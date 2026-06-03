"use client";

import { ScrewData } from "@/lib/screwData";

const ACCENT = "#00e5ff";
const DIM    = "#4a9eba";
const BG     = "#0a0e1a";
const SURF   = "#0f1b27";
const W      = 440;
const CX     = 220;

// All 4 views share this scale so 1 mm = same pixels everywhere
export function computeScale(data: ScrewData): number {
  return 300 / Math.max(data.headDiameter, data.nutCornerToCorner);
}

// ── dim helpers ────────────────────────────────────────────────────────────

function DimH({ x1, x2, y, label, above = true, wy }: {
  x1: number; x2: number; y: number; label: string; above?: boolean; wy?: number;
}) {
  const mx = (x1 + x2) / 2;
  const lY = above ? y - 7 : y + 16;
  return (
    <g>
      {wy !== undefined && <>
        <line x1={x1} y1={wy} x2={x1} y2={y} stroke={DIM} strokeWidth={0.85} strokeDasharray="4,3" opacity={0.55}/>
        <line x1={x2} y1={wy} x2={x2} y2={y} stroke={DIM} strokeWidth={0.85} strokeDasharray="4,3" opacity={0.55}/>
      </>}
      <line x1={x1} y1={y} x2={x2} y2={y} stroke={DIM} strokeWidth={1.3}/>
      <polygon points={`${x1},${y} ${x1+9},${y-4} ${x1+9},${y+4}`} fill={DIM}/>
      <polygon points={`${x2},${y} ${x2-9},${y-4} ${x2-9},${y+4}`} fill={DIM}/>
      <rect x={mx-50} y={above ? y-20 : y+3} width={100} height={15} fill={BG}/>
      <text x={mx} y={lY} textAnchor="middle" fill={DIM} fontSize={12} fontFamily="monospace" fontWeight="bold">{label}</text>
    </g>
  );
}

function DimV({ x, y1, y2, label, right = true, wx }: {
  x: number; y1: number; y2: number; label: string; right?: boolean; wx?: number;
}) {
  const my = (y1 + y2) / 2;
  return (
    <g>
      {wx !== undefined && <>
        <line x1={wx} y1={y1} x2={x} y2={y1} stroke={DIM} strokeWidth={0.85} strokeDasharray="4,3" opacity={0.55}/>
        <line x1={wx} y1={y2} x2={x} y2={y2} stroke={DIM} strokeWidth={0.85} strokeDasharray="4,3" opacity={0.55}/>
      </>}
      <line x1={x} y1={y1} x2={x} y2={y2} stroke={DIM} strokeWidth={1.3}/>
      <polygon points={`${x},${y1} ${x-4},${y1+9} ${x+4},${y1+9}`} fill={DIM}/>
      <polygon points={`${x},${y2} ${x-4},${y2-9} ${x+4},${y2-9}`} fill={DIM}/>
      <text x={right ? x+8 : x-8} y={my+4} textAnchor={right ? "start" : "end"}
        fill={DIM} fontSize={12} fontFamily="monospace" fontWeight="bold">{label}</text>
    </g>
  );
}

// ── 1. SCREW SIDE VIEW ─────────────────────────────────────────────────────
// Hex socket shown as a rectangular notch — correct for a side view

