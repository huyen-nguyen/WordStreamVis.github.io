// pre-defined size
var initWidth = 800,
    initHeight = 800,
    initMinFont = 12,
    initMaxFont = 50,
    initFlag = "none";

var globalWidth = initWidth,
    globalHeight = initHeight,
    globalMinFont = initMinFont,
    globalMaxFont = initMaxFont,
    globalFlag = initFlag,
    topRank
;

var axis = d3.svg.axis().ticks(4);
var axisFont = d3.svg.axis().tickValues([0,25,50,75,100]);
// var verticalAxis = d3.svg.axis().orient("left").ticks(5);
function testJS(){
    console.log("Mouse test JS");
}
function testJQuery(){
    console.log("Mouse test Jquery");
}

d3.select('#widthSlider').call(d3.slider()
    .axis(axis)
    .value([0,initWidth])
    .min(0)
    .max(2000)
    .step(20)
    .on("slide", function (evt, value) {
    d3.select('#widthText').text(value[1]);
}))
;
d3.select('#heightSlider').call(d3.slider()
    .axis(axis)
    .value([0,initHeight])
    .min(0)
    .max(2000)
    .step(20)
    .on("slide", function (evt, value) {
        d3.select('#heightText').text(value[1]);
    }))
;
d3.select('#fontSlider').call(d3.slider().axis(axisFont).value([initMinFont, initMaxFont]).on("slide", function (evt, value) {
    d3.select('#fontMin').text(value[0].toFixed(0));
    d3.select('#fontMax').text(value[1].toFixed(0));
}));


var metricName = [["Importance value (tf-idf ratio) "],["Compactness "],["All Words Area/Stream Area"],["Weighted Display Rate"],["Average Normalized Frequency "]];

var metric = d3.select("body").append("svg")
    .attr("width",360)
    .attr("height", 250)
    .attr("class","metricSVG")
    .attr("id","metricSVG");

metric.append("text").attr("y", 15).attr("font-weight",600).text("Metrics");

d3.select("body")
    // .append("div")
    .append("table")
    .attr("class","metTable")
    .style("border-collapse", "collapse")
    .style("border", "2px black solid")

    .selectAll("tr")
    .data(metricName)
    .enter().append("tr")

    .selectAll("td")
    .data(function(d){return d;})
    .enter().append("td")
    .style("border", "1px black solid")
    .style("padding", "10px")
    .on("mouseover", function(){d3.select(this).style("background-color", "aliceblue")})
    .on("mouseout", function(){d3.select(this).style("background-color", "white")})
    .text(function(d){return d;})
    .style("font-size", "13px");

var metric2 = d3.select("body").append("svg")
    .attr("width",100)
    .attr("height", 300)
    .attr("class","metricSVG2")
    .attr("id","metricSVG2");

// draw line
var frontier = d3.select("#cp").append("line")
    .attr("id","frontier")
    .attr("x1", 170)
    .attr("x2", 170)
    .attr("y1", 300)
    .attr("y2", 350)
    .attr("class","frontier");


function updateTopRank(){

    d3.select(".holderCP").append("span")
        .attr("id","topRankText")
        .attr("class","topRankText topRank textSlider");

    d3.select(".holderCP").append("div")
        .attr("id","topRankSlider")
        .attr("class","topRankAxis topRank slider");

    d3.select("#topRankText").text(topRank);

    d3.select('#topRankSlider').call(d3.slider()
        .axis(axis)
        .value([0,topRank])
        .min(0)
        .max(300)
        .step(5)
        .on("slide", function (evt, value) {
            d3.select('#topRankText').text(value[1]);
        }))
        // .on("mouseup", submitInput())
    ;
}
function loadNewPage()
{
    $(document).ready(function() {
        $('.switch-input').on('change', function() {
            var isChecked = $(this).is(':checked');
            var selectedData;
            var $switchLabel = $('.switch-label');
            console.log('isChecked: ' + isChecked);

            if(isChecked) {
                selectedData = $switchLabel.attr('data-yes');
            } else {
                selectedData = $switchLabel.attr('data-no');
            }
            console.log('Selected data: ' + selectedData);
        });
    });
}
function submitInput(){
    globalWidth = parseInt(document.getElementById("widthText").innerText);
    globalHeight = parseInt(document.getElementById("heightText").innerText);
    globalMinFont = parseInt(document.getElementById("fontMin").innerText);
    globalMaxFont = parseInt(document.getElementById("fontMax").innerText);
    topRank = parseInt(document.getElementById("topRankText").innerText);
    var isFlow = document.getElementById("flow").checked;
    var isAv = document.getElementById("av").checked;
    if (isFlow && isAv){
        console.log("Flow and Av");
        globalFlag = "fa";
    }
    else if (isFlow && !isAv) {
        console.log("Just Flow");
        globalFlag = "f";}

    else if (!isFlow && isAv){
        console.log("Just AV");
        globalFlag = "a";}

    else if (!isFlow && !isAv){
        console.log("None");
        globalFlag = "none"}

    loadNewLayout();
}

