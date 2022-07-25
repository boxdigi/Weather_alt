let now = new Date();
function addZero(i) {
    if (i < 10) {
        i = "0" + i;
    }
    return i;
}
let hour = addZero(now.getHours());
let minute = addZero(now.getMinutes());
let day = now.getDay();
let date = addZero(now.getDate());
let year = now.getFullYear();
let month = now.getMonth();
let months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
];
let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
];
day = days[now.getDay()];
month = months[now.getMonth()];

let currentData = document.querySelector("#current-data");
currentData.innerHTML = `<span class="updated">Last updated:</span><br />${date}.${month}.${year}`;

let currentTime = document.querySelector("#current-day-time");
currentTime.innerHTML = `${day}   ${hour}:${minute}`;

let cityDefault = "Kyiv";
let apiKey = "481bc9bf97ae403a7ee70a4848c33bb8";
let apiUrl = "https://api.openweathermap.org/data/2.5/weather?";
axios.get(`${apiUrl}q=${cityDefault}&appid=${apiKey}&units=metric`).then(showCurrTemp);

function inputCity(event) {
    event.preventDefault();
    let city = document.querySelector("#city-input");
    if (city.value) {
        axios.get(`${apiUrl}q=${city.value}&appid=${apiKey}&units=metric`).then(showCurrTemp,
            function () {
                alert('The city is not found in our list. Please verify it and try again 😉 or ask Google');
            }
        );
    } else {
        alert(` Please enter a city 🙃`);
    };
}

let searchCity = document.querySelector("#search-form");
searchCity.addEventListener("submit", inputCity);

let cityLocation = document.querySelector("#btn-search");
cityLocation.addEventListener("click", inputCity);

function handlePosition(event) {
    event.preventDefault();
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition, function (e) {
            alert(`Error message: ` + e.message + `.   Please check your settings and try again 😉`);
        });
    };
}

function showPosition(position) {
    let latCur = position.coords.latitude;
    let longCur = position.coords.longitude;
    axios
        .get(`${apiUrl}lat=${latCur}&lon=${longCur}&appid=${apiKey}&units=metric`)
        .then(showCurrTemp);
}

let currentLocation = document.querySelector("#btn-current");
currentLocation.addEventListener("click", handlePosition);

function showCurrTemp(response) {
    console.log(response.data);
    classListCelsiusActive();
    let tempCur = document.querySelector("#current-temp");
    tempCur.innerHTML = `🌡️ ${Math.round(response.data.main.temp)} °C<br /><span class="realFeel">feels like ${Math.round(response.data.main.feels_like)}`;

    let currentCity = document.querySelector("#current-city");
    currentCity.innerHTML = response.data.name;

    let country = document.querySelector("#current-country");
    country.innerHTML = response.data.sys.country;

    let currCondition = document.querySelector("#current-icon");
    let iconCurr = response.data.weather[0].icon;
    let currdescription = document.querySelector("#current-description")
    currdescription.innerHTML = (response.data.weather[0].main).toLowerCase();

    if (iconCurr === "01d") {
        currCondition.innerHTML = iconCurr.replace("01d", "☀️")
    };
    if (iconCurr === "01n") {
        currCondition.innerHTML = iconCurr.replace("01d", "🌒")
    };
    if (iconCurr === "02d") {
        currCondition.innerHTML = iconCurr.replace("02d", "⛅")
    };
    if (iconCurr === "03d") {
        currCondition.innerHTML = iconCurr.replace("03d", "☁️")
    };
    if (iconCurr === "04d") {
        currCondition.innerHTML = iconCurr.replace("04d", "☁️☁️")
    };
    if (iconCurr === "09d") {
        currCondition.innerHTML = iconCurr.replace("09n", "🌧️");
    }
    if (iconCurr === "10d") {
        currCondition.innerHTML = iconCurr.replace("10d", "🌦️");
    }
    if (iconCurr === "11d") {
        currCondition.innerHTML = iconCurr.replace("11d", "⛈️");
    }
    if (iconCurr === "13d") {
        currCondition.innerHTML = iconCurr.replace("13d", "❄️");
    }
    if (iconCurr === "50d") {
        currCondition.innerHTML = iconCurr.replace("50d", "🌫️");
    }


    let currentHumid = document.querySelector("#cur-humid");
    currentHumid.innerHTML = `humidity ${response.data.main.humidity}%`

    let currentWind = document.querySelector("#cur-wind");
    currentWind.innerHTML = `wind ${Math.round(response.data.wind.speed)} m/s`;

    getForecast(response.data.coord);
}


