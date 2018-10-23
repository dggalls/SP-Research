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

