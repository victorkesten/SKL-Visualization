var almedalen_text = ["Vad är viktigast för att forskning om digitalisering ska göras tillgänglig för skolan?","Vilka är de viktigaste drivkrafterna för en bra och likvärdig utveckling av digital kompetens i skolan?","Vilka är de största hindren för en bra och likvärdig utveckling av digital kompetens i skolan?","Vilka faktorer är viktigast för att uppnå en likvärdig tillgång till digitala verktyg i skolan?","Vad är viktigast för att säkerställa en likvärdig användning av digitala verktyg i skolan?","Hur kan forskningen bäst stödja digitaliseringen av skolan?","Ordet är fritt"];

var almedalen_names = ["Aragon","Arwen","Biblo","Boromir","Denethor","Elrond","Eomer","Eowyn","Faramir","Frodo","Galadriel","Gandalf","Gimli","Gollum","Haldir","Isildur","Legolas","Merry","Pippin","Sam","Saruman","Theoden","Treebeard","The Witch King of Angmar","Wormtongue"];
var almedalen_json = [];
var color_special_for_cq = {"0" : "#0000ff" ,"1" : "#ffa500"};


var margin = {top: 20, right: 20, bottom: 30, left: 40},
    width = 960 - margin.left - margin.right ,
    height = 500 - margin.top - margin.bottom;


var x = d3.scaleTime().range([0, width]);
// var xB = d3.time.scale().range([0, width]);

var y = d3.scaleTime().range([height,0]);
// var yL = d3.time.scale().range([height,0]);

var current_legend_selection = 0;

var formatX = d3.timeFormat("%Y-%m-%d");
var formatY = d3.timeFormat("%H:%M");

var parseX = d3.timeParse("%Y-%m-%d");
var parseY = d3.timeParse("%H:%M");


var selectedCategories = {};
var categories = [];
var statistics = {
  "questions" : [],
  "current_comments" : 0,
  "current_questions" : 0,
  "total_comments" : 0,
  "total_questions" : 0
}

var color = d3.scaleOrdinal(d3.schemeCategory20);

// var xAxis = d3.svg.axis()
//     .scale(x)
//     .orient("bottom");

var xAxis = d3.axisBottom(x);
var yAxis = d3.axisLeft(y);


  // var yAxis = d3.svg.axis()
  //     .scale(y)
  //     .orient("left");


var svg = d3.select("#scatter_plot_area").append("svg")
    .attr("width", width + margin.left + margin.right + 300)
    // .attr("width",width+100)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
var focus = svg.append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


var zoomRegion = svg.append("rect")
    .attr("class", "zoom")
    .style("cursor", "zoom-in")
    .attr("width", width)
    .attr("height", height);
    // .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
var xZoomOption;
var resetZoom = 0;

var previous_nav = 0;
var ids_for_nav = ["grupp_nav","q_nav","fd_nav"];
function updateColors(value){
  $("#"+ids_for_nav[previous_nav]).removeClass('active');
  previous_nav = value;
  $("#"+ids_for_nav[previous_nav]).addClass('active');

  d3.csv("/data/scatterplot.csv", function(error, data) {
    if (error) throw error;
    var shapes = svg.selectAll(".dot").transition()
      .duration(500);
      color = d3.scaleOrdinal(d3.schemeCategory20);
      // console.log(color[0]);


     current_legend_selection = value;

    if(value == 0){
        shapes.style("fill", function(d) { return color(d.author); });
    } else if(value == 1){
      shapes.style("fill", function(d) { return color(d.question); });
    } else if (value == 2){
      shapes.style("fill", function(d) { return color_special_for_cq[d.type]; });
    }
    create_data(data,value);
    create_legend(data,value);
  });

}

function create_data(data,value){
  categories = [];

  if(value == 0){
    data.forEach(function(d) {
      var check = false;
      for(var i = 0; i < categories.length; i++){
        if(d.author == categories[i]){
          check = true;
        }
      }
      if(check){
        categories[categories.length] = d.author;
      }
    });
  } else if(value == 1){
    data.forEach(function(d) {
      var check = false;
      for(var i = 0; i < categories.length; i++){
        if(d.question == categories[i]){
          check = true;
        }
      }
      if(check){
        categories[categories.length] = d.question;
      }
    });
  } else if (value == 2){
    data.forEach(function(d) {
      var check = false;
      for(var i = 0; i < categories.length; i++){
        if(d.type == categories[i]){
          check = true;
        }
      }
      if(check){
        categories[categories.length] = d.type;
      }
    });
  }
  for(var i = 0; i < categories.length; i++){
    selectedCategories[categories[i]] = true;
  }
}

