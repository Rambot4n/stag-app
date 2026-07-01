"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Baloo_2, Nunito, UnifrakturCook } from "next/font/google";

const baloo = Baloo_2({ subsets: ["latin"], weight: ["800"] });
const nunito = Nunito({ subsets: ["latin"], weight: ["400", "600", "700"] });
const blackletter = UnifrakturCook({ subsets: ["latin"], weight: ["700"] });

const INK = "#3E2C10";
const MUTED = "#8A6A38";
const FAINT = "#BE9F68";
const ACCENT = "#F4912B";
const BUNTING_COLORS = ["#F4912B", "#2E8BD6", "#3FB24B"];

const BUNTING_COUNT = 9;
const bunting = Array.from({ length: BUNTING_COUNT }, (_, i) => {
  const t = i / (BUNTING_COUNT - 1);
  return {
    left: `${t * 100}%`,
    bottom: 6 + 16 * Math.sin(Math.PI * t),
    rotate: (t - 0.5) * 70,
    color: BUNTING_COLORS[i % BUNTING_COLORS.length],
  };
});

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
    <div className={`h-screen relative flex flex-col items-center px-6 overflow-hidden ${nunito.className}`}>
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

      {/* Wordmark - moved up to clear the arch below */}
      <div className="text-center w-full" style={{ position: "relative", zIndex: 20, paddingTop: 28 }}>
        <h1 className={blackletter.className} style={{ fontSize: 44, lineHeight: 1, color: INK }}>
          Chaz&apos;s Stag
        </h1>
        <p className="mt-1" style={{ color: MUTED }}>Cologne, Germany 2026</p>
      </div>

      {/* Bunting, arced along the top of the doorway below */}
      <div className="w-full max-w-sm" style={{ position: "relative", zIndex: 20, height: 30, marginTop: 6 }}>
        <div
          className="absolute w-full"
          style={{ top: 0, height: 2, background: INK, opacity: 0.4 }}
        />
        {bunting.map((p, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              left: p.left,
              bottom: p.bottom,
              transform: `translateX(-50%) rotate(${p.rotate}deg)`,
              width: 0,
              height: 0,
              borderLeft: "8px solid transparent",
              borderRight: "8px solid transparent",
              borderTop: `14px solid ${p.color}`,
            }}
          />
        ))}
      </div>

      {/* Stone arch doorway - decorative frame around the (unmoved) video + form */}
      <div
        className="w-full max-w-sm flex-1 flex flex-col"
        style={{
          position: "relative",
          zIndex: 10,
          padding: "12px 12px 14px",
          background: "linear-gradient(#ece0c6 0%, #ddcaa3 55%, #d1bc91 100%)",
          border: `3px solid ${INK}`,
          borderRadius: "46% 46% 14px 14px / 22% 22% 14px 14px",
          boxShadow: "0 7px 0 rgba(62,44,16,0.20)",
        }}
      >
        {/* keystone */}
        <div
          style={{
            position: "absolute",
            top: -4,
            left: "50%",
            transform: "translateX(-50%)",
            width: 34,
            height: 20,
            background: "#e6d7b5",
            border: `3px solid ${INK}`,
            borderBottom: "none",
            borderRadius: "7px 7px 0 0",
          }}
        />

        {/* recessed opening - transparent, so the video shows through exactly as before */}
        <div
          className="flex-1 flex flex-col"
          style={{
            border: `2.5px solid ${INK}`,
            borderRadius: "44% 44% 8px 8px / 20% 20% 8px 8px",
            overflow: "hidden",
            background: "transparent",
          }}
        >
          <div className="flex-1 flex items-center justify-center w-full" style={{ position: "relative", zIndex: 20 }}>
            <form onSubmit={handleSubmit} className="space-y-4 w-full px-4">
              <div className="flex gap-3">
                <div className="flex-1">
                  <label className="block text-sm font-medium mb-1.5" style={{ color: INK }}>
                    First name
                  </label>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="Josh"
                    className="w-full px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-[#F4912B] focus:border-transparent placeholder:text-[#BE9F68]"
                    style={{ border: `1px solid ${INK}`, borderRadius: 8, color: INK }}
                    autoComplete="given-name"
                    autoCapitalize="words"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium mb-1.5" style={{ color: INK }}>
                    Last name
                  </label>
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Ramsay"
                    className="w-full px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-[#F4912B] focus:border-transparent placeholder:text-[#BE9F68]"
                    style={{ border: `1px solid ${INK}`, borderRadius: 8, color: INK }}
                    autoComplete="family-name"
                    autoCapitalize="words"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: INK }}>
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter the stag password"
                  className="w-full px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-[#F4912B] focus:border-transparent placeholder:text-[#BE9F68]"
                  style={{ border: `1px solid ${INK}`, borderRadius: 8, color: INK }}
                  autoComplete="current-password"
                />
              </div>

              {error && (
                <p className="text-red-500 text-sm text-center">{error}</p>
              )}

              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3.5 text-white disabled:opacity-50 mt-2 hover:brightness-95 active:brightness-90 transition ${baloo.className}`}
                style={{
                  background: ACCENT,
                  border: `2.5px solid ${INK}`,
                  borderRadius: 14,
                  boxShadow: `0 5px 0 ${INK}`,
                  fontSize: 17,
                  letterSpacing: "0.01em",
                }}
              >
                {loading ? "Logging in…" : "Let's go"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
