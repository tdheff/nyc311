// colors scales used
var colors = {
    blue: ["#FFFFD9", "#EDF8B1", "#C7E9B4", "#7FCDBB", "#41B6C4", "#1D91C0", "#225EA8", "#253494", "#081D58"],
    purple: ["#FFF7F3", "#FDE0DD", "#FCC5C0", "#FA9FB5", "#F768A1", "#DD3497", "#AE017E", "#7A0177", "#49006A"],
    green: ["#FFFFE5", "#F7FCB9", "#D9F0A3", "#ADDD8E", "#78C679", "#41AB5D", "#238443", "#006837", "#004529"],
    red: ["#FFFFCC", "#FFEDA0", "#FED976", "#FEB34C", "#FD8D3C", "#FC4E2A", "#E31A1C", "#BD0026", "#800026"]
}
// names for color scales
var color_names = ["Blue","Purple","Green","Red"];

// names of complaints
var complaints = ["Broken Elevator",
                  "Congestion/Gridlock",
                  "Dead Animals",
                  "Derelict Vehicle",
                  "Double Parked Blocking Vehicle",
                  "Fallen Tree",
                  "Fire Hydrant Emergency (FHE)",
                  "Graffiti",
                  "Heating",
                  "Loud Music/Party",
                  "Loud Talking",
                  "Missed Garbage Collection",
                  "Munimeter Issue",
                  "Noise, Ice Cream Truck",
                  "Posted Parking Sign Violation",
                  "Pothole",
                  "Rat Sighting",
                  "Sewer Backup",
                  "Street Light Out",
                  "Taxi Driver Complaint",
                  "Vermin"]

// color scale in use
var active_colors = colors["blue"];
// temporary variable used for hover effect
var temp = null;
// name of selected zip code
var selected = null;
// current complaint data
var data = null;
// preprocessed data
var d = null;
// active complaint
var active_complaint = "Broken Elevator";

$(document).ready(function() {
    // read in names of zip codes
    var zipList = $("#json-zips").val();
    // set mapped complaint to Broken Elevator (the default one in the selection)
    //data = changeComplaint("Broken Elevator", zipList, colors.blue);

    d = preprocess();
    data = d3selectComplaint("Broken Elevator");

    // map hover and click callbacks
    $("#map path").hoverIntent(mousein,mouseout);
    $("#map path").click(select);

    // populate selection menus
    fillSelect("complaints-select",complaints);
    fillSelect("color-select",color_names);

    // map button callback
    $("#color-map").click( function() {
	active_colors = colors[$("#color-select").val().toLowerCase()];
	data = data = d3selectComplaint($("#complaints-select").val());
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
    if ($(this).css("fill") != "#333333") {
        temp = $(this).css("fill");
        $(this).css("fill","#666666");
        $("#tooltip").css("display","inherit");
        $('#tooltip').css({
            left: event.pageX,
            top: event.pageY
        });
        $("#tooltip-zip").text($(this).attr("id"));
        $("#tooltip-complaints").text(d[$(this).attr("id")][active_complaint]);
    } else {
        temp = "#333333";
    }
}

// what to do when mouse leaves
function mouseout() {
    // recolor zip code, hide tooltip
    $(this).css("fill",temp);
    $("#tooltip").css("display","none");
}

// what to do when zip is clicked on
function select() {
    // if the bar chart is created succesfully, set bar chart title and selected zip variable
    if (barchart($(this).attr("id"),$("#json-zip-complaint").val(),active_colors) != null) {
        selected = $(this).attr("id");
        $("#zip").text("Complaints in "+selected);
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
    var zipList = JSON.parse($("#json-zips").val());
    for (z in zipList)
    {
	finalData[zipList[z]] = {};
	for (c in complaints) {
	    finalData[zipList[z]][complaints[c]] = zipData[zipList[z] + " " + complaints[c]];
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

    var maxComplaint = maxInObject(d,c);

    var quantize = d3.scale.quantize()
        .domain([0, maxComplaint])
        .range(d3.range(9));

    var throwaway = d3.selectAll('path').attr('fill',function(q){

	var z = this.id;
	
	if (d[z] != undefined) {
	    if (d[z][c] != undefined) {
		return active_colors[quantize(d[z][c])];
	    } else {
		return "#333333";
	    }
	}
	
    });
    
    return throwaway;
}
