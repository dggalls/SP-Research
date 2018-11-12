function assignVectorColours(dataArray, expressionArray, caps = false) {
    var maxValue;

    maxValue = 10000000;

    for (var key in dataArray) {
        if (dataArray.hasOwnProperty(key)) {

            var red = (dataArray[key] / maxValue) * 255;
            var color = "rgba(" + red + ", " + 0 + ", " + 0 + ", 1)";
            if(caps) {
                expressionArray.push(capitalise(key), color);
            } else {
                expressionArray.push(key, color);
            }
        }
    }


    // Last value is the default, used where there is no data
    expressionArray.push("rgba(0,0,0,0)");
}


function getCSVMonthlyData(columnValueName, allText, columnName) {
    var allTextLines = allText.split(/\r\n|\n/);
    var headers = allTextLines[0].split(',');
    var tempData = new Map();
    var returnData = [];
    var key;

    for (var i=1; i<allTextLines.length; i++) {
        var data = allTextLines[i].split(',');

        if (data.length == headers.length) {

            for (var j=0; j<headers.length; j++) {
                tempData.set(headers[j],data[j]);
            }

            key = (tempData.get(columnName)).toString();

            if(!(key in returnData)) {
                returnData[key] = [];
            }

            returnData[key].push(tempData.get(columnValueName))
        }
    }

    return returnData;
}

function getDataForMonth(month, data) {
    var returnData = {};

    for (let [key, value] of Object.entries(data)) {
        returnData[key] = value[month-1];
    }

    return returnData;
}

function generatePopup(chartColumns, feature, featureHeader, clickPos) {

    var tableHTML;

    if(currentLayer === 'Zips') {
        tempData2 = getChartData(initialData, parseInt(feature.properties.POSTCODE));
    } else if(currentLayer === 'Counties') {
        tempData2 = getChartData(initialData2, parseInt(feature.properties.ADMINCODE));
    } else if(currentLayer === 'Cities') {
        tempData2 = getChartData(initialData3, feature.properties.city);
    }

    if(currentLayer === 'Zips' || currentLayer === 'Counties' || currentLayer === 'Cities') {

        tableHTML = '<img src="img/Mastercard.png" style="width=140px; height:50px; margin:auto;"><br>' +
            '<table>' +
            '<tr><th><h3>Location</h3></th>' +
            '<th><h3>Value</h3></th></tr>' +
            '<tr><td><h3>' + featureHeader + '</h3></td>' +
            '<td><h3>$' + tempData2[datasetPosition - 1] + '</h3></td></tr></table>';

    } else {

        tableHTML = '<img src="img/Mastercard.png" style="width=140px; height:50px; margin:auto;"><br>' +
            '<table style="width:300px;text-align:center;">' +
            '<tr><th style="text-align: center"><h3>Location</h3></th>' +
            '<tr><td style="text-align: center"><h3>' + featureHeader + '</h3></td></tr></table>';
    }

    var popup = new mapboxgl.Popup({offset: [0, -15]})
        .setLngLat(clickPos.lngLat)

        .setHTML(tableHTML).addTo(map);

    if(currentLayer === 'Zips' || currentLayer === 'Counties' || currentLayer === 'Cities') {
        generateChart(chartColumns, tempData2)
    }
}

function switchLayer(input) {

    zipMonthData = getDataForMonth(input.target.id, zipData);
    FIPSMonthData = getDataForMonth(input.target.id, FIPSData);

    expression = ["match", ["get", "POSTCODE"]];
    expression2 = ["match", ["get", "ADMINCODE"]];

    assignVectorColours(zipMonthData, expression);
    assignVectorColours(FIPSMonthData, expression2);

    map.setPaintProperty('Zips', 'fill-color', expression);
    map.setPaintProperty('Counties', 'fill-color', expression2);


    datasetPosition = input.target.value;
    map.setFilter('States', null);
    map.setFilter('Counties', null);
}

function addLegend(dataset) {
    var colors = ['rgba(0,0,0,0.6)', 'rgba(36,0,0, 0.6)', 'rgba(73,0,0,0.6)', 'rgba(109,0,0,0.6)', 'rgba(146,0,0,0.6)', 'rgba(182,0,0,0.6)', 'rgba(219,0,0,0.6)', 'rgba(255,0,0,0.6)'];
    var layers;
    var legendText = 'U.S. ' + currentLayer;
    var legendDiv = document.getElementById('legend');
    legendDiv.innerHTML = '';

    if(dataset === 'States'){
        layers = ['0-12,500', '12,500-25,000', '25,000-37,500', '37,500-50,000', '50,000-62,500', '62,500-75,000', '75,000-87,500', '87,500+'];
    } else {
        layers = ['0-1250', '1250-2500', '2500-3750', '3750-5000', '5000-6250', '6250-7500', '7500-8750', '8750+'];
    }

    legendDiv.innerHTML = legendText + '<hr>';

    for (i = 0; i < layers.length; i++) {

        var layer = layers[i];
        var color = colors[i];
        var item = document.createElement('div');
        var key = document.createElement('span');

        key.className = 'legend-key';
        key.style.backgroundColor = color;

        var value = document.createElement('span');
        value.innerHTML = layer;
        item.appendChild(key);
        item.appendChild(value);
        legend.appendChild(item);
    }
}

function findLocationNamesBetweenValues(dataArray, startValue, endValue) {
    var filteredData = [];

    for (var key in dataArray) {
        if (dataArray.hasOwnProperty(key)) {
            if (dataArray[key] >= startValue && dataArray[key] <= endValue) {
                filteredData.push(key);
            }
        }
    }

    return filteredData;
}

function addFilterUI(){
    $( function() {
        $( "#slider-range" ).slider({
            range: true,
            min: 0,
            max: 10000000,
            values: [ 0, 10000000 ],
            step: 1000,
            animate: "slow",
            orientation: "vertical",
            slide: function( event, ui ) {
                $( "#amount" ).val( "$" + ui.values[ 0 ] + " - $" + ui.values[ 1 ] );
            }
        });
        $( "#amount" ).val( "$" + $( "#slider-range" ).slider( "values", 0 ) +
            " - $" + $( "#slider-range" ).slider( "values", 1 ) );
    } );
}

function applyFilter() {
    var FIPSFilters = findLocationNamesBetweenValues(FIPSMonthData, $("#slider-range").slider("values", 0), $("#slider-range").slider("values", 1));
    map.setFilter('Counties', ['match', ['get', 'ADMINCODE'], FIPSFilters, true, false]);
}

function getLegendGrouping() {
    var legendGroups = {};

    legendGroups = {
        Outline: ['Overall'],
        States: ['0-12,500', '12,500-25,000', '25,000-37,500', '37,500-50,000', '50,000-62,500', '62,500-75,000', '75,000-87,500', '87,500+'],
        DMA: [],
        Counties: [],
        Cities: [],
        Zips: []
    };
};

console.log(capitalise('johnny bingo sings'));

function capitalise(str)
{
    str = str.toLowerCase();
    str = str.split(" ");

    for (var i = 0, x = str.length; i < x; i++) {
        str[i] = str[i][0].toUpperCase() + str[i].substr(1);
    }

    return str.join(" ");
}