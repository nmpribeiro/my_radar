type HistoryItem = {
  start: Date;
  end: Date | null;
  quadrant: string;
  position: number;
  positionAngle: number;
  direction: number;
  directionAngle: number;
};

type BaseCSVType = Record<string, string>;
interface RawBlipType extends BaseCSVType {
  Title: string;
  Summary: string;
  Description: string;
  'Level of implementation': string;
  Quadrant: string;
}

interface BlipType {
  id: number;
  name: string;
  description: string;
  quadrant: string;
  // r: number;
  // theta: number;
  x: number;
  y: number;
}

interface RadarDataType {
  title: string;
  width?: number;
  height?: number;
  quadrants: string[];
  horizons: string[];
}

type D3SvgEl = d3.Selection<SVGSVGElement, unknown, null, undefined>;
type D3SvgGEL = d3.Selection<SVGGElement, unknown, null, undefined>;
