const weatherForm = document.querySelector(".weatherForm");
const cityInput = document.querySelector(".cityInput");
const card = document.querySelector(".card");
const historyList = document.querySelector(".history-list");
const apiKey = "a10703c4498ecba30f1f7e2bde495c0c";
const searchHistory = []; 
let unit = 'metric';  

weatherForm.addEventListener("submit", async event => {
    event.preventDefault();

    const city = cityInput.value;
    if (city) {
        try {
            const weatherData = await getWeatherData(city);
            displayWeatherInfo(weatherData);
            updateSearchHistory(city); 
        } catch (error) {
            console.error(error);
            displayError(error);
        }
    } else {
        displayError("Please enter a city");
    }
});

async function getWeatherData(city) {
    const apiUrl = https://api.openweathermap.org/data/2.5/weather?q=${city}&units=${unit}&appid=${apiKey};
    const response = await fetch(apiUrl);

    if (!response.ok) {
        throw new Error("Could not fetch weather data");
    }

    return await response.json();
}

function displayWeatherInfo(data) {
    const { name: city, main: { temp, humidity }, weather: [{ description, id }] } = data;


    
    
    console.log(Raw temp value from API: ${temp}); 

    let temperature;
    if (unit === 'metric') {
        temperature = temp; 
    } else if (unit === 'imperial') {
        temperature = temp;
    }

    console.log(Temperature in ${unit === 'metric' ? 'Celsius' : 'Fahrenheit'}: ${temperature});

    const unitSymbol = unit === 'metric' ? '°C' : '°F'; 

    const backgroundImage = getBackgroundImage(id);
    document.body.style.backgroundImage = url(${backgroundImage});

    card.textContent = "";
    card.style.display = "flex";
    const cityDisplay = document.createElement("h1");
    const tempDisplay = document.createElement("p");
    const humidityDisplay = document.createElement("p");
    const descDisplay = document.createElement("p");
    const weatherEmoji = document.createElement("p");
    const unitToggleButton = document.createElement("button");
    const tempValue = document.createElement("span");
    const saveCityButton = document.createElement("button");
    saveCityButton.textContent = "Save City"; 
    saveCityButton.classList.add("save-city");
    saveCityButton.addEventListener("click", async () => {
        const city = document.querySelector(".cityDisplay").textContent;
        if (city) {
            await fetch("/save_city", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ city })
            });
            getSavedCities();
        }
    });
    cityDisplay.textContent = city;
    tempValue.textContent = ${temperature.toFixed(1)}; 
    humidityDisplay.textContent = Humidity: ${humidity}%;
    descDisplay.textContent = description;
    weatherEmoji.textContent = getWeatherEmoji(id);

    cityDisplay.classList.add("cityDisplay");
    tempDisplay.classList.add("tempDisplay");
    humidityDisplay.classList.add("humidityDisplay");
    descDisplay.classList.add("descDisplay");
    weatherEmoji.classList.add("weatherEmoji");

    unitToggleButton.textContent = unitSymbol;
    unitToggleButton.id = "unit-toggle";
    unitToggleButton.style.fontSize = "1.5rem";
    unitToggleButton.style.marginLeft = "10px";
    unitToggleButton.style.backgroundColor = "transparent";
    unitToggleButton.style.border = "none";
    unitToggleButton.style.cursor = "pointer";
    unitToggleButton.style.fontWeight = "bold";
    unitToggleButton.style.display = "inline-block";

    card.appendChild(cityDisplay);
    card.appendChild(tempDisplay);
    tempDisplay.appendChild(tempValue); 
    tempDisplay.appendChild(unitToggleButton); 
    card.appendChild(humidityDisplay);
    card.appendChild(descDisplay);
    card.appendChild(weatherEmoji);
    card.appendChild(saveCityButton);

    unitToggleButton.style.display = "inline-block"; 
    unitToggleButton.textContent = unitSymbol; 

    unitToggleButton.addEventListener("click", () => {
        unit = (unit === 'metric') ? 'imperial' : 'metric';  
        weatherForm.dispatchEvent(new Event('submit')); 
    });

    renderSearchHistory(); 
}

function getBackgroundImage(weatherId) {
    switch (true) {
        case (weatherId >= 200 && weatherId < 300): 
            return "https://media.tenor.com/jSVVsppRT-MAAAAM/rain-lightning.gif";
        case (weatherId >= 300 && weatherId < 400): 
            return "https://media.tenor.com/SV4ppzqpVtIAAAAM/anime-rain.gif";
        case (weatherId >= 500 && weatherId < 600): 
            return "https://media.tenor.com/GeiuKcl9VxIAAAAM/coffee.gif";
        case (weatherId >= 600 && weatherId < 700): 
            return "https://media.tenor.com/f6Z_JUiELaMAAAAM/winter-wonderland-snow.gif";
        case (weatherId >= 700 && weatherId < 800): 
            return "https://media.tenor.com/5ImWLS5QAJgAAAAM/foggy-fog.gif";
        case (weatherId === 800): 
            return "https://media.tenor.com/4IkfSV_2jxQAAAAM/sky-sun.gifhttps://media.tenor.com/4IkfSV_2jxQAAAAM/sky-sun.gif";
        case (weatherId >= 801 && weatherId < 810):
            return "https://media.tenor.com/tQWmGFB9_SYAAAAM/moving-clouds-world-meteorological-day.gif";
        default:
            return "";
    }
}


function renderSearchHistory() 
{
    historyList.innerHTML = ""; 
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
function updateSearchHistory(city) {
    if (!searchHistory.includes(city)) {
        searchHistory.push(city);
        renderSearchHistory();
    }
}

document.querySelector(".clear-history").addEventListener("click", () => {
    searchHistory.length = 0;
    historyList.innerHTML = "";
});

function getWeatherEmoji(weatherId) {
    switch (true) {
        case (weatherId >= 200 && weatherId < 300):
            return "⛈";
        case (weatherId >= 300 && weatherId < 400):
            return "🌧"; 
        case (weatherId >= 500 && weatherId < 600):
            return "☔"; 
        case (weatherId >= 600 && weatherId < 700):
            return "❄"; 
        case (weatherId >= 700 && weatherId < 800):
            return "🌫"; 
        case (weatherId === 800):
            return "☀";
        case (weatherId >= 801 && weatherId < 810):
            return "☁"; 
        default:
            return "?"; 
    }
}

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
    console.log("Converted Fahrenheit:", fahrenheit); 
    return fahrenheit;
}

const savedCityList = document.querySelector(".saved-city-list");

async function getSavedCities() {
    const response = await fetch("/get_saved_cities");
    const data = await response.json();
    renderSavedCities(data.savedCities);
}

function renderSavedCities(cities) {
    savedCityList.innerHTML = "";
    cities.forEach(city => {
        const listItem = document.createElement("li");
        listItem.textContent = city;
        listItem.addEventListener("click", () => {
            cityInput.value = city;
            weatherForm.dispatchEvent(new Event("submit"));
        });
        savedCityList.appendChild(listItem);
    });
}

document.addEventListener("DOMContentLoaded", getSavedCities);