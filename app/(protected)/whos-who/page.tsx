import { supabase, Guest } from "@/lib/supabase";
import Image from "next/image";

function displayName(guest: Guest): string {
  const parts = [guest.first_name];
  if (guest.nickname) parts.push(`"${guest.nickname}"`);
  if (guest.last_name) parts.push(guest.last_name);
  return parts.join(" ");
}

function initials(guest: Guest): string {
  return `${guest.first_name[0]}${guest.last_name?.[0] ?? ""}`.toUpperCase();
}

function GuestCard({ guest }: { guest: Guest }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 flex gap-4 items-start">
      {/* Avatar */}
      <div className="shrink-0">
        {guest.photo_url ? (
          <Image
            src={guest.photo_url}
            alt={guest.first_name}
            width={56}
            height={56}
            className="w-14 h-14 rounded-full object-cover"
          />
        ) : (
          <div className="w-14 h-14 rounded-full bg-amber-100 flex items-center justify-center">
            <span className="text-lg font-bold text-amber-500">{initials(guest)}</span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="font-bold text-slate-800 leading-snug">{displayName(guest)}</p>

        {guest.fun_fact && (
          <p className="text-sm text-slate-500 mt-1 leading-relaxed">{guest.fun_fact}</p>
        )}

        {guest.other_nicknames && guest.other_nicknames.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-2">
            {guest.other_nicknames.map((n) => (
              <span
                key={n}
                className="text-xs bg-amber-50 text-amber-600 font-medium px-2 py-0.5 rounded-full"
              >
                {n}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default async function WhosWhoPage() {
  const { data: guests } = await supabase
    .from("guests")
    .select("*")
    .order("last_name", { ascending: true });

  if (!guests || guests.length === 0) {
    return (
      <div className="px-5 pt-12 pb-6 flex flex-col items-center justify-center py-16 text-center">
        <div className="text-4xl mb-4">👥</div>
        <p className="text-slate-400 text-sm">No guests yet</p>
      </div>
    );
  }

  // Group guests, ungrouped last
  const grouped = guests.reduce<Record<string, Guest[]>>((acc, guest) => {
    const key = guest.group ?? "Other";
    if (!acc[key]) acc[key] = [];
    acc[key].push(guest);
    return acc;
  }, {});

  const groupOrder = Object.keys(grouped).sort((a, b) =>
    a === "Other" ? 1 : b === "Other" ? -1 : a.localeCompare(b)
  );

  return (
    <div className="px-5 pt-12 pb-6">
      <h1 className="text-2xl font-bold text-slate-800 mb-1">Who&apos;s Who</h1>
      <p className="text-slate-400 text-sm mb-8">{guests.length} degenerates</p>

      <div className="flex flex-col gap-8">
        {groupOrder.map((group) => (
          <section key={group}>
            <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
              {group.charAt(0).toUpperCase() + group.slice(1)}
            </h2>
            <div className="flex flex-col gap-3">
              {grouped[group].map((guest) => (
                <GuestCard key={guest.id} guest={guest} />
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
