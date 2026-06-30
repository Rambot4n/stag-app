"use server";

import { supabase } from "@/lib/supabase";

export async function startQuiz(guestId: number): Promise<number> {
  const { data, error } = await supabase
    .from("quiz_attempts")
    .insert({ guest_id: guestId })
    .select("id")
    .single();
  if (error) throw new Error(error.message);
  return data.id;
}

export async function saveAnswer(
  attemptId: number,
  questionId: number,
  selectedOptionId: number
): Promise<void> {
  const { error } = await supabase.from("quiz_answers").insert({
    attempt_id: attemptId,
    question_id: questionId,
    selected_option_id: selectedOptionId,
  });
  if (error) throw new Error(error.message);
}

export async function completeQuiz(attemptId: number): Promise<number> {
  const { data: answers } = await supabase
    .from("quiz_answers")
    .select("quiz_options!inner(is_correct)")
    .eq("attempt_id", attemptId);

  const score = (answers ?? []).filter((a: any) => a.quiz_options.is_correct).length;

  await supabase
    .from("quiz_attempts")
    .update({ completed_at: new Date().toISOString(), score })
    .eq("id", attemptId);

  return score;
}
