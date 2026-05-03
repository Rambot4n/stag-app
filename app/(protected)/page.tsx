import { getSession } from "@/lib/auth";
import LogoutButton from "./LogoutButton";

export default async function HomePage() {
  const surname = await getSession();

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-12 pb-2">
        <span className="text-sm font-medium text-slate-400">
          {surname ? `Hey, ${surname.charAt(0).toUpperCase() + surname.slice(1)}` : ""}
        </span>
        <LogoutButton />
      </div>

      {/* Hero */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
        <div className="text-7xl mb-6">🍺</div>
        <h1 className="text-3xl font-bold text-slate-800 leading-tight mb-3">
          Chaz&apos;s Stag
        </h1>
        <p className="text-lg text-amber-500 font-semibold mb-6">
          Cologne, Germany 2026
        </p>
        <p className="text-slate-500 text-base leading-relaxed max-w-xs">
          Welcome to Chaz&apos;s stag — Cologne, Germany — may your beers be cold and frothy.
        </p>
      </div>

      {/* Footer badge */}
      <div className="pb-8 flex justify-center">
        <span className="inline-flex items-center gap-1.5 bg-amber-50 text-amber-600 text-xs font-medium px-3 py-1.5 rounded-full">
          <span>🇩🇪</span> Cologne
        </span>
      </div>
    </div>
  );
}
