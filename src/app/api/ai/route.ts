import { NextRequest, NextResponse } from "next/server";
import { generatePredatorResponse, AI_SYSTEM_PROMPT } from "@/services/ai";
import type { UserProfile, BehaviorState } from "@/types";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { messages, profile, behaviorState } = body as {
      messages: { role: string; content: string }[];
      profile: UserProfile | null;
      behaviorState?: BehaviorState;
    };
    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }
    const lastUser = [...messages].reverse().find((m) => m.role === "user");
    const userText = lastUser?.content || "";
    const reply = generatePredatorResponse(userText, profile, {
      behaviorState,
      streak: profile?.streak,
      totalWorkouts: profile?.totalWorkouts,
    });
    return NextResponse.json({ reply, provider: "local" });
  } catch {
    return NextResponse.json({ error: "AI error" }, { status: 500 });
  }
}
