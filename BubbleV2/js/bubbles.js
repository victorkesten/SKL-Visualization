var width = 960;
var height = 540;

//https://bl.ocks.org/iamkevinv/0a24e9126cd2fa6b283c6f2d774b69a2
// Zoom Function
var zoom = d3.zoom()
    // .scaleExtent([.5, 8])
    .scaleExtent([.2, 20])

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

var omrade_titles = ["Digtal Kompetens","Likvärdig Tillgång och Användning","Forskning och Uppföljning", "Annat"];

var meeting_data = {};

var format = d3.format(",d");

// Define the div for the tooltip
var tooltip = d3.select("body").append("div")
    .attr("class", "tooltip_bubble")
    .style("opacity", 0);

var selected_color_scheme = 0;

var color = d3.scaleOrdinal(d3.schemeCategory20c);
var currentl_selected_circle = null;
var calculated_bubbles = [1,0,0,0];

var view_option = 0;
var prepared = [0,0,0];

svg.call(zoom);

function zoomed() {
  // g.style("stroke-width", 1.5 / d3.event.transform.k + "px");
  // g.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")"); // not in d3 v4
  g.attr("transform", d3.event.transform); // updated for d3 v4
}


function change_view(option){
  $("#view_"+option).addClass("active");
  $("#view_"+view_option).removeClass("active");

  if(option==0){
    oversikt_view();
  } else if (option == 1){
    omrade_view();
  }
  // hide_bubbles();
}

///////////////////////////////////////
var sections_on_screen = 1;
var split = [0,200,400];

function omrade_view(){
  var old_view = view_option;
  sections_on_screen = 3;
  view_option = 1;
  if(prepared[view_option] == 0){
    prepare_json(0);
    prepare_json(1);
    prepare_json(2);
    prepared[view_option] = 1;
  }
    $(".view-omrade-"+old_view).css("display","none");
    $(".view-omrade-"+view_option).css("display","initial");

}

function oversikt_view(){
  var old_view = view_option;
  view_option = 0;
  sections_on_screen = 1;
  if(prepared[view_option] == 0){
    prepare_json(0);
    prepared[view_option] = 1;
  }
    $(".view-omrade-"+old_view).css("display","none");
    $(".view-omrade-"+view_option).css("display","initial");

}

function hide_bubbles(){
  g.selectAll
}

function prepare_json(option){
  var pack = d3.pack()
      .size([width/sections_on_screen, height/sections_on_screen]);
      // .padding(1.5);

  d3.csv("data/almedalen.csv", function(error,data){
    if(error) throw error;
    var root = create_hierarchy(data,option)
    // console.log(root);
//g_sec.attr
    var section = g.append('g').attr("class","view-omrade-"+view_option).append("g")
      .attr("class","section_"+option)
      .attr("transform","translate("+split[option]+","+50+")")
      // .append("text");
      section.append("text")
        // .attr("text-align","center")
        // .attr("font-family", "sans-serif")
        .attr("font-size", "12px")
        .attr("x","160px")
        .attr("font-weight","bold")
        .text(function(){
          if(view_option == 1){
            return omrade_titles[option];
          }
            return "";
        });

    // g_sec.append("text")
      // .attr("")

      d3.selectAll(".badge")
        .on("click",function(){
          filter_badge(this);
          return "";
        });

      d3.selectAll(".color-button")
        .filter(function(d){
          console.log(this);
          return true;
        })
        .on("click", function(){
          change_color(this);
          return "";
        });

    var node = section.selectAll(".node")
      .data(pack(root).leaves())
      // .data(root)
      .enter().append("g")
        .attr("class", "node")
        // .attr("z-index","5")
        .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });

    node.append("circle")
        .attr("id", function(d) { return d.id })
        .attr("r", function(d) { return d.r; })
        .on("mouseover", handleMouseOverCircle)
        .on("mouseout", handleMouseOutCircle)
        .on("click", handleClickCircle)
        .style("stroke","black")
        .style("fill", function(d) {
          if(view_option == 1){
            return mote_color(d);
          }
          return color(d.package);
        });

    // node.append("clipPath")
        // .attr("id", function(d) { return "clip-" + d.id; });
      // .append("use")
        // .attr("xlink:href", function(d) { return "#" + d.id; });


    function handleMouseOverCircle(d){
      // console.log(d3.select(this));
      // console.log(d);
      var id = this.id;
      // d3.select(this)
        // .append("circle")
        // .style("fill","black");
      // $(this).css("fill","black");
      // $(this).css("stroke","#5c5b97");


      d3.selectAll(".node")
        .filter(function(d){
          //http://bl.ocks.org/eesur/4e0a69d57d3bfc8a82c2
          if(d.id==id){
            this.parentNode.appendChild(this);
            return false;}
          return true;})
        .transition()
          .style("opacity","0.3");

      tooltip.transition().style("opacity", .9);
      // console.log(d);
      tooltip.html(d.id)
        .style("left", (d3.event.pageX) + "px")
        .style("top", (d3.event.pageY - 28) + "px");

      d3.select(this)
        .transition()
          .attr("r", function(d){
            return d.r+3;
          });
    }

    function handleMouseOutCircle(){
      // $(this).css("stroke","");
      // $(this).css("fill","white");
      d3.select(this)
        .transition()
          .attr("r", function(d){
            console.log(d);
            // var radius = d.r;
            return d.r;
          });
      tooltip.transition().style("opacity", 0);

      d3.selectAll(".node")
        .transition()
          .style("opacity","1");
    }

    function handleClickCircle(){
      // redraw_circles();
      // var c = this;
      // console.log(this.id);
      // var infobox = $("#infobox");
      console.log("infobox");
      // $("#info_box")
      // d3.select("#info_box")
        // .style("display","initial");
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
  if(view_option == 1){
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
  } else if (view_option == 0){
    new_data = data;
  }
  return new_data;
}

function mote_color(d){
  if(d.package.match(".+område1.*fråga1.*")){
    return "#fcdd9e";
  } else if (d.package.match(".+område1.*fråga2.*")){
    return "#faab8c";
  } else if (d.package.match(".+område2.*fråga1.*")){
    return "#c69897";
  } else if (d.package.match(".+område2.*fråga2.*")){
    return "#e18233";
  } else if (d.package.match(".+område3.*fråga1.*")){
    return "#9a7b5b";
  } else if (d.package.match(".+område3.*fråga2.*")){
    return "#d65219";
  } else {
    return "black";
  }
  // return "white;"
}
///////////////////////////////////////

function hide_infobox(){
  $("#info_box").css("display","none");
}

function read_meeting_data(){

  d3.csv("data/almedalen_details.csv", function(d){
    meeting_data[d.tag] = d;
    return d;
  }, function(error,data){
    if (error) throw error;
    console.log(data);
  });
}
//
function filter_badge(d){
  // console.log(meeting_data);
  // console.log(meeting_data["#daniel_broman_1"])
  // console.log("hey");
  // console.log(d);
  var element = $(d);
  if(element.hasClass("badge_outline_primary")){
    element.removeClass("badge_outline_primary");
  } else {
    $(d).addClass("badge_outline_primary");
  }


  // console.log(d);
  // d3.select(d)
    // .attr("class","badge badge-pill badge_outline_primary");
}

function change_color(d){


  var element = $(d);
  if(!element.hasClass("btn-outline-primary")){
    element.addClass("btn-outline-primary");
  } else {
    element.removeClass("btn-outline-primary");

  }
}
