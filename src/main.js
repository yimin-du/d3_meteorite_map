var width = 1200,
    height = 680;

var projection = d3.geo.patterson()
    .scale(153)
    .translate([width / 2, height / 2])
    .precision(.1);

var path = d3.geo.path()
    .projection(projection);

var graticule = d3.geo.graticule();

var svg = d3.select("#container").append("svg")
    .attr("width", width)
    .attr("height", height);

var colors = ['#5BC0EB', '#FDE74C', '#9BC53D', '#E55934', '#FA7921'];

function getRadius(mass) {
	mass = mass / 10000;
	if(mass === 0)	return 1;
	else if(mass < 5)	return 2;
	else if(mass < 10)	return 5;
	else if(mass < 50)  return 10;
	else if(mass < 100)	return 20;
	else if(mass < 200)	return 30;
	else return 40;

}

function getColor(year) {
	var date1 = new Date(1850, 1, 1);
	var date2 = new Date(1880, 1, 1);
	var date3 = new Date(1930, 1, 1);
	var date4 = new Date(1980, 1, 1);

	var date = new Date(year);
	if(date < date1)	return colors[0];
	else if(date < date2)	return colors[1];
	else if(date < date3)	return colors[2];
	else if(date < date4)	return colors[3];
	else   return colors[4];
}

svg.append("path")
    .datum(graticule)
    .attr("class", "graticule")
    .attr("d", path);

d3.json("https://raw.githubusercontent.com/mbostock/topojson/master/examples/world-50m.json", function(error, world) {
  if (error) throw error;

  svg.insert("path", ".graticule")
      .datum(topojson.feature(world, world.objects.land))
      .attr("class", "land")
      .attr("d", path);

  svg.insert("path", ".graticule")
      .datum(topojson.mesh(world, world.objects.countries, function(a, b) { return a !== b; }))
      .attr("class", "boundary")
      .attr("d", path);

});

d3.json('https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/meteorite-strike-data.json', function(json) {

  const data = json.features;

  svg.append('g')
  .selectAll('path')
    .data(data)
    .enter()
      .append('circle')
      .attr('cx', function(d) { return projection([d.properties.reclong,d.properties.reclat])[0] })
      .attr('cy', function(d) { return projection([d.properties.reclong,d.properties.reclat])[1] })
      .attr('r', function(d) { 
    	return getRadius(d.properties.mass);
      })
      .attr('fill-opacity', function(d) {
        return .5;
      })
      .attr('stroke-width', 1)
      .attr('stroke', '#EAFFD0')
      .attr('fill', function(d) { return getColor(d.properties.year) });


  $('svg circle').tipsy({ 
          gravity: 'w', 
          html: true, 
          title: function() {
            let d = this.__data__;
            console.log(d);
            let msg = 'name: ' + d.properties.name + '<br>'
            		 +'mass: ' + d.properties.mass + '<br>'
            		 +'year: ' + d.properties.year + '<br>'
            		 +'fall: ' + d.properties.fall + '<br>'
            		 +'recclass: ' + d.properties.recclass + '<br>'
            		 +'nametype :' + d.properties.nametype + '<br>'

            return '<span>' + msg + '</span>'; 
          }
        });


});


  

d3.select(self.frameElement).style("height", height + "px");

