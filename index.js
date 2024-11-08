const weatherForm = document.querySelector(".weatherForm");
const cityInput = document.querySelector(".cityInput");
const card = document.querySelector(".card");
const historyList = document.querySelector(".history-list");
const apiKey = "a10703c4498ecba30f1f7e2bde495c0c";
const searchHistory = []; // Array to store search history
let unit = 'metric';  // Default unit is Celsius

weatherForm.addEventListener("submit", async event => {
    event.preventDefault();

    const city = cityInput.value;
    if (city) {
        try {
            const weatherData = await getWeatherData(city);
            displayWeatherInfo(weatherData);
            updateSearchHistory(city); // Add to search history
        } catch (error) {
            console.error(error);
            displayError(error);
        }
    } else {
        displayError("Please enter a city");
    }
});

// Fetch weather data based on city and unit
async function getWeatherData(city) {
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=${unit}&appid=${apiKey}`;
    const response = await fetch(apiUrl);

    if (!response.ok) {
        throw new Error("Could not fetch weather data");
    }

    return await response.json();
}

// Display weather data including the toggle button
function displayWeatherInfo(data) {
    const { name: city, main: { temp, humidity }, weather: [{ description, id }] } = data;


    
    
    // Log the raw data to debug
    console.log(`Raw temp value from API: ${temp}`); // Check the temperature returned

    // Adjust temperature based on the selected unit
    let temperature;
    if (unit === 'metric') {
        temperature = temp; // Celsius
    } else if (unit === 'imperial') {
        // Convert Celsius to Fahrenheit
        temperature = temp;
    }

    // Log temperature before and after conversion
    console.log(`Temperature in ${unit === 'metric' ? 'Celsius' : 'Fahrenheit'}: ${temperature}`);

    const unitSymbol = unit === 'metric' ? '°C' : '°F'; // Update unit symbol

    // Update background color based on weather conditions
    const backgroundImage = getBackgroundImage(id);
    document.body.style.backgroundImage = `url(${backgroundImage})`;

    card.textContent = "";
    card.style.display = "flex";

    const cityDisplay = document.createElement("h1");
    const tempDisplay = document.createElement("p");
    const humidityDisplay = document.createElement("p");
    const descDisplay = document.createElement("p");
    const weatherEmoji = document.createElement("p");
    const unitToggleButton = document.createElement("button");
    const tempValue = document.createElement("span");

    // Set the elements' content
    cityDisplay.textContent = city;
    tempValue.textContent = `${temperature.toFixed(1)}`; // Display only the number
    humidityDisplay.textContent = `Humidity: ${humidity}%`;
    descDisplay.textContent = description;
    weatherEmoji.textContent = getWeatherEmoji(id);

    // Set classes for styling
    cityDisplay.classList.add("cityDisplay");
    tempDisplay.classList.add("tempDisplay");
    humidityDisplay.classList.add("humidityDisplay");
    descDisplay.classList.add("descDisplay");
    weatherEmoji.classList.add("weatherEmoji");

    // Set properties for unit toggle button
    unitToggleButton.textContent = unitSymbol;
    unitToggleButton.id = "unit-toggle";
    unitToggleButton.style.fontSize = "1.5rem";
    unitToggleButton.style.marginLeft = "10px";
    unitToggleButton.style.backgroundColor = "transparent";
    unitToggleButton.style.border = "none";
    unitToggleButton.style.cursor = "pointer";
    unitToggleButton.style.fontWeight = "bold";
    unitToggleButton.style.display = "inline-block";

    // Append elements to the card
    card.appendChild(cityDisplay);
    card.appendChild(tempDisplay);
    tempDisplay.appendChild(tempValue); // Append tempValue inside tempDisplay
    tempDisplay.appendChild(unitToggleButton); // Append the unit toggle button to the tempDisplay
    card.appendChild(humidityDisplay);
    card.appendChild(descDisplay);
    card.appendChild(weatherEmoji);

    // Show unit toggle button
    unitToggleButton.style.display = "inline-block"; // Show the toggle button
    unitToggleButton.textContent = unitSymbol; // Set the text to °C or °F

    // Set up unit toggle button click event
    unitToggleButton.addEventListener("click", () => {
        unit = (unit === 'metric') ? 'imperial' : 'metric';  // Toggle between metric and imperial
        weatherForm.dispatchEvent(new Event('submit')); // Re-fetch the weather with the new unit
    });

    renderSearchHistory(); // Update search history
}

// Function to update the background color based on weather ID
function getBackgroundImage(weatherId) {
    switch (true) {
        case (weatherId >= 200 && weatherId < 300): // Thunderstorm
            return "https://media.tenor.com/jSVVsppRT-MAAAAM/rain-lightning.gif";
        case (weatherId >= 300 && weatherId < 400): // Drizzle
            return "https://media.tenor.com/SV4ppzqpVtIAAAAM/anime-rain.gif";
        case (weatherId >= 500 && weatherId < 600): // Rain
            return "https://media.tenor.com/GeiuKcl9VxIAAAAM/coffee.gif";
        case (weatherId >= 600 && weatherId < 700): // Snow
            return "https://media.tenor.com/f6Z_JUiELaMAAAAM/winter-wonderland-snow.gif";
        case (weatherId >= 700 && weatherId < 800): // Atmosphere
            return "https://media.tenor.com/5ImWLS5QAJgAAAAM/foggy-fog.gif";
        case (weatherId === 800): // Clear
            return "https://media.tenor.com/4IkfSV_2jxQAAAAM/sky-sun.gifhttps://media.tenor.com/4IkfSV_2jxQAAAAM/sky-sun.gif";
        case (weatherId >= 801 && weatherId < 810): // Clouds
            return "https://media.tenor.com/tQWmGFB9_SYAAAAM/moving-clouds-world-meteorological-day.gif";
        default:
            return "";
    }
}

// Render search history
function renderSearchHistory() {
    historyList.innerHTML = ""; // Clear previous history

    if (searchHistory.length > 0) {
        searchHistory.forEach(city => {
            const historyItem = document.createElement("p");
            historyItem.textContent = city;
            historyItem.addEventListener("click", () => {
                cityInput.value = city;
                weatherForm.dispatchEvent(new Event('submit'));
            });
            historyList.appendChild(historyItem);
        });
    } else {
        historyList.textContent = "No search history yet.";
    }
}
// Update search history
function updateSearchHistory(city) {
    if (!searchHistory.includes(city)) {
        searchHistory.push(city);
        renderSearchHistory();
    }
}

// Clear search history
document.querySelector(".clear-history").addEventListener("click", () => {
    searchHistory.length = 0;
    historyList.innerHTML = "";
});

// Weather emoji based on weather condition ID
function getWeatherEmoji(weatherId) {
    switch (true) {
        case (weatherId >= 200 && weatherId < 300):
            return "⛈️"; // Thunderstorm
        case (weatherId >= 300 && weatherId < 400):
            return "🌧️"; // Drizzle
        case (weatherId >= 500 && weatherId < 600):
            return "☔"; // Rain
        case (weatherId >= 600 && weatherId < 700):
            return "❄️"; // Snow
        case (weatherId >= 700 && weatherId < 800):
            return "🌫️"; // Fog
        case (weatherId === 800):
            return "☀️"; // Clear
        case (weatherId >= 801 && weatherId < 810):
            return "☁️"; // Clouds
        default:
            return "?"; // Unknown
    }
}

// Display error message
function displayError(message) {
    const errorDisplay = document.createElement("p");
    errorDisplay.textContent = message;
    errorDisplay.classList.add("errorDisplay");
    card.textContent = "";
    card.style.display = "flex";
    card.appendChild(errorDisplay);
}
function convertCelsiusToFahrenheit(celsius) {
    const fahrenheit = (celsius * 9 / 5) + 32;
    console.log("Converted Fahrenheit:", fahrenheit); // Log the Fahrenheit conversion
    return fahrenheit;
}
