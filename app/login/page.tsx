"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { baloo, nunito, blackletter, INK, MUTED, ACCENT, WALL, BUNTING_COLORS } from "@/lib/theme";

const BUNTING_COUNT = 9;
const bunting = Array.from(
  { length: BUNTING_COUNT },
  (_, i) => BUNTING_COLORS[i % BUNTING_COLORS.length]
);

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
    <div className={`h-screen relative flex flex-col items-center px-6 pb-6 overflow-hidden ${nunito.className}`}>
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

      {/* Bunting - straight row of pennants above the doorway */}
      <div className="w-full max-w-sm flex justify-between items-start" style={{ position: "relative", zIndex: 20, marginTop: 6 }}>
        <div
          className="absolute w-full"
          style={{ top: 1, height: 2, background: INK, opacity: 0.4 }}
        />
        {bunting.map((color, i) => (
          <div
            key={i}
            style={{
              marginTop: 2,
              width: 0,
              height: 0,
              borderLeft: "8px solid transparent",
              borderRight: "8px solid transparent",
              borderTop: `14px solid ${color}`,
            }}
          />
        ))}
      </div>

      {/* Stone arch doorway - built entirely from borders (no fills), so the
          interior stays genuinely transparent and the video shows through
          the opening, not just around its outside edges */}
      <div
        className="w-full max-w-sm flex-1 flex flex-col"
        style={{
          position: "relative",
          zIndex: 10,
          marginTop: 24,
          background: "transparent",
          border: `3px solid ${INK}`,
          borderRadius: "47% 47% 15px 15px / 12% 12% 15px 15px",
          boxShadow: `0 7px 0 rgba(62,44,16,0.20), 0 0 0 9999px ${WALL}`,
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

        {/* stone band - thick coloured ring standing in for the gradient fill;
            a true top-to-bottom gradient needs border-image, which doesn't
            reliably clip to a border-radius this extreme across browsers, so
            this uses a flat stone tone instead - revisit if the gradient look
            is wanted badly enough to test border-image on-device */}
        <div
          className="flex-1 flex flex-col"
          style={{
            background: "transparent",
            border: "13px solid #ddcaa3",
            borderRadius: "45% 45% 12px 12px / 11% 11% 12px 12px",
          }}
        >
          {/* recessed opening - transparent, so the video shows through */}
          <div
            className="flex-1 flex flex-col"
            style={{
              border: `2.5px solid ${INK}`,
              borderRadius: "44% 44% 8px 8px / 10% 10% 8px 8px",
              overflow: "hidden",
              background: "transparent",
            }}
          >
            <div className="flex-1 flex items-end justify-center w-full pb-4" style={{ position: "relative", zIndex: 20 }}>
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
                      className="w-full px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-[#F4912B] focus:border-transparent placeholder:text-[#8A6A38]"
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
                      className="w-full px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-[#F4912B] focus:border-transparent placeholder:text-[#8A6A38]"
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
                    className="w-full px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-[#F4912B] focus:border-transparent placeholder:text-[#8A6A38]"
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
    </div>
  );
}
