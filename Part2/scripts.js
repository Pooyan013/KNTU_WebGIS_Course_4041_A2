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

const weatherDiv = document.getElementById('weatherInfo');

function fetchWeather(lat, lon) {
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`;
    weatherDiv.innerHTML = 'Loading...';

    fetch(url)
        .then(response => {
            if (!response.ok) throw new Error('Weather data not found');
            return response.json();
        })
        .then(data => {
            const temp = data.main.temp;
            const humidity = data.main.humidity;
            const condition = data.weather[0].description;

            weatherDiv.innerHTML = `
                <strong>Weather Info:</strong><br>
                Temperature: ${temp}°C<br>
                Humidity: ${humidity}%<br>
                Condition: ${condition}
            `;
        })
        .catch(err => {
            weatherDiv.innerHTML = `Error: ${err.message}`;
        });
}

map.on('click', function (evt) {
    const coord = ol.proj.toLonLat(evt.coordinate);
    const [lon, lat] = coord;
    console.log(`Clicked coordinates: ${lat}, ${lon}`);
    fetchWeather(lat, lon);
});

document.getElementById('searchBtn').addEventListener('click', () => {
    const query = document.getElementById('searchInput').value;
    if (!query) return;

    const geocodeUrl = `https://us1.locationiq.com/v1/search.php?key=${API_KEY_Loc}&q=${encodeURIComponent(query)}&format=json`;

    fetch(geocodeUrl)
        .then(res => {
            if (!res.ok) throw new Error('Location not found');
            return res.json();
        })
        .then(data => {
            const lat = parseFloat(data[0].lat);
            const lon = parseFloat(data[0].lon);
            const coord = ol.proj.fromLonLat([lon, lat]);

            map.getView().animate({ center: coord, zoom: 12 });

            fetchWeather(lat, lon);
        })
        .catch(err => {
            weatherDiv.innerHTML = `Error: ${err.message}`;
        });
});
