import React from "react";
import * as d3 from "d3";
import { useEffect, useRef } from "react";

const data = [
  { Country: "United States", Value: 12394 },
  { Country: "Russia", Value: 6148 },
  { Country: "Germany (FRG)", Value: 1653 },
  { Country: "France", Value: 2162 },
  { Country: "United Kingdom", Value: 1214 },
  { Country: "China", Value: 1131 },
  { Country: "Spain", Value: 814 },
  { Country: "Netherlands", Value: 1167 },
  { Country: "Italy", Value: 660 },
  { Country: "Israel", Value: 1263 },
];

const CustomChart = () => {
  const ref = useRef();

  useEffect(() => {
    // set the dimensions and margins of the graph
    const margin = { top: 30, right: 30, bottom: 70, left: 60 },
      width = 460 - margin.left - margin.right,
      height = 400 - margin.top - margin.bottom;

      
      const svg = d3
      .select(ref.current)
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // X axis
    const x = d3
      .scaleBand()
      .range([0, width])
      .domain(data.map(d => "AA" + d.Country))
      .padding(0.2);

      const tickValuesForAxis = data.map(d => "AA" + d.Country);

    svg
      .append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(d3.axisBottom(x))
      // .tickValues(tickValuesForAxis))
      .selectAll("text")
      .attr("transform", "translate(-10,0)rotate(-45)")
      .style("text-anchor", "end");

    // Add Y axis
    const y = d3.scaleLinear().domain([0, 13000]).range([height, 0]);
    svg.append("g").call(d3.axisLeft(y));

    // Bars
    svg
      .selectAll("mybar")
      .data(data)
      .join("rect")
      .attr("x", (d) => x(d.Country))
      .attr("y", (d) => y(d.Value))
      .attr("width", x.bandwidth())
      .attr("height", (d) => height - y(d.Value))
      .attr("fill", "#5f0f40");
  }, []);

  return (
    <>
      <h1>Custom Chart</h1>
      <svg width={460} height={400} id="barchart" ref={ref} />
    </>
  );
};

export default CustomChart;
