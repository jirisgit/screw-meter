"use client";

import { ScrewData } from "@/lib/screwData";

interface Props {
  data: ScrewData;
}

export function ScrewDiagram({ data }: Props) {
  const W = 320;
  const H = 420;
  const cx = W / 2;
  const accent = "#00e5ff";
  const dim = "#4a9eba";
  const bg = "#0a0e1a";
  const surface = "#111827";

  // Scale screw visually — normalize to thread diameter
  const scale = Math.min(60 / data.threadDiameter, 8);

  const threadR = (data.threadDiameter / 2) * scale;
  const headR = (data.headDiameter / 2) * scale;
  const headH = data.headHeight * scale;
  const shaftLen = Math.max(headH * 2.5, 80);

  // Positions
  const headTop = 60;
  const headBot = headTop + headH;
  const shaftBot = headBot + shaftLen;

  // Hex socket in head
  const hexR = (data.hexKeySize / 2) * scale;

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className="w-full max-w-[320px]"
      style={{ background: bg, borderRadius: 8 }}
    >
      {/* Title */}
      <text x={cx} y={28} textAnchor="middle" fill={accent} fontSize={18} fontFamily="monospace" fontWeight="bold">
        {data.size} SOCKET HEAD
      </text>
      <text x={cx} y={44} textAnchor="middle" fill="#4a6a7a" fontSize={10} fontFamily="monospace">
        ISO 4762 · SIDE VIEW
      </text>

      {/* Screw head */}
      <rect
        x={cx - headR}
        y={headTop}
        width={headR * 2}
        height={headH}
        fill={surface}
        stroke={accent}
        strokeWidth={1.5}
      />

      {/* Hex socket cutout (visualized as a small rect top-center) */}
      <rect
        x={cx - hexR}
        y={headTop}
        width={hexR * 2}
        height={hexR * 1.4}
        fill="#060a12"
        stroke={accent}
        strokeWidth={1}
        opacity={0.85}
      />

      {/* Thread shaft */}
      <rect
        x={cx - threadR}
        y={headBot}
        width={threadR * 2}
        height={shaftLen}
        fill={surface}
        stroke={accent}
        strokeWidth={1.5}
      />

      {/* Thread lines on shaft */}
      {Array.from({ length: Math.floor(shaftLen / (data.pitch * scale * 0.6 + 4)) }).map((_, i) => {
        const y = headBot + 6 + i * (shaftLen / Math.floor(shaftLen / (data.pitch * scale * 0.6 + 4)));
        return (
          <g key={i}>
            <line x1={cx - threadR - 3} y1={y} x2={cx - threadR} y2={y + 3} stroke={accent} strokeWidth={0.8} opacity={0.5} />
            <line x1={cx + threadR} y1={y} x2={cx + threadR + 3} y2={y + 3} stroke={accent} strokeWidth={0.8} opacity={0.5} />
          </g>
        );
      })}

      {/* Chamfer tip */}
      <polygon
        points={`${cx - threadR},${shaftBot} ${cx + threadR},${shaftBot} ${cx + threadR * 0.6},${shaftBot + threadR * 0.8} ${cx - threadR * 0.6},${shaftBot + threadR * 0.8}`}
        fill={surface}
        stroke={accent}
        strokeWidth={1.5}
      />

      {/* === DIMENSION LINES === */}
      {/* Head diameter */}
      <DimLine
        x1={cx - headR} y1={headTop - 14}
        x2={cx + headR} y2={headTop - 14}
        label={`⌀ ${data.headDiameter} mm`}
        color={dim}
      />

      {/* Thread diameter */}
      <DimLine
        x1={cx - threadR} y1={shaftBot + threadR * 0.8 + 18}
        x2={cx + threadR} y2={shaftBot + threadR * 0.8 + 18}
        label={`⌀ ${data.threadDiameter} mm`}
        color={dim}
      />

      {/* Head height */}
      <DimLineV
        x={cx + headR + 24}
        y1={headTop} y2={headBot}
        label={`${data.headHeight} mm`}
        color={dim}
      />

      {/* Hex key */}
      <text
        x={cx}
        y={headTop + hexR * 0.8}
        textAnchor="middle"
        fill={accent}
        fontSize={Math.max(hexR * 0.9, 7)}
        fontFamily="monospace"
        opacity={0.9}
      >
        ⬡{data.hexKeySize}
      </text>

      {/* Standard note */}
      <text x={cx} y={H - 10} textAnchor="middle" fill="#2a4a5a" fontSize={9} fontFamily="monospace">
        ISO 4762 · DIN 912 · pitch {data.pitch} mm
      </text>
    </svg>
  );
}

