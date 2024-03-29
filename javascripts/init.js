const initWidth = 1500,
    initHeight = 520,
    initMinFont = 14,
    initMaxFont = 36,
    initFlag = "none";// none / fa/ f / a

let initTop = 15;

let globalWidth = initWidth,
    globalHeight = initHeight,
    globalMinFont = initMinFont,
    globalMaxFont = initMaxFont,
    globalFlag = initFlag,
    globalTop = initTop,
    globalData;

let allW;

let mainGroup, axisGroup, xGridlinesGroup, opacScale, legendGroup, opacity, layerPath, maxFreq;

const color = d3.scale.category10();
const axis = d3.svg.axis().ticks(4);
const axisFont = d3.svg.axis().tickValues([0, 25, 50, 75, 100]);

d3.select('#widthSlider').call(d3.slider()
    .axis(axis)
    .value([0, initWidth])
    .min(0)
    .max(maxWidth)
    .step(20)
    .on("slide", function (evt, value) {
        d3.select('#widthText').text(value[1]);
    }))
;
d3.select('#heightSlider').call(d3.slider()
    .axis(axis)
    .value([0, initHeight])
    .min(0)
    .max(maxHeight)
    .step(20)
    .on("slide", function (evt, value) {
        d3.select('#heightText').text(value[1]);
    }))
;
d3.select('#fontSlider').call(d3.slider().axis(axisFont).value([initMinFont, initMaxFont]).on("slide", function (evt, value) {
    d3.select('#fontMin').text(value[0].toFixed(0));
    d3.select('#fontMax').text(value[1].toFixed(0));
}));

d3.select('#topRankSlider').call(d3.slider()
    .axis(axis)
    .value([0, initTop])
    .min(0)
    .max(maxTop)
    .step(5)
    .on("slide", function (evt, value) {
        d3.select('#topRankText').text(value[1]);
    }))
;
const metricName = [["Importance value (tf-idf ratio) "],["Compactness "],["All Words Area/Stream Area"],
    ["Weighted Display Rate"],["Average Normalized Frequency "]];

let metric = d3.select("body").append("svg")
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
    .text(function(d){return d;})
    .style("font-size", "13px");

let metric2 = d3.select("body").append("svg")
    .attr("width",100)
    .attr("height", 300)
    .attr("class","metricSVG2")
    .attr("id","metricSVG2");