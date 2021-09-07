import * as d3 from 'd3';

import { Dot } from './RadarApi';

const arcGen = (
  innerRadius: number,
  outerRadius: number,
  startAngle: number,
  endAngle: number
): d3.Arc<any, d3.DefaultArcObject> =>
  d3.arc().innerRadius(innerRadius).outerRadius(outerRadius).startAngle(startAngle).endAngle(endAngle);

const create = (svgEl: SVGSVGElement, values: Dot[]) => {
  const svgOuter = d3.select(svgEl);

  const margin = { top: 20, right: 20, bottom: 20, left: 20 };
  const width = 900;
  const height = 900;
  const domainwidth = width - margin.left - margin.right;
  const domainheight = height - margin.top - margin.bottom;
  const tooltip = d3.select('.tooltip');

  // svgOuter.attr('viewBox', `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`);

  // const svg = svgOuter.append('g').style('transform', `translate(${margin.left}px, ${margin.top}px)`);

  // // const x = d3.scaleLinear().domain([-4, 4]).range([0, domainwidth]);
  // // const y = d3.scaleLinear().domain([-4, 4]).range([domainheight, 0]);

  // // const radialScale = d3.scaleLinear().domain([0, 10]).range([0, 250]);
  // // const ticks = [2, 4, 6, 8, 10];
  // // ticks.forEach((t) =>
  // //   svg.append('circle').attr('cx', 300).attr('cy', 300).attr('fill', 'none').attr('stroke', 'gray').attr('r', radialScale(t))
  // // );
  // // ticks.forEach((t) =>
  // //   svg
  // //     .append('text')
  // //     .attr('x', 305)
  // //     .attr('y', 300 - radialScale(t))
  // //     .text(t.toString())
  // // );

  svgOuter.attr('viewBox', `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`);

  const svg = svgOuter.append('g').style('transform', `translate(${margin.left}px, ${margin.top}px)`);

  const x = d3.scaleLinear().domain([-4, 4]).range([0, domainwidth]);
  const y = d3.scaleLinear().domain([-4, 4]).range([domainheight, 0]);

  const xAxis = svg
    .append('g')
    .attr('class', 'x-axis')
    .attr('transform', `translate(0,${y.range()[0] / 2})`);

  xAxis
    .call(d3.axisBottom(x).ticks(6))
    .call((g) => g.selectAll('.tick text').remove())
    .call((g) => g.selectAll('.tick line').remove())
    .call((g) => g.selectAll('.domain').remove());

  svg
    .append('g')
    .attr('class', 'y-axis')
    .attr('transform', `translate(${x.range()[1] / 2}, 0)`)
    .call(d3.axisLeft(y).ticks(6))
    .call((g) => g.selectAll('.tick text').remove())
    .call((g) => g.selectAll('.tick line').remove())
    .call((g) => g.selectAll('.domain').remove());

  const innerFirstCircle = (startAngle: number, endAngle: number): any => {
    return arcGen(domainheight / 8 + 8, domainheight / 8 - 8, startAngle, endAngle);
  };
  const innerSecondCircle = (startAngle: number, endAngle: number): any => {
    return arcGen(domainheight / 4 + 6, domainheight / 4 - 6, startAngle, endAngle);
  };
  const innerThirdCircle = (startAngle: number, endAngle: number): any => {
    return arcGen((domainheight / 8) * 3 + 4, (domainheight / 8) * 3 - 4, startAngle, endAngle);
  };
  const innerFourthCircle = (startAngle: number, endAngle: number): any => {
    return arcGen(domainheight / 2 + 2, domainheight / 2 - 2, startAngle, endAngle);
  };

  const circleTransform = `translate(${domainwidth / 2}px, ${domainheight / 2}px)`;
  const GREEN = '#84BFA4';
  const green = svg.append('g').attr('class', 'green');

  // green background gradient area
  green
    .append('rect')
    .attr('width', domainwidth / 2)
    .attr('height', domainheight / 2)
    .attr('x', 0)
    .attr('y', 0)
    .attr('fill', 'url(#green-radial-gradient)')
    .style('opacity', 0);

  // green circle borders
  green
    .append('path')
    .attr('fill', GREEN)
    .attr('d', innerFirstCircle((3 * Math.PI) / 2, (4 * Math.PI) / 2))
    .style('transform', circleTransform);
  green
    .append('path')
    .attr('fill', GREEN)
    .attr('d', innerSecondCircle((3 * Math.PI) / 2, (4 * Math.PI) / 2))
    .style('transform', circleTransform);
  green
    .append('path')
    .attr('fill', GREEN)
    .attr('d', innerThirdCircle((3 * Math.PI) / 2, (4 * Math.PI) / 2))
    .style('transform', circleTransform);
  green
    .append('path')
    .attr('fill', GREEN)
    .attr('d', innerFourthCircle((3 * Math.PI) / 2, (4 * Math.PI) / 2))
    .style('transform', circleTransform);

  // const xAxis = svgOuter
  //   .append('g')
  //   .attr('class', 'x-axis')
  //   .attr('transform', `translate(0,${y.range()[0] / 2})`);

  // xAxis
  //   .call(d3.axisBottom(x).ticks(6))
  //   .call((g) => g.selectAll('.tick text').remove())
  //   .call((g) => g.selectAll('.tick line').remove())
  //   .call((g) => g.selectAll('.domain').remove());

  // svgOuter
  //   .append('g')
  //   .attr('class', 'y-axis')
  //   .attr('transform', `translate(${x.range()[1] / 2}, 0)`)
  //   .call(d3.axisLeft(y).ticks(6))
  //   .call((g) => g.selectAll('.tick text').remove())
  //   .call((g) => g.selectAll('.tick line').remove())
  //   .call((g) => g.selectAll('.domain').remove());

  // const innerFirstCircle = (startAngle: number, endAngle: number): d3.Arc<any, d3.DefaultArcObject> => {
  //   return arcGen(domainheight / 8 + 8, domainheight / 8 - 8, startAngle, endAngle);
  // };
  // const innerSecondCircle = (startAngle: number, endAngle: number): d3.Arc<any, d3.DefaultArcObject> => {
  //   return arcGen(domainheight / 4 + 6, domainheight / 4 - 6, startAngle, endAngle);
  // };
  // const innerThirdCircle = (startAngle: number, endAngle: number): d3.Arc<any, d3.DefaultArcObject> => {
  //   return arcGen((domainheight / 8) * 3 + 4, (domainheight / 8) * 3 - 4, startAngle, endAngle);
  // };
  // const innerFourthCircle = (startAngle: number, endAngle: number): d3.Arc<any, d3.DefaultArcObject> => {
  //   return arcGen(domainheight / 2 + 2, domainheight / 2 - 2, startAngle, endAngle);
  // };

  // const circleTransform = `translate(${domainwidth / 2}px, ${domainheight / 2}px)`;
  // const GREEN = '#84BFA4';
  // const green = svg.append('g').attr('class', 'green');

  // // green background gradient area
  // green
  //   .append('rect')
  //   .attr('width', domainwidth / 2)
  //   .attr('height', domainheight / 2)
  //   .attr('x', 0)
  //   .attr('y', 0)
  //   .attr('fill', 'url(#green-radial-gradient)')
  //   .style('opacity', 0.25);

  // // green circle borders
  // green
  //   .append('path')
  //   .attr('fill', GREEN)
  //   .attr('d', innerFirstCircle((3 * Math.PI) / 2, (4 * Math.PI) / 2).toString())
  //   .style('transform', circleTransform);
  // green
  //   .append('path')
  //   .attr('fill', GREEN)
  //   .attr('d', innerSecondCircle((3 * Math.PI) / 2, (4 * Math.PI) / 2).toString())
  //   .style('transform', circleTransform);
  // green
  //   .append('path')
  //   .attr('fill', GREEN)
  //   .attr('d', innerThirdCircle((3 * Math.PI) / 2, (4 * Math.PI) / 2).toString())
  //   .style('transform', circleTransform);
  // green
  //   .append('path')
  //   .attr('fill', GREEN)
  //   .attr('d', innerFourthCircle((3 * Math.PI) / 2, (4 * Math.PI) / 2).toString())
  //   .style('transform', circleTransform);

  // svg
  //   .append('g')
  //   .attr('class', 'circles')
  //   .selectAll('circle')
  //   .data(values)
  //   .enter()
  //   .append('circle')
  //   .attr('class', (d) => `dot is-${d.fillColor}`)
  //   .attr('r', 5)
  //   .attr('data-value', (d) => d.text)
  //   .attr('cx', (d) => d.x)
  //   .attr('cy', (d) => d.y);
};

export const RadarService = {
  create,
};
