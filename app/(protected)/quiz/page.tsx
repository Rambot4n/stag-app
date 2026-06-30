import { getSession } from "@/lib/auth";
import { supabase } from "@/lib/supabase";
import { redirect } from "next/navigation";
import QuizClient from "./QuizClient";

export const dynamic = "force-dynamic";

function scoreMessage(score: number) {
  if (score >= 12) return "You really know Chaz.";
  if (score >= 9) return "Not bad at all.";
  if (score >= 6) return "Mediocre. Embarrassing, really.";
  return "Do you even know the man?";
}

export default async function QuizPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const [firstName, ...rest] = session.split(" ");
  const lastName = rest.join(" ");

  const { data: guest } = await supabase
    .from("guests")
    .select("id, first_name")
    .ilike("first_name", firstName)
    .ilike("last_name", lastName)
    .single();

  if (!guest) redirect("/login");

  const { data: attempt } = await supabase
    .from("quiz_attempts")
    .select("id, completed_at, score")
    .eq("guest_id", guest.id)
    .maybeSingle();

  // Completed — show results and leaderboard
  if (attempt?.completed_at) {
    const { data: leaderboard } = await supabase
      .from("quiz_attempts")
      .select("score, guests(first_name, last_name, nickname)")
      .not("completed_at", "is", null)
      .order("score", { ascending: false })
      .order("completed_at", { ascending: true });

    const myScore = attempt.score ?? 0;

    return (
      <div className="px-5 pt-12 pb-6">
        <h1 className="text-2xl font-bold text-slate-800 mb-1">Quiz</h1>
        <p className="text-slate-400 text-sm mb-6">{scoreMessage(myScore)}</p>

        <div className="bg-amber-50 rounded-2xl p-6 text-center mb-8">
          <div className="text-5xl mb-3">
            {myScore >= 12 ? "🏆" : myScore >= 9 ? "🎯" : myScore >= 6 ? "📚" : "🍺"}
          </div>
          <p className="text-5xl font-bold text-slate-800">
            {myScore}<span className="text-2xl text-slate-400">/15</span>
          </p>
        </div>

        <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
          Leaderboard
        </h2>

        <div className="flex flex-col gap-2">
          {((leaderboard ?? []) as any[]).map((entry, i) => {
            const g = entry.guests;
            const name = g.nickname
              ? `${g.first_name} "${g.nickname}" ${g.last_name ?? ""}`.trim()
              : `${g.first_name} ${g.last_name ?? ""}`.trim();
            const isMe =
              g.first_name.toLowerCase() === firstName.toLowerCase() &&
              (g.last_name ?? "").toLowerCase() === lastName.toLowerCase();
            const medal = i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : null;

            return (
              <div
                key={i}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl ${
                  isMe ? "bg-amber-50 border border-amber-200" : "bg-slate-50"
                }`}
              >
                <span className="w-6 text-center text-sm font-bold text-slate-400">
                  {medal ?? i + 1}
                </span>
                <span className={`flex-1 font-medium ${isMe ? "text-amber-600" : "text-slate-800"}`}>
                  {name}
                </span>
                <span className="font-bold text-slate-600">{entry.score}/15</span>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // In progress or not started — fetch questions without is_correct
  const { data: questions } = await supabase
    .from("quiz_questions")
    .select("id, question_text, display_order, quiz_options(id, option_text)")
    .order("display_order");

  let answeredQuestionIds: number[] = [];
  if (attempt) {
    const { data: answers } = await supabase
      .from("quiz_answers")
      .select("question_id")
      .eq("attempt_id", attempt.id);
    answeredQuestionIds = (answers ?? []).map((a: any) => a.question_id);
  }

  return (
    <QuizClient
      questions={questions ?? []}
      existingAttemptId={attempt?.id ?? null}
      answeredQuestionIds={answeredQuestionIds}
      guestId={guest.id}
    />
  );
}
