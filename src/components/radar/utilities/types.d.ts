type HistoryItem = {
  start: Date;
  end: Date | null;
  quadrant: string;
  position: number;
  positionAngle: number;
  direction: number;
  directionAngle: number;
};

interface RawBlipType {
  // id: string;
  name: string;
  description: string;
  links: string[];
  history: HistoryItem[];
}

interface BlipType {
  id: number;
  name: string;
  quadrant: string;
  r: number;
  theta: number;
  x: number;
  dx: number | null;
  y: number;
  dy: number | null;
}

interface RadarDataType {
  width?: number;
  height?: number;
  quadrants: string[];
  horizons: string[];
}

type D3SvgEl = d3.Selection<SVGSVGElement, unknown, null, undefined>;
type D3SvgGEL = d3.Selection<SVGGElement, unknown, null, undefined>;
