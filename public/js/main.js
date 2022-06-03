"use strict";

import API_KEY from "./key.js";

const weather = document.querySelector(".weather");
const weatherContainer = document.querySelector(".weather__daily__container");
const currentWeather = document.querySelector(".weather__current");
const body = document.body;

let dailyForecast = [];

// Get users location
const getLocation = function () {
  navigator.geolocation.getCurrentPosition(
    function (position) {
      // const { latitude: lat, longitude: long } = position.coords;

      // Thai
      const lat = 15.87;
      const long = 100.9925;
      // Italy
      // const lat = 41.8719;
      // const long = 12.5674;
      getWeatherAndLocation(lat, long);
    },
    function () {
      // Error message
      errMsg();
    }
  );
};

/**
 * Get JSON
 * @param {string} url - This will received a 'GET' request (API URL)
 * @returns Promise <fulfilled /> rejected>
 */
const getJSON = async function (url) {
  const response = await fetch(url);

  if (!response.ok)
    throw new Error(
      `Something went wrong! Please try ro reload your browser after 3 seconds `
    );

  return response.json();
};

/**
 * Convert string first letter to uppercase
 * @param {string} str - receive a string and convert every first letter of it in uppercase
 * @returns string, formatted copy
 */
const upperFirstLetter = (str) => {
  const lower = str.toLowerCase().split(" ");
  const upper = lower.map((word) =>
    word.replace(word[0], word[0].toUpperCase())
  );

  return upper.join(" ");
};

/**
 * Get the current date and time
 * @param {Number} timestamp - received a timestamp coming from the OpenWeather API.
 * @returns formatted date based on navigator.language or simply browser language
 */
const currentDate = function (timestamp) {
  const now = new Date(timestamp * 1000);
  const locale = navigator.language;

  const options = {
    hour: "numeric",
    minute: "numeric",
    day: "numeric",
    month: "long",
    weekday: "long",
  };

  const formattedDate = new Intl.DateTimeFormat(locale, options).format(now);
  return formattedDate;
};

/**
 * Convert timestamp to day of the week
 * @param {Number} timestamp - received a timestamp coming from the OpenWeather API.
 * @returns a string based on the switch statement value (SUN, MON, TUE,..)
 */
const weatherDay = function (timestamp) {
  const date = new Date(timestamp * 1000);
  const val = date.getDay();

  let day;

  switch (val) {
    case 0:
      day = "SUN";
      break;
    case 1:
      day = "MON";
      break;
    case 2:
      day = "TUE";
      break;
    case 3:
      day = "WED";
      break;
    case 4:
      day = "THU";
      break;
    case 5:
      day = "FRI";
      break;
    case 6:
      day = "SAT";
      break;
  }

  return day;
};

/**
 * Get the current temperature and description
 * @param {Object} geoData - receives an object which contains the information about the passed in coordinates
 * @param {Object} weatherData - receives an object that contains the current, daily, temp, forecast
 */
const getTempDesc = function (geoData, weatherData) {
  const temp = weatherData.current.temp;
  const daily = weatherData.daily;
  const [{ id, description: desc }] = weatherData.current.weather;
  // const { city, country, state } = geoData;

  const city = geoData.city ?? geoData.timezone;
  const state = geoData.state ?? geoData.region;
  const country = geoData.country ?? geoData.prov;

  currentWeather.innerHTML = "";

  const bannerMarkup = `
  <h1 class="heading__primary">What's the weather today?</h1>
  <div class="weather__current__photo">
    <img
    src="${renderBannerImg(id)[0]}"
    srcset="
    ${renderBannerImg(id)[1]}
    "
    sizes="(min-width: 300px) 100vw"
    alt="banner image"
    class="banner__img"
   />
   <div class="weather__current__desc">
    <span class="weather__location"
      >${upperFirstLetter(city)}, ${upperFirstLetter(
    state
  )}, ${upperFirstLetter(country)}</span
    >
    <span class="weather__date">${currentDate(weatherData.current.dt)}</span>

      <div class="weather__container__desc">
        <div class="weather__icon--current">
          <img
            src="${renderWeatherIcons(id)}"
            alt="rainy"
            class="weather__icon weather__icon--whites"
          />
        </div>

        <div class="icon__desc">
          <span class="weather__degrees">${Math.trunc(+temp / 10)}°</span>
          <span class="weather__current--desc">${upperFirstLetter(desc)}</span>
        </div>
      </div>
    </div>
  </div>
  `;

  currentWeather.insertAdjacentHTML("beforeend", bannerMarkup);

  dailyWeatherForecast(daily);
  renderBannerImg(id);
};

/**
 * Daily weather forecast
 * @param {Object} daily - receives an object that contains the weather forecast, temperature, precipitation, etc.
 */
const dailyWeatherForecast = function (daily) {
  daily.forEach((forecast) => {
    const { weather } = forecast;
    const date = forecast.dt;
    const [{ id, description }] = weather;
    dailyForecast.push({ date, id, description });
  });

  renderWeatherCards(dailyForecast);
};

