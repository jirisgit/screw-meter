"use client";

import { useState, useRef, useEffect } from "react";
import { findScrew, searchScrews, screwDatabase, ScrewData } from "@/lib/screwData";
import { ScrewDiagram, NutDiagram } from "@/components/ScrewDiagram";

const ACCENT = "#00e5ff";

function StatCard({ label, value, unit, sub }: { label: string; value: number; unit: string; sub?: string }) {
  return (
    <div className="border border-[#1a2a35] bg-[#0d1520] p-4 flex flex-col gap-1 hover:border-[#00e5ff33] transition-colors">
      <span className="text-[#3a6a7a] text-[10px] font-mono uppercase tracking-widest">{label}</span>
      <div className="flex items-end gap-1">
        <span className="text-[#00e5ff] text-3xl font-mono font-bold leading-none">{value}</span>
        <span className="text-[#4a9eba] text-sm font-mono mb-0.5">{unit}</span>
      </div>
      {sub && <span className="text-[#2a4a5a] text-[9px] font-mono">{sub}</span>}
    </div>
  );
}

function ClearanceBar({ label, clearance, thread }: { label: string; clearance: number; thread: number }) {
  const pct = Math.round(((clearance - thread) / thread) * 100);
  return (
    <div className="border border-[#1a2a35] bg-[#0d1520] p-4 col-span-2">
      <div className="flex justify-between mb-2">
        <span className="text-[#3a6a7a] text-[10px] font-mono uppercase tracking-widest">{label}</span>
        <span className="text-[#00e5ff] text-sm font-mono">⌀ {clearance} mm</span>
      </div>
      <div className="h-2 bg-[#0a0e1a] border border-[#1a2a35] relative">
        <div
          className="h-full bg-[#00e5ff] opacity-70 transition-all duration-500"
          style={{ width: `${Math.min((clearance / (clearance * 1.5)) * 100, 100)}%` }}
        />
        <div
          className="absolute top-0 h-full bg-[#ff4444] opacity-50"
          style={{
            left: `${(thread / (clearance * 1.5)) * 100}%`,
            width: "2px",
          }}
        />
      </div>
      <div className="flex justify-between mt-1">
        <span className="text-[#2a4a5a] text-[9px] font-mono">thread ⌀ {thread} mm</span>
        <span className="text-[#3a6a7a] text-[9px] font-mono">+{pct}% clearance</span>
      </div>
    </div>
  );
}

