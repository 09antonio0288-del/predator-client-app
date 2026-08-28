"use client";
import { AppShell } from "@/components/AppShell";
import { Button, Card, PageHeader } from "@/components/ui";
import { usePredatorStore } from "@/lib/store";
import { callPredatorAI } from "@/services/ai";
import { useState } from "react";
export default function AIPage() {
  const profile = usePredatorStore((s) => s.profile);
  const messages = usePredatorStore((s) => s.aiMessages);
  const addAIMessage = usePredatorStore((s) => s.addAIMessage);
  const getBehavior = usePredatorStore((s) => s.getBehavior);
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  const send = async () => {
    if (!text.trim()) return;
    const user = text.trim();
    setText("");
    addAIMessage("user", user);
    setBusy(true);
    const reply = await callPredatorAI([...messages, { role: "user", content: user }].map((m) => ({ role: m.role, content: m.content })), profile, { behaviorState: getBehavior().state });
    addAIMessage("assistant", reply);
    setBusy(false);
  };
  return (
    <AppShell>
      <PageHeader title="AI Coach" subtitle="Факт → вывод → одно действие" />
      <div className="space-y-3 mb-4">
        {messages.slice(-20).map((m) => (
          <Card key={m.id} className={m.role === "user" ? "bg-accent/10" : ""}>
            <div className="text-xs text-muted mb-1">{m.role === "user" ? "Ты" : "PREDATOR"}</div>
            <div className="whitespace-pre-wrap text-sm">{m.content}</div>
          </Card>
        ))}
      </div>
      <div className="flex gap-2">
        <input value={text} onChange={(e) => setText(e.target.value)} onKeyDown={(e) => e.key === "Enter" && send()} placeholder="Что сделать сегодня?" className="flex-1 h-11 px-3 rounded-xl bg-card border border-border" />
        <Button disabled={busy || !text.trim()} onClick={send}>OK</Button>
      </div>
    </AppShell>
  );
}
