import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";
import { getSubscription } from "@/lib/subscriptions";

export async function GET(){
  const { userId } = auth();
  if(!userId) return NextResponse.json({ signedIn:false, active:false });
  const sub = await getSubscription(userId);
  return NextResponse.json({ signedIn:true, active: !!sub && (sub.status==="active" || sub.status==="trialing"), sub });
}
