export type RgbOut = string | number | boolean | null;

export type D3SvgEl = d3.Selection<SVGSVGElement, unknown, null, undefined>;

export type D3SvgGEL = d3.Selection<SVGGElement, unknown, null, undefined>;

export type BaseCSVType = { [x: string]: string };

export type BlipType<T> = T & {
  id: string;
  quadrantIndex: number;
  x: number;
  y: number;
};

export interface TechItemType {
  uuid: string;
  color: string;
  type: string;
  slug: string;
  description: string[];
}

export interface SelectableItem {
  uuid: string;
  name: string;
}

export type QuadsType = { quadrant: number; horizon: number; label: QuadrantKey };

export type QuadrantKey = string;
export type HorizonKey = string;
export type TechKey = string;
export type TitleKey = string;
export type IdIndexXandY = { id: string; quadrantIndex: number; x: number; y: number };
export type BlipWithQuadrantKey = { [k: string | QuadrantKey | HorizonKey | TitleKey]: string | number } & {
  [k: TechKey]: string[];
} & IdIndexXandY;

export interface RadarOptionsType {
  title: string;
  width: number;
  height: number;
  quadrants: QuadrantKey[];
  horizons: HorizonKey[];
  radarOptions: {
    horizonShiftRadius: number;
    radiusPadding: number;
    circlePadding: number;
  };
  tech: TechItemType[];
}

export type RadarDataBlipsAndLogic = {
  radarData: RadarOptionsType;
  blips: BlipWithQuadrantKey[];
  logic: {
    setSelectedItem: (itemId: BlipWithQuadrantKey | null) => void;
    setHoveredItem: (itemId: BlipWithQuadrantKey | null) => void;
    setSelectedQuadrant: (quadrantKey: QuadrantKey | null) => void;
  };
};
