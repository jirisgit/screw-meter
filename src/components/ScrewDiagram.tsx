"use client";

import { ScrewData } from "@/lib/screwData";

interface Props { data: ScrewData; }

const ACCENT  = "#00e5ff";
const DIM     = "#4a9eba";
const BG      = "#0a0e1a";
const SURFACE = "#0f1b27";

/* ─────────────────────────────────────────────────────────────────────────
   SCREW SIDE VIEW
───────────────────────────────────────────────────────────────────────── */
export function ScrewDiagram({ data }: Props) {
  const W = 440;

  // Scale so the head is always ~110 px radius → drawing fills width nicely
  const scale      = 220 / data.headDiameter;          // px per mm
  const headR      = (data.headDiameter  / 2) * scale; // ≈ 110 px
  const threadR    = (data.threadDiameter / 2) * scale;
  const headH      = Math.max(data.headHeight * scale, 30);
  const hexR       = (data.hexKeySize / 2) * scale;
  const chamferH   = threadR * 0.7;
  const shaftLen   = Math.max(headH * 1.3, threadR * 3.5, 75);

  // Vertical layout budgets
  const titleH     = 58;   // reserved for title block
  const dimAbove   = 52;   // space for head-diameter dim line
  const headTop    = titleH + dimAbove;
  const headBot    = headTop + headH;
  const shaftBot   = headBot + shaftLen;
  const tipBot     = shaftBot + chamferH;
  const dimBelow   = 60;   // space for thread-diameter dim line
  const H          = Math.ceil(tipBot + dimBelow);

  const cx         = W / 2;
  const headDimY   = headTop - 30;          // dim line above head
  const threadDimY = tipBot  + 32;          // dim line below tip
  const heightDimX = cx + headR + 56;       // vertical dim line to the right

  // Hex socket — flat-top hexagon, top-centred in head
  const hexCY = headTop + hexR + 6;
  const hexPts = Array.from({ length: 6 }).map((_, i) => {
    const a = (Math.PI / 3) * i + Math.PI / 6; // flat-top orientation
    return `${cx + hexR * Math.cos(a)},${hexCY + hexR * Math.sin(a)}`;
  }).join(" ");

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ background: BG, borderRadius: 8 }}>

      {/* ── TITLE ── */}
      <text x={cx} y={22} textAnchor="middle" fill={ACCENT} fontSize={14}
        fontFamily="monospace" fontWeight="bold" letterSpacing="2">
        {data.size}  SOCKET HEAD CAP SCREW
      </text>
      <text x={cx} y={40} textAnchor="middle" fill="#2a5a6a" fontSize={10} fontFamily="monospace">
        ISO 4762 / DIN 912 · SIDE VIEW
      </text>
      <text x={cx} y={54} textAnchor="middle" fill="#1e3d4a" fontSize={9} fontFamily="monospace">
        thread pitch  {data.pitch} mm  ·  coarse
      </text>

      {/* ── HEAD BODY ── */}
      <rect x={cx - headR} y={headTop} width={headR * 2} height={headH}
        fill={SURFACE} stroke={ACCENT} strokeWidth={1.5} />

      {/* ── HEX SOCKET ── */}
      <polygon points={hexPts} fill="#040710" stroke={ACCENT} strokeWidth={1.2} opacity={0.95} />

      {/* ── SHAFT ── */}
      <rect x={cx - threadR} y={headBot} width={threadR * 2} height={shaftLen}
        fill={SURFACE} stroke={ACCENT} strokeWidth={1.5} />

      {/* Thread serration marks */}
      {Array.from({ length: Math.floor(shaftLen / 10) }).map((_, i) => {
        const y = headBot + 6 + i * 10;
        if (y > shaftBot - 5) return null;
        return (
          <g key={i} opacity={0.28}>
            <line x1={cx - threadR - 5} y1={y} x2={cx - threadR} y2={y + 5}
              stroke={ACCENT} strokeWidth={1.2} />
            <line x1={cx + threadR} y1={y} x2={cx + threadR + 5} y2={y + 5}
              stroke={ACCENT} strokeWidth={1.2} />
          </g>
        );
      })}

      {/* ── CHAMFER TIP ── */}
      <polygon
        points={`${cx - threadR},${shaftBot} ${cx + threadR},${shaftBot} ${cx + threadR * 0.5},${tipBot} ${cx - threadR * 0.5},${tipBot}`}
        fill={SURFACE} stroke={ACCENT} strokeWidth={1.5} />

      {/* ══ DIM: HEAD DIAMETER ══ */}
      {/* witness lines */}
      <line x1={cx - headR} y1={headTop - 2} x2={cx - headR} y2={headDimY + 3}
        stroke={DIM} strokeWidth={0.9} strokeDasharray="4,3" opacity={0.65} />
      <line x1={cx + headR} y1={headTop - 2} x2={cx + headR} y2={headDimY + 3}
        stroke={DIM} strokeWidth={0.9} strokeDasharray="4,3" opacity={0.65} />
      {/* dim line + arrows */}
      <line x1={cx - headR} y1={headDimY} x2={cx + headR} y2={headDimY}
        stroke={DIM} strokeWidth={1.3} />
      <polygon points={`${cx - headR},${headDimY} ${cx - headR + 9},${headDimY - 4} ${cx - headR + 9},${headDimY + 4}`} fill={DIM} />
      <polygon points={`${cx + headR},${headDimY} ${cx + headR - 9},${headDimY - 4} ${cx + headR - 9},${headDimY + 4}`} fill={DIM} />
      {/* label on opaque background */}
      <rect x={cx - 52} y={headDimY - 19} width={104} height={16} fill={BG} />
      <text x={cx} y={headDimY - 6} textAnchor="middle" fill={DIM}
        fontSize={13} fontFamily="monospace" fontWeight="bold">
        ⌀ {data.headDiameter} mm
      </text>

      {/* ══ DIM: THREAD DIAMETER ══ */}
      <line x1={cx - threadR} y1={tipBot + 2} x2={cx - threadR} y2={threadDimY - 3}
        stroke={DIM} strokeWidth={0.9} strokeDasharray="4,3" opacity={0.65} />
      <line x1={cx + threadR} y1={tipBot + 2} x2={cx + threadR} y2={threadDimY - 3}
        stroke={DIM} strokeWidth={0.9} strokeDasharray="4,3" opacity={0.65} />
      <line x1={cx - threadR} y1={threadDimY} x2={cx + threadR} y2={threadDimY}
        stroke={DIM} strokeWidth={1.3} />
      <polygon points={`${cx - threadR},${threadDimY} ${cx - threadR + 9},${threadDimY - 4} ${cx - threadR + 9},${threadDimY + 4}`} fill={DIM} />
      <polygon points={`${cx + threadR},${threadDimY} ${cx + threadR - 9},${threadDimY - 4} ${cx + threadR - 9},${threadDimY + 4}`} fill={DIM} />
      <rect x={cx - 52} y={threadDimY + 4} width={104} height={16} fill={BG} />
      <text x={cx} y={threadDimY + 17} textAnchor="middle" fill={DIM}
        fontSize={13} fontFamily="monospace" fontWeight="bold">
        ⌀ {data.threadDiameter} mm
      </text>

      {/* ══ DIM: HEAD HEIGHT ══ */}
      <line x1={cx + headR + 2} y1={headTop} x2={heightDimX - 3} y2={headTop}
        stroke={DIM} strokeWidth={0.9} strokeDasharray="4,3" opacity={0.65} />
      <line x1={cx + headR + 2} y1={headBot} x2={heightDimX - 3} y2={headBot}
        stroke={DIM} strokeWidth={0.9} strokeDasharray="4,3" opacity={0.65} />
      <line x1={heightDimX} y1={headTop} x2={heightDimX} y2={headBot}
        stroke={DIM} strokeWidth={1.3} />
      <polygon points={`${heightDimX},${headTop} ${heightDimX - 4},${headTop + 9} ${heightDimX + 4},${headTop + 9}`} fill={DIM} />
      <polygon points={`${heightDimX},${headBot} ${heightDimX - 4},${headBot - 9} ${heightDimX + 4},${headBot - 9}`} fill={DIM} />
      <text x={heightDimX + 8} y={(headTop + headBot) / 2 + 5}
        textAnchor="start" fill={DIM} fontSize={13} fontFamily="monospace" fontWeight="bold">
        {data.headHeight} mm
      </text>

      {/* ══ HEX KEY CALLOUT (leader line from socket to left margin) ══ */}
      <line x1={cx - hexR - 2} y1={hexCY} x2={cx - headR - 28} y2={hexCY}
        stroke={DIM} strokeWidth={0.9} opacity={0.55} strokeDasharray="3,2" />
      <text x={cx - headR - 32} y={hexCY + 4} textAnchor="end"
        fill={DIM} fontSize={12} fontFamily="monospace">
        ⬡ {data.hexKeySize} mm
      </text>
    </svg>
  );
}