function loadNewLayout(){
    svg.selectAll("*").remove();
    // svg2.selectAll("*").remove();
    // svg3.selectAll("*").remove();
    fileName = fileName.slice(0, -4).slice(5);
    updateLoadData();

}
function updateLoadData(){

    fileName = "data/"+fileName+".tsv"; // Add data folder path
    if (fileName.indexOf("Cards_Fries")>=0){
        categories = ["increases_activity", "decreases_activity"];
        loadAuthorData(updateDraw, topRank200()
        );

    }
    else if (fileName.indexOf("Cards_PC")>=0){
        categories = ["adds_modification", "removes_modification", "increases","decreases", "binds", "translocation"];
        loadAuthorData(updateDraw, topRank200()

        );

    }
    else if (fileName.indexOf("PopCha")>=0){
        categories = ["Comedy","Drama","Action", "Fantasy", "Horror"];
        loadAuthorData(updateDraw, topRank200()
        );

    }
    else if (fileName.indexOf("IMDB")>=0){
        categories = ["Comedy","Drama","Action", "Family"];
        loadAuthorData(updateDraw, topRank45()

        );

    }
    else if (fileName.indexOf("VIS")>=0){
        categories = ["Vis","VAST","InfoVis","SciVis"];
        loadAuthorData(updateDraw, topRank45()

        );

    }
    else{
        categories = ["person","location","organization","miscellaneous"];
        loadBlogPostData(updateDraw, topRank45()
        );

    }
}
function updateDraw(data){
    // prepare data
    var width = globalWidth  ;
    var height = globalHeight;
    var interpolation = "cardinal";
    var font = "Arial";
    var ws = d3.layout.wordStream()
        .size([width, height])
        .interpolate(interpolation)
        .fontScale(d3.scale.linear())
        .minFontSize(globalMinFont)
        .maxFontSize(globalMaxFont)
        .data(data)
        .font(font)
        .flag(globalFlag);

    var boxes = ws.boxes(),     // initial boxes
        minFreq = ws.minFreq(),
        maxFreq = ws.maxFreq();

}

// d3.select("#heightSlider")
//     .attr("id","test")
//     .call(d3.slider()
//     .axis(verticalAxis)
//     .value(800)
//     .min(600)
//     .max(1200)
//     .step(100)
//     .orientation("vertical")
//     .on("slide", function (evt, value) {
//         d3.select('#heightText').text(value);
//     }))
// ;

// metric.selectAll("rect")
//     .data(metricLine)
//     .enter()
//     .append("rect")
//     .attr("id", "metric" + function(d){
//         return d
//     })
//     .attr("class",".metricRect")
//     .attr("x","20")
//     .attr("y",(d,i) => 50*i+40)
//     .attr("rx","5")
//     .attr("ry","5")
//     .attr("width","320")
//     .attr("height","36")
//     .style("fill","#eeeeee")
//     .attr("stroke","#8f8f8f");

// metric.selectAll(".metricText")
//     .data(metricName)
//     .enter()
//     .append("text")
//     .text(d => d)
//     .attr("class","metricDisplay")
//     .attr("x","33")
//     .attr("y",(d,i) =>i*50);