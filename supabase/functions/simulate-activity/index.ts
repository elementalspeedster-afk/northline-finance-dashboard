import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const MERCHANTS: Record<string, [string, string][]> = {
  Food: [
    ["Trader Joe's", "Groceries"],
    ["Chipotle", "Lunch"],
    ["Blue Bottle Coffee", "Coffee"],
    ["DoorDash", "Takeout"],
    ["Local Bistro", "Dinner"],
    ["Whole Foods Market", "Groceries"],
  ],
  Transportation: [
    ["Shell", "Gas station"],
    ["Uber", "Rideshare"],
    ["Metro Transit", "Transit pass"],
  ],
  Housing: [["City Power & Water", "Utilities"]],
  Healthcare: [
    ["CVS Pharmacy", "Pharmacy"],
    ["Kaiser Permanente", "Copay"],
  ],
  "Debt payments": [["Chase Card Payment", "Card payment"]],
  Other: [
    ["Amazon", "Online shopping"],
    ["Target", "Retail"],
    ["Netflix", "Streaming subscription"],
    ["Spotify", "Music subscription"],
  ],
  Investments: [["Vanguard Auto-Invest", "Auto-invest transfer"]],
};

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const { data: accounts, error: acctErr } = await supabase
      .from("accounts")
      .select("id, type, balance")
      .in("type", ["checking", "credit"]);
    if (acctErr) throw acctErr;
    if (!accounts || accounts.length === 0) throw new Error("no eligible accounts");

    const account = pick(accounts);
    // Calibrated so long-run expected value per tick is mildly positive
    // (~0.28 * $150 avg income - 0.72 * $28 avg expense =~ +$22), so the
    // demo trends toward healthier numbers over time instead of an
    // ever-worsening budget blowout on a long-lived deployment.
    const isIncome = account.type === "checking" && Math.random() < 0.28;

    let category: string;
    let merchant: string;
    let description: string;
    let amount: number;

    if (isIncome) {
      category = "Income";
      merchant = "Acme Corp Payroll";
      description = Math.random() < 0.5 ? "Payroll deposit" : "Interest payment";
      amount = round2(Math.random() * 150 + 80);
    } else {
      const categories = Object.keys(MERCHANTS);
      category = pick(categories);
      const [m, d] = pick(MERCHANTS[category]);
      merchant = m;
      description = d;
      amount = -round2(Math.random() * 45 + 5);
    }

    const { data: tx, error: txErr } = await supabase
      .from("transactions")
      .insert({
        account_id: account.id,
        description,
        merchant,
        category,
        amount,
        status: "completed",
      })
      .select()
      .single();
    if (txErr) throw txErr;

    const delta = account.type === "credit" ? -amount : amount;
    const newBalance = round2(Number(account.balance) + delta);
    const { error: balErr } = await supabase
      .from("accounts")
      .update({ balance: newBalance })
      .eq("id", account.id);
    if (balErr) throw balErr;

    return new Response(JSON.stringify({ transaction: tx, newBalance }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: (err as Error).message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
