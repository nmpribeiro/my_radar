/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-plusplus */
import * as d3 from 'd3';

import { RadarUtilities } from './Utilities';

function addHorizons(base: D3SvgGEL, data: RadarDataType, horizonUnit: number) {
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

function addQuadrants(base: D3SvgGEL, data: RadarDataType) {
  // add the quadrants
  const quadrants = base.append('g').attr('class', 'quadrants');

  const width = data.width || 800;
  const height = data.height || 600;
  const horizonWidth = (0.95 * (width > height ? height : width)) / 2;
  // const horizonUnit = horizonWidth / data.horizons.length;

  const quadAngle = (2 * Math.PI) / data.quadrants.length;
  // const colorScale = d3.scaleOrdinal(d3.schemeCategory10);

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
  const fillQuadrant = (d: QuadsType, i: number): RgbOut => {
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

  // Create quadrant arcs
  quadrants
    .selectAll('path.quadrant')
    .data(quads)
    .enter()
    .append('path')
    .attr('d', arcFunction)
    .attr('fill', fillQuadrant)
    .attr('class', quadrantClass);
}

const drawBlips = (svg: D3SvgGEL, data: RadarDataType, blips: RawBlipType[]): void => {
  const processedBlips = RadarUtilities.processBlips(data, blips);
  const sortedBlips = processedBlips.sort(RadarUtilities.blipsSorting);

  const svgBlips = svg
    .selectAll('.blip')
    .data<BlipType>(sortedBlips)
    .enter()
    .append('g')
    .attr('class', 'blip')
    .attr('id', (d) => `blip-${d.id}`)
    .attr('transform', (d) => `translate(${d.x}, ${d.y})`)
    .on('mouseover', (d) =>
      d3
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .select(this as any)
        .select('text.name')
        .style('opacity: 1')
    )
    .on('mouseout', (d) =>
      d3
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .select(this as any)
        .select('text.name')
        .style('opacity: 0')
    );

  // svgBlips
  //   .append('line')
  //   .attr('class', 'direction')
  //   .attr('x1', 0)
  //   .attr('y1', 0)
  //   .attr('x2', (d) => d.dx)
  //   .attr('y2', (d) => d.dy);

  svgBlips.append('circle').attr('r', '7px');

  svgBlips
    .append('text')
    .attr('dy', '20px')
    .style('text-anchor', 'middle')
    .attr('class', 'name')
    .text((d) => d.name);

  // add the lists
  const ul = svg.append('ul');
  ul.selectAll('li.quadrant')
    .data<BlipType>(sortedBlips)
    .enter()
    .append('li')
    .attr('class', 'quadrant')
    .text((d) => d.name);
};

function drawRadar(svg: D3SvgEl, data: RadarDataType, blips: RawBlipType[]) {
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

  drawBlips(base, data, blips);
}

const render = (svgEl: SVGSVGElement, data: RadarDataType, blips: RawBlipType[]): void => {
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

  drawRadar(svgOuter, data, blips);
};

export const RadarRenderUtils = { setupForQuadrants: render };
