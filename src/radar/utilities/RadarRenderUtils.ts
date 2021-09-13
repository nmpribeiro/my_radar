/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-plusplus */
import * as d3 from 'd3';

import { RadarContextType } from '../../services/RadarContext';

import { RadarUtilities } from './Utilities';

const DEFAULT_WIDTH = 800;
const DEFAULT_HEIGHT = 600;

function addHorizons(base: D3SvgGEL, data: RadarOptionsType) {
  const width = data.width || DEFAULT_WIDTH;
  const height = data.height || DEFAULT_HEIGHT;
  const horizonWidth = (0.95 * (width > height ? height : width)) / 2;
  const horizonUnit = (horizonWidth - data.horizonShiftRadius) / data.horizons.length;

  const horizons = base.append('g').attr('class', 'horizons').selectAll('.horizon');

  horizons
    .data(data.horizons)
    .enter()
    .append('circle')
    .attr('r', (d, i) => (i + 1) * horizonUnit + data.horizonShiftRadius)
    .attr('cx', 0)
    .attr('cy', 0)
    .attr('fill', 'none')
    .attr('stroke', 'gray')
    .attr('class', 'horizon');

  // TODO: add horizons labels
  horizons
    .data(data.horizons)
    .enter()
    .append('text')
    .attr('class', (d) => `horizon-text horizon-${d}`)
    .attr('text-anchor', 'middle')
    .attr('dx', (d, i) => (i + 1) * horizonUnit - horizonUnit / 2 + data.horizonShiftRadius)
    .attr('dy', 10)
    .text((d) => RadarUtilities.capitalize(d));
}

function addQuadrants(base: D3SvgGEL, data: RadarOptionsType) {
  // add the quadrants
  const quadrants = base.append('g').attr('class', 'quadrants');

  const width = data.width || DEFAULT_WIDTH;
  const height = data.height || DEFAULT_HEIGHT;
  const horizonWidth = (0.95 * (width > height ? height : width)) / 2;

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

  const getY = (d: QuadsType) => {
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

  const getX = (d: QuadsType) => {
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
  const getLabelAnchor = (d: QuadsType) => {
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
    .text((d) => d.label.charAt(0).toUpperCase() + d.label.slice(1));

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

const drawBlips = (rootElement: HTMLDivElement, svg: D3SvgGEL, data: RadarOptionsType, blips: RawBlipType[]): void => {
  // process and sort the blips
  const processedBlips = RadarUtilities.processBlips(data, blips);
  const sortedBlips = processedBlips.sort(RadarUtilities.blipsSorting);

  // Add a div
  const RADAR_TOOLTIP_ID = 'radar-tooltip';
  let tooltip: d3.Selection<HTMLDivElement, unknown, HTMLElement, any> = d3.select(`#${RADAR_TOOLTIP_ID}`);
  if (tooltip.empty()) {
    tooltip = d3.select('body').append('div').attr('id', RADAR_TOOLTIP_ID).style('opacity', 0);
  }

  // Draw each BLIP
  const svgBlips = svg
    .selectAll('.blip')
    .data<BlipType>(sortedBlips)
    .enter()
    .append('g')
    .attr('class', 'blip')
    .attr('id', (d) => `blip-${d.id}`)
    .attr('transform', (d) => `translate(${d.x}, ${d.y})`)
    .attr('cursor', 'pointer')
    .on('mouseover', function (event, d) {
      tooltip.transition().duration(200).style('opacity', 0.9);
      tooltip
        .html(`<h4>${d.name}</h4>`)
        .style('left', `${event.pageX + 15}px`)
        .style('top', `${event.pageY - 10}px`);
      this.setAttribute('opacity', '0.5');
    })
    .on('mousemove', (event, d) => tooltip.style('left', `${event.pageX + 15}px`).style('top', `${event.pageY - 10}px`))
    .on('mouseout', function (d: BlipType) {
      tooltip.transition().duration(250).style('opacity', 0);
      this.setAttribute('opacity', '1');
    });

  svgBlips
    .append('circle')
    .attr('r', '7px')
    .attr('fill', (d) => {
      const tech = data.tech.find((t) => t.type === d.tech);
      if (tech) return tech.color;
      return '';
    });
};

function drawRadar(rootElement: HTMLDivElement, svg: D3SvgEl, { data, blips }: RadarContextType) {
  // add the horizons
  const base: D3SvgGEL = svg
    .append('g')
    .attr('transform', `translate(${(data.width || DEFAULT_WIDTH) / 2},${(data.height || DEFAULT_HEIGHT) / 2})`);

  addHorizons(base, data);

  // add the quadrants
  addQuadrants(base, data);

  // add the blips
  drawBlips(rootElement, base, data, blips);
}

const setupFourQuadrants = (rootElement: HTMLDivElement, { data, blips }: RadarContextType): void => {
  // reset strategy!
  while (rootElement.firstChild) {
    rootElement.firstChild.remove();
  }

  const svg = d3
    .select(rootElement)
    .append('svg')
    .attr('width', data.width || DEFAULT_WIDTH)
    .attr('height', data.height || DEFAULT_HEIGHT);

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

  drawRadar(rootElement, svg, { data, blips });
};

export const RadarRenderUtils = { setupFourQuadrants };