/**
 * Weather id code
 * @param {Number} id - receives a number and display the appropriate icons based on a certain condition
 * @returns a string that contains the image src
 */
const renderBannerImg = function (id) {
  let src;
  let srcSet;
  let arrSrc = [];

  if (id >= 200 && id <= 232) {
    src = "img/thunderstorms-sm.jpg";
    srcSet =
      "img/thunderstorms-sm.jpg  500w, img/thunderstorms-lg.jpg 1000w, img/thunderstorms.jpg 1500w ";
    arrSrc.push(src, srcSet);
  }

  if (id >= 300 && id <= 531) {
    src = "img/rains-sm.jpg";
    srcSet =
      "img/rains-sm.jpg  500w, img/rains-lg.jpg 1000w, img/rains.jpg 1500w ";
    arrSrc.push(src, srcSet);
  }

  if (id >= 600 && id <= 622) {
    src = "img/snowy-night-sm.jpg";
    srcSet =
      "img/snowy-night-sm.jpg  500w, img/snowy-night-lg.jpg 1000w, img/snowy-night.jpg 1500w ";
    arrSrc.push(src, srcSet);
  }

  if (id >= 700 && id <= 781) {
    src = "img/foggy-sm.jpg";
    srcSet =
      "img/foggy-sm.jpg  500w, img/foggy-lg.jpg 1000w, img/foggy.jpg 1500w ";
    arrSrc.push(src, srcSet);
  }

  if (id === 800) {
    src = "img/sunny-sm.jpg";
    srcSet =
      "img/sunny-sm.jpg  500w, img/sunny-lg.jpg 1000w, img/sunny.jpg 1500w ";
    arrSrc.push(src, srcSet);
  }

  if (id >= 801 && id <= 804) {
    src = "img/clouds-sm.jpg";
    srcSet =
      "img/clouds-sm.jpg  500w, img/clouds-lg.jpg 1000w, img/clouds.jpg 1500w ";
    arrSrc.push(src, srcSet);
  }

  return arrSrc;
};

/**
 * Weather id code
 * @param {Number} id - receives a number based on the current weather (weather id code)
 * @returns a string that source the svg file of the icons based on a certain condition.
 */
const renderWeatherIcons = function (id) {
  let src;

  if (id >= 200 && id <= 232) src = "img/icons/thunderstorm-outline.svg";

  if (id >= 300 && id <= 531) src = "img/icons/rainy-outline.svg";

  if (id >= 600 && id <= 622) src = "img/icons/snow-outline.svg";

  if (id >= 700 && id <= 781) src = "img/icons/cloud-fog.svg";

  if (id === 800) src = "img/icons/sunny-outline.svg";

  if (id >= 801 && id <= 804) src = "img/icons/partly-sunny-outline.svg";

  return src;
};

/**
 * Card rendering -HTML markup for daily weather forecast
 * @param {Array} arrForecast -receives an array of daily forecast and takeout the "weather" property.
 */
const renderWeatherCards = function (arrForecast) {
  const dailyForecast = arrForecast.slice(1, 7);
  const cardMarkup = dailyForecast.map((weather) => {
    const weatherItemsMarkup = `
    <div class="weather__items">
    <img
      src="${renderWeatherIcons(weather.id)}"
      alt="icon"
      class="weather__icon"
     />
      <span class="weather__desc">${upperFirstLetter(
        weather.description
      )}</span>
      <span class="weather__day">${weatherDay(weather.date)}</span>
    </div>
    `;

    return weatherItemsMarkup;
  });

  weatherContainer.innerHTML = "";
  cardMarkup.forEach((items) => {
    weatherContainer.insertAdjacentHTML("beforeend", items);
  });
};

/**
 * Get weather and users location
 * @param {Number} lat - receives the user latitude through Geolocation API
 * @param {Number} long - receives the user longitude through Geolocation API
 */
const getWeatherAndLocation = async function (lat, long) {
  try {
    // Run the promises in parallel to save time
    const data = await Promise.all([
      getJSON(`https://geocode.xyz/${lat},${long}?geoit=json`),
      getJSON(
        `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${long}&exclude=hourly,minutely&appid=${API_KEY}`
      ),
    ]);

    weather.classList.remove("hidden");
    getTempDesc(data[0], data[1]);
  } catch (err) {
    errMsg();
  }
};

// Render error markup
const errMsg = function () {
  const markupErr = `
  <div class="err">
    <div class="err__msg">
      <img src="img/icons/denied.svg" alt="denied" class="err__img" />
      <p>Something went wrong! Please reload your browser and try again.</p>
      <button class="btn btn--reload">Reload</button>
    </div>
  </div>
  `;

  body.insertAdjacentHTML("beforeend", markupErr);
  loadEvent();
};

// Add load event when errorMarkup is instantiated
const loadEvent = function () {
  const loadEl = document.querySelector(".btn--reload");
  loadEl.addEventListener("click", () => {
    location.reload(true);
  });
};

getLocation();