function getForecast(coordinates) {
    let apiUrlF = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}&units=metric`
    axios.get(apiUrlF).then(showForecastTemp);
}

function formatData(timestamp) {
    let date = new Date(timestamp * 1000);
    let dateDay = date.getDate();
    let month = (date.getMonth() + 1);
    if (dateDay < 10) {
        dateDay = `0${dateDay}`;
    }
    if (month < 10) {
        month = `0${month}`;
    }
    return `${dateDay}.${month}`;
}

function formatDay(timestamp) {
    let date = new Date(timestamp * 1000);
    let day = date.getDay();
    let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    return `${days[day]}`;
}


function showForecastTemp(response) {
    let forecast = response.data.daily;
    let forecastElement = document.querySelector("#forecast");
    let iconEmoji = "";
    let forecastHTML = `<div class="row align-items-center">`;
    forecast.forEach(function (forecastDay, index) {
        if (index > 0 & index < 6) {
            let icon = forecastDay.weather[0].icon;
            if (icon === "01d") {
                iconEmoji = icon.replace("01d", "☀️")
            };
            if (icon === "02d") {
                iconEmoji = icon.replace("02d", "⛅")
            };
            if (icon === "03d") {
                iconEmoji = icon.replace("03d", "☁️")
            };
            if (icon === "04d") {
                iconEmoji = icon.replace("04d", "☁️☁️")
            };
            if (icon === "09d") {
                iconEmoji = icon.replace("09n", "🌧️");
            }
            if (icon === "10d") {
                iconEmoji = icon.replace("10d", "🌦️");
            }
            if (icon === "11d") {
                iconEmoji = icon.replace("11d", "⛈️");
            }
            if (icon === "13d") {
                iconEmoji = icon.replace("13d", "❄️");
            }
            if (icon === "50d") {
                iconEmoji = icon.replace("50d", "🌫️");
            }
            forecastHTML = forecastHTML +
                `   <div class="col-4 ms-2 text-start text-nowrap">
                <span class="weather-forecast-date">${formatData(forecastDay.dt)}  </span>
                <span class="fst-italic text-primary">${formatDay(forecastDay.dt)}</span>
            </div>
          <div class="col fs-6 text-center align-items-center">${iconEmoji}</div>
            <div class="col-4 text-center text-nowrap">
                <span class="weather-temperature-forecast-min">${Math.round(forecastDay.temp.min)}°</span> | 
                <strong><span class="weather-temperature-forecast-max">${Math.round(forecastDay.temp.max)}°</span></strong>
            </div>          
`;
        }
    });

    forecastHTML = forecastHTML + `</div>`;
    forecastElement.innerHTML = forecastHTML;
}
//end forecast part

//conversion to Farenheit and Celsius
let convertC = document.querySelector("#celsius");
convertC.addEventListener("click", getCelsius);

function getCelsius(event) {
    event.preventDefault();
    classListCelsiusActive();
    let city = document.querySelector("#city-input");
    if (city.value) {
        axios.get(`${apiUrl}q=${city.value}&appid=${apiKey}&units=metric`).then(showCurrTemp);
    } else {
        axios.get(`${apiUrl}q=${cityDefault}&appid=${apiKey}&units=metric`).then(showCurrTemp);
    }
}

let convertF = document.querySelector("#farenheit");
convertF.addEventListener("click", getFarenheit);

function getFarenheit(event) {
    event.preventDefault();
    classListFarenheihActive();
    let apiUrl = "https://api.openweathermap.org/data/2.5/weather?";
    let city = document.querySelector("#city-input");
    if (city.value) {
        axios.get(`${apiUrl}q=${city.value}&appid=${apiKey}&units=imperial`).then(showCurrTempF);
    } else {
        axios.get(`${apiUrl}q=${cityDefault}&appid=${apiKey}&units=imperial`).then(showCurrTempF);
    }
}

function showCurrTempF(response) {
    let tempCur = document.querySelector("#current-temp");
    tempCur.innerHTML = `🌡️ ${Math.round(response.data.main.temp)}°<br /><span class="realFeel">feels like ${Math.round(response.data.main.feels_like)}°</span>`;

    let currentWind = document.querySelector("#cur-wind");
    currentWind.innerHTML = `wind ${Math.round(response.data.wind.speed)} mi/h`;
    getForecastF(response.data.coord);
}

function getForecastF(coordinates) {
    let apiUrlF = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}&units=imperial`
    axios.get(apiUrlF).then(showForecastTemp);
}

function classListCelsiusActive() {
    convertF.classList.remove("active");
    convertF.classList.add("passive");
    convertC.classList.remove("passive");
    convertC.classList.add("active");
}

function classListFarenheihActive() {
    convertC.classList.remove("active");
    convertC.classList.add("passive");
    convertF.classList.remove("passive");
    convertF.classList.add("active");
}

let listCities = document.querySelectorAll('li');
listCities.forEach(function (listCity) {
    listCity.addEventListener("click", (event) => {
        let displayCity = event.target.textContent;
        classListCelsiusActive();
        axios.get(`${apiUrl}q=${displayCity}&appid=${apiKey}&units=metric`).then(showCurrTemp);
    });
});
