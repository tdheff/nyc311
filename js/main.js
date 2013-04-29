// colors scales used
var colors = {
    blue: ["#FFFFD9", "#EDF8B1", "#C7E9B4", "#7FCDBB", "#41B6C4", "#1D91C0", "#225EA8", "#253494", "#081D58"],
    purple: ["#FFF7F3", "#FDE0DD", "#FCC5C0", "#FA9FB5", "#F768A1", "#DD3497", "#AE017E", "#7A0177", "#49006A"],
    green: ["#FFFFE5", "#F7FCB9", "#D9F0A3", "#ADDD8E", "#78C679", "#41AB5D", "#238443", "#006837", "#004529"],
    red: ["#FFFFCC", "#FFEDA0", "#FED976", "#FEB34C", "#FD8D3C", "#FC4E2A", "#E31A1C", "#BD0026", "#800026"],
    grey: ["#FFFFFF", "#F0F0F0", "#D9D9D9", "#BDBDBD", "#969696", "#737373", "#525252", "#252525", "#000000"]
}
// names for color scales
var color_names = ["blue","purple","green","red", "grey"];

// names of complaints
var complaints = ["Fire Hydrant Emergency (FHE)", "Lead", "Rough Pitted or Cracked Roads", "Rat Sighting", "Missed Garbage Collection", "Loud Music/Party", "Pothole", "Asbestos", "School Maintenance", "Boilers", "Food Stamp Replacement Card", "Dirty Conditions", "Fallen Tree", "Medicaid Replacement Card", "Broken Elevator", "Posted Parking Sign Violation", "Loud Talking", "Dirty Water", "Heating", "Vacant Lot", "Plumbing", "Double Parked Blocking Vehicle", "Noise, Ice Cream Truck", "Homeless Encampment", "Congestion/Gridlock", "Taxi Driver Complaint", "Vermin", "Munimeter Issue", "Dead Animals", "Graffiti", "Street Light Out", "Derelict Vehicle", "Sewer Backup"]

// names of demographic categories
var demographics = ["Total Population","Median Age","Percent White","Percent Black","Percent Hispanic","Median Income","Mean Income"]

// color scale in use
var active_colors = colors["blue"];
// name of selected zip code
var selected = null;
// current complaint data
var data = null;
// preprocessed data
var pdata = null;
// active complaint
var active_complaint = complaints[0];
// active demographic category
var active_dem = demographics[0];
// is the barchart there?
var hasChart = false;

$(document).ready(function() {
    // read in names of zip codes
    var zipList = $("#json-zips").val();
    // set mapped complaint to Broken Elevator (the default one in the selection)
    //data = changeComplaint("Broken Elevator", zipList, colors.blue);

    pdata = preprocess();
    data = d3selectComplaint(active_complaint);
    drawScatter(active_complaint,active_dem);

    // map hover and click callbacks
    $("#svg2 path").hoverIntent(mousein,mouseout);
    $("#svg2 path").click(select);

    // populate selection menus
    fillSelect("complaints-select",complaints);
    fillSelect("color-select",color_names);
    fillSelect("dem-select",demographics);

    // selection callbacks
    $("#complaints-select").change(function () {
	active_colors = colors[$("#color-select").val().toLowerCase()];
	data = d3selectComplaint($("#complaints-select").val());
	active_complaint = $("#complaints-select").val();
	drawScatter(active_complaint,active_dem);
    });

     $("#dem-select").change(function () {
	active_dem = $("#dem-select").val();
	drawScatter(active_complaint,active_dem);
    });

    $("#color-select").change(function () {
	active_colors = colors[$("#color-select").val().toLowerCase()];
	data = d3selectComplaint($("#complaints-select").val());
    });
});

// takes zipcode, color, colors in that zipcode!
function colorZip(zip,color) {
    $("#" + zip).css("fill",color);
}

// populated a select item with data
function fillSelect(id,data) {
    for (var i = 0; i < data.length; i = i+1) {
        $("#"+id).append("<option>"+data[i]+"</option>");
    }
}

// takes data and a zip code, returns number of complaints for that zip code
function getCount(zip, data) {
    for (var i = 0; i < data.zip.length; i++) {
        if (data.zip[i] == zip) {
            return data.count[i];
        }
    }

    return null;
}

