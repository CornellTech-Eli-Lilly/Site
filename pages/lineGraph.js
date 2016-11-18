
var margin = {top: 20, right: 50, bottom: 30, left: 50},
    width = 900 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

var parseDate = d3.time.format("%Y-%m-%d").parse,
    formatDate = d3.time.format("%Y");

var x = d3.time.scale()
    .range([0, width]);

var y = d3.scale.linear()
    .range([height, 0]);

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom")
    .tickSize(-height, 0)
    .tickPadding(6);

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("right")
    .tickSize(-width)
    .tickPadding(6);

var area = d3.svg.area()
    .interpolate("cardinal")
    .x(function(d) { return x(d.date); })
    .y0(y(0))
    .y1(function(d) { return y(d.value/2000); })
    ;

var line = d3.svg.line()

    .interpolate("cardinal")
    .x(function(d) { return x(d.date); })
    .y(function(d) { return y(d.value/2000); })
   ;

var svg1 = d3.select("#line-chart").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var zoom = d3.behavior.zoom()
    .on("zoom", draw);

var gradient = svg1.append("defs").append("linearGradient")
    .attr("id", "gradient")
    .attr("x2", "0%")
    .attr("y2", "100%");

gradient.append("stop")
    .attr("offset", "0%")
    .attr("stop-color", "white")
    .attr("stop-opacity", .5);

gradient.append("stop")
    .attr("offset", "100%")
    .attr("stop-color", "steelblue")
    .attr("stop-opacity", 1);

svg1.append("clipPath")
    .attr("id", "clip")
  .append("rect")
    .attr("x", x(0))
    .attr("y", y(1))
    .attr("width", x(1) - x(0))
    .attr("height", y(0) - y(1));

svg1.append("g")
    .attr("class", "y axis")
    .attr("transform", "translate(" + width + ",0)");

svg1.append("path")
    .attr("class", "area")
    .attr("clip-path", "url(#clip)")
    .style("fill", "url(#gradient)");

svg1.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")");

svg1.append("path")
    .attr("class", "line")
    .attr("clip-path", "url(#clip)")
    .style("outline-color", 'orange');


svg1.append("rect")
    .attr("class", "pane")
    .attr("width", width)
    .attr("height", height)
    .call(zoom);

    
var initLeft = new Date(2001, 9, 1);
var initRight = new Date(2002, 4, 1);

d3.csv("readme-flights.csv", function(error, data) {
  if (error) throw error;

  data.forEach(function(d) {
    d.date = parseDate(d.date);
    d.value = +d.value;
  });

  x.domain([new Date(2001, 8, 2), new Date(2001, 9, 1)]);
  y.domain([0, d3.max(data, function(d) { return d.value/2000; })]);
  zoom.x(x);

  svg1.select("path.area").data([data]);
  svg1.select("path.line").data([data]);
  draw();
});




    function draw() {
      svg1.select("g.x.axis")
//          .transition()
//        .duration(500)
          .call(xAxis);
      svg1.select("g.y.axis")
//          .transition()
//        .duration(500)
          .call(yAxis);
        
      svg1.select("path.area")
         // .transition()
        //.duration(400)
          .attr("d", area);
      svg1.select("path.line")
          //.transition()
        //.duration(400)
          .attr("d", line)
      ;
    }


     function zoomTo() 
    {
        console.log('zoom!');
        svg.transition()
        .duration(500).attr("transform", " scale(" + a + ")");
    }

