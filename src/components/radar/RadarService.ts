/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-plusplus */
import * as d3 from 'd3';

import { Dot } from './RadarApi';

const identity = (i: unknown): any => {
  return i as any;
};

interface DataType {
  width?: number;
  height?: number;
  quadrants: string[];
  horizons: string[];
}

type D3SvgEl = d3.Selection<SVGSVGElement, unknown, null, undefined>;
type D3SvgGEL = d3.Selection<SVGGElement, unknown, null, undefined>;

interface DataItem {
  quadrant: string[];
  id: string;
  x: number;
  y: number;
  name: string;
}

function processRadarData(data: unknown, currentTime = new Date()): DataItem[] {
  // go through the data
  const results: DataItem[] = [];
  // for (const i in data.data) {
  //   const entry = data.data[i];
  //   const history = entry.history.filter(function (e) {
  //     return e.end == null || (e.end > currentTime && e.start < currentTime);
  //   })[0];
  //   let quadrant_delta = 0;
  //   // figure out which quadrant this is
  //   for (let j = 0, len = data.quadrants.length; j < len; j++) {
  //     if (data.quadrants[j] == history.quadrant) {
  //       quadrant_delta = quad_angle * j;
  //     }
  //   }
  //   const theta = history.position_angle * quad_angle + quadrant_delta;
  //   const r = history.position * horizonWidth;
  //   const cart = polar_to_cartesian(r, theta);
  //   const blip = {
  //     id: i,
  //     name: entry.name,
  //     quadrant: history.quadrant,
  //     r,
  //     theta,
  //     x: cart[0],
  //     y: cart[1],
  //   };
  //   if (history.direction) {
  //     const r2 = history.direction * horizonWidth;
  //     const theta2 = history.direction_angle * quad_angle + quadrant_delta;
  //     const vector = polar_to_cartesian(r2, theta2);
  //     blip.dx = vector[0] - cart[0];
  //     blip.dy = vector[1] - cart[1];
  //   }
  //   results.push(blip);
  // }
  return results;
}

function addHorizons(base: D3SvgGEL, data: DataType, horizonUnit: number) {
  const horizons = base.append('g').attr('class', 'horizons');
  horizons
    .selectAll('.horizon')
    .data(data.horizons, identity)
    .enter()
    .append('circle')
    .attr('r', function (d, i) {
      return (i + 1) * horizonUnit;
    })
    .attr('cx', 0)
    .attr('cy', 0)
    // .attr('fill', 'none')
    .attr('stroke', 'gray')
    .attr('class', 'horizon');
}

function addQuadrants(base: D3SvgGEL, data: DataType) {
  // add the quadrants
  const quadrants = base.append('g').attr('class', 'quadrants');
  function quadrantClass(d: { name: string }) {
    return `quadrant quadarant-${d.name.toLowerCase().replace(/ /, '-')}`;
  }

  const width = data.width || 800;
  const height = data.height || 600;
  const horizonWidth = (0.95 * (width > height ? height : width)) / 2;
  const horizonUnit = horizonWidth / data.horizons.length;

  const quadAngle = (2 * Math.PI) / data.quadrants.length;
  const colorScale = d3.scaleOrdinal(d3.schemeCategory10);

  quadrants
    .selectAll('line.quadrant')
    .data(data.quadrants, identity)
    .enter()
    .append('line')
    .attr('x1', 0)
    .attr('y1', 0)
    .attr('x2', function (d, i) {
      return Math.cos(quadAngle * i) * horizonWidth;
    })
    .attr('y2', function (d, i) {
      return Math.sin(quadAngle * i) * horizonWidth;
    })
    // .attr('class', quadrant_class)
    .attr('stroke', function (d, i) {
      return colorScale(i.toString());
    });

  const arcFunction = d3
    .arc()
    .outerRadius(function (d, i) {
      return d.outerRadius * horizonWidth;
    })
    .innerRadius(function (d, i) {
      return d.innerRadius * horizonWidth;
    })
    .startAngle(function (d, i) {
      // return d.quadrant * quadAngle + Math.PI / 2;
      return quadAngle + Math.PI / 2;
    })
    .endAngle(function (d, i) {
      return 1 * quadAngle + Math.PI / 2;
    });

  const quads = [];
  for (let i = 0, ilen = data.quadrants.length; i < ilen; i++) {
    for (let j = 0, jlen = data.horizons.length; j < jlen; j++) {
      quads.push({
        outerRadius: (j + 1) / jlen,
        innerRadius: j / jlen,
        quadrant: i,
        horizon: j,
        name: data.quadrants[i],
      });
    }
  }
  const textAngle = 360 / data.quadrants.length;

  // TODO: move labels to each corner
  quadrants
    .selectAll('text.quadrant')
    .data(
      quads.filter(function (d) {
        return d.horizon === 0;
      })
    )
    .enter()
    .append('text')
    .attr('class', 'quadrant')
    .attr('dx', horizonWidth / data.horizons.length)
    .attr('transform', function (d) {
      return `rotate(${d.quadrant * textAngle + textAngle})`;
    })
    .text(function (d) {
      return d.name;
    });

  quadrants
    .selectAll('path.quadrant')
    .data(quads)
    .enter()
    .append('path')
    .attr('d', arcFunction as any)
    .attr('fill', (d) => {
      const rgb = d3.rgb(colorScale(d.quadrant.toString()));
      return rgb.brighter((d.horizon / data.horizons.length) * 3) as unknown as any;
    })
    .attr('class', quadrantClass);
}

