var margin = { top: 50, right: 0, bottom: 50, left: 150 },
    width = 900 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom,
    gridSize = 35,
    legendElementWidth = gridSize * 1.5,
    buckets = 9,
    colors =
['#A80000', '#DC2509', '#E35022', '#E67634', '#EB9A46', '#EFB95A', '#F3D56D', '#F7EC82'
 ,'#F6FB97', '#EFFFAD'];
colors.reverse();


    //['#F9FAC0', '#F8F1A9', '#F6E193', '#F3CE7C', '#F1B667', '#EE9A51', '#EC7A3C', '#E95727', 
     //    '#E72F13', '#E60D00'];
    //["#ffffd9","#edf8b1","#c7e9b4","#7fcdbb","#41b6c4","#1d91c0","#225ea8","#253494","#081d58"],
    // alternatively colorbrewer.YlGnBu[9]
    days = d3.range(1, 6);

var weekdays = ["Mon", "Tue", "Wen", "Thr", "Fri", "Sat", "Sun"];

var picW = 125,
    picH = 260;

//var months = d3.range(1, 13)


var datasets = [];

var svg = d3.select("#chart").append("svg")
.attr("width", width + margin.left + margin.right)
.attr("height", height + margin.top + margin.bottom)
.append("g")
.attr("transform", "translate(" + margin.left + "," + margin.top + ")")
.attr("class", "whole");

//svg.append("rect")
//    .attr("width", "100%")
//    .attr("height", "100%")
//    .attr("fill", "pink");


var dayLabels = svg.selectAll(".dayLabel")
.append("g");

var weekLabels = svg.selectAll(".weekLabel")
.data(days)
.enter().append("text")
.text(function(d) { return d; })
.attr("x", function(d, i) { return i * gridSize + 2*picW + 100; })
.attr("y", 0)
.style("text-anchor", "middle")
.attr("transform", "translate(" + gridSize / 2 + ", -6)")
.attr("class", function(d, i) { return "event weekLabel mono axis"; });


dayLabels.data(weekdays)        //Draw Student Icon
    .enter().append("text")
    .text(function(d) { return d; })
    .attr("x", 0 + 2*picW + 120)
    .attr("y", function (d, i) { return i * gridSize + 20; })
    .style("text-anchor", "end")
    .attr("height", gridSize - 3)
    .attr("width", gridSize - 3)
    .attr("transform", "translate(-35, 0)")
    .attr("class", "event dayLabel mono axis");

var colorScale = d3.scale.quantile()
.domain([1, 10])
.range(colors);

var DayPercentByStu = []

for (var i = 0; i < 31; i ++)
{
    DayPercentByStu.push(Math.floor(Math.random() * 9) + 2);
}

var cells = svg.selectAll ("rect")      //Draw Colored Cells
.data(DayPercentByStu);

cells.append("title");

cells.enter()
    .append("rect")
    .attr("y", function(d, i) { return (i % 7) * gridSize ; })
    .attr("x", function(d, i) { return Math.floor(i / 7) * gridSize + 2*picW + 100; })
    .attr("rx", 4)
    .attr("ry", 4)
    .attr("class", function (d, i)
          {
            return "cell bordered " +'week' + (i % 7) + ' day' + Math.floor(i / 7);
          })

    .attr("width", gridSize)
    .attr("height", gridSize)
    .attr("title", function (d, i)
         {
            return "Student " + (Math.floor(i / 41) + 1);
        })      
    .attr("data-toggle", "popover")
    .attr("data-placement", "bottom")
//    .attr("data-content",  function (d, i)
//         {
//            return "Day " + ((i % 41) + 1) + ", "+ " Earned " + Math.round (d*100) + "% possible grade. Running Total: " + Math.round(runningDayTotalByStu[i] * 100);
//        })
    .attr("data-container", 'body')
    .style("fill", colors[0]);


d3.selectAll('.event')
    .attr("pointer-events", "none");

cells.transition().duration(1000)
    .delay(function (d, i) { return i * 8})
    .style("fill", function(d) { return colorScale(d); })
    .each("end", function() { d3.selectAll('.event').attr("pointer-events", null); });

cells.select("title").text(function(d) { return d.value; });

cells.exit().remove();




// color legend
var legend = svg.selectAll(".legend")
.data([0].concat(colorScale.quantiles()), function(d) { return d; });

legend.enter().append("g")
    .attr("class", "legend");

legend.append("rect")
    .attr("x", function(d, i) { return gridSize + legendElementWidth * i; })
    .attr("y", height)
    .attr("width", legendElementWidth)
    .attr("height", gridSize / 2)
    .style("fill", function(d, i) { return colors[i]; });

legend.append("text")
    .attr("class", "mono")
    .text(function(d) { return "> " + Math.round(d); })
    .attr("x", function(d, i) { return gridSize + legendElementWidth * i; })
    .attr("y", height + gridSize);

legend.exit().remove();


