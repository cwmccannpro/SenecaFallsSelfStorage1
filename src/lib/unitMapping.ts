// Unit number → size and pricing for all 84 units at this facility.
// This is the source of truth used by the admin UI for auto-fill.
// The payment_links table in Supabase is the runtime source for Square URLs.

export type UnitSize = '5×10' | '10×10' | '10×15' | '10×20';

export interface UnitSpec {
  size: UnitSize;
  monthlyPrice: number;
  annualPrice: number;
  label: string;
}

const PRICING: Record<UnitSize, { monthlyPrice: number; annualPrice: number }> = {
  '5×10':  { monthlyPrice: 65,  annualPrice: 715  },
  '10×10': { monthlyPrice: 85,  annualPrice: 935  },
  '10×15': { monthlyPrice: 95,  annualPrice: 1045 },
  '10×20': { monthlyPrice: 140, annualPrice: 1540 },
};

function range(start: number, end: number): number[] {
  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
}

function buildMap(): Record<string, UnitSpec> {
  const entries: Array<[number[], UnitSize, string?]> = [
    [range(1, 6),   '5×10',  undefined],
    [range(7, 12),  '10×20', undefined],
    [range(13, 22), '10×15', undefined],
    [range(23, 28), '10×10', undefined],
    [[29],          '5×10',  'Office'],
    [range(30, 34), '5×10',  undefined],
    [range(35, 40), '10×10', undefined],
    [range(41, 50), '10×15', undefined],
    [range(51, 56), '10×20', undefined],
    [range(57, 62), '5×10',  undefined],
    [range(63, 68), '10×10', undefined],
    [range(69, 78), '10×15', undefined],
    [range(79, 84), '10×20', undefined],
  ];

  const map: Record<string, UnitSpec> = {};
  for (const [units, size, label] of entries) {
    const pricing = PRICING[size];
    for (const n of units) {
      map[String(n)] = {
        size,
        ...pricing,
        label: label ?? size,
      };
    }
  }
  return map;
}

export const UNIT_MAP = buildMap();

/** Returns the spec for a given unit number string, or undefined if not found. */
export function lookupUnit(unitNumber: string): UnitSpec | undefined {
  return UNIT_MAP[unitNumber.trim()];
}

export const UNIT_SIZES: UnitSize[] = ['5×10', '10×10', '10×15', '10×20'];
