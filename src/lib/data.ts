import raw from "@/data/data.json";

export type CompanyId = "RWE" | "VW" | "BASF";
export type SubCode =
  | "1a" | "1b" | "2a" | "2b" | "2c" | "2d"
  | "3a" | "3b" | "4a" | "4b" | "4c" | "4d" | "5a";

export type Metric = "substanz" | "langfrist" | "ambition";

export interface TrajPoint {
  year: number;
  height: number;
  sym: number;
  long: number;
  metrics: Record<Metric, number>;
  break: boolean;
  moves: { "4a": number; "4b": number; "4c": number; "4d": number };
}

export const METRICS: {
  id: Metric;
  label: string;
  short: string;
  desc: string;
}[] = [
  {
    id: "substanz",
    label: "Substanz",
    short: "3a",
    desc: "Höhe = substanziell kodierte Segmente je Jahr (harte Kennzahlen, Investitionen, Scope-Ziele, Governance). Zeigt, wie inhaltlich gedeckt die Klimakommunikation war — RWE als Tal, VW als Kaskade, BASF als Treppe.",
  },
  {
    id: "langfrist",
    label: "Langfrist-Dominanz",
    short: "1b",
    desc: "Höhe = langfristige Zeitbezüge (1b) je Jahr. Zeigt, wie präsent der lange Horizont ist — durchgängig hoch bei allen dreien, am stärksten bei BASF.",
  },
  {
    id: "ambition",
    label: "Ziel-Ambition",
    short: "HK4",
    desc: "Höhe = kumulierte Zielentwicklung (Präzisierung +, Abschwächung −, Streichung −−). Zeigt, wie sich die Ziele selbst entwickeln — RWE bricht 2016 ein, VW steigt, BASF hält ein Plateau. Enthält alle HK4-Bewegungen, auch BASFs Finanzziel-Rücknahme 2015.",
  },
];
export interface SpectrumPoint { year: number; x: number; y: number }
export interface EventItem {
  year: number;
  page: string;
  type: SubCode;
  quote: string;
  note: string;
  curated: boolean;
}
export interface Company {
  label: string;
  ratio: number;
  tagline: string;
  totals: Record<SubCode, number>;
  total: number;
  yearly: Record<string, Record<SubCode, number>>;
  trajectory: TrajPoint[];
  spectrum: SpectrumPoint[];
  events: EventItem[];
}
export interface CrisisYear { label: string; affects: CompanyId[]; note: string }
export interface Dataset {
  meta: {
    years: number[];
    companies: CompanyId[];
    colors: Record<CompanyId, string>;
    codeLabels: Record<string, string>;
  };
  crisisYears: Record<string, CrisisYear>;
  companies: Record<CompanyId, Company>;
}

export const data = raw as unknown as Dataset;

export const YEARS = data.meta.years;
export const COMPANIES = data.meta.companies;
export const COLORS = data.meta.colors;
export const CODE_LABELS = data.meta.codeLabels;

export const YEAR_MIN = YEARS[0];
export const YEAR_MAX = YEARS[YEARS.length - 1];

export function color(c: CompanyId) {
  return COLORS[c];
}

export function yearCounts(c: CompanyId, year: number) {
  return data.companies[c].yearly[String(year)];
}

export function crisisFor(year: number): CrisisYear | undefined {
  return data.crisisYears[String(year)];
}

export function eventsAt(c: CompanyId, year: number): EventItem[] {
  return data.companies[c].events.filter((e) => e.year === year);
}

export function clamp(v: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, v));
}
export function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}