//draw man front and back picture
svg.append("image")
    .attr("x", "0" )
    .attr("y", "-15")
    .attr("xlink:href", 'BodyF.png')
    .attr("width", picW)
    .attr("height", picH);

svg.append("image")
    .attr("x", "" + picW)
    .attr("y", "-15")
    .attr("xlink:href", 'BodyB.png')
    .attr("width", picW)
    .attr("height", picH);



d3.selectAll('.dayLabel')
    .on("mouseover", function(d, i)
        {
            d3.selectAll('.cell')
                .classed('dim', true)
                .transition()
                .duration(400)
                .attr('opacity', 0.3);

            d3.selectAll(".week" + i)
                //.classed('dim', false)
                .transition()
                .duration(300)
                .attr('opacity', 1);

            d3.selectAll('.dim')
            .on("mouseover", function(d, i)
              {
                d3.selectAll('.cell')
                        .classed('dim', false)
                        .transition()
                        .duration(400)
                        .attr('opacity', 1);
            })
        })


d3.selectAll('.weekLabel')
.on("mouseover", function(d, i)
    {
        d3.selectAll('.cell')
//                    .classed('dim',true)
            .transition()
            .duration(400)
            .attr('opacity', 0.3);

        d3.selectAll(".day" + i)
           // .classed('dim',false)
            .transition()
            .duration(300)
            .attr('opacity', 1);

            d3.selectAll('.dim')
            .on("mouseover", function(d, i)
              {
                d3.selectAll('.cell')
                        .classed('dim', false)
                        .transition()
                        .duration(400)
                        .attr('opacity', 1);
            })
    })

.on("mouseout", function()
    {
        d3.selectAll('.cell')
            .transition()
            .duration(400)
            .attr('opacity', 1);
    });


//d3.selectAll('.dayLabel')
//    .attr("pointer-events", "none")
//    .on("click", function(d, i)
//        {
//            Move(i);
//        })




////////////////////Control the Circles/////////////////////
        

var data = [[ 1, 6, 'lucy'], [3,7, 'zed'], [5, 8, 'han'], [7, 9, 'rubbish'], [10, 10, 'flot'], [4, 11, 'nice']];

var dict = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n'];

function randData()
{
    data = [];
    var num = Math.floor((Math.random() * 9) + 4);
               
    for (var i = 0; i < num; i ++)
    {
        data.push([Math.floor((Math.random() * 10) + 1), Math.floor(Math.random() * 12), dict[i]]);
    }
}


var xPos = [48, 50, 53, 76, 76, 74, 173, 175, 178, 201, 201, 199],
    yPos = [45, 100, 158, 45, 100, 158, 45, 100, 158, 45, 100, 158];

var xScale = d3.scale.ordinal()
  .domain(d3.range(6))
  .range(xPos);

var yScale =  d3.scale.ordinal()
  .domain(d3.range(12))
  .range(yPos);

var painScale = d3.scale.ordinal()
  .domain(d3.range(1,11))
  .range(['#F9FAC0', '#F8F1A9', '#F6E193', '#F3CE7C', '#F1B667', '#EE9A51', '#EC7A3C', '#E95727', 
         '#E72F13', '#E60D00']);

var filter = svg.append("defs")
  .append("filter")
    .attr("id", "blur")
    .attr("x", "-20")
    .attr("y", "-20")
    .attr("width", "40")
    .attr("height", "40")
  .append("feGaussianBlur")
    .attr("stdDeviation", 0.7);

//update();


function update()
   {

        randData();
       console.log(data);


       var circles = svg.selectAll('circle')
        .data(data, function (d, i) { return d[2];});


       //update old
        circles.transition()
        .duration(1000)
        .attr('class', 'circle')
        .attr("cx", function (d)
        {
            return xScale(d[1]);
        })
        .attr("cy", function (d)
        {
            return yScale(d[1]);
        });


       //enter new
        circles.enter()
        .append("circle")
        .attr('class', 'circle')
        .transition()
        .duration(1000)
        .attr("cx", function (d)
        {
            return xScale(d[1]) + Math.floor((Math.random() * 6) -3);
        })
        .attr("cy", function (d)
        {
            return yScale(d[1]) + Math.floor((Math.random() * 6) -3);
        })
        .attr("r", function(d)
        {
            return 2*(5-Math.sqrt(d[0]));
            
        })
        .attr("fill", function(d)
        {
           // return "rgb(30," + (256-(d[1]) * 5) +", " + (256-(d[1]) * 2) + ")";
            return painScale(d[0]);
        })
        .attr("opacity", function(d)
        {
            //return '1';
            return 0.5 + 0.06* d[0];
        })
        .attr("filter", "url(#blur)");

       circles.exit()
            .transition()
            .duration(500)
            .ease('circle')
            .style("r", 0)
            .remove();

    }


cells.on('click',  function() {
  update();
  d3.event.stopPropagation();
});