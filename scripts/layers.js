function loadLayer() {
    map.on('load', function() {

        var tempData2 = [];

        map.addSource("amCounties", {
            type: "vector",
            url: "mapbox://apipilots.7jv56krv"
        });

        map.addLayer({
            "id": "Counties",
            "type": "fill",
            "source": "amCounties",
            "source-layer": "MBI_US_R2017_Counties",
            'layout': {
                'visibility': 'none'
            },
            "paint": {
                "fill-color": '#000000',
                "fill-outline-color": '#FFFFFF',
                'fill-opacity': 0.6
            }
        });

        map.addSource("amStates", {
            type: "vector",
            url: "mapbox://apipilots.d2pm165l"
        });


        map.addLayer({
            "id": "States",
            "type": "fill",
            "source": "amStates",
            "source-layer": "MBI_US_R2017_States",
            'layout': {
                'visibility': 'none'
            },
            "paint": {
                "fill-color": '#000000',
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
                'visibility': 'visible'
            },
            "paint": {
                "fill-color": 'rgb(255,146,0)',
                'fill-opacity': 0.6,
                "fill-outline-color": '#FFFFFF'
            }
        });

        map.addSource("amZips", {
            type: "vector",
            url: "mapbox://apipilots.90cksls8"
        });


        map.addLayer({
            "id": "Zips",
            "type": "fill",
            "source": "amZips",
            "source-layer": "MBI_US_R2017_Postcodes5",
            'layout': {
                'visibility': 'none'
            },
            "paint": {
                "fill-color": expression,
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
                'visibility': 'none'
            },
            "paint": {
                "fill-color": 'rgb(255,146,0)',
                'fill-opacity': 0.6,
                "fill-outline-color": '#FFFFFF'
            }
        });

        map.addSource("amDMA", {
            type: "vector",
            url: "mapbox://apipilots.6303viky"
        });


        map.addLayer({
            "id": "DMA",
            "type": "fill",
            "source": "amDMA",
            "source-layer": "USDMAs-6y1e0i",
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
        var layers = ['States', 'Counties', 'DMA', 'Outline', 'Cities', 'Zips'];
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
            hideAllBut('Outline')
        } else if (map.getZoom() < 6 && map.getZoom() >=3.5){
            hideAllBut('States');
        } else if(map.getZoom() >= 6 && map.getZoom() <7) {
            hideAllBut('DMA');
        } else if(map.getZoom() >= 7 && map.getZoom() < 8) {
            hideAllBut('Counties');
        } else if(map.getZoom() >= 8 && map.getZoom() < 9.0) {
            hideAllBut('Cities');
        } else if(map.getZoom() >= 9.0) {
            hideAllBut('Zips');
        }
    });
}