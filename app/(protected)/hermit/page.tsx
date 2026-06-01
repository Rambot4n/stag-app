import { getSession } from "@/lib/auth";
import { supabase } from "@/lib/supabase";
import { redirect } from "next/navigation";
import HermitMap from "./HermitMap";

export type Stop = {
  roundNumber: number;
  roundName: string;
  pubName: string;
  lat: number;
  lng: number;
  isFinal: boolean;
};

export default async function HermitPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const [firstName, ...rest] = session.split(" ");
  const lastName = rest.join(" ");

  const { data: guest } = await supabase
    .from("guests")
    .select("id")
    .ilike("first_name", firstName)
    .ilike("last_name", lastName)
    .single();

  if (!guest) redirect("/login");

  const { data: assignments } = await supabase
    .from("hermit_assignments")
    .select(`
      round_id,
      hermit_rounds ( round_number, name ),
      pubs ( name, lat, lng )
    `)
    .eq("guest_id", guest.id)
    .order("round_id");

  const { data: finalVenue } = await supabase
    .from("pubs")
    .select("name, lat, lng")
    .eq("is_final_venue", true)
    .single();

  const stops: Stop[] = (assignments ?? []).map((a: any) => ({
    roundNumber: a.hermit_rounds.round_number,
    roundName: a.hermit_rounds.name,
    pubName: a.pubs.name,
    lat: a.pubs.lat,
    lng: a.pubs.lng,
    isFinal: false,
  }));

  if (finalVenue) {
    stops.push({
      roundNumber: 5,
      roundName: "Final Venue — Everyone",
      pubName: finalVenue.name,
      lat: finalVenue.lat,
      lng: finalVenue.lng,
      isFinal: true,
    });
  }

  return (
    <div className="px-5 pt-12 pb-6">
      <h1 className="text-2xl font-bold text-slate-800 mb-1">Your Route</h1>
      <p className="text-slate-400 text-sm mb-6">The Hermit Social — Cologne</p>
      <HermitMap stops={stops} />
    </div>
  );
}
