
var margin = {top: 20, right: 20, bottom: 30, left: 40},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

// var x = d3.scale.linear()
//     .range([0, width]);

// var x = d3.time.scale();
var x = d3.time.scale().range([0, width]);


var format = d3.time.format("%Y-%m-%d %H:%M");


var y = d3.scale.linear()
    .range([height, 0]);

var color = d3.scale.category10();

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");

var svg = d3.select("#scatter_plot_area").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

function scatterplot_create(){

  d3.csv("/data/scatterplot.csv", function(error, data) {
    if (error) throw error;

    data.forEach(function(d) {
      d.category = +d.category;
    });


    // x.domain(d3.extent(data, function(d) { console.log(format.parse(d.date)); return d.sepalWidth; })).nice();
    x.domain(d3.extent(data, function(d) { return format.parse(d.date); })).nice();

    y.domain(d3.extent(data, function(d) { return d.category; })).nice();

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
      .append("text")
        .attr("class", "label")
        .attr("x", width)
        .attr("y", -6)
        .style("text-anchor", "end")
        .text("Mötes Tid");

    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
      .append("text")
        .attr("class", "label")
        .attr("transform", "rotate(-90)")
      .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("Svar")

    // svg.selectAll(".dot")
    // .data(data.filter(function(d){return d.type == 0}))
    //   .enter().append("circle")
    //     .attr("class", "dot")
    //     .attr("r", 3.5+5)
    //     .attr("cx", function(d) { return x(format.parse(d.date) ); })
    //     .attr("cy", function(d) { return y(d.category); })
    //     .on("mouseover", handleMouseOver)
    //     .on("mouseout", handleMouseOut)
    //     .style("fill", function(d) { return color(d.author); })

        var shapes = svg.selectAll(".dot")
    .data(data).enter();

      shapes.append("circle")
          .filter(function(d){ return d.type==0; })
          .attr("class","dot")
          .attr("cx", function(d) { return x(format.parse(d.date) ); })
          .attr("cy", function(d) { return y(d.category); })
          .attr("r", 8)
          .on("mouseover", handleMouseOver)
          .on("mouseout", handleMouseOut)
          .style("fill", function(d) { return color(d.author); });

      shapes.append("rect")
          .filter(function(d){ return d.type==1; })
          .attr("class","dot")
          .attr("x", function(d) { return x(format.parse(d.date) ); })
          .attr("y", function(d) { return y(d.category); })
          .attr("width", 10)
          .attr("height", 10)
          .on("mouseover", handleMouseOver)
          .on("mouseout", handleMouseOut)
          .style("fill", function(d) { return color(d.author); });


    // svg.selectAll(".dot")
    //     .data(data.filter(function(d){console.log(d.type==1);return d.type == 1}))
    //     .enter().append("rect")
    //     .attr("class","dot");


        function handleMouseOver(d, i) {  // Add interactivity
          var print_string = d.author + "<br>\n";
          print_string += d.date + "<br>\n";
          print_string += d.message +"<br>\n";
          $("#detail_box").html(print_string);
            console.log(d);
          }

      function handleMouseOut(d, i) {
        // $("#detail_box").text(d);
            // Use D3 to select element, change color back to normal
            console.log(i);
          }

    var legend = svg.selectAll(".legend")
        .data(color.domain())
      .enter().append("g")
        .attr("class", "legend")
        .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

    legend.append("rect")
        .attr("x", width - 18)
        .attr("width", 18)
        .attr("height", 18)
        .style("fill", color);

    legend.append("text")
        .attr("x", width - 24)
        .attr("y", 9)
        .attr("dy", ".35em")
        .style("text-anchor", "end")
        .text(function(d) { return d; });

  });
}
