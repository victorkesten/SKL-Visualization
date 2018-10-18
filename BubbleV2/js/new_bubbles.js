var width = 960;
var height = 540;

var center = { x: width / 2, y: height / 2 };

var omradeCenters = {
  0: { x: width / 3, y: height / 2 },
  1: { x: width / 2, y: height / 2 },
  2: { x: 2 * width / 3, y: height / 2 },
  3: { x:0, y:0}
};

var filterArea = {
  -1 : {x: -10000, y: -10000}
};

var zoom = d3.zoom()
    .scaleExtent([.2, 20])
    .on("zoom", zoomed);

var svg = d3.select("svg")
          .attr("width",width)
          .attr("height",height);

var g = svg.append("g");
var g_sec = g.append("g");

var omrade_titles = ["Digtal Kompetens","Likvärdig Tillgång och Användning","Forskning och Uppföljning", "Annat"];

var format = d3.format(",d");

var tooltip = d3.select("body").append("div")
    .attr("class", "tooltip_bubble")
    .style("opacity", 0);

var selected_color_scheme = 0;

var color = d3.scaleOrdinal(d3.schemeCategory20c);
var currently_selected_circle = null;

var view_option = 0;


// nodes and other variables.
var damper = 0.102;
var bubbles = null;
var nodes = [];

svg.call(zoom);

function zoomed() {
  g.attr("transform", d3.event.transform);
}


// 0.03
var forceStrength = 0.025;

// Moving
function charge(d) {
  // 2.15 works well
  return -Math.pow(d.radius, 2.0) * forceStrength;
}

// Force Layout
//https://stackoverflow.com/questions/41341248/migrating-d3-v3-to-d3-v4-in-circle-force-layout-chart
var simulation = d3.forceSimulation()
  .velocityDecay(0.2)
  .force('x', d3.forceX().strength(forceStrength).x(center.x))
  .force('y', d3.forceY().strength(forceStrength).y(center.y))
  .force('charge', d3.forceManyBody().strength(charge))
  .on('tick', ticked);

simulation.stop();

function change_view(option){
  $("#view_"+option).addClass("active");
  $("#view_"+view_option).removeClass("active");
  view_option = option;
  if(option==0){
    // oversikt_view();
    groupBubbles();
  } else if (option == 1){
    // omrade_view();
    splitBubbles();
  }
}

function createNodes(rawData) {

  var myNodes = rawData.map(function (d,i) {
    // console.log(i);
    return {
      id: (i+1),
      radius: 15, //radiusScale(+d.total_amount), // need to calculate a proper radius
      value: Math.random() * 10, // Arbitrary value
      tag: d.tag,
      author: d.author,
      message: d.message,
      date: d.date,
      time: d.time,
      gilla: d.gilla,
      meeting: d.meeting,
      omrade: d.omrade,
      question: d.question,
      type: d.type,             // Comment or Forslag.
      x: Math.random() * 900,
      y: Math.random() * 800
    };
  });

  // sort them to prevent occlusion of smaller nodes.
  myNodes.sort(function (a, b) { return b.value - a.value; });
  console.log(myNodes);
  return myNodes;
}


