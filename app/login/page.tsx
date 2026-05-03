"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) {
      setError("Please enter your name");
      return;
    }
    setLoading(true);
    setError("");

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ surname: name, password }),
    });

    if (res.ok) {
      router.push("/");
    } else {
      setError("Wrong name or password. Try again.");
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <div className="text-center mb-10">
          <div className="text-6xl mb-4">🍺</div>
          <h1 className="text-2xl font-bold text-slate-800">Chaz&apos;s Stag</h1>
          <p className="text-slate-500 mt-1">Cologne, Germany 2026</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              First name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your first name"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-800 text-base focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent"
              autoComplete="given-name"
              autoCapitalize="words"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
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
