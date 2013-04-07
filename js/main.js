var colors = {
    blue: ["#FFFFD9", "#EDF8B1", "#C7E9B4", "#7FCDBB", "#41B6C4", "#1D91C0", "#225EA8", "#253494", "#081D58"],
    purple: ["#FFF7F3", "#FDE0DD", "#FCC5C0", "#FA9FB5", "#F768A1", "#DD3497", "#AE017E", "#7A0177", "#49006A"]
}

var color_names = ["Blue","Purple"];

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

$(document).ready(function() {
    var zipList = document.getElementById("json-zips").value;
    changeComplaint("Taxi Driver Complaint", zipList, colors.blue);
    $("#map path").hover(mousein,mouseout);
    $("#map path").click(select);
    fillSelect("complaints-select",complaints);
    fillSelect("color-select",color_names);
    $("#color-map").click( function() {
	changeComplaint($("#complaints-select").val(),zipList,colors[$("#color-select").val().toLowerCase()]);
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

function mousein() {
    if ($(this).css("fill") != "#333333") {
	temp = $(this).css("fill");
	$(this).css("fill","#666666");
    } else {
	temp = "#333333";
    }
}

function mouseout() {
    $(this).css("fill",temp);
}

function select() {
    selected = $(this).attr("id");
    $("#zip").text(selected);
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
        colorZip(zipCount.zip[j], colors[quantize(zipCount.count[j])]);
    }


}