export function ScrewSideView({ data, scale }: { data: ScrewData; scale: number }) {
  const headR    = (data.headDiameter   / 2) * scale;
  const threadR  = (data.threadDiameter / 2) * scale;
  const headH    = data.headHeight            * scale;
  const socketW  = data.hexKeySize            * scale;          // notch width
  const socketD  = data.hexKeySize * 0.75     * scale;          // notch depth (approx ISO)
  const chamferH = threadR * 0.65;
  const shaftH   = Math.max(data.headHeight * 2 * scale, threadR * 4, 60);

  const TITLE  = 50;
  const ABOVE  = 50;
  const headTop  = TITLE + ABOVE;
  const headBot  = headTop + headH;
  const shaftBot = headBot + shaftH;
  const tipBot   = shaftBot + chamferH;
  const BELOW  = 58;
  const H      = Math.ceil(tipBot + BELOW);

  const headDimY   = headTop - 28;
  const threadDimY = tipBot  + 32;
  const hDimX      = CX + headR + 46;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ background: BG, borderRadius: 8 }}>
      <text x={CX} y={20} textAnchor="middle" fill={ACCENT} fontSize={13}
        fontFamily="monospace" fontWeight="bold" letterSpacing="2">
        {data.size}  SCREW — SIDE VIEW
      </text>
      <text x={CX} y={36} textAnchor="middle" fill="#2a5a6a" fontSize={9} fontFamily="monospace">
        ISO 4762 · socket head cap · internal hex socket
      </text>

      {/* head body */}
      <rect x={CX-headR} y={headTop} width={headR*2} height={headH}
        fill={SURF} stroke={ACCENT} strokeWidth={1.5}/>

      {/* hex socket: rectangular notch centred at top of head — SIDE VIEW */}
      <rect x={CX - socketW/2} y={headTop} width={socketW} height={socketD}
        fill="#040810" stroke={ACCENT} strokeWidth={1}/>

      {/* shaft */}
      <rect x={CX-threadR} y={headBot} width={threadR*2} height={shaftH}
        fill={SURF} stroke={ACCENT} strokeWidth={1.5}/>

      {/* thread marks */}
      {Array.from({ length: Math.floor(shaftH / 9) }).map((_, i) => {
        const y = headBot + 6 + i * 9;
        if (y > shaftBot - 5) return null;
        return (
          <g key={i} opacity={0.28}>
            <line x1={CX-threadR-5} y1={y} x2={CX-threadR} y2={y+5} stroke={ACCENT} strokeWidth={1.1}/>
            <line x1={CX+threadR}   y1={y} x2={CX+threadR+5} y2={y+5} stroke={ACCENT} strokeWidth={1.1}/>
          </g>
        );
      })}

      {/* chamfer tip */}
      <polygon
        points={`${CX-threadR},${shaftBot} ${CX+threadR},${shaftBot} ${CX+threadR*0.5},${tipBot} ${CX-threadR*0.5},${tipBot}`}
        fill={SURF} stroke={ACCENT} strokeWidth={1.5}/>

      {/* dim: head diameter */}
      <DimH x1={CX-headR} x2={CX+headR} y={headDimY}
        label={`⌀ ${data.headDiameter} mm`} wy={headTop}/>

      {/* dim: thread diameter */}
      <DimH x1={CX-threadR} x2={CX+threadR} y={threadDimY}
        label={`⌀ ${data.threadDiameter} mm`} above={false} wy={tipBot}/>

      {/* dim: head height */}
      <DimV x={hDimX} y1={headTop} y2={headBot}
        label={`${data.headHeight} mm`} wx={CX+headR}/>

      {/* hex socket callout */}
      <line x1={CX - socketW/2} y1={headTop + socketD/2}
        x2={CX - headR - 28}   y2={headTop + socketD/2}
        stroke={DIM} strokeWidth={0.85} strokeDasharray="3,2" opacity={0.6}/>
      <text x={CX - headR - 32} y={headTop + socketD/2 + 4}
        textAnchor="end" fill={DIM} fontSize={11} fontFamily="monospace">
        ⬡ {data.hexKeySize} mm
      </text>
    </svg>
  );
}

// ── 2. SCREW TOP VIEW ──────────────────────────────────────────────────────
// Head shown as circle; hex socket shown as hexagon — correct for top view

