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
                "fill-outline-color": '#000000',
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
            "minZoom": 9,
            "maxZoom": 10,
            'layout': {
                'visibility': 'visible'
            },
            "paint": {
                "fill-color": expression,
                'fill-opacity': 0.6
            }
        });

    });
}

function assignVectorColours(dataArray, expressionArray, rowName) {

    var maxValue = 100000;

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

    console.log(feature);

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
        assignVectorColours(data, expression, "STATE");
        map.setPaintProperty('states-join', 'fill-color', expression);
    } else {
        getCSVFloatColumnData(input.target.id, zipCsvData, data, 'State');
        assignVectorColours(data, expression2, "STATE");
        map.setPaintProperty('zip-join', 'fill-color', expression2);
    }

    datasetPosition = input.target.value;
}

