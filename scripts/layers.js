function loadLayer() {
    map.on('load', function() {

        var tempData2 = [];

        map.addSource("amCounties", {
            type: "vector",
            url: "mapbox://apipilots.bfqwghzn"
        });

        map.addLayer({
            "id": "Counties",
            "type": "fill",
            "source": "amCounties",
            "source-layer": "USCounties-62z5k5",
            'layout': {
                'visibility': 'none'
            },
            "paint": {
                "fill-color": 'red',
                "fill-outline-color": '#FFFFFF',
                'fill-opacity': 0.6
            }
        });

        map.addSource("amStates", {
            type: "vector",
            url: "mapbox://apipilots.4b3gju1c"
        });


        map.addLayer({
            "id": "States",
            "type": "fill",
            "source": "amStates",
            "source-layer": "US_States_WithCode-8b4do5",
            'layout': {
                'visibility': 'none'
            },
            "paint": {
                "fill-color": 'red',
                'fill-opacity': 0.6,
                "fill-outline-color": '#FFFFFF',
            }
        });

        map.addSource("amOutline", {
            type: "vector",
            url: "mapbox://apipilots.c622jhsh"
        });


        map.addLayer({
            "id": "Outline",
            "type": "fill",
            "source": "amOutline",
            "source-layer": "USOutline-47n74h",
            'layout': {
                'visibility': 'none'
            },
            "paint": {
                "fill-color": 'rgb(255,146,0)',
                'fill-opacity': 0.6,
                "fill-outline-color": '#FFFFFF'
            }
        });

        map.addSource("amZips", {
            type: "vector",
            url: "mapbox://apipilots.d51ewehf"
        });


        map.addLayer({
            "id": "Zips",
            "type": "fill",
            "source": "amZips",
            "source-layer": "USZips",
            'layout': {
                'visibility': 'none'
            },
            "paint": {
                "fill-color": 'red',
                'fill-opacity': 0.6,
                "fill-outline-color": '#FFFFFF'
            }
        });

        map.addSource("amCities", {
            type: "vector",
            url: "mapbox://apipilots.3904vs4m"
        });


        map.addLayer({
            "id": "Cities",
            "type": "fill",
            "source": "amCities",
            "source-layer": "us_cities-5d0lcu",
            'layout': {
                'visibility': 'visible'
            },
            "paint": {
                "fill-color": 'rgb(255,146,0)',
                'fill-opacity': 0.6,
                "fill-outline-color": '#FFFFFF'
            }
        });

        map.addSource("amMSA", {
            type: "vector",
            url: "mapbox://apipilots.c2bxp7gu"
        });


        map.addLayer({
            "id": "MSA",
            "type": "fill",
            "source": "amMSA",
            "source-layer": "USMSA-30pqcv",
            'layout': {
                'visibility': 'none'
            },
            "paint": {
                "fill-color": 'rgb(255,90,0)',
                'fill-opacity': 0.6,
                "fill-outline-color": '#FFFFFF'
            }
        });

        addLegend('States');

        addFilterUI();

        datasetPosition = 1;

    });





    function hideAllBut(shownLayer) {
        var layers = ['States', 'Counties', 'MSA', 'Outline', 'Cities', 'Zips'];
        layers.forEach(function (layer) {
            if(layer === shownLayer) {
                map.setLayoutProperty(shownLayer, 'visibility', 'visible');
                currentLayer = shownLayer;
            } else {
                map.setLayoutProperty(layer, 'visibility', 'none');
            }
        });
        addLegend('Counties');
    }

    map.on('zoom', function() {
        var chartName = document.getElementById("chart-name");

        if(map.getZoom() < 3.5) {
            hideAllBut('Cities')
        } else if (map.getZoom() < 6 && map.getZoom() >=3.5){
            hideAllBut('States');
        } else if(map.getZoom() >= 6 && map.getZoom() <7) {
            hideAllBut('MSA');
        } else if(map.getZoom() >= 7 && map.getZoom() < 8) {
            hideAllBut('Counties');
        } else if(map.getZoom() >= 8 && map.getZoom() < 9.0) {
            hideAllBut('Cities');
        } else if(map.getZoom() >= 9.0) {
            hideAllBut('Zips');
        }
    });


}