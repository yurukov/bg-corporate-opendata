d3.csv("/business/data/changes_stats.csv", function(error, data) {

	var margin = {top: 20, right: 20, bottom: 60, left: 40},
		width = 900 - margin.left - margin.right,
		height = 500 - margin.top - margin.bottom;

	var x = d3.scale.ordinal()
		.rangeRoundBands([0, width], .1);

	var y = d3.scale.linear()
		.rangeRound([height, 0]);

	var color = d3.scale.ordinal().range(["#ff8c00", "#d0743c", "#a05d56"]);

	var xAxis = d3.svg.axis()
		.scale(x)
		.orient("bottom");

	var yAxis = d3.svg.axis()
		.scale(y)
		.orient("left")
		.tickFormat(d3.format(".2s"));

	var svg = d3.select("#date-graph").append("svg")
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom)
		.append("g")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	temp = d3.keys(data[0]);
	temp.reverse();
	color.domain(temp.filter(function(key) { return key !== "Дата"; }));
	data.slice(-50);

	data.forEach(function(d) {
		var y0 = 0;
		d["Дата"] = d["Дата"].substring(6,8)+"."+d["Дата"].substring(4,6)+"."+d["Дата"].substring(0,4);
		d.changes = color.domain().map(function(name) { return {name: name, y0: y0, y1: y0 += +d[name]}; });
		d.total = d.changes[d.changes.length - 1].y1;
	});

	x.domain(data.map(function(d) { return d["Дата"]; }));
	y.domain([0, d3.max(data, function(d) { return d.total; })]);

	svg.append("g")
		.attr("class", "x axis")
		.attr("transform", "translate(0," + height + ")")
		.call(xAxis)
		.selectAll("text")
		.attr("transform", "translate(-29,25)rotate(-45)");

	svg.append("g")
		.attr("class", "y axis")
		.call(yAxis)
		.append("text")
		.attr("transform", "rotate(-90)")
		.attr("y", 6)
		.attr("dy", ".71em")
		.style("text-anchor", "end")
		.text("Фирми");

	var dateC = svg.selectAll(".dateC")
		.data(data)
		.enter().append("g")
		.attr("class", "g")
		.attr("transform", function(d) { return "translate(" + x(d["Дата"]) + ",0)"; });

	dateC.selectAll("rect")
		.data(function(d) { return d.changes; })
		.enter().append("rect")
		.attr("width", x.rangeBand())
		.attr("y", function(d) { return y(d.y1); })
		.attr("height", function(d) { return y(d.y0) - y(d.y1); })
		.style("fill", function(d) { return color(d.name); });

	var legend = svg.selectAll(".legend")
		.data(color.domain().slice().reverse())
		.enter().append("g")
		.attr("class", "legend")
		.attr("transform", function(d, i) { return "translate(10," + i * 20 + ")"; });

	legend.append("rect")
		.attr("x", width - 18)
		.attr("width", 18)
		.attr("height", 18)
		.style("fill", color);

	legend.append("text")
		.attr("x", width - 24)
		.attr("y", 9)
		.attr("dy", ".35em")
		.style("text-anchor", "end")
		.text(function(d) { return d; });

});

d3.csv("/business/data/registered.csv", function(error, data) {
	var margin = {top: 20, right: 20, bottom: 30, left: 50},
		width = 900 - margin.left - margin.right,
		height = 500 - margin.top - margin.bottom;

	var parseDate = d3.time.format("%Y%m").parse;

	var x = d3.time.scale()
		.range([0, width]);

	var y = d3.scale.linear()
		.range([height, 0]);

	var xAxis = d3.svg.axis()
		.scale(x)
		.orient("bottom");

	var yAxis = d3.svg.axis()
		.scale(y)
		.orient("left");

	var area = d3.svg.area()
		.x(function(d) { return x(d.date); })
		.y0(height)
		.y1(function(d) { return y(d.reg); });

	var svg = d3.select("#reg-graph").append("svg")
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom)
		.append("g")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	data.forEach(function(d) {
		d.date = parseDate(d['Месец']);
		d.reg = +d['Брой регистрирани'];
	});

	x.domain(d3.extent(data, function(d) { return d.date; }) );
	y.domain([0, d3.max(data, function(d) { return d.reg; })]);

	svg.append("path")
		.datum(data)
		.attr("class", "area")
		.attr("d", area);

	svg.append("g")
		.attr("class", "x axis")
		.attr("transform", "translate(0," + height + ")")
		.call(xAxis);

	svg.append("g")
		.attr("class", "y axis")
		.call(yAxis)
		.append("text")
		.attr("transform", "rotate(-90)")
		.attr("y", 6)
		.attr("dy", ".71em")
		.style("text-anchor", "end")
		.text("Брой регистрирани фирми");
});
d3.csv("/business/data/locations.csv", function(error, data) {
	var map = L.map('map',{minZoom:6,maxZoom:13}).setView([42.69,25.15], 8);

	L.tileLayer('http://{s}.tile.cloudmade.com/ef311d0827c74ca7a2e1bb68614b7ad3/998/256/{z}/{x}/{y}.png', {
		attribution: 'Charts <a href="http://d3js.org/">D3.js</a>; Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://cloudmade.com">CloudMade</a>',
		maxZoom: 13,
		minZoom: 6
	}).addTo(map);
	map.addControl(new L.Control.FullScreen());

	
	data.forEach(function(d) {
		d.marker = L.marker([+d.lat, +d.lng],{opacity:0.7, icon:new L.D3GraphIcon(d, map)});
		d.marker.addTo(map);
		d.marker.on("click",function(e) { this.panTo(e.target.getLatLng()).setZoom(10); }, map);
	});
});
