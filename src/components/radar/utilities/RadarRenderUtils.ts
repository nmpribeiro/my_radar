/* eslint-disable @typescript-eslint/no-explicit-any */
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

  // TODO: add horizons labels
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

const drawBlips = (rootElement: HTMLDivElement, svg: D3SvgGEL, data: RadarDataType, blips: RawBlipType[]): void => {
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
        .html(`<h4>${d.name}</h4><p>${d.description}</p>`)
        .style('left', `${event.pageX + 15}px`)
        .style('top', `${event.pageY - 28}px`);
      this.setAttribute('opacity', '0.5');
    })
    .on('mousemove', (event, d) => tooltip.style('left', `${event.pageX + 15}px`).style('top', `${event.pageY - 28}px`))
    .on('mouseout', function (d) {
      tooltip.transition().duration(250).style('opacity', 0);
      this.setAttribute('opacity', '1');
    });

  svgBlips.append('circle').attr('r', '7px');

  // add the lists
  // TODO: remove this list once we hav all layout completed
  const title = document.createElement('h5');
  title.innerText = 'List';
  rootElement.append(title);

  const UL_ID = 'radar-list';
  let ul: d3.Selection<HTMLUListElement, unknown, null | HTMLElement, any> = d3.select(`#${UL_ID}`);
  if (ul.empty()) {
    ul = d3.select(rootElement).append('ul').attr('id', UL_ID);
  }
  ul.selectAll('li.quadrant')
    .data<BlipType>(sortedBlips)
    .enter()
    .append('li')
    .attr('class', 'quadrant')
    .text((d) => d.name);
};

function drawRadar(rootElement: HTMLDivElement, svg: D3SvgEl, data: RadarDataType, blips: RawBlipType[]) {
  const width = data.width || 800;
  const height = data.height || 600;
  const cx = width / 2;
  const cy = height / 2;
  // add the horizons
  const base: D3SvgGEL = svg.append('g').attr('transform', `translate(${cx},${cy})`);

  const horizonWidth = (0.95 * (width > height ? height : width)) / 2;
  const horizonUnit = horizonWidth / data.horizons.length;

  const title = document.createElement('h3');
  title.innerText = data.title;

  rootElement.prepend(title);

  addHorizons(base, data, horizonUnit);
  addQuadrants(base, data);

  drawBlips(rootElement, base, data, blips);
}

const setupForQuadrants = (svgEl: HTMLDivElement, data: RadarDataType, blips: RawBlipType[]): void => {
  const width = data.width || 800;
  const height = data.height || 600;

  const svg = d3.select(svgEl).append('svg').attr('width', width).attr('height', height);

  svg.selectChildren().remove();

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

  drawRadar(svgEl, svg, data, blips);
};

export const RadarRenderUtils = { setupForQuadrants };
