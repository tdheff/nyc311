var colors = {
    blue: ["#FFFFD9", "#EDF8B1", "#C7E9B4", "#7FCDBB", "#41B6C4", "#1D91C0", "#225EA8", "#253494", "#081D58"],
    purple: ["#FFF7F3", "#FDE0DD", "#FCC5C0", "#FA9FB5", "#F768A1", "#DD3497", "#AE017E", "#7A0177", "#49006A"],
    green: ["#FFFFE5", "#F7FCB9", "#D9F0A3", "#ADDD8E", "#78C679", "#41AB5D", "#238443", "#006837", "#004529"],
    red: ["#FFFFCC", "#FFEDA0", "#FED976", "#FEB34C", "#FD8D3C", "#FC4E2A", "#E31A1C", "#BD0026", "#800026"]
}

var color_names = ["Blue","Purple","Green","Red"];

var complaints = ["Broken Elevator",
"Congestion/Gridlock",
"Dead Animals",
"Derelict Vehicle",
"Double Parked Blocking Vehicle",
"Fallen Tree",
"Fire Hydrant Emergency (FHE)",
"Food Stamp",
"Graffiti",
"Heating",
"Loud Music/Party",
"Loud Talking",
"Medicaid",
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

var temp = null;
var selected = null;
var data = null;

$(document).ready(function() {
    var zipList = document.getElementById("json-zips").value;
    data = changeComplaint("Broken Elevator", zipList, colors.blue);

    $("#map path").hoverIntent(mousein,mouseout);
    $("#map path").click(select);

    fillSelect("complaints-select",complaints);
    fillSelect("color-select",color_names);

    $("#color-map").click( function() {
	data = changeComplaint($("#complaints-select").val(),zipList,colors[$("#color-select").val().toLowerCase()]);
    });
});

function colorZip(zip,color) {
    $("#" + zip).css("fill",color);
}

function fillSelect(id,data) {
    for (var i = 0; i < data.length; i = i+1) {
	$("#"+id).append("<option>"+data[i]+"</option>");
    }
}

function getCount(zip, data) {
    for (var i = 0; i < data.zip.length; i++) {
	if (data.zip[i] == zip) {
	    return data.count[i];
	}
    }

    return null;
}

function mousein(event) {
    if ($(this).css("fill") != "#333333") {
	temp = $(this).css("fill");
	$(this).css("fill","#666666");
	$("#tooltip").css("display","inherit");
	$('#tooltip').css({
	    left: event.pageX,
	    top: event.pageY
	});
	$("#tooltip-zip").text($(this).attr("id"));
	$("#tooltip-complaints").text(getCount($(this).attr("id"),data));
    } else {
	temp = "#333333";
    }
}

function mouseout() {
    $(this).css("fill",temp);
    $("#tooltip").css("display","none");
}

function select() {
    if ($(this).css("fill") != "#333333") {
	selected = $(this).attr("id");
	$("#zip").text(selected);
    }
}

// this is a bit of a mess, but it sort of works
function changeComplaint(complaint, zips, colors) {
    $("path").css("fill","#333333");

    zips = eval(zips);
    var zipCount = {
        zip: [],
        count: []
    };

    var zipComplaint = document.getElementById("json-zip-complaint").value;

    for (var i = 0; i < zips.length; i++)
    {
        if (document.getElementById(zips[i]))
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
    console.log(JSON.stringify(maxComplaint));

    var quantize = d3.scale.quantize()
        .domain([0, maxComplaint])
        .range(d3.range(9));

    $("#topbar h1").css("color", colors[4]);
    for (var j = 0; j < zipCount.zip.length; j++)
    {
        //console.log(JSON.stringify(zipCount.count[j]));
        //console.log(JSON.stringify(quantize(zipCount.count[j])));

        //if (document.getElementById(zipCount.zip[j]))
        //    console.log(JSON.stringify(zipCount.zip[j]));
        //console.log(JSON.stringify(quantize(zipCount.count[j])));
	console.log(j,zipCount.zip[j],zipCount.count[j],quantize(zipCount.count[j]));
        colorZip(zipCount.zip[j], colors[quantize(zipCount.count[j])]);
    }

    return zipCount;
}