/* ─────────────────────────────────────────────────────────────────────────
   NUT TOP VIEW
───────────────────────────────────────────────────────────────────────── */
export function NutDiagram({ data }: Props) {
  const W   = 440;
  const H   = 380;
  const cx  = W / 2;
  const cy  = 195;

  // Scale: flat-to-flat always ≈ 110 px radius
  const scale    = 220 / data.nutFlatToFlat;   // px per mm
  const f2fR     = (data.nutFlatToFlat / 2) * scale;   // ≈ 110 px
  const c2cR     = (data.nutCornerToCorner / 2) * scale;
  const threadR  = (data.threadDiameter / 2) * scale;

  // Pointy-top hex (vertex straight up + down — clean vertical C2C dim)
  const hexPts = Array.from({ length: 6 }).map((_, i) => {
    const a = (Math.PI / 3) * i - Math.PI / 2; // first vertex at top
    return `${cx + c2cR * Math.cos(a)},${cy + c2cR * Math.sin(a)}`;
  }).join(" ");

  // Dim line positions
  const f2fDimY   = cy;                   // F2F line right through horizontal centre
  const c2cDimX   = cx + c2cR + 48;      // C2C line to the right of hex

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ background: BG, borderRadius: 8 }}>

      {/* ── TITLE ── */}
      <text x={cx} y={22} textAnchor="middle" fill={ACCENT} fontSize={14}
        fontFamily="monospace" fontWeight="bold" letterSpacing="2">
        {data.size}  HEX NUT
      </text>
      <text x={cx} y={38} textAnchor="middle" fill="#2a5a6a" fontSize={10} fontFamily="monospace">
        ISO 4032 / DIN 934 · TOP VIEW
      </text>

      {/* ── HEX BODY ── */}
      <polygon points={hexPts} fill={SURFACE} stroke={ACCENT} strokeWidth={1.5} />

      {/* Face-centre dots */}
      {Array.from({ length: 6 }).map((_, i) => {
        const a1 = (Math.PI / 3) * i     - Math.PI / 2;
        const a2 = (Math.PI / 3) * (i+1) - Math.PI / 2;
        const mx = cx + f2fR * Math.cos((a1 + a2) / 2);
        const my = cy + f2fR * Math.sin((a1 + a2) / 2);
        return <circle key={i} cx={mx} cy={my} r={2.5} fill={ACCENT} opacity={0.35} />;
      })}

      {/* ── THREAD HOLE ── */}
      <circle cx={cx} cy={cy} r={threadR}
        fill="#040710" stroke={ACCENT} strokeWidth={1.2} opacity={0.95} />
      {/* hole cross-hatch */}
      <line x1={cx - threadR + 3} y1={cy} x2={cx + threadR - 3} y2={cy}
        stroke={ACCENT} strokeWidth={0.7} opacity={0.3} />
      <line x1={cx} y1={cy - threadR + 3} x2={cx} y2={cy + threadR - 3}
        stroke={ACCENT} strokeWidth={0.7} opacity={0.3} />

      {/* ══ DIM: FLAT-TO-FLAT (horizontal through centre) ══ */}
      {/* The flat midpoints are at (cx ± f2fR, cy) for this hex orientation */}
      <line x1={cx - f2fR} y1={f2fDimY} x2={cx + f2fR} y2={f2fDimY}
        stroke={DIM} strokeWidth={1.3} />
      <polygon points={`${cx - f2fR},${f2fDimY} ${cx - f2fR + 9},${f2fDimY - 4} ${cx - f2fR + 9},${f2fDimY + 4}`} fill={DIM} />
      <polygon points={`${cx + f2fR},${f2fDimY} ${cx + f2fR - 9},${f2fDimY - 4} ${cx + f2fR - 9},${f2fDimY + 4}`} fill={DIM} />
      <rect x={cx - 56} y={f2fDimY - 21} width={112} height={16} fill={BG} />
      <text x={cx} y={f2fDimY - 8} textAnchor="middle" fill={DIM}
        fontSize={13} fontFamily="monospace" fontWeight="bold">
        ⌀F {data.nutFlatToFlat} mm
      </text>
      <text x={cx} y={f2fDimY + 26} textAnchor="middle" fill="#1e3d4a"
        fontSize={9} fontFamily="monospace">
        flat-to-flat  ·  wrench size
      </text>

      {/* ══ DIM: CORNER-TO-CORNER (vertical, right side) ══ */}
      {/* Top corner: (cx, cy-c2cR)  Bottom corner: (cx, cy+c2cR) */}
      <line x1={cx} y1={cy - c2cR} x2={c2cDimX - 3} y2={cy - c2cR}
        stroke={DIM} strokeWidth={0.9} strokeDasharray="4,3" opacity={0.65} />
      <line x1={cx} y1={cy + c2cR} x2={c2cDimX - 3} y2={cy + c2cR}
        stroke={DIM} strokeWidth={0.9} strokeDasharray="4,3" opacity={0.65} />
      <line x1={c2cDimX} y1={cy - c2cR} x2={c2cDimX} y2={cy + c2cR}
        stroke={DIM} strokeWidth={1.3} />
      <polygon points={`${c2cDimX},${cy - c2cR} ${c2cDimX - 4},${cy - c2cR + 9} ${c2cDimX + 4},${cy - c2cR + 9}`} fill={DIM} />
      <polygon points={`${c2cDimX},${cy + c2cR} ${c2cDimX - 4},${cy + c2cR - 9} ${c2cDimX + 4},${cy + c2cR - 9}`} fill={DIM} />
      <text x={c2cDimX + 8} y={cy - 4} textAnchor="start" fill={DIM}
        fontSize={12} fontFamily="monospace" fontWeight="bold">
        ⌀C
      </text>
      <text x={c2cDimX + 8} y={cy + 12} textAnchor="start" fill={DIM}
        fontSize={12} fontFamily="monospace" fontWeight="bold">
        {data.nutCornerToCorner}
      </text>
      <text x={c2cDimX + 8} y={cy + 26} textAnchor="start" fill={DIM}
        fontSize={10} fontFamily="monospace">
        mm
      </text>

      {/* ── NUT HEIGHT ── (label below) */}
      <text x={cx} y={H - 36} textAnchor="middle" fill="#3a6a7a"
        fontSize={11} fontFamily="monospace">
        NUT HEIGHT
      </text>
      <text x={cx} y={H - 18} textAnchor="middle" fill={DIM}
        fontSize={18} fontFamily="monospace" fontWeight="bold">
        {data.nutHeight} mm
      </text>
    </svg>
  );
}