// what to do on hover (with intent)
function mousein(event) {
    // change fill, store old fill in temp, bring up tooltip
    // if color is #333333 then zip has no relevant data, so do nothing
    if ($(this).css("fill") != "#eeeeee") {
        temp = $(this).css("fill");
        $(this).css("fill","#666666");
        $("#tooltip").fadeIn(150);
        $('#tooltip').css({
            left: event.pageX,
            top: event.pageY
        });
        $("#tooltip-zip").text($(this).attr("id"));
        $("#tooltip-complaints").text(pdata[$(this).attr("id")][active_complaint]);
	$(".tooltip-dem-label").remove();
	$(".tooltip-dem").remove();
	$("br").remove();
	for (d in demographics) {
	    $("#tooltip-data").append(
		"<br><p class='tooltip-dem-label'>" + demographics[d] + ": </p>" +
		    "<p class='tooltip-dem'>" +
		    pdata[$(this).attr("id")][demographics[d]] +
		    "</p")
	}
    }
}

// what to do when mouse leaves
function mouseout() {
    // recolor zip code, hide tooltip
    $(this).removeAttr('style');
    //$("#tooltip").css("display","none");
    $("#tooltip").fadeOut(150);
}

// what to do when zip is clicked on
function select() {
    // if the bar chart is created succesfully, set bar chart title and selected zip variable
    //if (barchart($(this).attr("id"),$("#json-zip-complaint").val(),active_colors) != null) {
    //    selected = $(this).attr("id");
    //    $("#zip").text("Complaints in "+selected);
    //}
    
    $("#zip").fadeOut();
    $("#graph").fadeOut();
    d3barchart($(this).attr("id"));
    if (!hasChart) {
	$(".chart").css("display","none").delay(450).fadeIn();
	hasChart = true;
    }
}

// initialize scatterplot
function drawScatter(comp,dem) {
    var w = 600, h = 600;
    
    var sData = [];
    
    for (z in pdata) {
	if (pdata[z][comp] != undefined 
	    && pdata[z][dem] != undefined
	    && $("#" + z).length != 0) {
	    sData.push({
		x: pdata[z][dem],
		y: pdata[z][comp],
		zip: z});
	}
    }
    
    var max = d3.max(sData,function(o){return o.x});
    var min = d3.min(sData,function(o){return o.x});
    var x = d3.scale.linear()
	.domain([min,max])
	.range([40,w-40]);

    var max = d3.max(sData,function(o){return o.y});
    var min = d3.min(sData,function(o){return o.y});
    var y = d3.scale.linear()
	.domain([0,max])
	.range([h-40,40]);
    
    if ($(".scatter").length == 0) {
	var scatter = d3.select("#map").append("svg")
	    .attr("class","scatter")
	    .attr("width",w)
	    .attr("height",h)
	
	scatter.selectAll("circle")
	    .data(sData,function(d){return d.zip;})
	    .enter()
	    .append("circle")
	    .attr("cx",function(d){return x(d.x);})
	    .attr("cy",function(d){return y(d.y);})
	    .attr("r","3")
	    .attr("fill",active_colors[4]);
	
	scatter.append("g")
	    .attr("class","axis")
	    .attr("id","x-axis")
	    .attr("transform","translate(0," + (h-40) + ")")
	    .call(d3.svg.axis()
		  .scale(x)
		  .orient("bottom")
		  .ticks(7));
	scatter.append("g")
	    .attr("class","axis")
	    .attr("id","y-axis")
	    .attr("transform","translate("+40+",0)")
	    .call(d3.svg.axis()
		  .scale(y)
		  .orient("left")
		  .ticks(7));
    } else {
	var scatter = d3.select(".scatter")
	var circles = scatter.selectAll("circle")
	    .data(sData,function(d){return d.zip;});

	circles.enter().insert("circle")
	    .attr("cx",function(d){return x(d.x);})
	    .attr("cy",function(d){return y(d.y);})
	    .attr("r","3")
	    .attr("fill",active_colors[4]);

	circles.transition()
	    .duration(1000)
	    .attr("cx",function(d){return x(d.x);})
	    .attr("cy",function(d){return y(d.y);});

	circles.exit()
	    .remove();

	scatter.select("#x-axis")
	    .transition()
	    .duration(1000)
	    .call(d3.svg.axis()
		  .scale(x)
		  .orient("bottom")
		  .ticks(7));

	scatter.select("#y-axis")
	    .transition()
	    .duration(1000)
	    .call(d3.svg.axis()
		  .scale(y)
		  .orient("left")
		  .ticks(7));
    }
}

