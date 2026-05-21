"use client";

import { useChat } from "ai/react";
import { useState, useRef, useEffect } from "react";
import Image from "next/image";

export default function ChazGPT() {
  const [open, setOpen] = useState(false);
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: "/api/chat",
  });
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <>
      {open && (
        <div className="fixed bottom-36 right-4 left-4 sm:left-auto sm:w-80 z-50 bg-white rounded-2xl shadow-2xl border border-slate-100 flex flex-col overflow-hidden" style={{ height: "420px" }}>
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-amber-400 shrink-0">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-amber-400 overflow-hidden shrink-0">
                <Image src="/chazgpt_v2.png" alt="ChazGPT" width={32} height={32} className="w-full h-full object-cover" style={{ objectPosition: "center 10%" }} unoptimized />
              </div>
              <div>
                <p className="font-bold text-white text-sm">ChazGPT</p>
                <p className="text-amber-100 text-xs">Powered by grudge</p>
              </div>
            </div>
            <button onClick={() => setOpen(false)} className="text-white hover:text-amber-100 p-1">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.length === 0 && (
              <div className="text-center text-slate-400 text-sm pt-6">
                <div className="text-4xl mb-3">🤖</div>
                <p className="font-medium text-slate-500">Ask me anything about the stag.</p>
                <p className="text-xs mt-1">I&apos;ll do my best. No promises about Chaz.</p>
              </div>
            )}
            {messages.map((m) => (
              <div key={m.id} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[82%] rounded-2xl px-3 py-2 text-sm leading-relaxed ${
                  m.role === "user"
                    ? "bg-amber-400 text-white rounded-br-none"
                    : "bg-slate-100 text-slate-800 rounded-bl-none"
                }`}>
                  {m.content}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-slate-100 rounded-2xl rounded-bl-none px-4 py-3">
                  <div className="flex gap-1 items-center">
                    <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0ms]" />
                    <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:150ms]" />
                    <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:300ms]" />
                  </div>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <form onSubmit={handleSubmit} className="border-t border-slate-100 p-3 flex gap-2 shrink-0">
            <input
              value={input}
              onChange={handleInputChange}
              placeholder="Ask ChazGPT…"
              className="flex-1 text-sm px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent"
              disabled={isLoading}
              autoComplete="off"
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="bg-amber-400 hover:bg-amber-500 active:bg-amber-600 text-white rounded-xl px-3 py-2 disabled:opacity-40 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </form>
        </div>
      )}

      {/* Floating button */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="fixed bottom-24 right-4 z-50 active:scale-95 flex flex-col items-center transition-all"
        aria-label="Open ChazGPT"
      >
        {open ? (
          <div className="w-14 h-14 bg-amber-400 hover:bg-amber-500 rounded-full shadow-xl flex items-center justify-center">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
        ) : (
          <>
            <div className="w-20 h-20 rounded-full bg-amber-400 overflow-hidden shadow-xl relative" style={{ boxShadow: "0 6px 14px rgba(0,0,0,0.4)" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/chazgpt_v2.png" alt="ChazGPT" className="absolute object-cover" style={{ width: "130%", height: "130%", top: "50%", left: "50%", transform: "translate(-50%, -40%)" }} />
            </div>
            <span className="text-xs font-bold text-slate-600 mt-1">ChazGPT</span>
          </>
        )}
      </button>
    </>
  );
}