function chart(selector, rawData) {
  var maxAmount = d3.max(rawData, function (d) { return +d.total_amount; });

  var radiusScale = d3.scalePow()
    .exponent(0.5)
    .range([2, 85])
    .domain([0, maxAmount]);

  nodes = createNodes(rawData);
  // Set the force's nodes to our newly created nodes array.
  // force.nodes(nodes);

  // Bind nodes data to what will become DOM elements to represent them.
  bubbles = g.selectAll('.bubble')
    .data(nodes, function (d) { return d.id; });

  // Create new circle elements each with class `bubble`.
  // There will be one circle.bubble for each object in the nodes array.
  // Initially, their radius (r attribute) will be 0.
  var bubblesE = bubbles.enter().append('circle')
    .classed('bubble', true)
    .attr('r', 0)
    // .attr('fill', function (d) { return fillColor(d.group); })
    // .attr('stroke', function (d) { return d3.rgb(fillColor(d.group)).darker(); })
    .style("stroke","black")
    .style("fill",function(d){ return mote_color(d);return color(d.question);})
    .attr('stroke-width', 1)
    .on("click",handleClickCircle)
    .on('mouseover', handleMouseOverCircle)
    .on('mouseout', handleMouseOutCircle);

    bubbles = bubbles.merge(bubblesE);
  // Fancy transition to make bubbles appear, ending with the
  // correct radius
  bubbles.transition()
    .duration(2000)
    .attr('r', function (d) { return d.radius; });
    simulation.nodes(nodes);

  // Set initial layout to single group.
  groupBubbles();

  d3.selectAll(".badge")
    .on("click",function(){
      filter_badge(this);
      return "";
    });

  d3.selectAll(".color-button")
    .filter(function(d){
      // console.log(this);
      return true;
    })
    .on("click", function(){
      change_color(this);
      return "";
    });

    function handleMouseOverCircle(d){
      var id = d.id;
      this.parentNode.appendChild(this);
      d3.selectAll(".bubble")
        .filter(function(d){
          if(d.id==id){
            return false;
          }
          return true;})
        .transition()
          .style("opacity","0.3");

      tooltip.transition().style("opacity", .9);
      tooltip.html(d.id)
        .style("left", (d3.event.pageX) + "px")
        .style("top", (d3.event.pageY - 28) + "px");
    }

    function handleMouseOutCircle(d){
      tooltip.transition().style("opacity", 0);
      d3.selectAll(".bubble")
        .transition()
          .style("opacity","1");
    }

    function handleClickCircle(){
      console.log("infobox");
      $("#info_box").css("display","initial");

      $("#card_header").html("<a href='https://skl.voteit.se/regionalt-radslag-skane/3-hur-kan-samhallet-bidra-till-att-digitaliseringen-av-skolvasendet-blir-bade'>#jupiter-3</a>" + "<span style=\"float:right;cursor:pointer;\"><button type=\"button\" class=\"close\" aria-label=\"Close\"><span onclick=\"hide_infobox()\" aria-hidden=\"true\">&times;</span></button></span>");
      $("#card_meeting_tree").html("Skåne &rarr; Område 2 &rarr; Fråga 1");
      $("#card_description").text("Kompetens- och resurssäkra den likvärdiga digitala utvecklingen.");

      for(var i = 0; i < i; i++){
        // Create pills.
      }
      var pill_string = "<span class='badge badge-pill badge-primary'>Medel</span>\n<span class='badge badge-pill badge-primary'>Skolverket</span>\n<span class='badge badge-pill badge-primary'>SPSM</span>\n<span class='badge badge-pill badge-primary'>Lärarutbildnignarna</span>\n<span class='badge badge-pill badge-primary'>Huvudman</span>\n";
      $("#pills").html(pill_string);
      $("#card_description").html();
      $("card_activity").text("");
    }
};


function ticked() {
  bubbles
    .attr('cx', function (d) { return d.x; })
    .attr('cy', function (d) { return d.y; });
}

function groupBubbles() {
  // @v4 Reset the 'x' force to draw the bubbles to the center.
  simulation.force('x', d3.forceX().strength(forceStrength).x(center.x));

  // @v4 We can reset the alpha value and restart the simulation
  simulation.alpha(1).restart();
}

function splitBubbles() {
  // showYearTitles();
  show_omrade_titles();

  // @v4 Reset the 'x' force to draw the bubbles to their year centers
  simulation.force('x', d3.forceX().strength(forceStrength).x(omrade_view));

  // @v4 We can reset the alpha value and restart the simulation
  simulation.alpha(1).restart();
}

function omrade_view(d){
  return omradeCenters[d.omrade].x;
}

function moveToCenter(alpha) {
  // console.log(alpha);
  return function (d) {
    d.x = d.x + (center.x - d.x) * damper * alpha;
    d.y = d.y + (center.y - d.y) * damper * alpha;
  };
}


d3.csv('data/almedalen_details.csv', display);

function display(error, data) {
  if (error) {
    console.log(error);
  }
  chart('#vis', data);
}


// UI Stuff

function hide_infobox(){
  $("#info_box").css("display","none");
}


function filter_badge(d){
  var element = $(d);
  var text = element.text();

  if(text.match("Digital Kompetens")){
    
  }

  if(element.hasClass("badge_outline_primary")){
    element.removeClass("badge_outline_primary");
    $(d).addClass("badge-primary");
  } else {
    element.removeClass("badge-primary");
    $(d).addClass("badge_outline_primary");
  }
}



function change_color(d){
  var element = $(d);
  if(!element.hasClass("btn-outline-primary")){
    element.addClass("btn-outline-primary");
  } else {
    element.removeClass("btn-outline-primary");
  }
}

function mote_color(d){
  if(d.question == 0){
    return "#fcdd9e";
  } else if (d.question == 1){
    return "#faab8c";
  } else if (d.question == 2){
    return "#c69897";
  } else if (d.question == 3){
    return "#e18233";
  } else if (d.question == 4){
    return "#9a7b5b";
  } else if (d.question == 5){
    return "#d65219";
  } else {
    return "lightgrey";
  }
}

function show_omrade_titles(){

}