export function ScrewTopView({ data, scale }: { data: ScrewData; scale: number }) {
  const headR = (data.headDiameter / 2) * scale;
  const hexR  = (data.hexKeySize   / 2) * scale;

  const TITLE = 50;
  const ABOVE = 48;
  const cy    = TITLE + ABOVE + headR;
  const H     = Math.ceil(cy + headR + 30);

  const dimY  = TITLE + ABOVE - 28;

  // Hex socket: flat-top orientation (angle = i*60°)
  const hexPts = Array.from({ length: 6 }).map((_, i) => {
    const a = (Math.PI / 3) * i;
    return `${CX + hexR * Math.cos(a)},${cy + hexR * Math.sin(a)}`;
  }).join(" ");

  // leader end-point: upper-right hex vertex
  const lx = CX + hexR * Math.cos(0);
  const ly = cy + hexR * Math.sin(0);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ background: BG, borderRadius: 8 }}>
      <text x={CX} y={20} textAnchor="middle" fill={ACCENT} fontSize={13}
        fontFamily="monospace" fontWeight="bold" letterSpacing="2">
        {data.size}  SCREW — TOP VIEW
      </text>
      <text x={CX} y={36} textAnchor="middle" fill="#2a5a6a" fontSize={9} fontFamily="monospace">
        ISO 4762 · looking into hex socket
      </text>

      {/* head circle */}
      <circle cx={CX} cy={cy} r={headR} fill={SURF} stroke={ACCENT} strokeWidth={1.5}/>

      {/* hex socket */}
      <polygon points={hexPts} fill="#040810" stroke={ACCENT} strokeWidth={1.2}/>

      {/* centre mark */}
      <line x1={CX-4} y1={cy} x2={CX+4} y2={cy} stroke={ACCENT} strokeWidth={0.8} opacity={0.4}/>
      <line x1={CX} y1={cy-4} x2={CX} y2={cy+4} stroke={ACCENT} strokeWidth={0.8} opacity={0.4}/>

      {/* dim: head diameter */}
      <DimH x1={CX-headR} x2={CX+headR} y={dimY}
        label={`⌀ ${data.headDiameter} mm`} wy={cy}/>

      {/* hex socket leader */}
      <line x1={lx} y1={ly} x2={CX+headR+20} y2={cy+headR*0.35}
        stroke={DIM} strokeWidth={0.85} strokeDasharray="3,2" opacity={0.6}/>
      <text x={CX+headR+24} y={cy+headR*0.35+4}
        textAnchor="start" fill={DIM} fontSize={11} fontFamily="monospace">
        ⬡ {data.hexKeySize} mm
      </text>
    </svg>
  );
}

// ── 3. NUT TOP VIEW ────────────────────────────────────────────────────────

export function NutTopView({ data, scale }: { data: ScrewData; scale: number }) {
  const c2cR   = (data.nutCornerToCorner / 2) * scale;  // ≈ 150 px always
  const f2fR   = (data.nutFlatToFlat     / 2) * scale;
  const tR     = (data.threadDiameter    / 2) * scale;

  const TITLE  = 50;
  const ABOVE  = 50;
  const cy     = TITLE + ABOVE + c2cR;
  const H      = Math.ceil(cy + c2cR + 30);

  const dimY   = TITLE + ABOVE - 28;
  const c2cX   = CX + c2cR + 46;
  // Wider canvas so the C2C label (right of dim line) is never clipped.
  // CX stays at 220 — only the right margin grows.
  const NUT_W  = 520;

  // Pointy-top hex: vertex straight up/down → clean vertical C2C dim line
  const hexPts = Array.from({ length: 6 }).map((_, i) => {
    const a = (Math.PI / 3) * i - Math.PI / 2;
    return `${CX + c2cR * Math.cos(a)},${cy + c2cR * Math.sin(a)}`;
  }).join(" ");

  return (
    <svg viewBox={`0 0 ${NUT_W} ${H}`} className="w-full" style={{ background: BG, borderRadius: 8 }}>
      <text x={CX} y={20} textAnchor="middle" fill={ACCENT} fontSize={13}
        fontFamily="monospace" fontWeight="bold" letterSpacing="2">
        {data.size}  NUT — TOP VIEW
      </text>
      <text x={CX} y={36} textAnchor="middle" fill="#2a5a6a" fontSize={9} fontFamily="monospace">
        ISO 4032 / DIN 934
      </text>

      {/* hex body */}
      <polygon points={hexPts} fill={SURF} stroke={ACCENT} strokeWidth={1.5}/>

      {/* face-centre dots */}
      {Array.from({ length: 6 }).map((_, i) => {
        const a = (Math.PI / 3) * i - Math.PI / 2 + Math.PI / 6;
        return <circle key={i} cx={CX + f2fR*Math.cos(a)} cy={cy + f2fR*Math.sin(a)} r={2.5} fill={ACCENT} opacity={0.28}/>;
      })}

      {/* thread hole */}
      <circle cx={CX} cy={cy} r={tR} fill="#040810" stroke={ACCENT} strokeWidth={1.2}/>
      <line x1={CX-tR+3} y1={cy} x2={CX+tR-3} y2={cy} stroke={ACCENT} strokeWidth={0.7} opacity={0.35}/>
      <line x1={CX} y1={cy-tR+3} x2={CX} y2={cy+tR-3} stroke={ACCENT} strokeWidth={0.7} opacity={0.35}/>

      {/* dim: F2F — witnesses from flat-face midpoints (y=cy) up to dim line */}
      <DimH x1={CX-f2fR} x2={CX+f2fR} y={dimY}
        label={`${data.nutFlatToFlat} mm`} wy={cy}/>
      <text x={CX} y={dimY+15} textAnchor="middle" fill="#1a3a4a" fontSize={8} fontFamily="monospace">
        flat-to-flat · wrench size
      </text>

      {/* dim: C2C — witnesses from top/bottom vertices rightward */}
      <DimV x={c2cX} y1={cy-c2cR} y2={cy+c2cR}
        label={`${data.nutCornerToCorner} mm`} wx={CX}/>
      <text x={c2cX+8} y={cy-c2cR-6} textAnchor="start" fill="#1a3a4a" fontSize={8} fontFamily="monospace">
        corner-to-corner
      </text>
    </svg>
  );
}

