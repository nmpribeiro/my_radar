/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-plusplus */
import * as d3 from 'd3';

import { TECH_KEY, TITLE_KEY } from '../../constants/RadarData';

import { RadarUtilities } from './Utilities';

const DEFAULT_WIDTH = 800;
const DEFAULT_HEIGHT = 600;

type RgbOut = string | number | boolean | null;

function addHorizons(base: D3SvgGEL, data: RadarOptionsType) {
  const width = data.width || DEFAULT_WIDTH;
  const height = data.height || DEFAULT_HEIGHT;
  const horizonWidth = (0.95 * (width > height ? height : width)) / 2;
  const horizonUnit = (horizonWidth - data.radarOptions.horizonShiftRadius) / data.horizons.length;

  const horizons = base.append('g').attr('class', 'horizons').selectAll('.horizon');

  horizons
    .data(data.horizons)
    .enter()
    .append('circle')
    .attr('r', (d, i) => (i + 1) * horizonUnit + data.radarOptions.horizonShiftRadius)
    .attr('cx', 0)
    .attr('cy', 0)
    .attr('fill', 'none')
    .attr('stroke', 'gray')
    .attr('class', 'horizon');

  horizons
    .data(data.horizons)
    .enter()
    .append('text')
    .attr('class', (d) => `horizon-text horizon-${d}`)
    .attr('text-anchor', 'middle')
    .attr('dx', (d, i) => (i + 1) * horizonUnit - horizonUnit / 2 + data.radarOptions.horizonShiftRadius)
    .attr('dy', 10)
    .text((d) => RadarUtilities.capitalize(d));
}

function addQuadrants(base: D3SvgGEL, data: RadarDataBlipsAndLogic) {
  // add the quadrants
  const quadrants = base.append('g').attr('class', 'quadrants');

  const width = data.radarData.width || DEFAULT_WIDTH;
  const height = data.radarData.height || DEFAULT_HEIGHT;
  const horizonWidth = (0.95 * (width > height ? height : width)) / 2;
  const horizonUnit = (horizonWidth - data.radarData.radarOptions.horizonShiftRadius) / data.radarData.horizons.length;
  const quadAngle = (2 * Math.PI) / data.radarData.quadrants.length;
  const thisColorScale = d3.scaleOrdinal(d3.schemePastel1);

  quadrants
    .selectAll('line.quadrant')
    .data(data.radarData.quadrants)
    .enter()
    .append('line')
    .attr('x1', 0)
    .attr('y1', 0)
    .attr('x2', (d, i) => Math.cos(quadAngle * i) * horizonWidth)
    .attr('y2', (d, i) => Math.sin(quadAngle * i) * horizonWidth)
    .attr('class', (d) => `quadrant quadarant-${d.toLowerCase().replace(/ /, '-')}`)
    .attr('stroke', 'rgba(0,0,0,1)')
    .attr('stroke-width', '5px');

  const getY = (d: QuadsType) => {
    switch (d.quadrant) {
      case 1:
        return width / 2.5;
      case 2:
        return width / 2.5;
      case 3:
        return -width / 2.5;
      case 0:
        return -width / 2.5;
      default:
        return 0;
    }
  };

  const getX = (d: QuadsType) => {
    switch (d.quadrant) {
      case 1:
        return height / 2;
      case 2:
        return -height / 2;
      case 3:
        return -height / 2;
      case 0:
        return height / 2;
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
  for (let i = 0, ilen = data.radarData.quadrants.length; i < ilen; i++) {
    for (let j = 0, jlen = data.radarData.horizons.length; j < jlen; j++) {
      quads.push({
        quadrant: i,
        horizon: j,
        label: data.radarData.quadrants[i],
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
    .text((d) => d.label.charAt(0).toUpperCase() + d.label.slice(1))
    .on('mouseup', (event, d) => data.logic.setSelectedQuadrant(d.label));

  const fillQuadrant = (d: QuadsType, i: number): RgbOut => {
    const quadrantInput = d.quadrant * 0.4;
    const brighter = (d.horizon / data.radarData.horizons.length) * 0.7 + 0.2;
    const result = d3.rgb(thisColorScale(quadrantInput.toString())).brighter(brighter);
    // console.log(i, quadrantInput.toString(), d.horizon / data.horizons.length, brighter, result);
    return result as unknown as RgbOut;
  };

  const arcFunction = d3
    .arc<QuadsType>()
    .outerRadius((d) => (d.horizon + 1) * horizonUnit + data.radarData.radarOptions.horizonShiftRadius)
    .innerRadius((d) => d.horizon * horizonUnit + (d.horizon === 0 ? 0 : data.radarData.radarOptions.horizonShiftRadius))
    .startAngle((d) => d.quadrant * (Math.PI / 2))
    .endAngle((d) => d.quadrant * (Math.PI / 2) + Math.PI / 2);

  // Create quadrant arcs
  quadrants
    .selectAll('path.quadrant')
    .data(quads)
    .enter()
    .append('path')
    .attr('d', arcFunction)
    .attr('fill', fillQuadrant)
    .attr('class', (d: { label: string }) => `quadrant quadarant-${d.label.toLowerCase().replace(/ /, '-')}`);
}

const drawBlips = (rootElement: HTMLDivElement, svg: D3SvgGEL, data: RadarDataBlipsAndLogic): void => {
  const { radarData, blips, logic } = data;
  // process and sort the blips
  const sortedBlips = blips.sort(RadarUtilities.blipsSorting);

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
        .html(`<h4>${d[TITLE_KEY]}</h4>`)
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
      const tech = radarData.tech.find((t) => t.type === d[TECH_KEY]);
      if (tech) return tech.color;
      return '';
    })
    .on('mouseover', (event, d) => logic.setHoveredItem(d))
    .on('mouseleave', () => logic.setHoveredItem(null))
    .on('mouseup', (event, d) => logic.setSelectedItem(d));
};

function drawRadar(rootElement: HTMLDivElement, svg: D3SvgEl, radarBlipsAndLogic: RadarDataBlipsAndLogic) {
  const { radarData, blips } = radarBlipsAndLogic;
  // add the horizons
  const base: D3SvgGEL = svg
    .append('g')
    .attr('transform', `translate(${(radarData.width || DEFAULT_WIDTH) / 2},${(radarData.height || DEFAULT_HEIGHT) / 2})`);

  addHorizons(base, radarData);

  // add the quadrants
  addQuadrants(base, radarBlipsAndLogic);

  // add the blips (filtered if they're filtered)
  drawBlips(rootElement, base, radarBlipsAndLogic);
}

const setupFourQuadrants = (rootElement: HTMLDivElement, radarContext: RadarDataBlipsAndLogic): void => {
  // reset strategy!
  while (rootElement.firstChild) {
    rootElement.firstChild.remove();
  }

  const { width, height } = radarContext.radarData;
  const svg = d3
    .select(rootElement)
    .append('svg')
    .attr('width', width || DEFAULT_WIDTH)
    .attr('height', height || DEFAULT_HEIGHT);

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

  drawRadar(rootElement, svg, radarContext);
};

export const RadarRenderUtils = { setupFourQuadrants };
