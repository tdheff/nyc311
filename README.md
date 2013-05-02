#
# How to run the code:
#

To run our code, simply open index.html. Once open, the onscreen instructions should help you with what to do. Basically the main features are using the dropdown menus to select a complaint and color scheme, and hovering or clicking on a zip code or scatterplot point to get more information about it.

#
# Code breakdown:
#

Most of the work is done in main.js. The onload function sets up some basic stuff, populates a few elements, and colors the map. The bulk of the work is done by a few functions:

* **drawScatter:** This function takes a complaint name and a demographic name as strings, and plots a scatterplot comparing those two variables.
* **d3barchart:** This function takes a zip code as a string, and plots a bar chart of complaints in that zip code.
* **d3selectComplaint:** This function takes a complaint name as a string, and adjusts the choropleth and scatterplot to reflect that complaint.
* **preprocess:** This function reads the data in and preproccesses it into a manageable object structure.

#
# Libraries:
#

jquery and d3 are both sed heavily, for data and DOM manipulation, and are located in the js folder. hoverintent is also used (only once to replace hover), and is again in the js folder. 

SVG Map is from Kenny Peng:
Peng, Kenny. "VisioNYC." Kpeng / Visionyc., 11 Feb. 2012. Web. 1 Apr. 2013. https://github.com/kpeng/visionyc

#
# Data Location:
#

The data is embedded in index.html. The first data set is in the textarea with id "json-zip-complaint," and is a json object with keys of the form "zipcode complaint" and values for the count for that complaint/zipcode pair. The next is in id "json-complaint", which is a json object with total counts for each complaint. Third is in "json-zips" and is a json array of nyc zip codes. Fourth is our demographic data in "json-demographics." Finally, in the div with id "map" there is an svg file which is our map of NYC zip codes.

#
# Additional Information:
#

We think/hope the code should be relatively easy to follow.