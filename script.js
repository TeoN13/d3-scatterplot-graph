document.addEventListener("DOMContentLoaded", () => {
  fetch(
  "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json").

  then(response => response.json()).
  then(data => {
    // console.log(data)
    // array of objects , length = 35
    /* object {
    'Time' : mm:ss
    'place' : int
    'seconds': int
    'name' : 'firstName LastName'
    'year' : int
    'nationality' : str
    'doping' : str
    'url' : str
    } */

    // plot will have 'year' represented on the x axis and 'time' on y axis ('time' is in mm:ss and is equal to 'seconds')

    // define svg plot

    const w = 700;
    const h = 400;
    const padding = 40;
    const circleRadius = 6;

    const svg = d3.
    select("#container").
    append("svg").
    attr("id", "chart").
    attr("width", w).
    attr("height", h);

    const xScale = d3.
    scaleTime().
    domain([
    d3.min(data, d => new Date(d["Year"] - 1, 0, 1)), // d["Year"]-1 so the starting circles aren't on the y axis
    d3.max(data, d => new Date(d["Year"], 0, 1))]).

    range([padding, w - padding]);

    const yScale = d3.
    scaleTime().
    domain([
    d3.timeSecond.offset(
    d3.min(data, d => d3.timeParse("%M:%S")(d["Time"])),
    -10),

    //d3.min(data, (d) => d3.timeParse("%M:%S")(d["Time"])),
    d3.max(data, d => d3.timeParse("%M:%S")(d["Time"]))]).

    range([h - padding, padding]);

    svg.
    selectAll("circle").
    data(data).
    enter().
    append("circle").
    attr("class", "dot").
    attr("fill", d => d["Doping"] ? "#C2185B" : "#1A237E").
    attr("stroke", d => d["Doping"] ? "#880E4F" : "#311B92").
    attr("data-xvalue", d => d["Year"]).
    attr("cx", d => xScale(new Date(d["Year"], 0, 1))).
    attr("data-yvalue", d => d3.timeParse("%M:%S")(d["Time"]).toISOString()).
    attr("cy", d => yScale(d3.timeParse("%M:%S")(d["Time"]))).
    attr("r", d => circleRadius).
    on("mouseover", (event, d) => showTooltip(d)).
    on("mouseout", hideTooltip);

    function showTooltip(d) {
      d3.select("#tooltip") // position already set to absolute in css
      .style("display", "block") // show the #tooltip div
      .style("left", event.pageX + "px") // show it next to mouse
      .style("top", event.pageY + "px").
      attr("data-year", d["Year"]).
      html(
      `${d["Name"]}, ${d["Nationality"]}<br/>Year: ${d["Year"]}, Time: ${d["Time"]}<br/>${d["Doping"]}`);

    }

    function hideTooltip() {
      d3.select("#tooltip").style("display", "none");
    }

    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3.
    axisLeft(yScale).
    tickFormat(d => d3.timeFormat("%M:%S")(d));

    svg.
    append("g").
    attr("id", "x-axis").
    attr("transform", `translate(0, ${h - padding})`).
    call(xAxis);

    svg.
    append("g").
    attr("id", "y-axis").
    attr("transform", `translate(${padding}, 0)`).
    call(yAxis);

    svg.
    append('text').
    attr('class', 'x-axis-label').
    attr('x', w - padding / 2).
    attr('y', h - padding / 2).
    style('text-anchor', 'end').
    text('Year');

    svg.
    append("text").
    attr("class", "y-axis-label").
    attr("transform", "rotate(90)").
    attr('x', padding + h / 4).
    attr('y', -padding - 5).
    style("text-anchor", "end").
    text("Time (minutes)");
  });
});