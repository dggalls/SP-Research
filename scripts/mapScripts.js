function loadLayer() {
    map.on('load', function() {


        map.addSource("amZips", {
            type: "vector",
            url: "mapbox://dggalls.6gyvbere"
        });

        map.addLayer({
            "id": "zip-join",
            "type": "fill",
            "source": "amZips",
            "source-layer": "gz_2010_us_050_00_5m-9au8es",
            'layout': {
                'visibility': 'none'
            },
            "paint": {
                "fill-color": expression2,
                "fill-outline-color": '#FFFFFF',
                'fill-opacity': 0.6
            }
        });

        map.addSource("American States", {
            type: "vector",
            url: "mapbox://dggalls.cjnd92u7e02is2voioguvw5cr-05azb"
        });


        map.addLayer({
            "id": "states-join",
            "type": "fill",
            "source": "American States",
            "source-layer": "AmericaStates",
            'layout': {
                'visibility': 'visible'
            },
            "paint": {
                "fill-color": expression,
                'fill-opacity': 0.6,
                "fill-outline-color": '#FFFFFF',
            }
        });

        addLegend('states');

        addFilterUI();

        datasetPosition = 1;

    });
}

function assignVectorColours(dataArray, expressionArray, rowName, dataset) {
    var maxValue;

    if(dataset === 'states'){
        maxValue = 100000;
    } else {
        maxValue = 10000;
    }
    // Calculate color for each state based on yearly data
    dataArray.forEach(function(row) {

        var red = (row["Amount"] / maxValue) * 255;
        var color = "rgba(" + red + ", " + 0 + ", " + 0 + ", 1)";
        expressionArray.push(row[rowName], color);
    });


    // Last value is the default, used where there is no data
    expressionArray.push("rgba(0,0,0,0)");
}


function getCSVFloatColumnData(columnValueName, allText, newData, columnName) {
    var allTextLines = allText.split(/\r\n|\n/);
    var headers = allTextLines[0].split(',');
    var tempData = new Map();

    for (var i=1; i<allTextLines.length; i++) {
        var data = allTextLines[i].split(',');
        if (data.length == headers.length) {

            for (var j=0; j<headers.length; j++) {
                tempData.set(headers[j],data[j]);
            }

            newData.push({"STATE": tempData.get(columnName), "Amount": parseFloat(tempData.get(columnValueName))})
        }
    }
}

function generatePopup(chartColumns, feature, featureHeader, clickPos) {

    if(currentLayer === 'states') {
        getChartData(chartColumns, stateCsvData, tempData2, feature.properties.STATE);
    } else {
        getChartData(chartColumns, zipCsvData, tempData2, feature.properties.COUNTY);
    }

    var popup = new mapboxgl.Popup({offset: [0, -15]})
        .setLngLat(clickPos.lngLat)

        .setHTML('<img src="img/Mastercard.png" style="width=140px; height:50px; margin:auto;"><br>' +
            '<table>' +
            '<tr><th><h3>Location</h3></th>' +
            '<th><h3>Value</h3></th></tr>' +
            '<tr><td><h3>' + featureHeader + '</h3></td>' +
            '<td><h3>$' + tempData2[datasetPosition - 1] + '</h3></td></tr></table>').addTo(map);

    generateChart(chartColumns, tempData2)
}

function switchLayer(input) {

    var data = [];
    var expression = ["match", ["get", "STATE"]];
    var expression2 = ["match", ["get", "COUNTY"]];

    if(currentLayer === 'states') {
        getCSVFloatColumnData(input.target.id, stateCsvData, data, 'State');
        assignVectorColours(data, expression, "STATE", 'states');
        map.setPaintProperty('states-join', 'fill-color', expression);
    } else {
        getCSVFloatColumnData(input.target.id, zipCsvData, data, 'State');
        assignVectorColours(data, expression2, "STATE", 'counties');
        map.setPaintProperty('zip-join', 'fill-color', expression2);
    }
    datasetPosition = input.target.value;
}

function addLegend(dataset) {
    var colors = ['#000000', '#240000', '#490000', '#6D0000', '#920000', '#B60000', '#DB0000', '#FF0000'];
    var layers;
    var legendText;
    var legendDiv = document.getElementById('legend');

    if(dataset === 'states'){
        layers = ['0-12,500', '12,500-25,000', '25,000-37,500', '37,500-50,000', '50,000-62,500', '62,500-75,000', '75,000-87,500', '87,500+'];
        legendText = 'U.S. States';
    } else {
        layers = ['0-1250', '1250-2500', '2500-3750', '3750-5000', '5000-6250', '6250-7500', '7500-8750', '8750+'];
        legendText = 'U.S. Counties';
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

function findLocationNamesBetweenValues(dataArray, filteredData, startValue, endValue) {
    dataArray.forEach(function(row) {
        if(row['Amount'] >= startValue && row['Amount'] <= endValue) {
            filteredData.push(row['STATE']);
        }
    });
}

function addFilterUI(){
    $( function() {
        $( "#slider-range" ).slider({
            range: true,
            min: 0,
            max: 100000,
            values: [ 0, 100000 ],
            step: 8,
            orientation: "vertical",
            slide: function( event, ui ) {
                $( "#amount" ).val( "$" + ui.values[ 0 ] + " - $" + ui.values[ 1 ] );
            }
        });
        $( "#amount" ).val( "$" + $( "#slider-range" ).slider( "values", 0 ) +
            " - $" + $( "#slider-range" ).slider( "values", 1 ) );
    } );
}