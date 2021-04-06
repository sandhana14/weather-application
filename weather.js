const inputElement = document.getElementById("city_name");
const buttonElement = document.getElementById("button_for_click");
const cityNameToDisplay = document.getElementById("city_name_to_display");
const temperature = document.getElementById("temperature");
const iconeToShowTheWeatherType = document.getElementById("icon");
const windSpeed = document.getElementById("wind_speed");
const description = document.getElementById("description");
const sunriseSunset = document.getElementById("sunrise_sunset");
const mapToShowTheCityLocation = document.getElementById("map");
const buttonToGenerateUsersCurrentLocation = document.getElementById(
  "button_to_generate_users_current_position"
);
const errorTag = document.getElementById("error_tag");
const displayTag = document.getElementById("display");
const loading = document.getElementsByClassName("loading_text");
const open_weather_url = "https://api.openweathermap.org/data/2.5/";
const open_weather_api_key = "7eb2adb0ae663ad8be6e770a4b1a937e";
let url;

function getWeatherInformation() {
  for (let i = 0; i < loading.length; i += 1) {
    loading[i].style.display = "block";
  }
  setTimeout(weatherDetails, 4000);
}

function weatherDetails() {
  for (let i = 0; i < loading.length; i += 1) {
    loading[i].style.display = "none";
  }
  fetch(url)
    .then((response) => response.json())
    .then((weather_data) => {
      cityNameToDisplay.innerHTML = weather_data.name;
      const temp = weather_data.main.temp;
      temperature.innerHTML =
        "Temperature -----  " +
        temp +
        "K / " +
        (temp - 273.15).toFixed(2) +
        "°C";
      iconeToShowTheWeatherType.src =
        "http://openweathermap.org/img/wn/" +
        weather_data.weather[0].icon +
        ".png";
      windSpeed.innerHTML = "wind -----  " + weather_data.wind.speed + "m/s";
      description.innerHTML =
        "Description ----- " + weather_data.weather[0].description;
      const secondsForSunrise = weather_data.sys.sunrise;
      const dateForSunrise = new Date(
        secondsForSunrise * 1000
      ).toLocaleTimeString();
      const secondsForSunset = weather_data.sys.sunset;
      const dateForSunset = new Date(
        secondsForSunset * 1000
      ).toLocaleTimeString();
      sunriseSunset.innerHTML =
        "Sunrise " + dateForSunrise + " sunset " + dateForSunset;
      const latitude = weather_data.coord.lat;
      const longitude = weather_data.coord.lon;
      const map = new google.maps.Map(mapToShowTheCityLocation, {
        center: { lat: Number(latitude), lng: Number(longitude) },
        zoom: 8,
      });
    })
    .catch((err) => {
      console.error(err);
    });
}

buttonElement.addEventListener("click", getWeatherByCityName);

function getWeatherByCityName() {
  errorTag.innerHTML = "";
  const city = inputElement.value;
  localStorage.setItem("city", city);
  if (city !== "") {
    url =
      open_weather_url + "weather?q=" + city + "&appid=" + open_weather_api_key;
    getWeatherInformation();
  } else {
    displayTag.innerHTML = "";
    errorTag.innerHTML =
      "Please enter the city name in the input field before clicking the button";
  }
}

buttonToGenerateUsersCurrentLocation.addEventListener("click", geoLocation);

function composeUrl(latitude, longitude) {
  const url =
    open_weather_url +
    "weather?lat=" +
    latitude +
    "&lon=" +
    longitude +
    "&appid=" +
    open_weather_api_key;
  return url;
}

function geoLocation() {
  errorTag.innerHTML = "";
  function success(position) {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    localStorage.setItem("latitude", latitude);
    localStorage.setItem("longitude", longitude);
    url = composeUrl(latitude, longitude);
    getWeatherInformation();
  }
  navigator.geolocation.getCurrentPosition(success);
}

function localData() {
  let latitude = localStorage.getItem("latitude");
  let longitude = localStorage.getItem("longitude");
  url = composeUrl(latitude, longitude);
  getWeatherInformation();
}
if (localStorage.length === 0) {
  let defaultCity = "valby";
  url =
    open_weather_url +
    "weather?q=" +
    defaultCity +
    "&appid=" +
    open_weather_api_key;
  getWeatherInformation();
} else if (localStorage.getItem("city")) {
  let city = localStorage.getItem("city");
  url =
    open_weather_url + "weather?q=" + city + "&appid=" + open_weather_api_key;
  getWeatherInformation();
} else {
  localData();
}
