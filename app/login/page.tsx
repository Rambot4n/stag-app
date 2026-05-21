"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!firstName.trim() || !lastName.trim()) {
      setError("Please enter your first and last name");
      return;
    }
    setLoading(true);
    setError("");

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ firstName, lastName, password }),
    });

    if (res.ok) {
      router.push("/");
    } else {
      setError("Wrong name or password. Try again.");
    }
    setLoading(false);
  }

  return (
    <div className="h-screen relative flex flex-col items-center justify-center px-6 overflow-hidden">
      <video
        autoPlay
        loop
        muted
        playsInline
        style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", objectFit: "cover", zIndex: 0 }}
      >
        <source src="/chaz_mankini.mp4" type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-white/60" style={{ zIndex: 1 }} />
      <div className="w-full max-w-sm" style={{ position: "relative", zIndex: 20 }}>
        <div className="text-center mb-10">
          <div className="text-6xl mb-4">🍺</div>
          <h1 className="text-2xl font-bold text-slate-800">Chaz&apos;s Stag</h1>
          <p className="text-slate-500 mt-1">Cologne, Germany 2026</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex gap-3">
            <div className="flex-1">
              <label className="block text-sm font-medium text-slate-900 mb-1.5">
                First name
              </label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Josh"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-800 text-base focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent"
                autoComplete="given-name"
                autoCapitalize="words"
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-slate-900 mb-1.5">
                Last name
              </label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Ramsay"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-800 text-base focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent"
                autoComplete="family-name"
                autoCapitalize="words"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-900 mb-1.5">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter the stag password"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-800 text-base focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent"
              autoComplete="current-password"
            />
          </div>

          {error && (
            <p className="text-red-500 text-sm text-center">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-amber-400 hover:bg-amber-500 active:bg-amber-600 text-white font-semibold text-base transition-colors disabled:opacity-50 mt-2"
          >
            {loading ? "Logging in…" : "Let's go"}
          </button>
        </form>
      </div>
    </div>
  );
}

