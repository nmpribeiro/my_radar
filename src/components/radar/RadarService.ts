/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-plusplus */
import * as d3 from 'd3';

import { Dot } from './RadarApi';

interface DataType {
  width?: number;
  height?: number;
  quadrants: string[];
  horizons: string[];
}

type D3SvgEl = d3.Selection<SVGSVGElement, unknown, null, undefined>;
type D3SvgGEL = d3.Selection<SVGGElement, unknown, null, undefined>;

interface DataItem extends d3.DefaultArcObject {
  quadrant: number;
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
    .data(data.horizons)
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

  const width = data.width || 800;
  const height = data.height || 600;
  const horizonWidth = (0.95 * (width > height ? height : width)) / 2;
  const horizonUnit = horizonWidth / data.horizons.length;

  const quadAngle = (2 * Math.PI) / data.quadrants.length;
  const colorScale = d3.scaleOrdinal(d3.schemeCategory10);

  const quadrantStroke = (d: string, i: number) => {
    return 'rgba(0,0,0,1)';
    switch (d) {
      case 'frameworks':
        return 'rgba(255,0,0,1)';
      case 'languages':
        return 'rgba(0,255,0,1)';
      case 'tools':
        return 'rgba(0,0,255,1)';
      case 'big data':
        return 'rgba(255,0,255,1)';
      default:
        return 'rgba(0,0,0,1)';
    }
    // colorScale(i.toString());
  };

  quadrants
    .selectAll('line.quadrant')
    .data(data.quadrants)
    .enter()
    .append('line')
    .attr('x1', 0)
    .attr('y1', 0)
    .attr('x2', (d, i) => Math.cos(quadAngle * i) * horizonWidth)
    .attr('y2', (d, i) => Math.sin(quadAngle * i) * horizonWidth)
    .attr('class', (d) => `quadrant quadarant-${d.toLowerCase().replace(/ /, '-')}`)
    .attr('stroke', quadrantStroke)
    .attr('stroke-width', '5px');

  const textAngle = 360 / data.quadrants.length;

  // TODO: move labels to each corner
  const getY = (d: { horizon: number; quadrant: number }) => {
    switch (d.quadrant) {
      case 1:
        return width / 2.25;
      case 2:
        return width / 2.25;
      case 3:
        return -width / 2.25;
      case 0:
        return -width / 2.25;
      default:
        return 0;
    }
  };

  const getX = (d: { horizon: number; quadrant: number }) => {
    switch (d.quadrant) {
      case 1:
        return height / 2.25;
      case 2:
        return -height / 2.25;
      case 3:
        return -height / 2.25;
      case 0:
        return height / 2.25;
      default:
        return 0;
    }
  };
  const getLabelAnchor = (d: { horizon: number; quadrant: number }) => {
    switch (d.quadrant) {
      case 1:
        return 'end';
      case 2:
        return 'start';
      case 3:
        return 'start';
      case 0:
        return 'end';
      default:
        return 0;
    }
  };

  type QuadsType = { quadrant: number; horizon: number; label: string; outerRadius: number; innerRadius: number };
  const quads: QuadsType[] = [];
  for (let i = 0, ilen = data.quadrants.length; i < ilen; i++) {
    for (let j = 0, jlen = data.horizons.length; j < jlen; j++) {
      quads.push({
        outerRadius: (j + 1) / jlen,
        innerRadius: j / jlen,
        quadrant: i,
        horizon: j,
        label: data.quadrants[i],
      });
    }
  }

  quadrants
    .selectAll('text.quadrant')
    .data(quads.filter((d) => d.horizon === 0))
    .enter()
    .append('text')
    .attr('class', (d) => `quadrant-text quadrant-${d.label}`)
    .attr('dx', getX)
    .attr('dy', getY)
    .attr('text-anchor', getLabelAnchor)
    .text((d) => d.label);

  type RgbOut = string | number | boolean | null;
  const fillQuadrant = (d: { quadrant: number; horizon: number }, i: number): RgbOut => {
    const result = 'rgba(0,0,0,0)';
    // const result = d3.rgb(colorScale(d.quadrant.toString())).brighter((d.horizon / data.horizons.length) * 3);
    // const result = d3.rgb(colorScale(d.quadrant.toString())).brighter((d.horizon / data.horizons.length + 0.5) * 4);
    // const thisColorScale = d3.scaleOrdinal(d3.schemeGreens);
    // const result = d3.rgb(thisColorScale()).brighter((d.horizon / data.horizons.length + 0.5) * 4);
    return result as unknown as RgbOut;
  };

  const arcFunction = d3
    .arc<QuadsType>()
    .outerRadius((d) => d.outerRadius * horizonWidth)
    .innerRadius((d) => d.innerRadius * horizonWidth)
    .startAngle((d) => d.quadrant * (Math.PI / 2))
    .endAngle((d) => d.quadrant * (Math.PI / 2) + Math.PI / 2);

  const quadrantClass = (d: { label: string }) => `quadrant quadarant-${d.label.toLowerCase().replace(/ /, '-')}`;

  // Create arcs
  // quadrants
  //   .selectAll('path.quadrant')
  //   .data(quads2)
  //   .enter()
  //   .append('path')
  //   .attr('d', arcFunction)
  //   .attr('fill', 'rgba(0,0,0,0)')
  //   .attr('class', quadrantClass);
  // console.log(quads);
  quadrants
    .selectAll('path.quadrant')
    .data(quads)
    .enter()
    .append('path')
    .attr('d', arcFunction)
    .attr('fill', fillQuadrant)
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
  svgOuter.selectChildren().remove();
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