export function NutDiagram({ data }: Props) {
  const W = 280;
  const H = 300;
  const cx = W / 2;
  const cy = H / 2 - 10;
  const accent = "#00e5ff";
  const dim = "#4a9eba";
  const bg = "#0a0e1a";
  const surface = "#111827";

  const scale = Math.min(70 / data.nutFlatToFlat, 5);
  const f2f = (data.nutFlatToFlat / 2) * scale;  // flat-to-flat radius
  const c2c = (data.nutCornerToCorner / 2) * scale; // corner-to-corner radius
  const threadR = (data.threadDiameter / 2) * scale;

  // Hexagon points (corner-to-corner)
  const hexPoints = Array.from({ length: 6 }).map((_, i) => {
    const angle = (Math.PI / 3) * i - Math.PI / 6;
    return [cx + c2c * Math.cos(angle), cy + c2c * Math.sin(angle)];
  });
  const hexStr = hexPoints.map(p => p.join(",")).join(" ");

  // Flat-to-flat indicator lines (horizontal)
  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className="w-full max-w-[280px]"
      style={{ background: bg, borderRadius: 8 }}
    >
      <text x={cx} y={24} textAnchor="middle" fill={accent} fontSize={16} fontFamily="monospace" fontWeight="bold">
        {data.size} HEX NUT
      </text>
      <text x={cx} y={38} textAnchor="middle" fill="#4a6a7a" fontSize={10} fontFamily="monospace">
        ISO 4032 · TOP VIEW
      </text>

      {/* Hex body */}
      <polygon points={hexStr} fill={surface} stroke={accent} strokeWidth={1.5} />

      {/* Flat markers */}
      {Array.from({ length: 6 }).map((_, i) => {
        const a1 = (Math.PI / 3) * i - Math.PI / 6;
        const a2 = (Math.PI / 3) * (i + 1) - Math.PI / 6;
        const mx = cx + f2f * Math.cos((a1 + a2) / 2);
        const my = cy + f2f * Math.sin((a1 + a2) / 2);
        return <circle key={i} cx={mx} cy={my} r={2} fill={accent} opacity={0.4} />;
      })}

      {/* Thread hole */}
      <circle cx={cx} cy={cy} r={threadR} fill="#060a12" stroke={accent} strokeWidth={1} opacity={0.9} />

      {/* Flat-to-flat dimension */}
      <line x1={cx - f2f} y1={cy} x2={cx + f2f} y2={cy} stroke={dim} strokeWidth={0.8} strokeDasharray="3,3" />
      <text x={cx} y={cy - f2f * 0.15} textAnchor="middle" fill={dim} fontSize={10} fontFamily="monospace">
        {data.nutFlatToFlat} mm
      </text>

      {/* Corner-to-corner dimension */}
      <line x1={cx} y1={cy - c2c} x2={cx} y2={cy + c2c} stroke={dim} strokeWidth={0.8} strokeDasharray="2,4" opacity={0.5} />

      {/* Labels below */}
      <text x={cx} y={H - 48} textAnchor="middle" fill={dim} fontSize={10} fontFamily="monospace">
        flat↔flat: {data.nutFlatToFlat} mm
      </text>
      <text x={cx} y={H - 34} textAnchor="middle" fill={dim} fontSize={10} fontFamily="monospace">
        corner↔corner: {data.nutCornerToCorner} mm
      </text>
      <text x={cx} y={H - 20} textAnchor="middle" fill={dim} fontSize={10} fontFamily="monospace">
        height: {data.nutHeight} mm
      </text>
      <text x={cx} y={H - 6} textAnchor="middle" fill="#2a4a5a" fontSize={9} fontFamily="monospace">
        ISO 4032 · DIN 934
      </text>
    </svg>
  );
}

function DimLine({ x1, y1, x2, y2, label, color }: {
  x1: number; y1: number; x2: number; y2: number; label: string; color: string;
}) {
  const mx = (x1 + x2) / 2;
  return (
    <g>
      <line x1={x1} y1={y1 + 6} x2={x1} y2={y1 - 2} stroke={color} strokeWidth={0.8} />
      <line x1={x2} y1={y2 + 6} x2={x2} y2={y2 - 2} stroke={color} strokeWidth={0.8} />
      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={0.8} />
      <polygon points={`${x1},${y1} ${x1 + 5},${y1 - 2} ${x1 + 5},${y1 + 2}`} fill={color} />
      <polygon points={`${x2},${y2} ${x2 - 5},${y2 - 2} ${x2 - 5},${y2 + 2}`} fill={color} />
      <text x={mx} y={y1 - 4} textAnchor="middle" fill={color} fontSize={10} fontFamily="monospace">
        {label}
      </text>
    </g>
  );
}

function DimLineV({ x, y1, y2, label, color }: {
  x: number; y1: number; y2: number; label: string; color: string;
}) {
  const my = (y1 + y2) / 2;
  return (
    <g>
      <line x1={x - 6} y1={y1} x2={x + 2} y2={y1} stroke={color} strokeWidth={0.8} />
      <line x1={x - 6} y1={y2} x2={x + 2} y2={y2} stroke={color} strokeWidth={0.8} />
      <line x1={x} y1={y1} x2={x} y2={y2} stroke={color} strokeWidth={0.8} />
      <polygon points={`${x},${y1} ${x - 2},${y1 + 5} ${x + 2},${y1 + 5}`} fill={color} />
      <polygon points={`${x},${y2} ${x - 2},${y2 - 5} ${x + 2},${y2 - 5}`} fill={color} />
      <text x={x + 4} y={my + 4} textAnchor="start" fill={color} fontSize={10} fontFamily="monospace">
        {label}
      </text>
    </g>
  );
}
