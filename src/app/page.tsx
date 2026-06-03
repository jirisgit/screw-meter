"use client";

import { useState, useRef, useEffect } from "react";
import { findScrew, screwDatabase, ScrewData } from "@/lib/screwData";
import { computeScale, ScrewSideView, ScrewTopView, NutTopView, NutSideView } from "@/components/ScrewDiagram";

const COMMON_SIZES  = ["M1", "M1.2", "M1.6", "M2", "M2.5", "M3", "M4", "M5", "M6", "M8"];
const EXTENDED_SIZES = screwDatabase.map(s => s.size).filter(s => !COMMON_SIZES.includes(s));

/* ── stat card ─────────────────────────────────────────────────────────── */
function StatCard({ label, value, unit, sub }: {
  label: string; value: number; unit: string; sub?: string;
}) {
  return (
    <div className="border border-[#1a2a35] bg-[#0d1520] p-4 flex flex-col gap-1 hover:border-[#00e5ff33] transition-colors">
      <span className="text-[#3a6a7a] text-[10px] font-mono uppercase tracking-widest">{label}</span>
      <div className="flex items-end gap-1.5">
        <span className="text-[#00e5ff] text-3xl font-mono font-bold leading-none">{value}</span>
        <span className="text-[#4a9eba] text-sm font-mono mb-0.5">{unit}</span>
      </div>
      {sub && <span className="text-[#2a4a5a] text-[9px] font-mono">{sub}</span>}
    </div>
  );
}

/* ── clearance bar ─────────────────────────────────────────────────────── */
function ClearanceBar({ clearance, thread }: { clearance: number; thread: number }) {
  const pct = Math.round(((clearance - thread) / thread) * 100);
  const barW = Math.min((clearance / (clearance * 1.6)) * 100, 100);
  const redX = (thread / (clearance * 1.6)) * 100;
  return (
    <div className="border border-[#1a2a35] bg-[#0d1520] p-4 col-span-2">
      <div className="flex justify-between mb-2">
        <span className="text-[#3a6a7a] text-[10px] font-mono uppercase tracking-widest">Clearance Hole ⌀</span>
        <span className="text-[#00e5ff] text-sm font-mono font-bold">⌀ {clearance} mm</span>
      </div>
      <div className="h-2 bg-[#060a12] border border-[#1a2a35] relative">
        <div className="h-full bg-[#00e5ff] opacity-60 transition-all duration-500"
          style={{ width: `${barW}%` }} />
        <div className="absolute top-0 h-full bg-[#ff5555] opacity-70"
          style={{ left: `${redX}%`, width: "2px" }} />
      </div>
      <div className="flex justify-between mt-1.5">
        <span className="text-[#2a4a5a] text-[9px] font-mono">thread ⌀ {thread} mm</span>
        <span className="text-[#3a6a7a] text-[9px] font-mono">+{pct}% clearance</span>
      </div>
    </div>
  );
}

/* ── size selector ─────────────────────────────────────────────────────── */
function SizeSelector({ active, onSelect }: {
  active: string | null;
  onSelect: (s: ScrewData) => void;
}) {
  return (
    <div className="flex flex-wrap items-center gap-2 mb-8">
      {/* Large buttons for M1–M8 */}
      {COMMON_SIZES.map(size => {
        const isActive = active === size;
        return (
          <button
            key={size}
            onClick={() => { const s = findScrew(size); if (s) onSelect(s); }}
            className={`
              px-4 py-2.5 text-sm font-mono font-bold tracking-widest border transition-all
              ${isActive
                ? "border-[#00e5ff] text-[#00e5ff] bg-[#00e5ff12] shadow-[0_0_12px_#00e5ff33]"
                : "border-[#1a2a35] text-[#4a8a9a] hover:border-[#00e5ff55] hover:text-[#00e5ff] hover:bg-[#00e5ff08]"
              }
            `}
          >
            {size}
          </button>
        );
      })}

      {/* Divider */}
      <div className="h-8 w-px bg-[#1a2a35] mx-1" />

      {/* Dropdown for M10+ */}
      <div className="relative">
        <select
          value={EXTENDED_SIZES.includes(active ?? "") ? active ?? "" : ""}
          onChange={e => { const s = findScrew(e.target.value); if (s) onSelect(s); }}
          className={`
            appearance-none pl-4 pr-8 py-2.5 text-sm font-mono font-bold tracking-widest border
            bg-[#0d1520] cursor-pointer transition-all outline-none
            ${EXTENDED_SIZES.includes(active ?? "")
              ? "border-[#00e5ff] text-[#00e5ff] shadow-[0_0_12px_#00e5ff33]"
              : "border-[#1a2a35] text-[#4a8a9a] hover:border-[#00e5ff55] hover:text-[#00e5ff]"
            }
          `}
          style={{ background: "#0d1520" }}
        >
          <option value="" disabled>M10 – M36 ▾</option>
          {EXTENDED_SIZES.map(size => (
            <option key={size} value={size} style={{ background: "#0d1520", color: "#00e5ff" }}>
              {size}
            </option>
          ))}
        </select>
        {/* custom chevron */}
        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#4a8a9a] text-xs">▾</span>
      </div>
    </div>
  );
}

