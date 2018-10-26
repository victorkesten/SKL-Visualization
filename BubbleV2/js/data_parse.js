// Class for JSON dataparsing & putting all the meetings
// Into the same file in the correct format.


function delayedHello(callback) {
  setTimeout(function() {
    console.log("Hello!");
    callback(null);
  }, 250);
}

//https://bl.ocks.org/mbostock/1696080
//https://github.com/d3/d3-queue
function parse_file(){

  var q = d3.queue();
  q.defer(delayedHello);
  // q.defer(d3.text,'list_of_files');
  // q.wait for finish.
  // Process this text into al ist of files

  // For loop that iterates and creates new 'defer' items for each filename
  // Then we do awaitAll
  // Process that data into a data json variables
  // And then starT_program with that data.
  //
  q.defer(d3.json, 'data/gotland.json')

  // First we read

  q.awaitAll(function(error, data_list){
    if(error) throw error;
    // console.log(data_list[1]);
    // var fin_d = process_data(data_list[1]);
    process_data(data_list[1]);
    // console.log('goodbye');
    start_program();
  });
}

// Need 1 list for all Meeting Information
// Contains meeting objects
var meeting_information = [];
// 1 list for ALL proposals as per how it will be treated.
// List of proposal objects.
var meeting_data = [];
//
//

function process_data(data){
  add_meeting(data);
  add_proposals(data);
}

function add_meeting(data){
  var d = {};
  console.log(data);
  
  meeting_information.push(d);
}

function add_proposals(data){

}

function read_list_of_files(){
  d3.csv("data/names.csv",function(error, data){
    console.log(data);
  });
}
