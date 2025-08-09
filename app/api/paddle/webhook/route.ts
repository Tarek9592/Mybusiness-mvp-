import { NextResponse } from "next/server";
import { createHmac, timingSafeEqual } from "crypto";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { ENV } from "@/lib/env";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  if(!ENV.PADDLE.WEBHOOK_SECRET){ return NextResponse.json({ error: "No webhook secret" }, { status: 500 }); }
  const signature = req.headers.get("paddle-signature") || req.headers.get("Paddle-Signature");
  const raw = await req.text();

  const hmac = createHmac("sha256", ENV.PADDLE.WEBHOOK_SECRET);
  hmac.update(raw, "utf8");
  const digest = Buffer.from(hmac.digest("hex"));
  const given = Buffer.from((signature || "").replace(/^sha256=/i, ""), "hex");

  if (!signature || digest.length !== given.length || !timingSafeEqual(digest, given)) {
    return NextResponse.json({ ok: false, error: "Invalid signature" }, { status: 400 });
  }

  const evt = JSON.parse(raw);
  const userId: string | undefined = evt?.data?.customer_id || evt?.data?.custom_data?.user_id || evt?.data?.metadata?.user_id;
  const statusRaw = (evt?.data?.status || "").toLowerCase();
  const plan = evt?.data?.product_id ? String(evt.data.product_id) : (evt?.data?.price_id ? String(evt.data.price_id) : "unknown");
  const interval = (evt?.data?.billing_cycle?.interval || "month").toLowerCase();
  const currentPeriodEnd = evt?.data?.current_billing_period?.ends_at || evt?.data?.next_billed_at || null;

  const allowed = new Set(["active", "trialing", "past_due", "canceled", "paused"]);
  const status = allowed.has(statusRaw) ? statusRaw : "active";

  if(!userId){ return NextResponse.json({ ok:false, error:"Missing user_id" }, { status: 400 }); }

  const { error } = await supabaseAdmin
    .from("subscriptions")
    .upsert({ user_id: userId, status, plan, interval, current_period_end: currentPeriodEnd }, { onConflict: "user_id" });
  if (error) return NextResponse.json({ ok:false, error: error.message }, { status: 500 });

  return NextResponse.json({ ok:true });
}
