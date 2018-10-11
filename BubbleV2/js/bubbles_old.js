function redraw_circles(removed){

}

function create_bubbles(){
  // svg.call(zoom);

  d3.csv("/BubbleV2/data/learning.csv", function(d) {
    // Check to see if the bubble has a value > 0
    // If not, we don't add it.
    d.value = +d.value;
    if (d.value) return d;
  }, function(error, data) {
    if (error) throw error;

    var root = create_node_hierarchy();
    // console.log(root.descendants());
    // console.log(root.links());
    console.log(root);


    // console.log(pack(root).leaves());
    var node = g.selectAll(".node")
      .data(pack(root).leaves())
      // .data(root)
      .enter().append("g")
        .attr("class", "node")
        .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });

    node.append("circle")
        .attr("id", function(d) { return d.id; })
        .attr("r", function(d) { return d.r; })
        // .attr("border", "5px solid red")
        // .attr()
        .on("mouseover", handleMouseOverCircle)
        .on("mouseout", handleMouseOutCircle)
        .on("click", handleClickCircle)
        .style("stroke","grey")
        .style("fill", function(d) { return area_colors(d); });

    node.append("clipPath")
        .attr("id", function(d) { return "clip-" + d.id; })
      .append("use")
        .attr("xlink:href", function(d) { return "#" + d.id; });

    node.append("text")
        .attr("clip-path", function(d) { return "url(#clip-" + d.id + ")"; })
      .selectAll("tspan")
      .data(function(d) { return d.class.split(/(?=[A-Z][^A-Z])/g); })
      .enter().append("tspan")
        .attr("x", 0)
        .attr("y", function(d, i, nodes) { return 13 + (i - nodes.length / 2 - 0.5) * 10; });
        // .text(function(d) { return d; });

    node.append("title")
        .text(function(d) { return d.id + "\n" + format(d.value); });
    // svg.call(zoom);

    function handleMouseOverCircle(){

      // $(this).css("fill","black");
      $(this).css("stroke","#5c5b97");

      // console.log(this.id);
    }

    function handleMouseOutCircle(){
      $(this).css("stroke","");

    }

    function handleClickCircle(){
      // redraw_circles();
      var c = this;
      console.log(this);
      d3.select(this)
        .style("border","2px solid #ccc");
    }

    function area_colors(d){
      if(selected_color_scheme == 1){
        if(d.package.match(".+område1.*")){
          return "red";
        } else if (d.package.match(".+område2.*")){
          return "green";
        } else if (d.package.match(".+område3.*")){
          return "blue";
        } else {
          return "black";
        }
      } else if (selected_color_scheme == 2){
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
      }
      return color(d.package);
    }

   function create_node_hierarchy(){
     var current_view = 0;
     console.log(data);
     return d3.hierarchy({children : data})
         .sum(function(d) { return d.value; })
         .each(function(d) {
           if (id = d.data.id) {
             var id, i = id.lastIndexOf(".");
             d.id = id;
             d.package = id.slice(0, i);
             d.class = id.slice(i + 1);
           }
         });
           // .sort(function(d){
           //   return d.value;
           // });
   }
  });
}
