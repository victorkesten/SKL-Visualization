var width = 1000;


var testData = [
  {times: [{"starting_time": 1355752800000, "ending_time": 1355759900000, "label" : "Alemdalen"}]},
  {times: [{"starting_time": 1355759910000, "ending_time": 1355761900000, "label" : "Forskare"}]},
  {times: [{"starting_time": 1355761910000, "ending_time": 1355763910000, "label" : "Skåne"}]}
];

function timelineCircle() {
  console.log(Math.round(new Date(2018,7,1,0,0,0,0)));
  testData[0].times[0].starting_time = Math.round(new Date(2018,6,1,0,0,0,0).getTime());
  testData[0].times[0].ending_time = Math.round(new Date(2018,6,1,0,0,0,0).getTime());
  testData[1].times[0].starting_time = Math.round(new Date(2018,8,20,0,0,0,0).getTime());
  testData[1].times[0].ending_time = Math.round(new Date(2018,8,20,0,0,0,0).getTime());
  testData[2].times[0].starting_time = Math.round(new Date(2018,8,21,0,0,0,0).getTime());
  testData[2].times[0].ending_time = Math.round(new Date(2018,8,21,0,0,0,0).getTime());

  var chart = d3.timeline()
    .tickFormat( //
      {format: d3.time.format("%I %p"),
      tickTime: d3.time.day,
      tickInterval: 50,
      tickSize: 50})
      .click(function (d, i, datum) {
        window.location.href = "/samples/almedalen.html";
      })
      .hover(handleMouseOver)
    .display("circle"); // toggle between rectangles and circles

  var svg = d3.select("#timeline").append("svg").attr("width", width)
    .datum(testData).call(chart);
}

function timeline_create(){
  console.log("Works");
  timelineCircle();
}


function handleMouseOver(d, i) {  // Add interactivity
  console.log(d);
    $(".my_text").text(new Date(d.starting_time));
  }
