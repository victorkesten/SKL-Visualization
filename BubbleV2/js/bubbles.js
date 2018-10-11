var width = 960;
var height = 540;

//https://bl.ocks.org/iamkevinv/0a24e9126cd2fa6b283c6f2d774b69a2
// Zoom Function
var zoom = d3.zoom()
    .scaleExtent([.5, 8])
    .on("zoom", zoomed);

var svg = d3.select("svg")
          .attr("width",width)
          .attr("height",height);

var g = svg.append("g");
var g_sec = g.append("g");
            // .call(zoom);
// svg.append("rect")
//     .attr("class", "background")
//     .attr("width", width)
//     .attr("height", height);
    // .on("click", reset);

var meeting_data = {};

var format = d3.format(",d");

var selected_color_scheme = 0;

var color = d3.scaleOrdinal(d3.schemeCategory20c);
var currentl_selected_circle = null;
var calculated_bubbles = [1,0,0,0];

var view_option = 0;

svg.call(zoom);

function zoomed() {
  // g.style("stroke-width", 1.5 / d3.event.transform.k + "px");
  // g.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")"); // not in d3 v4
  g.attr("transform", d3.event.transform); // updated for d3 v4
}


function change_view(option){
  $("#view_"+option).addClass("active");
  $("#view_"+view_option).removeClass("active");
  view_option = option;

  hide_bubbles();
}

///////////////////////////////////////
var sections_on_screen = 3;
var split = [0,200,400];

function omrade_view(){
  prepare_json(0);
  prepare_json(1);
  prepare_json(2);

}

function hide_bubbles(){
  g.selectAll
}

function prepare_json(option){
  var pack = d3.pack()
      .size([width/sections_on_screen, height/sections_on_screen])
      .padding(1.5);

  d3.csv("/BubbleV2/data/almedalen.csv", function(error,data){
    if(error) throw error;
    var root = create_hierarchy(data,option)
    // console.log(root);

    var section = g_sec.attr("class","view-omrade").append("g")
      .attr("class","section_"+option)
      .attr("transform","translate("+split[option]+","+50+")");

    var node = section.selectAll(".node")
      .data(pack(root).leaves())
      // .data(root)
      .enter().append("g")
        .attr("class", "node")
        .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });

    node.append("circle")
        .attr("id", function(d) { return d.id; })
        .attr("r", function(d) { return d.r; })
        .on("mouseover", handleMouseOverCircle)
        .on("mouseout", handleMouseOutCircle)
        .on("click", handleClickCircle)
        .style("stroke","black")
        .style("fill", function(d) { return mote_color(d);return color(d.package); });

    node.append("clipPath")
        .attr("id", function(d) { return "clip-" + d.id; })
      .append("use")
        .attr("xlink:href", function(d) { return "#" + d.id; });


    function handleMouseOverCircle(){

      // $(this).css("fill","black");
      // $(this).css("stroke","#5c5b97");

      // console.log(this.id);
    }

    function handleMouseOutCircle(){
      // $(this).css("stroke","");

    }

    function handleClickCircle(){
      // redraw_circles();
      // var c = this;
      console.log(this.id);

      // d3.select(this)
      //   .style("border","2px solid #ccc");
    }
  });

  // return
}
function create_hierarchy(data,option){

  // var current_view = 0;
  // console.log(data);
  var new_data = data_order(data,option);

  return d3.hierarchy({children : new_data})
      .sum(function(d) { return d.value; })
      .each(function(d) {
        if (id = d.data.id) {
            var id, i = id.lastIndexOf(".");
            d.id = id;
            d.package = id.slice(0, i);
            d.class = id.slice(i + 1);
        }
      });
}

function data_order(data,option){
  var new_data = [];
  var match_string = "";
  if(option == 0){
    match_string = ".*område1.*";
  } else if (option == 1){
    match_string = ".*område2.*";
  } else if (option == 2){
    match_string = ".*område3.*";
  } else {
    return data;
  }

  for(var i = 0; i < data.length; i++){
    var identifier = data[i].id;
    if(identifier.match(match_string)){
      new_data.push(data[i]);
    }
  }

  return new_data;
}

function mote_color(d){
  if(d.package.match(".+område1.*fråga1.*")){
    return "red";
  } else if (d.package.match(".+område1.*fråga2.*")){
    return "green";
  } else if (d.package.match(".+område2.*fråga1.*")){
    return "blue";
  } else if (d.package.match(".+område2.*fråga2.*")){
    return "yellow";
  } else if (d.package.match(".+område3.*fråga1.*")){
    return "pink";
  } else if (d.package.match(".+område3.*fråga2.*")){
    return "orange";
  } else {
    return "black";
  }
  // return "white;"
}
///////////////////////////////////////

function read_meeting_data(){

  d3.csv("/BubbleV2/data/almedalen_details.csv", function(error,data){
    if (error) throw error;
    console.log(data);
    // meeting_data.push();
    for (var i = 0; i < data.length; i++){
      var t = data[i].tag;
      meeting_data[t] = data[i];
    }
  });
}
