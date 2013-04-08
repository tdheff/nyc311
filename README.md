#
# How to run the code:
#

To run our code, simply open index.html. Once open, the onscreen instructions should help you with what to do. Basically the main features are using the dropdown menus to select a complaint and color scheme, and hovering or clicking on a zip code to get more information about it.

#
# Code breakdown:
#

The bulk of the work is done in main.js. The onload function sets up some basic stuff, populates a few elements, and colors the map. The bulk of the work is done by two functions:

* **barchart:** This function takes a zip code name, a string of complaints data in json format, and a color scheme, and plots a bar chart with a breakdown of complaints for that zipcode in the left sidebar.
* **changeComplaint:** This function takes a complaint, a list of zipcodes, and a color scheme, and colors the map appropriately. It will also color a few other elements, such as the bar chart. This is purely asthetic.

#
# Libraries:
#

jquery is used heavily, and is located in the js folder. hoverintent is also used (only once to replace hover), and is again in the js folder. d3 is used lightly, mostly for quantizing data scales, and can also be found in the js folder.

#
# Data Location:
#

The data is embedded in index.html. The first data set is in the textarea with id "json-zip-complaint," and is a json object with keys of the form "zipcode complaint" and values for the count for that complaint/zipcode pair. The next is in id "json-complaint", which is a json object with total counts for each complaint. Third is in "json-zips" and is a json array of nyc zip codes. Finally, in the div with id "map" there is an svg file which is our map of NYC zip codes.

#
# Additional Information:
#

We think/hope the code should be relatively easy to follow.