export default function Home() {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState<ScrewData | null>(null);
  const [suggestions, setSuggestions] = useState<ScrewData[]>([]);
  const [notFound, setNotFound] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  function handleInput(val: string) {
    setQuery(val);
    setNotFound(false);
    if (!val.trim()) {
      setSuggestions([]);
      setResult(null);
      return;
    }
    const found = findScrew(val);
    if (found) {
      setResult(found);
      setSuggestions([]);
    } else {
      setResult(null);
      setSuggestions(searchScrews(val));
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const found = findScrew(query);
    if (found) {
      setResult(found);
      setSuggestions([]);
      setNotFound(false);
    } else {
      setNotFound(true);
    }
  }

  function selectSuggestion(s: ScrewData) {
    setQuery(s.size);
    setResult(s);
    setSuggestions([]);
    setNotFound(false);
  }

  return (
    <main className="min-h-screen bg-[#070b14] text-white font-mono">
      {/* Header */}
      <div className="border-b border-[#0f1e2a] px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-[#00e5ff] shadow-[0_0_8px_#00e5ff]" />
          <span className="text-[#00e5ff] text-sm tracking-[0.2em] uppercase">ScrewMeter</span>
          <span className="text-[#1a3a4a] text-xs">// ISO metric reference</span>
        </div>
        <span className="text-[#1a3a4a] text-xs">v1.0</span>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-12">
        {/* Search */}
        <div className="mb-12">
          <div className="text-[#3a6a7a] text-xs tracking-widest uppercase mb-4">
            &gt; enter screw designation
          </div>
          <form onSubmit={handleSubmit} className="relative">
            <div className="flex items-center border border-[#00e5ff44] bg-[#0a0e1a] focus-within:border-[#00e5ff] transition-colors">
              <span className="text-[#00e5ff] px-4 text-lg select-none">_</span>
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={e => handleInput(e.target.value)}
                placeholder="M2, M6, M12..."
                className="flex-1 bg-transparent text-white text-xl py-4 pr-4 outline-none placeholder:text-[#1a3a4a] uppercase"
                autoComplete="off"
                spellCheck={false}
              />
              <button
                type="submit"
                className="px-6 py-4 text-[#00e5ff] border-l border-[#1a2a35] hover:bg-[#00e5ff10] transition-colors text-sm tracking-widest uppercase"
              >
                LOOKUP
              </button>
            </div>

            {/* Suggestions dropdown */}
            {suggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 z-10 border border-[#1a2a35] border-t-0 bg-[#0a0e1a]">
                {suggestions.map(s => (
                  <button
                    key={s.size}
                    type="button"
                    onClick={() => selectSuggestion(s)}
                    className="w-full text-left px-6 py-3 text-[#4a9eba] hover:bg-[#0d1520] hover:text-[#00e5ff] transition-colors text-sm border-b border-[#0f1a20] last:border-0 flex justify-between"
                  >
                    <span>{s.size}</span>
                    <span className="text-[#2a4a5a] text-xs">⌀ {s.threadDiameter} mm · pitch {s.pitch} mm</span>
                  </button>
                ))}
              </div>
            )}
          </form>

          {notFound && (
            <div className="mt-3 text-[#ff4444] text-xs tracking-widest">
              &gt; NOT FOUND — try M2, M3, M4, M5, M6, M8, M10, M12...
            </div>
          )}
        </div>

        {/* Quick select all sizes */}
        {!result && (
          <div>
            <div className="text-[#2a4a5a] text-[10px] tracking-widest uppercase mb-3">&gt; available sizes</div>
            <div className="flex flex-wrap gap-2">
              {screwDatabase.map(s => (
                <button
                  key={s.size}
                  onClick={() => selectSuggestion(s)}
                  className="px-3 py-1.5 text-xs border border-[#1a2a35] text-[#3a6a7a] hover:border-[#00e5ff44] hover:text-[#00e5ff] transition-colors"
                >
                  {s.size}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Results */}
        {result && (
          <div className="space-y-6">
            {/* Title bar */}
            <div className="flex items-center gap-4 border-b border-[#0f1e2a] pb-4">
              <h1 className="text-4xl font-bold tracking-widest" style={{ color: ACCENT }}>
                {result.size}
              </h1>
              <div className="text-[#2a4a5a] text-sm">
                Socket Head Cap Screw + Hex Nut · ISO Metric
              </div>
              <div className="ml-auto flex gap-2">
                <span className="text-[#2a4a5a] text-xs border border-[#1a2a35] px-2 py-1">ISO 4762</span>
                <span className="text-[#2a4a5a] text-xs border border-[#1a2a35] px-2 py-1">ISO 4032</span>
              </div>
            </div>

            {/* Main grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left: diagrams */}
              <div className="space-y-4">
                <div className="text-[#2a4a5a] text-[10px] tracking-widest uppercase">&gt; drawings</div>
                <div className="flex flex-col sm:flex-row gap-4 items-start">
                  <ScrewDiagram data={result} />
                  <NutDiagram data={result} />
                </div>
              </div>

              {/* Right: stats */}
              <div className="space-y-4">
                <div className="text-[#2a4a5a] text-[10px] tracking-widest uppercase">&gt; dimensions</div>

                <div className="grid grid-cols-2 gap-2">
                  <StatCard label="Thread Diameter" value={result.threadDiameter} unit="mm" sub="nominal thread ⌀" />
                  <StatCard label="Head Diameter" value={result.headDiameter} unit="mm" sub="socket head cap" />
                  <StatCard label="Head Height" value={result.headHeight} unit="mm" sub="ISO 4762" />
                  <StatCard label="Hex Key Size" value={result.hexKeySize} unit="mm" sub="Allen key / hex wrench" />
                  <StatCard label="Nut Flat↔Flat" value={result.nutFlatToFlat} unit="mm" sub="wrench size · ISO 4032" />
                  <StatCard label="Nut Corner↔Corner" value={result.nutCornerToCorner} unit="mm" sub="min. clearance ⌀" />
                  <StatCard label="Nut Height" value={result.nutHeight} unit="mm" sub="standard hex nut" />
                  <StatCard label="Thread Pitch" value={result.pitch} unit="mm" sub="coarse thread" />
                  <ClearanceBar label="Clearance Hole ⌀" clearance={result.clearanceHoleDiameter} thread={result.threadDiameter} />
                </div>
              </div>
            </div>

            {/* Full data table */}
            <div className="border border-[#1a2a35]">
              <div className="border-b border-[#1a2a35] px-4 py-2 text-[10px] tracking-widest text-[#2a4a5a] uppercase">
                &gt; complete specification table
              </div>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#0f1a20]">
                    <th className="text-left px-4 py-2 text-[#2a4a5a] text-[10px] uppercase tracking-widest font-normal">parameter</th>
                    <th className="text-right px-4 py-2 text-[#2a4a5a] text-[10px] uppercase tracking-widest font-normal">value</th>
                    <th className="text-right px-4 py-2 text-[#2a4a5a] text-[10px] uppercase tracking-widest font-normal">standard</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["Thread Diameter (d)", `⌀ ${result.threadDiameter} mm`, "ISO 724"],
                    ["Thread Pitch", `${result.pitch} mm`, "ISO 261"],
                    ["Screw Head Diameter (dk)", `⌀ ${result.headDiameter} mm`, "ISO 4762"],
                    ["Screw Head Height (k)", `${result.headHeight} mm`, "ISO 4762"],
                    ["Hex Socket Drive Size (s)", `${result.hexKeySize} mm`, "ISO 4762"],
                    ["Clearance Hole Diameter", `⌀ ${result.clearanceHoleDiameter} mm`, "ISO 273"],
                    ["Nut Width Across Flats (s)", `${result.nutFlatToFlat} mm`, "ISO 4032"],
                    ["Nut Width Across Corners (e)", `${result.nutCornerToCorner} mm`, "ISO 4032"],
                    ["Nut Height (m)", `${result.nutHeight} mm`, "ISO 4032"],
                  ].map(([param, value, std], i) => (
                    <tr key={i} className="border-b border-[#0a1018] hover:bg-[#0d1520] transition-colors">
                      <td className="px-4 py-3 text-[#4a7a8a]">{param}</td>
                      <td className="px-4 py-3 text-right text-[#00e5ff] font-bold">{value}</td>
                      <td className="px-4 py-3 text-right text-[#2a4a5a] text-xs">{std}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* 3D design tips */}
            <div className="border border-[#1a2a35] p-4">
              <div className="text-[#2a4a5a] text-[10px] tracking-widest uppercase mb-3">&gt; 3D design reference</div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div>
                  <div className="text-[#3a6a7a] mb-1">SCREW POCKET</div>
                  <div className="text-[#4a9eba]">Head recess: ⌀ {+(result.headDiameter + 0.2).toFixed(1)} mm</div>
                  <div className="text-[#2a4a5a]">depth: {+(result.headHeight + 0.1).toFixed(1)} mm</div>
                </div>
                <div>
                  <div className="text-[#3a6a7a] mb-1">THROUGH HOLE</div>
                  <div className="text-[#4a9eba]">Clearance: ⌀ {result.clearanceHoleDiameter} mm</div>
                  <div className="text-[#2a4a5a]">close fit: ⌀ {+(result.threadDiameter + 0.2).toFixed(1)} mm</div>
                </div>
                <div>
                  <div className="text-[#3a6a7a] mb-1">NUT POCKET</div>
                  <div className="text-[#4a9eba]">Hex slot: {+(result.nutFlatToFlat + 0.2).toFixed(1)} mm</div>
                  <div className="text-[#2a4a5a]">depth: {+(result.nutHeight + 0.1).toFixed(1)} mm</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="border-t border-[#0f1e2a] px-6 py-4 mt-12 flex justify-between text-[#1a3a4a] text-[10px]">
        <span>ISO 4762 · ISO 4032 · ISO 273 · DIN 912 · DIN 934</span>
        <span>screwmeter.vercel.app</span>
      </div>
    </main>
  );
}
