$(document).ready(function() {

  colorZip("11426","#ff0000");

});

function colorZip(zip,color) {
  $("#" + zip).css("fill",color);
}