// ── 4. NUT SIDE VIEW ───────────────────────────────────────────────────────

export function NutSideView({ data, scale }: { data: ScrewData; scale: number }) {
  const nutW   = data.nutFlatToFlat  * scale;
  const nutH   = data.nutHeight      * scale;
  const tR     = (data.threadDiameter / 2) * scale;
  const chamf  = Math.min(nutH * 0.14, 8);  // chamfer on corners

  const TITLE  = 50;
  const ABOVE  = 50;
  const nutTop = TITLE + ABOVE;
  const nutBot = nutTop + nutH;
  const H      = Math.ceil(nutBot + 55);

  const nx1    = CX - nutW / 2;
  const nx2    = CX + nutW / 2;
  const dimY   = nutTop - 28;
  const hDimX  = nx2 + 46;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ background: BG, borderRadius: 8 }}>
      <text x={CX} y={20} textAnchor="middle" fill={ACCENT} fontSize={13}
        fontFamily="monospace" fontWeight="bold" letterSpacing="2">
        {data.size}  NUT — SIDE VIEW
      </text>
      <text x={CX} y={36} textAnchor="middle" fill="#2a5a6a" fontSize={9} fontFamily="monospace">
        ISO 4032 · flat face towards viewer
      </text>

      {/* nut body with chamfered corners */}
      <polygon
        points={`
          ${nx1+chamf},${nutTop}
          ${nx2-chamf},${nutTop}
          ${nx2},${nutTop+chamf}
          ${nx2},${nutBot-chamf}
          ${nx2-chamf},${nutBot}
          ${nx1+chamf},${nutBot}
          ${nx1},${nutBot-chamf}
          ${nx1},${nutTop+chamf}
        `}
        fill={SURF} stroke={ACCENT} strokeWidth={1.5}/>

      {/* thread hole: shown as hidden (dashed) lines in side view */}
      <line x1={CX-tR} y1={nutTop+2} x2={CX-tR} y2={nutBot-2}
        stroke={ACCENT} strokeWidth={1} strokeDasharray="5,4" opacity={0.45}/>
      <line x1={CX+tR} y1={nutTop+2} x2={CX+tR} y2={nutBot-2}
        stroke={ACCENT} strokeWidth={1} strokeDasharray="5,4" opacity={0.45}/>

      {/* dim: flat-to-flat width */}
      <DimH x1={nx1} x2={nx2} y={dimY}
        label={`${data.nutFlatToFlat} mm`} wy={nutTop}/>

      {/* dim: nut height */}
      <DimV x={hDimX} y1={nutTop} y2={nutBot}
        label={`${data.nutHeight} mm`} wx={nx2}/>
    </svg>
  );
}