// draw bar chart using d3
function d3barchart(zip) {
    var w = 20, h = 100;

    var barArray = [];

    for (c in complaints) {
	if (pdata[zip][complaints[c]] != undefined) {
	    barArray.push({
		key: complaints[c],
		value: pdata[zip][complaints[c]]
	    });
	} else {
	    barArray.push({
		key: complaints[c],
		value: 0
	    });
	}
    }

    var barArray = barArray.sort(function(a,b){return b.value - a.value});
    var vals = barArray.map(function(o){return o.value});
    var labels = barArray.map(function(o){return o.key});

    var max = d3.max(vals);
    var y = d3.scale.linear().domain([0, max]).range([0,100]);
    var x = d3.scale.ordinal().domain(labels).rangePoints([0,labels.length-1]);

    var colorInd = 4;

    if ($(".chart").length == 0) {
	var chart = d3.select("#sidebar").append("svg")
	    .attr("class","chart")
	    .attr("height","400")
	    .attr("width", 40*barArray.length+100);

	var node = chart.selectAll("g")
	    .data(barArray,function(d) { return d.key; })
	    .enter()
	    .append("g");

	node.append("rect")
	    .attr("fill",active_colors[colorInd])
	    .attr("x", function(d,i){console.log(d.key); return x(i)*40+20; })
	    .attr("height", function(d) {return y(d.value)})
	    .attr("y", function(d) {return 100 - y(d.value)})
	    .attr("width", 40);
	
	node.append("text")
	    .text(function(d) { return d.value; })
	    .attr("fill",function(d) {
		if (y(d.value) > 18) {
		    return "#ffffff";
		} else {
		    return active_colors[colorInd];
		}
	    })
	    .attr("y", function(d) {
		if (y(d.value) > 18) {
		    return 113 - y(d.value);
		} else {
		    return 99 - y(d.value);
		}
	    })
	    .attr("class", function(d) {
		if (y(d.value) > 18) {
		    return "value white";
		} else {
		    return "value color";
		}
	    })
	    .attr("x", function(d,i){return x(i)*40+24});

	node.append("text")
	    .text(function(d) { return d.key; })
	    .attr("class","label")
	    .attr("y", 105)
	    .attr("x", function(d,i){return x(i)*40+35})
	    .attr("transform", function(d,i){
		var str = "rotate(90 ";
		str = str + String(x(i)*40+35);
		str = str + ",105)";
		return str;
	    });
    } else {
	var chart = d3.select("#sidebar");
	
	var node = chart.selectAll("g")
	    .data(barArray,function(d) { return d.key; });

	console.log(barArray);
	
	node.selectAll("rect")
	    .data(barArray,function(d) { return d.key; })
	    .transition()
	    .duration(1000)
	    .attr("fill",active_colors[colorInd])
	    .attr("x", function(d,i){ return x(d.key)*40+20; })
	    .attr("height", function(d) { return y(d.value) })
	    .attr("y", function(d) {return 100 - y(d.value)});

	node.selectAll(".value")
	    .data(barArray,function(d) { return d.key; })
	    .transition()
	    .duration(1000)
	    .text(function (d) {console.log(d.value); return d.value; })
	    .attr("fill",function(d) {
		if (y(d.value) > 18) {
		    return "#ffffff";
		} else {
		    return active_colors[colorInd];
		}
	    })
	    .attr("y", function(d) {
		if (y(d.value) > 18) {
		    return 113 - y(d.value);
		} else {
		    return 99 - y(d.value);
		}
	    })
	    .attr("class", function(d) {
		if (y(d.value) > 18) {
		    return "value white";
		} else {
		    return "value color";
		}
	    })
	    .attr("x", function(d,i){ return x(d.key)*40+24; });

	node.selectAll(".label")
	    .data(barArray,function(d) { return d.key; })
	    .transition()
	    .duration(1000)
	    .attr("x", function(d,i){return x(d.key)*40+35})
	    .attr("transform", function(d,i){
		var str = "rotate(90 ";
		str = str + String(x(d.key)*40+35);
		str = str + ",105)";
		return str;
	    });
    }
}

