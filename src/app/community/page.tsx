"use client";
import { AppShell } from "@/components/AppShell";
import { Button, Card, PageHeader, Badge } from "@/components/ui";
import { usePredatorStore } from "@/lib/store";
import { useState } from "react";
export default function CommunityPage() {
  const challenges = usePredatorStore((s) => s.challenges);
  const joinChallenge = usePredatorStore((s) => s.joinChallenge);
  const shares = usePredatorStore((s) => s.shares);
  const shareProgress = usePredatorStore((s) => s.shareProgress);
  const [text, setText] = useState("");
  return (
    <AppShell>
      <PageHeader title="Tribe" />
      <div className="space-y-3">
        {challenges.map((c) => (
          <Card key={c.id} className="space-y-2">
            <div className="flex justify-between"><span className="font-medium">{c.title}</span><Badge>{c.progress}/{c.goalCount}</Badge></div>
            <p className="text-sm text-muted">{c.description}</p>
            {!c.joined ? <Button size="sm" onClick={() => joinChallenge(c.id)}>Вступить</Button> : <div className="text-xs text-accent">Ты внутри</div>}
          </Card>
        ))}
      </div>
      <Card className="mt-4 space-y-2">
        <input value={text} onChange={(e) => setText(e.target.value)} placeholder="Короткий отчёт" className="w-full h-11 px-3 rounded-xl bg-bg border border-border" />
        <Button className="w-full" disabled={!text.trim()} onClick={() => { shareProgress(text); setText(""); }}>Зафиксировать</Button>
        {shares.slice(0, 5).map((s) => <div key={s.id} className="text-sm text-muted">{s.text}</div>)}
      </Card>
    </AppShell>
  );
}
