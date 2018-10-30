function generateChart(chartLabels, chartData) {
    var chart = new Chartist.Line('.ct-chart', {
        labels: chartLabels,
        series: [chartData]
    }, {
        low: 0,
        showArea: true,
        showGrid: false,
        showPoint: false,
        width: '480px',
        height: '250px'
    });

    chart.on('draw', function (data) {
        if (data.type === 'line' || data.type === 'area') {
            data.element.animate({
                d: {
                    begin: 800 * data.index, //Length between each animation
                    dur: 600, //Length of each animation
                    from: data.path.clone().scale(1, 0).translate(0, data.chartRect.height()).stringify(),
                    to: data.path.clone().stringify(),
                    easing: Chartist.Svg.Easing.easeOutQuint
                }
            });
        }
    });
}

function getChartData(columnNames, allText, newData, locationName) {
    var allTextLines = allText.split(/\r\n|\n/);
    var headers = allTextLines[0].split(',');
    var tempData = new Map();

    for (var i=1; i<allTextLines.length; i++) {
        var data = allTextLines[i].split(',');
        if (data.length == headers.length) {

            for (var j=0; j<headers.length; j++) {
                tempData.set(headers[j],data[j]);
            }

            if(tempData.get("State") === locationName) {
                for(var k=0; k<columnNames.length; k++) {
                    newData.push(parseFloat(tempData.get(columnNames[k])))
                }
            }
        }
    }
}