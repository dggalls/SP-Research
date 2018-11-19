function generateChart(chartLabels, chartData) {
    chartData = chartData.slice(0,12);
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

    console.log(chartData);

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

function getChartData(allText, name) {
    if(currentLayer === 'Cities') {
        var newData = allText[name.toUpperCase()];
    } else {
        var newData = allText[name];
    }

    if(currentLayer === 'Cities' || currentLayer === 'Zips') {
        newData = newData.slice(0, 12);
    } else {
        newData = newData.slice(0, 24);
    }

    return newData
}

function getChartColumns(currentLayer) {
    var chartColumns = [];
    var size;

    if(currentLayer === 'Zips' || currentLayer === 'Cities') {
        size = 12; } else {
        size = 12; }

    for(var i = 0; i < size; i++){
        chartColumns.push('M' + (i+1) + ' ');
    }
    return chartColumns;
}