/* ── main page ─────────────────────────────────────────────────────────── */
export default function Home() {
  const [query,    setQuery]    = useState("");
  const [result,   setResult]   = useState<ScrewData | null>(null);
  const [notFound, setNotFound] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { inputRef.current?.focus(); }, []);

  function selectScrew(s: ScrewData) {
    setResult(s);
    setQuery(s.size);
    setNotFound(false);
  }

  function handleInput(val: string) {
    setQuery(val);
    setNotFound(false);
    const found = findScrew(val);
    if (found) setResult(found);
    else setResult(null);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const found = findScrew(query);
    if (found) { setResult(found); setNotFound(false); }
    else setNotFound(true);
  }

  return (
    <main className="min-h-screen bg-[#070b14] text-white font-mono">

      {/* ── HEADER ── */}
      <div className="border-b border-[#0f1e2a] px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-[#00e5ff] shadow-[0_0_8px_#00e5ff]" />
          <span className="text-[#00e5ff] text-sm tracking-[0.2em] uppercase">ScrewMeter</span>
          <span className="text-[#1a3a4a] text-xs hidden sm:inline">// ISO metric reference</span>
        </div>
        <span className="text-[#1a3a4a] text-xs">v1.0</span>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-10">

        {/* ── SEARCH BAR ── */}
        <div className="mb-6">
          <form onSubmit={handleSubmit} className="relative">
            <div className="flex items-center border border-[#00e5ff44] bg-[#0a0e1a] focus-within:border-[#00e5ff] transition-colors">
              <span className="text-[#00e5ff] px-4 text-lg select-none">_</span>
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={e => handleInput(e.target.value)}
                placeholder="type a size  e.g. M2, M6, M12..."
                className="flex-1 bg-transparent text-white text-lg py-3.5 pr-4 outline-none placeholder:text-[#1a3a4a] uppercase"
                autoComplete="off"
                spellCheck={false}
              />
              <button type="submit"
                className="px-6 py-3.5 text-[#00e5ff] border-l border-[#1a2a35] hover:bg-[#00e5ff10] transition-colors text-xs tracking-widest uppercase">
                LOOKUP
              </button>
            </div>
            {notFound && (
              <div className="mt-2 text-[#ff5555] text-xs tracking-widest">
                &gt; NOT FOUND — try M2, M3, M4, M6, M8, M10...
              </div>
            )}
          </form>
        </div>

        {/* ── SIZE SELECTOR ── */}
        <SizeSelector active={result?.size ?? null} onSelect={selectScrew} />

        {/* ── RESULTS ── */}
        {result && (
          <div className="space-y-6">

            {/* Title bar */}
            <div className="flex flex-wrap items-center gap-4 border-b border-[#0f1e2a] pb-4">
              <h1 className="text-5xl font-bold tracking-widest text-[#00e5ff]">{result.size}</h1>
              <div className="text-[#2a4a5a] text-sm">
                Socket Head Cap Screw + Hex Nut · ISO Metric
              </div>
              <div className="ml-auto flex gap-2">
                <span className="text-[#2a4a5a] text-xs border border-[#1a2a35] px-2 py-1">ISO 4762</span>
                <span className="text-[#2a4a5a] text-xs border border-[#1a2a35] px-2 py-1">ISO 4032</span>
              </div>
            </div>

            {/* ── DRAWINGS ── */}
            {(() => {
              const scale = computeScale(result);
              return (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="text-[#2a4a5a] text-[10px] tracking-widest uppercase">&gt; technical drawings</div>
                    <div className="text-[#1a3a4a] text-[9px] font-mono">
                      ISO 4762 socket head cap screw · internal hex socket (Allen key)
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <ScrewSideView data={result} scale={scale} />
                    <ScrewTopView  data={result} scale={scale} />
                    <NutTopView    data={result} scale={scale} />
                    <NutSideView   data={result} scale={scale} />
                  </div>
                </div>
              );
            })()}

            {/* ── STATS ── */}
            <div className="space-y-4">
              <div className="text-[#2a4a5a] text-[10px] tracking-widest uppercase">&gt; dimensions</div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <StatCard label="Thread Diameter"   value={result.threadDiameter}    unit="mm" sub="nominal thread ⌀" />
                <StatCard label="Head Diameter"      value={result.headDiameter}       unit="mm" sub="socket head cap" />
                <StatCard label="Head Height"        value={result.headHeight}         unit="mm" sub="ISO 4762" />
                <StatCard label="Hex Key Size"       value={result.hexKeySize}         unit="mm" sub="Allen key · hex socket" />
                <StatCard label="Nut Flat↔Flat"      value={result.nutFlatToFlat}      unit="mm" sub="wrench size · ISO 4032" />
                <StatCard label="Nut Corner↔Corner"  value={result.nutCornerToCorner}  unit="mm" sub="min. clearance ⌀" />
                <StatCard label="Nut Height"         value={result.nutHeight}          unit="mm" sub="standard hex nut" />
                <StatCard label="Thread Pitch"       value={result.pitch}              unit="mm" sub="coarse thread" />
              </div>
              <ClearanceBar clearance={result.clearanceHoleDiameter} thread={result.threadDiameter} />
            </div>

            {/* ── FULL SPEC TABLE ── */}
            <div className="border border-[#1a2a35]">
              <div className="border-b border-[#1a2a35] px-4 py-2 text-[10px] tracking-widest text-[#2a4a5a] uppercase">
                &gt; complete specification
              </div>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#0f1a20]">
                    {["parameter","value","standard"].map(h => (
                      <th key={h} className={`px-4 py-2 text-[#2a4a5a] text-[10px] uppercase tracking-widest font-normal ${h === "parameter" ? "text-left" : "text-right"}`}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {([
                    ["Thread Diameter (d)",         `⌀ ${result.threadDiameter} mm`,      "ISO 724"],
                    ["Thread Pitch",                 `${result.pitch} mm`,                  "ISO 261"],
                    ["Head Diameter (dk)",           `⌀ ${result.headDiameter} mm`,         "ISO 4762"],
                    ["Head Height (k)",              `${result.headHeight} mm`,             "ISO 4762"],
                    ["Hex Socket Drive (s)",         `${result.hexKeySize} mm`,             "ISO 4762"],
                    ["Clearance Hole",               `⌀ ${result.clearanceHoleDiameter} mm`, "ISO 273"],
                    ["Nut Width Across Flats (s)",   `${result.nutFlatToFlat} mm`,          "ISO 4032"],
                    ["Nut Width Across Corners (e)", `${result.nutCornerToCorner} mm`,      "ISO 4032"],
                    ["Nut Height (m)",               `${result.nutHeight} mm`,              "ISO 4032"],
                  ] as [string, string, string][]).map(([param, value, std], i) => (
                    <tr key={i} className="border-b border-[#0a1018] hover:bg-[#0d1520] transition-colors">
                      <td className="px-4 py-3 text-[#4a7a8a]">{param}</td>
                      <td className="px-4 py-3 text-right text-[#00e5ff] font-bold">{value}</td>
                      <td className="px-4 py-3 text-right text-[#2a4a5a] text-xs">{std}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* ── 3D DESIGN REFERENCE ── */}
            <div className="border border-[#1a2a35] p-5">
              <div className="text-[#2a4a5a] text-[10px] tracking-widest uppercase mb-4">
                &gt; 3D design reference
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 text-xs">
                <div className="space-y-1.5">
                  <div className="text-[#3a6a7a] tracking-widest uppercase text-[10px]">Screw Pocket</div>
                  <div className="text-[#4a9eba]">Head recess: ⌀ {+(result.headDiameter + 0.2).toFixed(1)} mm</div>
                  <div className="text-[#2a4a5a]">Depth: {+(result.headHeight + 0.1).toFixed(1)} mm</div>
                </div>
                <div className="space-y-1.5">
                  <div className="text-[#3a6a7a] tracking-widest uppercase text-[10px]">Through Hole</div>
                  <div className="text-[#4a9eba]">Clearance: ⌀ {result.clearanceHoleDiameter} mm</div>
                  <div className="text-[#2a4a5a]">Close fit: ⌀ {+(result.threadDiameter + 0.2).toFixed(1)} mm</div>
                </div>
                <div className="space-y-1.5">
                  <div className="text-[#3a6a7a] tracking-widest uppercase text-[10px]">Nut Pocket</div>
                  <div className="text-[#4a9eba]">Hex slot: {+(result.nutFlatToFlat + 0.2).toFixed(1)} mm</div>
                  <div className="text-[#2a4a5a]">Depth: {+(result.nutHeight + 0.1).toFixed(1)} mm</div>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* ── EMPTY STATE ── */}
        {!result && (
          <div className="mt-8 text-center text-[#1a3a4a] text-sm">
            select a size above or type into the search bar
          </div>
        )}
      </div>

      {/* ── FOOTER ── */}
      <div className="border-t border-[#0f1e2a] px-6 py-4 mt-16 flex flex-wrap justify-between gap-2 text-[#1a3a4a] text-[10px]">
        <span>ISO 4762 · ISO 4032 · ISO 273 · DIN 912 · DIN 934</span>
        <span>screwmeter.vercel.app</span>
      </div>
    </main>
  );
}
