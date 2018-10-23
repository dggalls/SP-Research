function loadLayer() {
    map.on('load', function() {

        map.addSource("AmericaStates", {
            type: "vector",
            url: "mapbox://dggalls.cjnd92u7e02is2voioguvw5cr-05azb"
        });

        map.addLayer({
            "id": "states-join",
            "type": "fill",
            "source": "AmericaStates",
            "source-layer": "AmericaStates",
            "paint": {
                "fill-color": expression
            }
        });
    });
}


function assignVectorColours(dataArray) {
    var maxValue = 130000;

    // Calculate color for each state based on the unemployment rate
    dataArray.forEach(function(row) {
        var green = (row["Amount"] / maxValue) * 255;
        var color = "rgba(" + 0 + ", " + green + ", " + 0 + ", 1)";
        expression.push(row["STATE"], color);
    });


    // Last value is the default, used where there is no data
    expression.push("rgba(0,0,0,0)");
}


function getCSVFloatColumnData(columnName, allText, newData) {
    var allTextLines = allText.split(/\r\n|\n/);
    var headers = allTextLines[0].split(',');
    var tempData = new Map();

    for (var i=1; i<allTextLines.length; i++) {
        var data = allTextLines[i].split(',');
        if (data.length == headers.length) {

            for (var j=0; j<headers.length; j++) {
                tempData.set(headers[j],data[j]);
            }

            newData.push({"STATE": tempData.get("State"), "Amount": parseFloat(tempData.get(columnName))})
        }
    }
}