// draw bar chart
function barchart(zip, complaints, colors) {
    // parse data
    var complaint_counts = JSON.parse(complaints);
    complaints = Object.keys(complaint_counts);
    var cdata = [];
    
    // search for data relevant to selected zip code
    for (var i = 0; i < complaints.length; i++) {
        if (complaints[i].slice(0,5) == zip) {
            cdata.push([complaints[i].slice(6,complaints[i].length),complaint_counts[complaints[i]]]);
        }
    }
    
    // sort the data so bar chart is pretty
    cdata.sort(function(a,b){return b[1] - a[1]});
    // check to make sure data was actually found, if not return null and draw nothing
    if (cdata[0] == undefined) {
	return null;
    }
    // get max value
    var max = cdata[0][1];
    // clear bar chart div
    $("#graph").html('');
    
    // draw bar chart and color it in active_color scheme
    for (var i = 0; i < cdata.length; i++) {
	$("#graph").append("<div class='bar-container'><div class='label'>"+cdata[i][0]+"</div><div class='bar'>"+cdata[i][1]+"</div>");
	var percent = Math.floor(100*cdata[i][1]/max);
    }
    $(".bar").css("background", active_colors[4]);
    $(".bar").css("border-color", active_colors[0]);
    $(".bar").css("color", "white");
    $(".bar").css("width", function () {
	var num = parseInt($(this).text());
	return Math.floor(200*num/max) + "px"
    });
}

// maps a new complaint onto the chloropleth
function changeComplaint(complaint, zips, colors) {
    active_colors = colors;

    $("path").css("fill","#333333");

    zips = eval(zips);
    var zipCount = {
        zip: [],
        count: []
    };

    var zipComplaint = $("#json-zip-complaint").val();

    for (var i = 0; i < zips.length; i++)
    {
        if ($("#"+zips[i]))
        {
            var zipAccess = zips[i]+" "+complaint;
            var jszipComplaint = JSON.parse(zipComplaint);
            if (jszipComplaint[zipAccess] != undefined) {
                zipCount.zip.push(zips[i]);
                zipCount.count.push(jszipComplaint[zipAccess]);
            }
        }
    }

    var maxComplaint = Math.max.apply(null,zipCount.count);
    //console.log(JSON.stringify(maxComplaint));

    var quantize = d3.scale.quantize()
        .domain([0, maxComplaint])
        .range(d3.range(9));

    $("#topbar h1").css("color", colors[4]);
    $("#subhead").css("color", colors[2]);
    $(".bar").css("background", active_colors[4]);
    $(".bar").css("border-color", active_colors[0]);
    $(".bar").css("color", "white");
    for (var j = 0; j < zipCount.zip.length; j++)
    {
        //console.log(JSON.stringify(zipCount.count[j]));
        //console.log(JSON.stringify(quantize(zipCount.count[j])));

        //if (document.getElementById(zipCount.zip[j]))
        //    console.log(JSON.stringify(zipCount.zip[j]));
        //console.log(JSON.stringify(quantize(zipCount.count[j])));
        //console.log(j,zipCount.zip[j],zipCount.count[j],quantize(zipCount.count[j]));
        colorZip(zipCount.zip[j], colors[quantize(zipCount.count[j])]);
    }

    return zipCount;
}

function preprocess() {
    var finalData = {};

    var zipData = JSON.parse($("#json-zip-complaint").val());
    var demData = JSON.parse($("#json-demographics").val());
    var zipList = JSON.parse($("#json-zips").val());
    for (z in zipList)
    {
	finalData[zipList[z]] = {};
	for (c in complaints) {
	    finalData[zipList[z]][complaints[c]] = zipData[zipList[z] + " " + complaints[c]];
	}
	for (d in demographics) {
	    finalData[zipList[z]][demographics[d]] = parseFloat(demData[zipList[z] + " " + demographics[d]]);
	}
    }

    return finalData;
}

function maxInObject(obj,attr) {
    var max = null;
    for (o in obj) {
	if (obj[o][attr] > max || max == null) {
	    max = obj[o][attr];
	}
    }
    return max;
}

function d3selectComplaint(c) {
    active_complaint = c;

    var maxComplaint = maxInObject(pdata,c);

    var quantize = d3.scale.quantize()
        .domain([0, maxComplaint])
        .range(d3.range(9));

    var throwaway = d3.selectAll('path').transition().attr('fill',function(q){

	var z = this.id;
	
	if (pdata[z] != undefined) {
	    if (pdata[z][c] != undefined) {
		return active_colors[quantize(pdata[z][c])];
	    } else {
		return "#eeeeee";
	    }
	}
	return "#eeeeee";
    });

    d3.select('h1').transition().style('color',active_colors[6]);
    d3.select('#subhead').transition().style('color',active_colors[4]);
    d3.select('#sidebar')
	.selectAll('rect')
	.transition()
	.attr('fill',active_colors[4]);
    d3.select('#sidebar')
	.selectAll('.color')
	.transition()
	.attr('fill',active_colors[4]);
    d3.selectAll('circle')
	.transition()
	.attr('fill',active_colors[4]);
    
    return throwaway;
}

function randInt (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
