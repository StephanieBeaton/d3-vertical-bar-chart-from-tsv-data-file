// var employees = [
//   {dept: 'A', age : 22},
//   {dept: 'B', age : 26},
//   {dept: 'C', age : 35},
//   {dept: 'D', age : 30},
//   {dept: 'E', age : 27}
// ];

var sales = [
  {salesgroup: 'Gary Larson', salestotal : 120},
  {salesgroup: 'Cook', salestotal : 68},
  {salesgroup: 'Harris', salestotal : 58},
  {salesgroup: 'Maricopa', salestotal : 52},
  {salesgroup: 'Orange', salestotal : 45},
  {salesgroup: 'Jefferson', salestotal : 40},
  {salesgroup: 'Clark', salestotal : 40},
  {salesgroup: 'Washington', salestotal : 39},
  {salesgroup: 'Dallas', salestotal : 38},
  {salesgroup: 'San Diego County', salestotal : 35},
  {salesgroup: 'Wayne', salestotal : 33},
  {salesgroup: 'Middlesex', salestotal : 32},
  {salesgroup: 'Santa Clara', salestotal : 31},
  {salesgroup: 'Suffolk', salestotal : 28},
  {salesgroup: 'Jackson', salestotal : 28},
  {salesgroup: 'San Bernardino', salestotal : 28}
];


var svgHeight = 400;
var svgWidth = 1000;
var maxSalesTotal = 120; // You can also compute this from the data
var barSpacing = 1; // The amount of space you want to keep between the bars
var padding = {
    left: 20, right: 0,
    top: 20, bottom: 20
};

function animateBarsUp() {

  function type(d) {
    d.salestotal = +d.salestotal; // coerce to number
    return d;
  }

  var maxWidth = svgWidth - padding.left - padding.right;
  var maxHeight = svgHeight - padding.top - padding.bottom;

  // Define your conversion functions
  var convert = {
    x: d3.scale.ordinal(),
    y: d3.scale.linear()
  };

  // Define your axis
  var axis = {
    x: d3.svg.axis().orient('bottom'),
    y: d3.svg.axis().orient('left')
  };

  // Define the conversion function for the axis points
  axis.x.scale(convert.x);
  axis.y.scale(convert.y);

  // Define the output range of your conversion functions
  convert.y.range([maxHeight, 0]);
  convert.x.rangeRoundBands([0, maxWidth]);

  // this should be an async  Ajax GET Request
  d3.tsv("../salesdata.tsv", type, function(error, sales) {


      // Once you get your data, compute the domains
      convert.x.domain(sales.map(function (d) {
          return d.salesgroup;
        })
      );
      convert.y.domain([0, maxSalesTotal]);

      // Setup the markup for your SVG
      var svg = d3.select('.chart')
        .attr({
            width: svgWidth,
            height: svgHeight
        });

      // The group node that will contain all the other nodes
      // that render your chart
      var chart = svg.append('g')
        .attr({
            transform: function (d, i) {
              return 'translate(' + padding.left + ',' + padding.top + ')';
            }
          });

      chart.append('g') // Container for the axis
        .attr({
          class: 'x axis',
          transform: 'translate(0,' + maxHeight + ')'
        })
        .call(axis.x); // Insert an axis inside this node

      chart.append('g') // Container for the axis
        .attr({
          class: 'y axis',
          height: maxHeight
        })
        .call(axis.y); // Insert an axis inside this node

      var bars = chart
        .selectAll('g.bar-group')
        .data(sales)
        .enter()
        .append('g') // Container for the each bar
        .attr({
          transform: function (d, i) {
            return 'translate(' + convert.x(d.salesgroup) + ', 0)';
          },
          class: 'bar-group'
        });

      bars.append('rect')
            .attr({
            y: maxHeight,
            height: 0,
            width: function(d) {return convert.x.rangeBand(d) - 1;},
            class: 'bar'
        })
        .transition()
        .duration(1500)
        .attr({
          y: function (d, i) {
            return convert.y(d.salestotal);
          },
          height: function (d, i) {
            return maxHeight - convert.y(d.salestotal);
          }
        });

      return chart;
    });    // end of d3.tsv( )
}

animateBarsUp();
