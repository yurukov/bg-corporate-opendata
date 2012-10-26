L.D3GraphIcon = L.Icon.extend({
	options: {
		/*
		data: List of datapoints (Array) (required)
		*/
	},

	data: false,
	sumFirms: 0,
	title: "",

	_div:null,
	simpleO: null,
	detailO: null,
	detailOa:false,
	_width:0,

	initialize: function (d, map) {
		this.data=new Array();
		var keys = Object.keys(d);
		keys.sort();
		for (i=0;i<19;i++) {
			this.data[i]={"year":keys[i], "firms":parseInt(d[keys[i]])};
			this.sumFirms+=this.data[i].firms;
		}
		this.title = d['Град'];
		map.on('zoomend', this._changeZoom, this );
	},

	createIcon: function () {
		return this._createGraph();
	},
	createShadow: function () {
		return null;
	},

	_changeZoom: function(e) {
		if (e.target.getZoom()>=10 && !this.detailOa) {
			this.simpleO.style("display","none");
			this.detailO.style("display",null);

			this._div.style.width="300px";
			this._div.style.height="300px";
			this._div.style.marginLeft="-150px";
			this._div.style.marginTop="-150px";

			this.detailOa=true;
		} else 	if (e.target.getZoom()<10 && this.detailOa) {
			this.simpleO.style("display",null);
			this.detailO.style("display","none");

			this._div.style.width=this._width+"px";
			this._div.style.height=this._width+"px";
			this._div.style.marginLeft=(-this._width/2)+"px";
			this._div.style.marginTop=(-this._width/2)+"px";

			this.detailOa=false;
		}
	},

	_createGraph: function (type) {
		var div = document.createElement('div');
		this._div=div;
	
		var radius=Math.sqrt(this.sumFirms/5);
		var width = radius*2+4;
		this._width=width;

		div.className = 'leaflet-marker-icon';
		div.style.marginLeft=(-width/2)+"px";
		div.style.marginTop=(-width/2)+"px";
		div.title = this.title+" - "+this.sumFirms+" фирми";

		var color = d3.scale.ordinal().range(["#98abc5", "#94a1bc", "#8f96b2", "#8a8ba8", 
			"#85809e", "#7f7493", "#7a6989", "#755e7f", "#705375", "#6b486b", "#7c5060", 
			"#8c5754", "#9d5f48", "#ad673c", "#be6e30", "#ce7624", "#df7e18", "#ef850c", "#ff8c00"]);

		var svgSimple = d3.select(div).append("svg");
		svgSimple.attr("width", width)
			.attr("height", width)
			.append("g")
			.attr("transform", "translate(" + width / 2 + "," + width / 2 + ")");

		var svgDetail = d3.select(div).append("svg");
		svgDetail.style("display","none")
			.attr("width", 300)
			.attr("height", 300)
			.append("g")
			.attr("transform", "translate(150,150)");
		this.simpleO=svgSimple;
		this.detailO=svgDetail;

		svgSimple.select("g").append("circle")
			.attr("r", radius)
			.style("fill", "#ff8c00");

		if (radius<20) {
			svgDetail.select("g").append("circle")
				.attr("r", radius*3)
				.style("fill", "#ff8c00");
		} else {
			if (radius<120) radius=120;
			var arc = d3.svg.arc()
				.outerRadius(radius)
				.innerRadius(radius*0.3);

			var pie = d3.layout.pie().sort(null)
				.value(function(d) { return d.firms; });

			var g = svgDetail.select("g").selectAll(".arc")
				.data(pie(this.data))
				.enter().append("g")
				.attr("class", "arc");

			g.append("path")
				.attr("d", arc)
				.style("fill", function(d) { return color(d.data.year); });
			g.append("text")
				.attr("transform", function(d) { 
					var a = (d.startAngle+(d.endAngle-d.startAngle)/2)/Math.PI*180-90; 
					return "translate(" + arc.centroid(d) + ")rotate("+(a<90 && a>-90?a:180+a)+")"; 
				})
				.attr("dy", ".35em")
				.style("text-anchor", "middle")
				.text(function(d) { return d.data.year+" г. - "+d.data.firms; });
		}

		return div;
	}

	
});