function create_legend(data,value){
  svg.selectAll(".legend").remove();
  // console.log(color.domain());
  var color_domain = color.domain();
  if(value == 2){
    color_domain = ["0","1"];
  }
  var legend = svg.selectAll(".legend")
      .data(color_domain)
    .enter().append("g")
      .attr("class", "legend")
      .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

  legend.append("rect")
      .attr("x", width - 18 + 240)
      .attr("width", 18)
      .attr("height", 18)
      .attr("id", function(d){
        if(value == 1){
          if(statistics.questions[d].displayed == false){
            var rect = d3.select(this);
            var category = rect.attr("category");
            selectedCategories[category] = !selectedCategories[category];

            return "disabled";
          }
        }
        return "";
      })
      .attr("category", function (d) {
          return d;
        })
      .style("fill", function(d){
        if(value == 2){return color_special_for_cq[d];}
        return color(d);})
      .style("stroke", function(d){
        if(value == 2){return color_special_for_cq[d];}
        return color(d);})
      .on("click", function (d) {
          var rect = d3.select(this);
          var category = rect.attr("category");
          //Handle the case of "ALL" separately
          //Set the category to true if it is not selected and the opposite if selected
          selectedCategories[category] = !selectedCategories[category];
          if (!selectedCategories[category]) {
            //Set rect to selected
            rect.attr("id", "");
            // selectedCategories[category] = true;
            if(value == 1){
              statistics.current_questions += statistics.questions[d].q_count;
              statistics.current_comments += statistics.questions[d].c_count;
            }
            if(value == 2){
              if(d == 0){
                statistics.current_questions = statistics.total_questions;
              }
              if(d == 1){
                statistics.current_comments = statistics.total_comments;
              }
            }

            statistics.questions[d].displayed = true;
          } else {
            //Set rect to deselected
            rect.attr("id", "disabled");
            if(value == 1){
              statistics.current_questions -= statistics.questions[d].q_count;
              statistics.current_comments -= statistics.questions[d].c_count;
            }
            if(value == 2){
              if(d == 0){
                statistics.current_questions = 0;
              }
              if(d == 1){
                statistics.current_comments = 0;

              }
            }
            statistics.questions[d].displayed = false;
            // selectedCategories[category] = false;
          }
          create_bubbles(data,value);
        });

  legend.append("text")
      .attr("x", width - 24 + 240)
      .attr("y", 9)
      .attr("dy", ".35em")
      .style("text-anchor", "end")
      .text(function(d,i) {
        if(value == 2){
          if(d==0){
            return "Förslag";
          }
          if(d == 1){
            return "Diskussion";
          }
        }
        if(value == 1){
          return almedalen_text[d];
        }
        if(value == 0){
          // var a = {d : almedalen_names[i]};
          // console.log(a);


          almedalen_json[d] = almedalen_names[i];
          return almedalen_names[i];
        }
        return d; });
}

