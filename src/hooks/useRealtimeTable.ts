import { useEffect, useRef, useState } from "react";
import { supabase } from "../lib/supabaseClient";

interface Row {
  id: string;
}

export function useRealtimeTable<T extends Row>(
  table: string,
  orderColumn = "created_at",
  limit = 500,
) {
  const [rows, setRows] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const rowsRef = useRef<T[]>([]);

  useEffect(() => {
    let active = true;
    rowsRef.current = [];
    setLoading(true);

    async function load() {
      const { data, error } = await supabase
        .from(table)
        .select("*")
        .order(orderColumn, { ascending: false })
        .limit(limit);
      if (!active) return;
      if (!error && data) {
        rowsRef.current = data as T[];
        setRows(rowsRef.current);
      }
      setLoading(false);
    }
    load();

    const channel = supabase
      .channel(`realtime:${table}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table },
        (payload) => {
          if (payload.eventType === "INSERT") {
            const newRow = payload.new as T;
            if (rowsRef.current.some((r) => r.id === newRow.id)) return;
            rowsRef.current = [newRow, ...rowsRef.current].slice(0, limit);
          } else if (payload.eventType === "UPDATE") {
            const updated = payload.new as T;
            rowsRef.current = rowsRef.current.map((r) =>
              r.id === updated.id ? updated : r,
            );
          } else if (payload.eventType === "DELETE") {
            const oldRow = payload.old as Partial<T>;
            rowsRef.current = rowsRef.current.filter((r) => r.id !== oldRow.id);
          }
          setRows(rowsRef.current);
        },
      )
      .subscribe();

    return () => {
      active = false;
      supabase.removeChannel(channel);
    };
  }, [table, orderColumn, limit]);

  return { rows, loading };
}
