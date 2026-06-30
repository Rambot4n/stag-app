"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { startQuiz, saveAnswer, completeQuiz } from "./actions";

type Option = { id: number; option_text: string };
type Question = { id: number; question_text: string; display_order: number; quiz_options: Option[] };

type Props = {
  questions: Question[];
  existingAttemptId: number | null;
  answeredQuestionIds: number[];
  guestId: number;
};

export default function QuizClient({ questions, existingAttemptId, answeredQuestionIds, guestId }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const startIndex = answeredQuestionIds.length;
  const [phase, setPhase] = useState<"intro" | "quiz" | "done">(
    existingAttemptId !== null ? "quiz" : "intro"
  );
  const [currentIndex, setCurrentIndex] = useState(startIndex);
  const [attemptId, setAttemptId] = useState<number | null>(existingAttemptId);
  const [selectedOptionId, setSelectedOptionId] = useState<number | null>(null);
  const [finalScore, setFinalScore] = useState<number | null>(null);

  const total = questions.length;
  const currentQuestion = questions[currentIndex];

  function handleStart() {
    startTransition(async () => {
      const id = await startQuiz(guestId);
      setAttemptId(id);
      setPhase("quiz");
    });
  }

  async function handleSelectOption(optionId: number) {
    if (selectedOptionId !== null || !attemptId || !currentQuestion) return;

    setSelectedOptionId(optionId);
    await saveAnswer(attemptId, currentQuestion.id, optionId);
    await new Promise((r) => setTimeout(r, 750));

    if (currentIndex + 1 >= total) {
      const score = await completeQuiz(attemptId);
      setFinalScore(score);
      setPhase("done");
      setTimeout(() => router.refresh(), 2500);
    } else {
      setSelectedOptionId(null);
      setCurrentIndex(currentIndex + 1);
    }
  }

  if (phase === "intro") {
    return (
      <div className="flex flex-col min-h-screen px-5 pt-12 pb-8">
        <h1 className="text-2xl font-bold text-slate-800 mb-1">Quiz</h1>
        <p className="text-slate-400 text-sm mb-8">How well do you know Chaz?</p>

        <div className="flex-1 flex flex-col items-center justify-center text-center">
          <div className="text-6xl mb-6">🧠</div>
          <h2 className="text-xl font-bold text-slate-800 mb-3">15 questions. One shot.</h2>
          <p className="text-slate-500 text-sm mb-10 max-w-xs leading-relaxed">
            Multiple choice. Your progress is saved if you close the app, but you can&apos;t change your answers once submitted.
          </p>
          <button
            onClick={handleStart}
            disabled={isPending}
            className="w-full max-w-xs bg-amber-500 text-white font-bold py-4 rounded-2xl text-lg disabled:opacity-50 active:bg-amber-600 transition-colors"
          >
            {isPending ? "Starting…" : "Start Quiz"}
          </button>
        </div>
      </div>
    );
  }

  if (phase === "done") {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen px-5 text-center">
        <div className="text-6xl mb-4">
          {finalScore !== null && finalScore >= 12 ? "🏆" : finalScore !== null && finalScore >= 9 ? "🎯" : "🍺"}
        </div>
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Quiz complete!</h2>
        <p className="text-slate-500 mb-1">You scored</p>
        <p className="text-6xl font-bold text-amber-500 mb-2">{finalScore}</p>
        <p className="text-slate-400 text-lg mb-8">out of {total}</p>
        <p className="text-slate-400 text-sm">Loading leaderboard…</p>
      </div>
    );
  }

  // Quiz
  if (!currentQuestion) return null;

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Progress */}
      <div className="px-5 pt-12 pb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-slate-400">
            Question {currentIndex + 1} of {total}
          </span>
          <span className="text-xs font-medium text-slate-400">
            {Math.round((currentIndex / total) * 100)}%
          </span>
        </div>
        <div className="w-full bg-slate-100 rounded-full h-1.5">
          <div
            className="bg-amber-500 h-1.5 rounded-full transition-all duration-500"
            style={{ width: `${(currentIndex / total) * 100}%` }}
          />
        </div>
      </div>

      {/* Question + options */}
      <div className="flex-1 flex flex-col px-5 pb-10">
        <div className="flex-1 flex items-center mb-10">
          <p className="text-xl font-bold text-slate-800 leading-snug">
            {currentQuestion.question_text}
          </p>
        </div>

        <div className="flex flex-col gap-3">
          {currentQuestion.quiz_options.map((option) => {
            const isSelected = selectedOptionId === option.id;
            return (
              <button
                key={option.id}
                onClick={() => handleSelectOption(option.id)}
                disabled={selectedOptionId !== null}
                className={`w-full text-left px-4 py-4 rounded-2xl border-2 font-medium transition-all duration-200 ${
                  isSelected
                    ? "bg-amber-500 border-amber-500 text-white"
                    : "bg-white border-slate-200 text-slate-800 active:bg-slate-50"
                } disabled:cursor-default`}
              >
                {option.option_text}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
