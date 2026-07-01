import { nunito, blackletter, BG, INK, MUTED, ACCENT } from "@/lib/theme";

type AgendaItem = {
  time: string;
  title: string;
  location?: string;
  dressCode?: string;
  notes?: string;
};

type AgendaDay = {
  day: string;
  items: AgendaItem[];
};

const AGENDA: AgendaDay[] = [
  {
    day: "Friday",
    items: [
      { time: "11:00–16:00", title: "Arrivals, bag drop & miscellaneous drinks", location: "Hotel Leonet" },
      { time: "16:00–19:00", title: "(Late) lunch", location: "Gaffel", dressCode: "Your finest (shit) shirt" },
      { time: "19:00–22:00", title: "Friday night entertainment", location: "Various", dressCode: "Better bring your wellies" },
      { time: "22:00–late", title: "Kebab, and continue to get munted" },
    ],
  },
  {
    day: "Saturday",
    items: [
      { time: "11:00–13:00", title: "Sports day", location: "Hiroshima-Nagasaki Park (yes, genuinely)", dressCode: "To be provided (but wear sensible shoes)" },
      { time: "13:00–15:30", title: "Sleeping Lions and/or more drinking" },
      { time: "16:00–18:00", title: "Lunch", location: "Peter's Am Hahnentor", dressCode: "Night out appropriate" },
      { time: "18:30–20:30", title: "Sleeping Lions R2 (or build and go)" },
      { time: "21:00–late", title: "Beer tour" },
    ],
  },
];

function AgendaRow({ item }: { item: AgendaItem }) {
  const hasDetails = Boolean(item.location || item.dressCode || item.notes);

  const header = (
    <div className="flex items-baseline gap-3 px-4 py-3">
      <span className="text-sm font-bold whitespace-nowrap" style={{ color: ACCENT }}>
        {item.time}
      </span>
      <span className="flex-1 font-medium" style={{ color: INK }}>
        {item.title}
      </span>
      {hasDetails && (
        <svg
          className="w-4 h-4 shrink-0 transition-transform group-open:rotate-180"
          viewBox="0 0 24 24"
          fill="none"
          stroke={INK}
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 9l6 6 6-6" />
        </svg>
      )}
    </div>
  );

  if (!hasDetails) {
    return (
      <div className="rounded-xl bg-white/70" style={{ border: `1px solid ${INK}` }}>
        {header}
      </div>
    );
  }

  return (
    <details className="group rounded-xl bg-white/70 overflow-hidden" style={{ border: `1px solid ${INK}` }}>
      <summary className="cursor-pointer list-none [&::-webkit-details-marker]:hidden">{header}</summary>
      <div className="px-4 pb-3 text-sm space-y-1" style={{ color: MUTED }}>
        {item.location && (
          <p>
            <span className="font-semibold" style={{ color: INK }}>Location: </span>
            {item.location}
          </p>
        )}
        {item.dressCode && (
          <p>
            <span className="font-semibold" style={{ color: INK }}>Dress code: </span>
            {item.dressCode}
          </p>
        )}
        {item.notes && <p>{item.notes}</p>}
      </div>
    </details>
  );
}

export default function AgendaPage() {
  return (
    <div className={`min-h-screen flex flex-col ${nunito.className}`} style={{ background: BG }}>
      {/* Wordmark */}
      <div className="text-center px-6 pt-12 pb-6">
        <h1 className={blackletter.className} style={{ fontSize: 32, lineHeight: 1.15, color: INK }}>
          Welcome to Charlie&apos;s Stag Do
        </h1>
        <p className="mt-2" style={{ color: MUTED }}>
          May your beers be cold and their heads frothy
        </p>
      </div>

      {/* Agenda */}
      <div className="flex-1 px-5 pb-10">
        {AGENDA.map((day) => (
          <div key={day.day} className="mb-6">
            <h2 className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: ACCENT }}>
              {day.day}
            </h2>
            <div className="flex flex-col gap-2">
              {day.items.map((item, i) => (
                <AgendaRow key={i} item={item} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