function create_bubbles(data,value){
    svg.selectAll(".dot").remove();
    var shapes = svg.selectAll(".dot")
      .data(data).enter();



      shapes.append("circle")
          .attr("class","dot")
          .filter(function(d){ return d.type==0; })
          .filter(function(d){  if(value==0){return !selectedCategories[d.author];}
                                if(value==1){return !selectedCategories[d.question];}
                                if(value==2){return !selectedCategories[d.type];}})
          // .attr("class","dot")
          .attr("cx", function(d) { return x(parseX(d.date) ); })
          .attr("cy", function(d) { return y(parseY(d.time)); })
          .attr("r", 16) //8
          .attr("opacity","1")
          .on("mouseover", handleMouseOver)
          .on("mouseout", handleMouseOut);
          // .style("fill", function(d) { return color(d.question); });

      shapes.append("rect")
          .attr("class","dot")
          .filter(function(d){ return d.type==1; })
          .filter(function(d){  if(value==0){return !selectedCategories[d.author];}
                                if(value==1){return !selectedCategories[d.question];}
                                if(value==2){return !selectedCategories[d.type];}})
          .attr("x", function(d) { return x(parseX(d.date) ); })
          .attr("y", function(d) { return y(parseY(d.time)); })
          .attr("width", 20) //10
          .attr("height", 20)
          .attr("opacity","1")
          .on("mouseover", handleMouseOver)
          .on("mouseout", handleMouseOut);
          // .style("fill", function(d) { return color(d.question); });
          var shape = svg.selectAll(".dot")
          if(value == 0){
            shape.style("fill", function(d) { return color(d.author); });
          } else if(value == 1){
            shape.style("fill", function(d) { return color(d.question); });
          } else if (value == 2){
            shape.style("fill", function(d) { return color_special_for_cq[d.type]; });
          }

        function handleMouseOver(d, i) {  // Add interactivity
          $(".dot").css("opacity","0.1");
          d3.select(this).style("opacity",1);
          console.log(d.author);
          console.log(almedalen_json);
          var print_string = almedalen_json[d.author] + "<br>\n";
          print_string += d.date + "<br>\n";
          print_string += d.message +"<br>\n";

          $("#detail_box").html(print_string);
            console.log(d);
          }

        function handleMouseOut(d, i) {
          // $("#detail_box").text(d);
              // Use D3 to select element, change color back to normal
              $(".dot").css("opacity","1");

              console.log(i);
            }

        update_text();
}

function onZoomend() {
    zoomRegion.style("cursor", "zoom-in");
}

function create_zoom(){
    // Create zoom
  xZoomOption = d3.behavior.zoom()
      .scaleExtent([1, Infinity])
      .translateExtent([[0, 0], [width, height]])
      .extent([[0, 0], [width, height]])
      .on("zoom", onZoom)
      .on("end", onZoomend);

  zoomRegion.call(xZoomOption)
      .on("wheel", function() { d3.event.preventDefault(); });;

function onZoom() {
      if (resetZoom) {
          // this is really dirty
          d3.event.transform.k = 1;
          d3.event.transform.x = 0;
          d3.event.transform.y = 0;
          resetZoom = 0;
      }
      var t = d3.event.transform;

      if (d3.event.sourceEvent && d3.event.sourceEvent.type === 'mousemove') {
          zoomRegion.style("cursor", "move");
      }
      // x.domain(t.rescaleX(xB));
      svg.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");

      // y.domain(t.rescaleY(yL).domain());
      //
      // xAxis.call(xAxis);
      // yAxis.call(yAxis);

  }
}





function scatterplot_create(){

  d3.csv("/data/scatterplot.csv", function(error, data) {
    if (error) throw error;


    data.forEach(function(d) {
      d.category = +d.category;
      if (statistics.questions[d.question] == undefined) {
        statistics.questions[d.question] = {"q_count" : 0, "c_count" : 0, "displayed" : true};
      }
      if(d.type == 0){
        statistics.total_questions+=1;
        statistics.questions[d.question].q_count +=1;
      }
      if(d.type == 1){
        statistics.total_comments+=1;
        statistics.questions[d.question].c_count +=1;

      }
    });
    statistics.current_comments = statistics.total_comments;
    statistics.current_questions = statistics.total_questions;

    x.domain(d3.extent(data, function(d) { return parseX(d.date); })).nice();
    y.domain(d3.extent(data, function(d) { return parseY(d.time); })).nice();

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
      .append("text")
        .attr("class", "label")
        .attr("x", width)
        .attr("y", -6)
        .style("text-anchor", "end")
        .text("Datum");

    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
      .append("text")
        .attr("class", "label")
        .attr("transform", "rotate(-90)")
      .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("Tid")

    create_data(data,0);
    create_bubbles(data,0);

    create_legend(data,0);
    // create_zoom();

  });
}


function update_text(){
  // var update_string = "<h1><span style=\"color:red;\">Förslag</span> - " + statistics.total_questions;
  // update_string += "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <span style=\"color:red;\">Visade Förslag</span> - " + statistics.current_questions;
  // update_string += " <br><span style=\"color:red;\">Diskussioner</span> - " + statistics.total_comments;
  // update_string += " <span style=\"color:red;\">Visade Diskussioner</span> - " + statistics.current_comments + "\n<br></h1>";
  // console.log($('.dot').length);

  // $("#meeting_statistics").html(update_string);
  $("#meeting_statistics").html("");

}
