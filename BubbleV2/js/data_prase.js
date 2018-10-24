// Class for JSON dataparsing & putting all the meetings
// Into the same file in the correct format.


// var data = null;

function parse_file(){

}

function read_list_of_files(){
  d3.csv("/data/names.csv",function(error, data){
    console.log(data);
  });
}
