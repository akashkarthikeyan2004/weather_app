const weatherForm = document.querySelector(".weatherForm");
const cityInput = document.querySelector(".cityInput");
const card = document.querySelector(".card");
const historyList = document.querySelector(".history-list");
const apiKey = "a10703c4498ecba30f1f7e2bde495c0c";
const searchHistory = []; // Array to store search history

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

// Function to fetch weather data
async function getWeatherData(city) {
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;
    const response = await fetch(apiUrl);

    if (!response.ok) {
        throw new Error("Could not fetch weather data");
    }

    return await response.json();
}

// Function to display weather information
function displayWeatherInfo(data) {
    const { name: city, main: { temp, humidity }, weather: [{ description, id }] } = data;

    // Change background color based on weather
    document.body.style.backgroundColor = getBackgroundColor(id);

    card.textContent = "";
    card.style.display = "flex";

    const cityDisplay = document.createElement("h1");
    const tempDisplay = document.createElement("p");
    const humidityDisplay = document.createElement("p");
    const descDisplay = document.createElement("p");
    const weatherEmoji = document.createElement("p");

    cityDisplay.textContent = city;
    tempDisplay.textContent = `${(temp - 273.15).toFixed(1)}°C`;
    humidityDisplay.textContent = `Humidity: ${humidity}%`;
    descDisplay.textContent = description;
    weatherEmoji.textContent = getWeatherEmoji(id);

    cityDisplay.classList.add("cityDisplay");
    tempDisplay.classList.add("tempDisplay");
    humidityDisplay.classList.add("humidityDisplay");
    descDisplay.classList.add("descDisplay");
    weatherEmoji.classList.add("weatherEmoji");

    card.appendChild(cityDisplay);
    card.appendChild(tempDisplay);
    card.appendChild(humidityDisplay);
    card.appendChild(descDisplay);
    card.appendChild(weatherEmoji);

    renderSearchHistory(); // Ensure the search history is updated when new weather data is displayed
}

// Function to get background color based on weather ID
function getBackgroundColor(weatherId) {
    switch (true) {
        case (weatherId >= 200 && weatherId < 300): // Thunderstorm
            return "rgba(85, 85, 255, 0.5)"; // Light blue
        case (weatherId >= 300 && weatherId < 400): // Drizzle
            return "rgba(173, 216, 230, 0.5)"; // Light sky blue
        case (weatherId >= 500 && weatherId < 600): // Rain
            return "rgba(0, 0, 255, 0.5)"; // Blue
        case (weatherId >= 600 && weatherId < 700): // Snow
            return "rgba(255, 250, 250, 0.5)"; // Snow white
        case (weatherId >= 700 && weatherId < 800): // Atmosphere (fog, mist)
            return "rgba(169, 169, 169, 0.5)"; // Dark gray
        case (weatherId === 800): // Clear
            return "rgba(255, 223, 186, 0.5)"; // Light orange
        case (weatherId >= 801 && weatherId < 810): // Clouds
            return "rgba(211, 211, 211, 0.5)"; // Light gray
        default:
            return "rgba(195, 221, 223, 0.5)"; // Default grayish background
    }
}

// Function to update search history
function updateSearchHistory(city) {
    // Avoid duplicates in history
    if (!searchHistory.includes(city)) {
        searchHistory.push(city);
        renderSearchHistory();
    }
}

// Function to render search history
function renderSearchHistory() {
    historyList.innerHTML = ""; // Clear previous history
    searchHistory.forEach(city => {
        const historyItem = document.createElement("p");
        historyItem.textContent = city;

        // Add click event to fetch weather for this city
        historyItem.addEventListener("click", () => {
            cityInput.value = city;
            weatherForm.dispatchEvent(new Event('submit')); // Trigger the submit event
        });

        historyList.appendChild(historyItem);
    });
}

// Function to clear search history
document.querySelector(".clear-history").addEventListener("click", () => {
    searchHistory.length = 0; // Clear the array
    historyList.innerHTML = ""; // Clear the display
});

// Function to get weather emoji
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

// Function to display error message
function displayError(message) {
    const errorDisplay = document.createElement("p");
    errorDisplay.textContent = message;
    errorDisplay.classList.add("errorDisplay");

    card.textContent = "";
    card.style.display = "flex";
    card.appendChild(errorDisplay);
}