function drawRadar(svg: D3SvgEl, data: DataType) {
  const width = data.width || 800;
  const height = data.height || 600;
  const cx = width / 2;
  const cy = height / 2;
  // add the horizons
  const base: D3SvgGEL = svg.append('g').attr('transform', `translate(${cx},${cy})`);

  const horizonWidth = (0.95 * (width > height ? height : width)) / 2;
  const horizonUnit = horizonWidth / data.horizons.length;

  addHorizons(base, data, horizonUnit);
  addQuadrants(base, data);

  const blipData = processRadarData(data);
  blipData.sort(function (a, b) {
    if (a.quadrant < b.quadrant) return -1;
    if (a.quadrant > b.quadrant) return 1;
    return 0;
  });

  const blips = base
    .selectAll('.blip')
    .data(blipData)
    .enter()
    .append('g')
    .attr('class', 'blip')
    .attr('id', function (d) {
      return `blip-${d.id}`;
    })
    .attr('transform', function (d) {
      return `translate(${d.x},${d.y})`;
    })
    .on('mouseover', function (d) {
      d3.select(this).select('text.name').style('opacity: 1');
    })
    .on('mouseout', function (d) {
      d3.select(this).select('text.name').style('opacity: 1');
    });

  blips
    .append('line')
    .attr('class', 'direction')
    .attr('x1', 0)
    .attr('y1', 0)
    .attr('x2', function (d) {
      return d.x;
    })
    .attr('y2', function (d) {
      return d.y;
    });

  blips.append('circle').attr('r', '7px');

  blips
    .append('text')
    .attr('dy', '20px')
    .style('text-anchor', 'middle')
    .attr('class', 'name')
    .text(function (d) {
      return d.name;
    });

  // add the lists
  const ul = svg.append('ul');
  ul.selectAll('li.quadrant')
    .data(blipData)
    .enter()
    .append('li')
    .attr('class', 'quadrant')
    .text(function (d) {
      return d.name;
    });
}

const render = (svgEl: SVGSVGElement, values: Dot[], data: DataType): void => {
  const width = data.width || 800;
  const height = data.height || 600;

  const svgOuter = d3.select(svgEl);
  const svg = svgOuter.attr('width', width).attr('height', height);
  svg
    .append('marker')
    .attr('id', 'arrow')
    .attr('orient', 'auto')
    .attr('markerWidth', '2')
    .attr('markerHeight', '4')
    .attr('refX', 0.1)
    .attr('refY', 2)
    .append('path')
    .attr('d', 'M0,0 V4 L2,2 Z');

  drawRadar(svgOuter, data);
};

export const RadarService = {
  render,
};
