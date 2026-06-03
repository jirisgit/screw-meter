export interface ScrewData {
  size: string;
  threadDiameter: number;
  headDiameter: number;
  nutFlatToFlat: number;
  nutCornerToCorner: number;
  clearanceHoleDiameter: number;
  hexKeySize: number;
  headHeight: number;
  nutHeight: number;
  pitch: number;
}

// ISO 4762 Socket Head Cap Screws + ISO 4032 Hex Nuts
export const screwDatabase: ScrewData[] = [
  { size: "M1",    threadDiameter: 1,    headDiameter: 1.9,  nutFlatToFlat: 2.5,  nutCornerToCorner: 2.87,  clearanceHoleDiameter: 1.2,  hexKeySize: 0.7,  headHeight: 1.0,  nutHeight: 0.8,  pitch: 0.25 },
  { size: "M1.2",  threadDiameter: 1.2,  headDiameter: 2.2,  nutFlatToFlat: 3.0,  nutCornerToCorner: 3.46,  clearanceHoleDiameter: 1.4,  hexKeySize: 0.9,  headHeight: 1.2,  nutHeight: 1.0,  pitch: 0.25 },
  { size: "M1.6",  threadDiameter: 1.6,  headDiameter: 3.0,  nutFlatToFlat: 3.2,  nutCornerToCorner: 3.68,  clearanceHoleDiameter: 1.8,  hexKeySize: 1.3,  headHeight: 1.6,  nutHeight: 1.3,  pitch: 0.35 },
  { size: "M2",    threadDiameter: 2,    headDiameter: 3.8,  nutFlatToFlat: 4.0,  nutCornerToCorner: 4.62,  clearanceHoleDiameter: 2.4,  hexKeySize: 1.5,  headHeight: 2.0,  nutHeight: 1.6,  pitch: 0.4  },
  { size: "M2.5",  threadDiameter: 2.5,  headDiameter: 4.5,  nutFlatToFlat: 5.0,  nutCornerToCorner: 5.77,  clearanceHoleDiameter: 2.9,  hexKeySize: 2.0,  headHeight: 2.5,  nutHeight: 2.0,  pitch: 0.45 },
  { size: "M3",    threadDiameter: 3,    headDiameter: 5.5,  nutFlatToFlat: 5.5,  nutCornerToCorner: 6.35,  clearanceHoleDiameter: 3.4,  hexKeySize: 2.5,  headHeight: 3.0,  nutHeight: 2.4,  pitch: 0.5  },
  { size: "M4",    threadDiameter: 4,    headDiameter: 7.0,  nutFlatToFlat: 7.0,  nutCornerToCorner: 8.08,  clearanceHoleDiameter: 4.5,  hexKeySize: 3.0,  headHeight: 4.0,  nutHeight: 3.2,  pitch: 0.7  },
  { size: "M5",    threadDiameter: 5,    headDiameter: 8.5,  nutFlatToFlat: 8.0,  nutCornerToCorner: 9.24,  clearanceHoleDiameter: 5.5,  hexKeySize: 4.0,  headHeight: 5.0,  nutHeight: 4.0,  pitch: 0.8  },
  { size: "M6",    threadDiameter: 6,    headDiameter: 10.0, nutFlatToFlat: 10.0, nutCornerToCorner: 11.55, clearanceHoleDiameter: 6.6,  hexKeySize: 5.0,  headHeight: 6.0,  nutHeight: 5.0,  pitch: 1.0  },
  { size: "M8",    threadDiameter: 8,    headDiameter: 13.0, nutFlatToFlat: 13.0, nutCornerToCorner: 15.01, clearanceHoleDiameter: 9.0,  hexKeySize: 6.0,  headHeight: 8.0,  nutHeight: 6.5,  pitch: 1.25 },
  { size: "M10",   threadDiameter: 10,   headDiameter: 16.0, nutFlatToFlat: 16.0, nutCornerToCorner: 18.48, clearanceHoleDiameter: 11.0, hexKeySize: 8.0,  headHeight: 10.0, nutHeight: 8.0,  pitch: 1.5  },
  { size: "M12",   threadDiameter: 12,   headDiameter: 18.0, nutFlatToFlat: 18.0, nutCornerToCorner: 20.78, clearanceHoleDiameter: 13.5, hexKeySize: 10.0, headHeight: 12.0, nutHeight: 10.0, pitch: 1.75 },
  { size: "M14",   threadDiameter: 14,   headDiameter: 21.0, nutFlatToFlat: 21.0, nutCornerToCorner: 24.25, clearanceHoleDiameter: 15.5, hexKeySize: 12.0, headHeight: 14.0, nutHeight: 11.0, pitch: 2.0  },
  { size: "M16",   threadDiameter: 16,   headDiameter: 24.0, nutFlatToFlat: 24.0, nutCornerToCorner: 27.71, clearanceHoleDiameter: 17.5, hexKeySize: 14.0, headHeight: 16.0, nutHeight: 13.0, pitch: 2.0  },
  { size: "M20",   threadDiameter: 20,   headDiameter: 30.0, nutFlatToFlat: 30.0, nutCornerToCorner: 34.64, clearanceHoleDiameter: 22.0, hexKeySize: 17.0, headHeight: 20.0, nutHeight: 16.0, pitch: 2.5  },
  { size: "M24",   threadDiameter: 24,   headDiameter: 36.0, nutFlatToFlat: 36.0, nutCornerToCorner: 41.57, clearanceHoleDiameter: 26.0, hexKeySize: 19.0, headHeight: 24.0, nutHeight: 19.0, pitch: 3.0  },
  { size: "M30",   threadDiameter: 30,   headDiameter: 45.0, nutFlatToFlat: 46.0, nutCornerToCorner: 53.12, clearanceHoleDiameter: 33.0, hexKeySize: 22.0, headHeight: 30.0, nutHeight: 24.0, pitch: 3.5  },
  { size: "M36",   threadDiameter: 36,   headDiameter: 54.0, nutFlatToFlat: 55.0, nutCornerToCorner: 63.51, clearanceHoleDiameter: 39.0, hexKeySize: 27.0, headHeight: 36.0, nutHeight: 29.0, pitch: 4.0  },
];

export function findScrew(query: string): ScrewData | null {
  const normalized = query.trim().toLowerCase().replace(/\s+/g, "");
  return screwDatabase.find(s => s.size.toLowerCase() === normalized) ?? null;
}

export function searchScrews(query: string): ScrewData[] {
  const normalized = query.trim().toLowerCase().replace(/\s+/g, "");
  if (!normalized) return [];
  return screwDatabase.filter(s => s.size.toLowerCase().startsWith(normalized));
}
