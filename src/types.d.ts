type QuadsType = { quadrant: number; horizon: number; label: QuadrantKey };

type RgbOut = string | number | boolean | null;

type BaseCSVType = { [x: key]: string };

interface SuperRawBlipType extends BaseCSVType {
  'Country of Implementation': string;
  Data: string;
  'Date of Implementation': string;
  Description: string;
  'Disaster Cycle': string;
  'Ideas/Concepts/Examples': string;
  SDG: string;
  Source: string;
  'Status/Maturity': string;
  'Supporting Partners': string;
  Technology: string;
  'Un Host Organisation': string;
  'Use Case': string;
}

type RawBlipType = {
  'Country of Implementation': string;
  Data: string;
  'Date of Implementation': string;
  Description: string;
  'Disaster Cycle': string;
  'Ideas/Concepts/Examples': string;
  SDG: string[];
  Source: string;
  'Status/Maturity': string;
  'Supporting Partners': string;
  Technology: string[];
  'Un Host Organisation': string;
  'Use Case': string;
};

interface BlipType extends RawBlipType {
  id: string;
  quadrantIndex: number;
  x: number;
  y: number;
}

interface SelectableItem {
  uuid: string;
  name: string;
}

type HorizonKey = 'production' | 'validation' | 'prototype' | 'idea';
type QuadrantKey = 'response' | 'recovery' | 'resilience' | 'preparedness';

interface TechItemType {
  uuid: string;
  color: string;
  type: string;
  slug: string;
  description: string[];
}

interface RadarOptionsType {
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

type D3SvgEl = d3.Selection<SVGSVGElement, unknown, null, undefined>;
type D3SvgGEL = d3.Selection<SVGGElement, unknown, null, undefined>;

type RadarDataBlipsAndLogic = {
  radarData: RadarOptionsType;
  blips: BlipType[];
  logic: {
    setSelectedItem: (itemId: BlipType | null) => void;
    setHoveredItem: (itemId: BlipType | null) => void;
    setSelectedQuadrant: (quadrantKey: QuadrantKey | null) => void;
  };
};
