import { supabaseAdmin } from "./supabaseAdmin";
export type SubStatus = "active" | "trialing" | "past_due" | "canceled" | "paused";

export async function getSubscription(userId: string){
  const { data } = await supabaseAdmin
    .from("subscriptions").select("*").eq("user_id", userId).single();
  return data as { user_id: string; status: SubStatus; plan: string; interval: string; current_period_end: string | null } | null;
}

export async function isActive(userId: string){
  const sub = await getSubscription(userId);
  return sub ? (sub.status === "active" || sub.status === "trialing") : false;
}
