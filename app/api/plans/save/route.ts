import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { isActive } from "@/lib/subscriptions";

export async function POST(req: Request) {
  const { userId } = auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const ok = await isActive(userId);
  if (!ok) return NextResponse.json({ error: "Subscription required" }, { status: 402 });

  const body = await req.json();
  const { country, city, payload } = body || {};
  const { error } = await supabaseAdmin.from("plans").insert({ user_id: userId, country, city, payload });
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  return NextResponse.json({ ok: true });
}
