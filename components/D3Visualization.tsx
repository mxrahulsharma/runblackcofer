"use client";
import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

interface DataPoint {
  end_year: number;
  intensity: number;
  sector: string;
  topic: string;
  region: string;
  relevance: number;
  pestle: string;
  likelihood: number;
  country: string;
  title: string;
}

interface D3VisualizationProps {
  data: DataPoint[];
  title: string;
}

const D3Visualization: React.FC<D3VisualizationProps> = ({ data, title }) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (svgRef.current) {
      const svg = d3.select(svgRef.current);

      // Set up dimensions and margins
      const width = 928;
      const height = 500;
      const margin = { top: 50, right: 100, bottom: 30, left: 40 };

      svg.attr('width', width).attr('height', height);

      // Set up scales
      const x = d3
        .scaleBand<string>()
        .domain(data.map(d => d.end_year.toString()))
        .range([margin.left, width - margin.right])
        .padding(0.8);

      const y = d3
        .scaleLinear()
        .domain([0, d3.max(data, d => Math.max(d.intensity, d.relevance, d.likelihood)) ?? 0])
        .nice()
        .range([height - margin.bottom, margin.top]);

      // Clear existing contents
      svg.selectAll('*').remove();

      const barWidth = x.bandwidth() / 4;
      const barSpacing = barWidth * 0.2;

      // Helper function to ensure correct type for D3 scales
      const getY = (value: number) => y(value) as number;

      // Append bars for Intensity
      svg
        .selectAll('rect.intensity')
        .data(data)
        .enter()
        .append('rect')
        .attr('class', 'intensity')
        .attr('x', d => x(d.end_year.toString()) ?? margin.left)
        .attr('y', d => getY(d.intensity))
        .attr('height', d => getY(0) - getY(d.intensity))
        .attr('width', barWidth)
        .attr('fill', 'steelblue');

      // Append bars for Relevance
      svg
        .selectAll('rect.relevance')
        .data(data)
        .enter()
        .append('rect')
        .attr('class', 'relevance')
        .attr('x', d => (x(d.end_year.toString()) ?? margin.left) + barWidth + barSpacing)
        .attr('y', d => getY(d.relevance))
        .attr('height', d => getY(0) - getY(d.relevance))
        .attr('width', barWidth)
        .attr('fill', '#FF9800');

      // Append bars for Likelihood
      svg
        .selectAll('rect.likelihood')
        .data(data)
        .enter()
        .append('rect')
        .attr('class', 'likelihood')
        .attr('x', d => (x(d.end_year.toString()) ?? margin.left) + (barWidth + barSpacing) * 2)
        .attr('y', d => getY(d.likelihood))
        .attr('height', d => getY(0) - getY(d.likelihood))
        .attr('width', barWidth)
        .attr('fill', '#4CAF50');

      // Add horizontal lines and shaded areas for each bar type
      const addLineAndShade = (dataKey: keyof DataPoint, color: string) => {
        svg
          .selectAll(`line.${dataKey}`)
          .data(data)
          .enter()
          .append('line')
          .attr('class', dataKey)
          .attr('x1', d => x(d.end_year.toString()) ?? margin.left)
          .attr('y1', d => getY(d[dataKey] as number))
          .attr('x2', margin.left)
          .attr('y2', d => getY(d[dataKey] as number))
          .attr('stroke', color)
          .attr('stroke-width', 2)
          .attr('stroke-dasharray', '5,5');

        svg
          .selectAll(`rect.shade-${dataKey}`)
          .data(data)
          .enter()
          .append('rect')
          .attr('class', `shade-${dataKey}`)
          .attr('x', d => margin.left) // Start shading from the left margin
          .attr('y', d => getY(d[dataKey] as number)) // Start shading from the top of each bar
          .attr('width', d => (x(d.end_year.toString()) ?? width) - margin.left) // Width of shaded area up to the bar's x position
          .attr('height', d => height - margin.bottom - getY(d[dataKey] as number)) // Extend shading to the bottom of the chart
          .attr('fill', color)
          .attr('opacity', 0.1);
      };

      // Add line and shade for Intensity
      addLineAndShade('intensity', 'steelblue');

      // Add line and shade for Relevance
      addLineAndShade('relevance', '#FF9800');

      // Add line and shade for Likelihood
      addLineAndShade('likelihood', '#4CAF50');

      // Add x-axis
      svg
        .append('g')
        .attr('transform', `translate(0,${height - margin.bottom})`)
        .call(d3.axisBottom(x).tickSizeOuter(0));

      // Add y-axis
      svg
        .append('g')
        .attr('transform', `translate(${margin.left},0)`)
        .call(d3.axisLeft(y));

      // Add title
      svg
        .append('text')
        .attr('x', width / 2)
        .attr('y', height - margin.bottom + 50)
        .attr('text-anchor', 'middle')
        .style('font-size', '18px')
        .style('font-weight', 'bold')
        .style('fill', '#333')
        .text(`Trends Analysis for ${title}`);

      // Add country and region
      const countryRegionText = svg
        .append('text')
        .attr('x', width - margin.right - 10)
        .attr('y', margin.top)
        .attr('text-anchor', 'end')
        .style('font-size', '14px')
        .style('fill', '#666');

      countryRegionText
        .append('tspan')
        .attr('x', width - margin.right - 10)
        .text(`Country: ${data[0].country}`);

      countryRegionText
        .append('tspan')
        .attr('x', width - margin.right - 10)
        .attr('dy', '1.2em')
        .text(`Region: ${data[0].region}`);

      // Add topic below country and region
      svg
        .append('text')
        .attr('x', width - margin.right - 10)
        .attr('y', margin.top + 40) // Position below country and region text
        .attr('text-anchor', 'end')
        .style('font-size', '14px')
        .style('fill', '#666')
        .text(`Topic: ${data[0].topic}`);

      // Add legend
      const legend = svg.append('g')
        .attr('transform', 'translate(800, 400)');

      // Legend for Intensity
      legend.append('rect')
        .attr('x', 0)
        .attr('y', 0)
        .attr('width', 10)
        .attr('height', 10)
        .attr('fill', 'steelblue');
      legend.append('text')
        .attr('x', 15)
        .attr('y', 10)
        .text('Intensity');

      // Legend for Relevance
      legend.append('rect')
        .attr('x', 0)
        .attr('y', 20)
        .attr('width', 10)
        .attr('height', 10)
        .attr('fill', '#FF9800');
      legend.append('text')
        .attr('x', 15)
        .attr('y', 30)
        .text('Relevance');

      // Legend for Likelihood
      legend.append('rect')
        .attr('x', 0)
        .attr('y', 40)
        .attr('width', 10)
        .attr('height', 10)
        .attr('fill', '#4CAF50');
      legend.append('text')
        .attr('x', 15)
        .attr('y', 50)
        .text('Likelihood');
    }
  }, [data, title]);

  return <svg ref={svgRef}></svg>;
};

export default D3Visualization;
