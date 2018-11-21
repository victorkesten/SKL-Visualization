
var vis_data = {};
var nodes_ = [];
var node_id_changes = [];
var links_ = [];
var node_s;

var selected_node = -1;
var previous_node = null;

var nodes_list_div = d3.select(".nodes_list")
      .append("div")
      .classed("node_entries", true)
      .attr("id", "node_entries");

var node_entries;
function start_program(){
  var q = queue();
  q.defer(d3.json,'/handlingsplan/data/grupper.json');
  // load_current_node_system();
  q.awaitAll(function(error,data_list) {
    if (error) throw error;
    vis_data = data_list[0];
    nodes_ = data_list[0].nodes;
    links_ = data_list[0].links;

    // console.log(nodes_);
    show_nodes_list();
    make_sankey();
  });
}


function submit_node(){
  // console.log(nodes_);
  var name = $('#create_node_name').val();
  var content = $('#create_node_content').val();

  create_new_node(name,content,nodes_.length);
}

function create_node(){
  //Make input box appear.
  //Call create_new_node;
}

// Create a new node
// A node is a piece of information under a section
function create_new_node(name,content,id){
  var obj = {};
  obj.name = name;
  obj.content = content;
  obj.id = "test_"+id;
  obj.target_source = nodes_.length;

  nodes_.push(obj);
  update_nodes_list();
}

function remove_node(){
  if(selected_node != -1){
    remove_node_id(selected_node);
  }
}

//removes a node that you have created.
function remove_node_id(id){
  // Recalculate all the IDs for nodes.
  // Recalculate all the new IDs for this ID i nlinks.
  // if(id <= 12){
  //   alert('You cannot delete this node. It is part of the core structure');
  //   return;
  // }
  nodes_.splice(id,1);
  destroy_all_connections(id);
  recalculate_node_ids();
  destroy_all_connections(id);
  recalculate_node_links();
  update_nodes_list();
}

function recalculate_node_ids(){
  for(var i = 0; i < nodes_.length; i++){
    var obj = {};
    obj.old = nodes_[i].target_source;
    obj.new = i;
    nodes_[i].target_source = i;
    node_id_changes.push(obj);
  }
}

function recalculate_node_links(){
  for(var i = 0; i < links_.length; i++){
    var link = links_[i];
    for(var j= 0; j < node_id_changes.length; j++){
      var old = node_id_changes[j].old;
      if(old == link.source){
        links_[i].source = node_id_changes[j].new;
      }
      if(old == link.target){
        links_[i].target = node_id_changes[j].new;
      }
    }
  }
}

// Creates a connection between two nodes.
function create_connections(){

}

function destroy_all_connections(id){
  for(var i = 0; i < links_.length; i++){
    var link = links_[i];
    if(link.source == id || link.target == id){
      links_.splice(i,1);
    }
  }
}

// Destroys a created connection
function destroy_connection(){

}

function show_nodes_list(){
  node_s = nodes_list_div.selectAll('.node_entries')
    .data(nodes_, function(d){return d.target_source})
    .enter()
    .append('a')
    .classed('node_entry',true)
    .html(function(d){return d.target_source + " | " + d.name + "<br>"})
    .on('click',function(d){
      d3.select(previous_node).style('color','black');
      previous_node = this;
      // selected_node = d.id;
      selected_node = d.target_source;
      d3.select(this).style('color','red');
    });
}

function update_nodes_list(){
  $(".node_entries").empty();
  show_nodes_list();
  var fin = {
    "nodes" : nodes_,
    "links" : links_
  };
  update_sankey(nodes_,links_);
}

// Prints the new JSON file on screen.
function print_new_json(){
  var fin = {
    "nodes" : nodes_,
    "links" : links_
  };
  $(".texta").text(JSON.stringify(fin));
}


start_program();
