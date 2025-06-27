// No API key needed for Open-Meteo!
let units = "imperial";
let units_temp = `&deg;F`;
let units_humid = `%`;
let units_speed = "mph";

let omGeocode = new OMGeocode();
let omWeather = new OMWeather(units);
let omForecast = new OMForecast(units);
let omPollution = new OMPollution();

///////////////////////////////////////////////////////////////
// LOCATION - translate from city, state, country to lat/lon //
///////////////////////////////////////////////////////////////

function displayLocation() {
    const loc = document.getElementById("location");
    loc.innerHTML = `${omGeocode.getName()}`;
    if (omGeocode.getState()) {
        loc.innerHTML += `, ${omGeocode.getState()}`;
    }
    loc.innerHTML += `, ${omGeocode.getCountry()}`;
}

///////////////////////////////////////////////////////////////
// WEATHER - the current weather conditions                  //
///////////////////////////////////////////////////////////////

function displayWeather() {
    const weatherReport = document.getElementById("weather-report");

    // Weather Condition Strings
    let cond = omWeather.json.weather[0].main;
    cond = cond.toLowerCase();
    let condLong = omWeather.json.weather[0].description;
    condLong = condLong.toLowerCase();
    let condReport = `The current weather condition is "${condLong}" or "${cond}".`;

    // Weather Condition ID
    const condIdURL = "https://open-meteo.com/en/docs#weather-codes";
    let condId = omWeather.json.weather[0].id;
    let condIdReport = `The condition ID is ${condId} which can <a href=${condIdURL} target="_blank">help sort by possible conditions</a>.`;

    // Temperature and Feels-Like
    let temp = omWeather.json.main.temp;
    let tempFeel = omWeather.json.main.feels_like;
    temp = temp.toFixed(1);
    tempFeel = tempFeel.toFixed(1);
    let tempReport = `The temperature is ${temp}${units_temp} and it feels like ${tempFeel}${units_temp}.`;
    
    // Use OpenWeatherMap's icon for visual representation
    let iconCode = omWeather.json.weather[0].icon;
    let description = omWeather.json.weather[0].description;
    let iconHtml = getWeatherIconHtml(iconCode, description);

    weatherReport.innerHTML = `${condReport}<br>${condIdReport}<br>${tempReport}<br>${iconHtml}`;

    // Update the body background based on weather
    updateBackgroundByWeather();
}

// Helper function to get weather icon HTML based on icon code
function getWeatherIconHtml(iconCode, description) {
    // OpenWeatherMap provides icons via a CDN.
    // Example: https://openweathermap.org/img/wn/01d@2x.png
    const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
    return `<img src="${iconUrl}" alt="${description} icon" class="weather-icon">`;
}

// Map OpenWeatherMap icon codes to background gradients and text color preference
const weatherBackgrounds = new Map([
    // Clear Sky
    ['01d', { gradient: 'linear-gradient(to bottom, #87CEEB, #ADD8E6)', isLight: true }], // Clear day: light blue sky
    ['01n', { gradient: 'linear-gradient(to bottom, #0A1931, #1E3D59)', isLight: false }], // Clear night: dark blue night sky

    // Clouds
    ['02d', { gradient: 'linear-gradient(to bottom, #B0C4DE, #D3D3D3)', isLight: true }], // Few clouds day: light grey/blue-grey
    ['02n', { gradient: 'linear-gradient(to bottom, #34495E, #5D6D7E)', isLight: false }], // Few clouds night: darker grey/blue-grey
    ['03d', { gradient: 'linear-gradient(to bottom, #A9B7C6, #C0CEDA)', isLight: true }], // Scattered clouds day: light grey/blue-grey
    ['03n', { gradient: 'linear-gradient(to bottom, #34495E, #5D6D7E)', isLight: false }], // Scattered clouds night: darker grey/blue-grey
    ['04d', { gradient: 'linear-gradient(to bottom, #7F8C8D, #95A5A6)', isLight: false }], // Broken clouds day: darker grey
    ['04n', { gradient: 'linear-gradient(to bottom, #2C3E50, #34495E)', isLight: false }], // Broken clouds night: very dark grey

    // Rain / Drizzle
    ['09d', { gradient: 'linear-gradient(to bottom, #5F7C8A, #7F9CA8)', isLight: false }], // Shower rain day: blue-grey rain
    ['09n', { gradient: 'linear-gradient(to bottom, #2C3E50, #4A627A)', isLight: false }], // Shower rain night: dark blue-grey rain
    ['10d', { gradient: 'linear-gradient(to bottom, #5F7C8A, #7F9CA8)', isLight: false }], // Rain day: blue-grey rain
    ['10n', { gradient: 'linear-gradient(to bottom, #2C3E50, #4A627A)', isLight: false }], // Rain night: dark blue-grey rain

    // Thunderstorm
    ['11d', { gradient: 'linear-gradient(to bottom, #2C3E50, #34495E)', isLight: false }], // Thunderstorm day: stormy dark
    ['11n', { gradient: 'linear-gradient(to bottom, #2C3E50, #34495E)', isLight: false }], // Thunderstorm night: stormy dark

    // Snow
    ['13d', { gradient: 'linear-gradient(to bottom, #E0FFFF, #B0E0E6)', isLight: true }], // Snow day: light blue/white snow
    ['13n', { gradient: 'linear-gradient(to bottom, #B0C4DE, #D3D3D3)', isLight: false }], // Snow night: darker snow

    // Mist / Atmosphere
    ['50d', { gradient: 'linear-gradient(to bottom, #D3D3D3, #E0E0E0)', isLight: true }], // Mist day: light hazy
    ['50n', { gradient: 'linear-gradient(to bottom, #A9B7C6, #C0CEDA)', isLight: false }], // Mist night: darker hazy
]);

