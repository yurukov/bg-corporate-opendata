Opendata on Bulgarian companies
=====================

Here you'll find the source of the website presenting the data on Bulgarian companies I've 
managed to open. Currently it consists only of data for firms registered for VAT (350000). 
There are three graphs on the page - maps with piecharts on firm distribution in Bulgaria,
Graph of inserted, deleted and changed firms and a graph with time distribution of VAT
registrations.

The map is probably the most interesting code-wise. I've combined leaflet map based on 
openstreet map and cloudmade tiles with D3.js charts. Basically I created a new icon for 
the markers with a div inside. In each div I place two charts - one less detailed and one 
with many details. I show one or the other based on the zoom level. 

You can get the data and see the code in action on:
http://opendata.yurukov.net/business/en

