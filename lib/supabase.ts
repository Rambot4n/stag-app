import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
);

export type Guest = {
  id: number;
  first_name: string;
  last_name: string | null;
  nickname: string | null;
  other_nicknames: string[] | null;
  fun_fact: string | null;
  photo_url: string | null;
  group: string | null;
};