// Function to update the body background based on weather conditions
function updateBackgroundByWeather() {
    const body = document.body;
    const iconCode = omWeather.json.weather[0].icon;

    let backgroundInfo = weatherBackgrounds.get(iconCode);

    if (!backgroundInfo) {
        console.warn(`Unknown weather icon code: ${iconCode}. Using default background.`);
        backgroundInfo = { gradient: 'linear-gradient(to bottom, #1f001f, #330033)', isLight: false }; // Fallback to original dark purple
    }

    body.style.backgroundImage = backgroundInfo.gradient;

    if (backgroundInfo.isLight) {
        body.classList.add('light-background');
    } else {
        body.classList.remove('light-background');
    }
}

/* Old getWeatherEmoji function (no longer used, can be removed if desired)
function getWeatherEmoji(condition) { // This function currently takes 'condition' (e.g., "Clear", "Clouds")
    const emojiMap = { // This map is for emojis, not image icons
        "Clear": "☀️", 
        "Rain": "🌧️",
        "Drizzle": "🌦️",
        "Thunderstorm": "⛈️",
        "Snow": "❄️",
        "Mist": "🌫️",
        "Fog": "🌫️"
    };
    return emojiMap[condition] || "🌤️";
}*/

///////////////////////////////////////////////////////////////
// FORECAST                                                  //
///////////////////////////////////////////////////////////////

// See https://openweathermap.org/forecast5#5days

function displayForecast() {
    var table = document.getElementById('forecast-table');
    table.innerHTML = '';

    const headerColText = ["Time", "Temperature", "Condition", "Humidity", "Icon"];
    var header = document.createElement('tr');
    for (var j = 0; j < headerColText.length; j++) { // number of columns
        var cell = document.createElement('th');
        cell.textContent = headerColText[j];
        header.appendChild(cell);
    }
    table.appendChild(header);

    // Add the current weather if available
    if (omWeather.json !== undefined) {
        var row = createRow(omWeather.json);
        table.appendChild(row);
    }

    for (let i = 0; i < omForecast.json.list.length; i++) { // up to 40
        var row = createRow(omForecast.json.list[i]);
        table.appendChild(row);
    }
}

function createRow(json) {
    var row = document.createElement('tr');
    var cell;

    cell = document.createElement('td');
    cell.innerHTML = omForecast.convertTimecode(json.dt);
    row.appendChild(cell);

    cell = document.createElement('td');
    cell.innerHTML = `${json.main.temp.toFixed(1)}${units_temp}`;
    row.appendChild(cell);

    cell = document.createElement('td');
    cell.innerHTML = json.weather[0].main;
    row.appendChild(cell);

    cell = document.createElement('td');
    cell.innerHTML = `${json.main.humidity}${units_humid}`;
    row.appendChild(cell);

    cell = document.createElement('td');
    // Use weather icon from OpenWeatherMap CDN
    cell.innerHTML = getWeatherIconHtml(json.weather[0].icon, json.weather[0].description);
    row.appendChild(cell);

    return row;
}

///////////////////////////////////////////////////////////////
// POLLUTION - the air quality index (AQI) and contaminants  //
///////////////////////////////////////////////////////////////

function displayPollution() {
    const pollutionReport = document.getElementById("pollution-report");

    // Weather Condition Strings
    let aqi = parseInt(omPollution.json.list[0].main.aqi);
    let aqiReport = `The current Air Quality Index (AQI) is ${aqi}.`;

    pollutionReport.innerHTML = `${aqiReport}<br>Components: ${JSON.stringify(omPollution.json.list[0].components)}`;
}