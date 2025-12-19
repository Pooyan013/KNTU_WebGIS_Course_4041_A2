const map = new ol.Map({
    target: 'map',
    layers: [
        new ol.layer.Tile({
            source: new ol.source.OSM()
        })
    ],
    view: new ol.View({
        center: ol.proj.fromLonLat([50.2936, 37.1371]), // North Till I Die
        zoom: 10
    })
});


document.getElementById('searchBtn').addEventListener('click', () => {
    const query = document.getElementById('searchInput').value;
    console.log(query);
});

document.getElementById('searchBtn').addEventListener('click', async () => {
    const query = document.getElementById('searchInput').value;

    if (!query) {
        alert("Please enter a location");
        return;
    }

    try {
        const url = `https://us1.locationiq.com/v1/search.php?key=${API_KEY}&q=${encodeURIComponent(query)}&format=json`;
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error("API error");
        }

        const data = await response.json();

        if (!data.length) {
            alert("Location not found");
            return;
        }

        const lon = parseFloat(data[0].lon);
        const lat = parseFloat(data[0].lat);

        map.getView().animate({
            center: ol.proj.fromLonLat([lon, lat]),
            zoom: 12,
            duration: 1500
        });

    } catch (error) {
        alert("Location not found or API error");
        console.error(error);
    }
});
