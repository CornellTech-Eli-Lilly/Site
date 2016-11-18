var svg2 = d3.select("#bar-chart")
    .append('svg')
    .attr('width', 600)
    .attr("height", 300)
    .attr("class", "chart");

var margin = {
    top: 50,
    right: 105,
    bottom: 50,
    left: 75
};

var months = ['Jan.', 'Feb.', 'Mar.', 'Apr.', 'May', 'June', 'July', 'Aug.', 'Sept.', 'Oct.', 'Nov.', 'Dec.'];
var days = ['Sun.','Mon.','Tue.','Wed.','Thu.','Fri.','Sat.'];
var hours = ['7AM','8AM','9AM','10AM','11AM','12PM','1PM','2PM','3PM','4PM','5PM','6PM','7PM','8PM','9PM'];
var h_steps = [1322,1242,900,952,509,1478,1560,1354,402,131,890,780,1240,650,200];
var d_steps = [4465,2234,2790,4456,5509,4697,2752];
var m_steps = [97720,96690,80100,87430,100943,89124,109090,93720,96690,91030,99343,93290];

var dataSet = [[hours, h_steps], [days, d_steps], [months, m_steps]];

var counter = 2;
function makeData(x, y)
{
    var data = [];
    var i;
    for (i = 0; i < x.length; i++)
        {
            data[i] = [x[i], y[i], "r"+i];
        }
    //console.log(data);
    return data;
}

var data = makeData(months, m_steps);


var width = 900 - margin.left - margin.right;
var height = 500 - margin.top - margin.bottom;


var xScale2 = d3.scale.ordinal()
        .domain(months)
        .rangePoints([0, width]);

var maxY =  d3.max(data, function (d) {
        return d[1];
    });
var yScale2 = d3.scale.linear()
    .domain([maxY*0.5, maxY])
    .range([height, 0]);

var xAxis2 = d3.svg.axis()
    .scale(xScale2)
    .orient("bottom");

var yAxis2 = d3.svg.axis()
    .scale(yScale2)
    .orient("left");

var chart = d3.select(".chart")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


// Add data
chart.selectAll('rect')
    .data(data, function (d, i) {
        return d[2];
    })
    .enter()
    .append("rect")
    .attr('class', 'bar')
    .attr("x", function (d, i)
                {
                    return xScale2(d[0]);
                })
    .attr("y", function (d)
    {
        return yScale2(d[1]);
    })
    .attr("width", function(d)
    {
       return (width * 0.6)/data.length;
    })
    .attr("height", function(d)
    {
        return height - yScale2(d[1]);
    })
    .attr('index', function(d, i)
    {
        return i;
    })
    .attr("fill", function(d)
    {
       // return "rgb(99, 200, " + (d.height) + ")";
        return "rgb(50," + (256-Math.round((maxY-d[1])/maxY * 256 * 2)) +", " +  150 + ")";
    });

var texts = chart.selectAll("text")
    .data(data)
    .enter()
    .append("text")
    .text(function(d)
    {
        return "" + d[1];
    })
    .attr("font-family", "Arial")
    .attr("font-size", "120%")
    .attr('x', function(d)
    {
        return xScale2(d[0])- 2;
    })

    .attr('y', function(d)
    {
        return yScale2(d[1]) - 2;
    })
    .attr('id', function (d, i)
        {
            return 'text' + i;
        })
    .attr('class', 'name');

$('.name').hide();
            

// y axis and label
chart.append("g")
    .attr("class", "y axis2")
    .call(yAxis2)
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("x", -height / 2)
    .attr("y", -margin.bottom)
    .attr("dy", ".71em")
    .attr('id', 'yText')
    .style("text-anchor", "end");
   

// x axis and label
chart.append("g")
    .attr("class", "x axis2")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis2)
    .append("text")
    .attr("x", width / 2)
    .attr("y", margin.bottom - 25)
    .attr("dy", ".71em")
    .style("text-anchor", "end")
    .text("Time")
    .attr('font-size', '15px');

// chart title
//chart.append("text")
//    .text("Step Graph")
//    .attr("x", width / 2)
//    .attr("class", "title");

d3.selectAll(".bar")
    .on("click", changeScale);

$('.bar').hover(function()
    {
        var ind = $(this).attr("index");
        $("#text" + ind).show(100);  
    },

    function(){
        var ind = $(this).attr("index");
       $("#text" + ind).hide(100);
    });



function changeScale() {
    if(counter > 0)
    {
        counter --;
    }
    
    data = makeData(dataSet[counter][0], dataSet[counter][1]);
    //console.log("length" +dataSet[counter][0].length);
    update();
}




function update() 
{
    
   xScale2 = d3.scale.ordinal()
       .domain(dataSet[counter][0])
       .rangePoints([0, width]);

   maxY = d3.max(data, function (d) 
    {
       console.log(d[0]);
       return d[1];
   });
    
   yScale2 = d3.scale.linear()
       .domain([0, maxY])
       .range([height, 0]);
    
    xAxis2 = d3.svg.axis()
    .scale(xScale2)
    .orient("bottom");

    yAxis2 = d3.svg.axis()
    .scale(yScale2)
    .orient("left");
    
   var rects = svg2.selectAll('rect')
       .data(data);
    
    
    rects.transition()
        .duration(1000)
        .attr('class', 'bar')
        .attr("x", function (d)
            {
                //console.log("X: " + d[0]);
                //console.log(xScale2(d[0]));
                return xScale2(d[0]);
            })
        .attr("y", function (d)
        {
            console.log("X: " + d[0]);
            return yScale2(d[1]);
        })
        .attr("width", function(d)
        {
           return (width * 0.5)/data.length;
        })
        .attr("height", function(d)
        {
            return height - yScale2(d[1]);
        });


    //enter new
    rects.enter()
        .append("circle")
        .attr('class', 'bar')
        .transition()
        .duration(1000)
        .attr("x", function (d, i)
            {
                return xScale2(d[0]);
            })
        .attr("y", function (d)
        {
            return yScale2(d[1]);
        })
        .attr("width", function(d)
        {
           return (width * 0.5)/data.length;
        })
        .attr("height", function(d)
        {
            return height - yScale2(d[1]);
        })
        .attr('index', function(d, i)
        {
            return i;
        })
        .attr("fill", function(d)
        {
           // return "rgb(99, 200, " + (d.height) + ")";
            return "rgb(50," + (256-Math.round((maxY-d[1])/maxY * 256 * 2)) +", " +  150 + ")";
        });

     texts
        .data(data)
        .transition()
        .duration(100)
        .style('opacity', 0)
        .transition()
        .duration(100)
        .style('opacity', 1)
        .text(function(d)
        {
            return "" + d[1];
        })
        .attr("font-family", "Arial")
        .attr("font-size", "140%")
        .attr('x', function(d)
        {
            return xScale2(d[0]);
        })

        .attr('y', function(d)
        {
            return yScale2(d[1]) - 2;
        })
        .attr('id', function (d, i)
            {
                return 'text' + i;
            })
        .attr('class', 'name');

    rects.exit()
        .transition()
        .duration(500)
        .attr("height", 0)
        .remove();


    svg2.selectAll("g.x.axis2")
        .transition()
        .duration(1000)
        .call(xAxis2);

    svg2.selectAll("g.y.axis2")
        .transition()
        .duration(1000)
        .call(yAxis2);
  
    
    d3.selectAll(".bar")
        .on("click", changeScale);

}