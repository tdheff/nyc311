$(document).ready(function() {
    var zipList = document.getElementById("json-zips").value; 
    changeComplaint("Heating", zipList, colors1);
  //colorZip("11426","#ff0000");

});

function colorZip(zip,color) {
  $("#" + zip).css("fill",color);
}

// this is a bit of a mess, but it sort of works
function changeComplaint(complaint, zips, colors) {
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
            zipCount.zip.push(zips[i]);
            var zipAccess = zips[i]+" "+complaint;
            var jszipComplaint = JSON.parse(zipComplaint);
            zipCount.count.push(jszipComplaint[zipAccess]);
            }
        }
        
    var maxComplaint = Math.max.apply(Math, zipCount.count);
    console.log(JSON.stringify(maxComplaint));
    
    maxComplaint = 6015;
    
    var quantize = d3.scale.quantize()
    .domain([0, maxComplaint])
    .range(d3.range(9));
    
    for (var j = 0; j < zipCount.zip.length; j++)
    {
        //console.log(JSON.stringify(zipCount.count[j]));
        //console.log(JSON.stringify(quantize(zipCount.count[j])));
        
        if (document.getElementById(zipCount.zip[j]))
            console.log(JSON.stringify(zipCount.zip[j]));
            console.log(JSON.stringify(quantize(zipCount.count[j])));
            colorZip(zipCount.zip[j], colors[quantize(zipCount.count[j])]);
        }
    
}