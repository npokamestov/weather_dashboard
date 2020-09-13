var apiKey = "8e10b7ae032afb26cab5474e291c55b7";
var cityList = JSON.parse(localStorage.getItem("searchHistoryList")) || [];
var cityEl = document.querySelector("#city");
var searchEl = document.querySelector("#search");
var historyListEl = document.querySelector("#history-list");
var historyListItemEl = document.querySelector(".list-group-item");
var currentWeatherEl = document.querySelector("#current-weather");
var futureWeatherHeaderEl = document.querySelector("#future-header")
var futureWeatherEl = document.querySelector("#future-weather");

function renderSearchHistory(cityList) {
    $(historyListEl).empty();
    for (var i = 0; i < cityList.length; i++) {
        var searchHistoryItem = $('<li>');
        searchHistoryItem.addClass("list-group-item list-group-item-action");
        searchHistoryItem.text(cityList[i]);
        $(historyListEl).prepend(searchHistoryItem);
    };
    var clearBtn = $("<button>");
        clearBtn.addClass("btn btn-secondary")
        clearBtn.attr("id", "clearHistory")
        clearBtn.attr("type", "submit")
        clearBtn.text("Clear History")
        $(historyListEl).append(clearBtn)
        $("#clearHistory").on("click", clearSearchHistoryHandler);
};

function clearSearchHistoryHandler(cityList) {
    localStorage.removeItem("searchHistoryList");
    renderSearchHistory(cityList);
}

function searchCityHandler(event) {
    event.preventDefault();
    if (!cityEl.value) {
        alert("You must enter a city!")
        return;
    }
    else {
    var city = $("#city")
        .val()
        .trim();
    cityList.push(city);
    renderSearchHistory(cityList);
    localStorage.setItem("searchHistoryList", JSON.stringify(cityList));
    $("#city").val("");
    };
    getCurrentWeather(city);
    getFutureWeather(city);
};

$(historyListEl).on("click", ".list-group-item", function(event) {
    var historySelect = $(this).text();
    $(this).parent().find("li").removeClass("active");
    $(this).addClass("active");
    // console.log(historySelect)
    getCurrentWeather(historySelect)
    getFutureWeather(historySelect)
});

function getCurrentWeather(city) {
    var apiUrlCurrent = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + apiKey + "&units=imperial";
    fetch(apiUrlCurrent)
        .then(function(response) {
            if (response.ok) {
                response.json().then(function(data) {
                    // console.log(response)
                    // console.log(data)
                    displayCurrentWeather(city, data)
                }); 
            }
            else {
                alert("Error: City " + response.statusText)
            }
        })
        .catch(function(error) {
            alert("Unable to connect");
        });
};

function displayCurrentWeather(city, data) {
    // console.log(city)
    // console.log(data)
    var lat = JSON.stringify(data.coord.lat);
    // console.log(lat + " lat")
    var lon = JSON.stringify(data.coord.lon)
    // console.log(lon + " lon")
    var unixTime = data.dt
    var date = new Date(unixTime*1000);
    var formatedDate = moment(date).format("MM/DD/YYYY")
    // console.log(date);
    // console.log(formatedDate);
    var temp = Math.floor(data.main.temp);
    // console.log(temp + " degrees");
    var humidity = data.main.humidity;
    // console.log(humidity + " humidity");
    var windSpeed = Math.floor(data.wind.speed);
    // console.log(windSpeed + " windspeed");
    var iconCode = data.weather[0].icon
    // console.log(iconCode)
    var icon = "https://openweathermap.org/img/wn/" + iconCode + ".png"
    // console.log(icon)
    getUVI(lat, lon, data);

    $(currentWeatherEl).empty();

    var displayCityItem = $("<h1>");
        displayCityItem.addClass("h4 capitalize");
        displayCityItem.text(city);
        $(currentWeatherEl).append(displayCityItem);
        // console.log(displayCityItem);

    var displayDateItem = $("<h1>");
        displayDateItem.addClass("h4")
        displayDateItem.text(formatedDate);
        $(currentWeatherEl).append(displayDateItem);

    var displayIconItem = $("<img>");
        displayIconItem.attr("src", icon);
        $(currentWeatherEl).append(displayIconItem);
        // console.log(displayIconItem);

    var displayTempItem = $("<p>");
        displayTempItem.text("Temperature: " + temp + "°F");
        $(currentWeatherEl).append(displayTempItem);
        // console.log(displayTempItem);

    var displayHumidItem = $("<p>");
        displayHumidItem.text("Humidity: " + humidity + "%");
        $(currentWeatherEl).append(displayHumidItem);
        // console.log(displayHumidItem);

    var displayWindItem = $("<p>");
        displayWindItem.text("Wind Speed: " + windSpeed + " MPH");
        $(currentWeatherEl).append(displayWindItem);
        // console.log(displayWindItem)
};

function getUVI(lat, lon, data) {
    var uvApiUrl = "https://api.openweathermap.org/data/2.5/uvi?appid=" + apiKey + "&lat=" + lat + "&lon=" + lon;
        fetch(uvApiUrl)
            .then(function(response) {
                if (response.ok) {
                    response.json().then(function(data) {
                        // console.log(response)
                        // console.log(data)
                        displayUVI(lat, lon, data)
                    });
                }
                else{
                    console.log("Error" + response.statusText) 
                }
            })
            .catch(function(error) {
                alert("Unable to connect")
            });
};

function displayUVI(lat, lon, data) {
    var uv = data.value
    // console.log(uv + " UV Index")
    var displayUVItem = $("<p>");
        // displayUVItem.addClass("badge badge-success");
        displayUVItem.text("UV Index: ");
        $(currentWeatherEl).append(displayUVItem);
    var displayUVNum = $("<span>");
        if (uv <= 4) {
        displayUVNum.addClass("badge badge-success")
        }
        else if (4 < uv && uv <= 8) {
        displayUVNum.addClass("badge badge-warning")
        }
        else if (8 < uv && uv <=20) {
        displayUVNum.addClass("badge badge-danger")
        }
        displayUVNum.text(uv)
        $(displayUVItem).append(displayUVNum)
        // console.log(displayUVItem)
};

function getFutureWeather(city) {
    var apiUrlFuture = "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&appid=" + apiKey + "&units=imperial";
    fetch(apiUrlFuture)
        .then(function(response) {
            if (response.ok) {
                response.json().then(function(data) {
                    // console.log(response)
                    // console.log(data)
                    displayFutureWeather(city, data)
                }); 
            }
            else {
                console.log("Error " + response.statusText)
            }
        })
        .catch(function(error) {
            alert("Unable to connect");
        });
};

function displayFutureWeather(city, data) {
    var futureWeatherArr = [];
    var futureDays = data.list;
    // console.log(futureWeatherArr)
    // console.log(futureDays)
        for (var i = 7; i < futureDays.length; i+=8) {
            var forecast = futureDays[i]
            var unixTime = forecast.dt;
            // console.log(unixTime);
            var date = new Date(unixTime*1000);
            // console.log(date)
            var formatedDate = moment(date).format("MM/DD/YYYY");
            // console.log(formatedDate);
            var temp = Math.floor(forecast.main.temp);
            // console.log(temp + " degrees");
            var humidity = forecast.main.humidity;
            // console.log(humidity + "%");
            var iconCode = forecast.weather[0].icon
            // console.log(iconCode)
            var icon = "https://openweathermap.org/img/wn/" + iconCode + ".png"
            // console.log(icon)
            futureWeatherArr.push({formatedDate,temp,humidity,icon})
        }
        $(futureWeatherHeaderEl).empty();
        $(futureWeatherEl).empty();
            var forecastHeader = $("<h1>");
                forecastHeader.addClass("h4");
                forecastHeader.text("5-Day Forecast:");
                $(futureWeatherHeaderEl).append(forecastHeader);
        for (var i = 0; i < futureWeatherArr.length; i++) {
            var futureArr = futureWeatherArr[i]
            var displayCardEl = $("<div>");
                displayCardEl.addClass("card text-white bg-primary p-2 display:inline-block m-1");
                displayCardEl.attr("style", "max-width:10rem");
                $(futureWeatherEl).append(displayCardEl);
            var displayDateItem = $("<h6>");
                displayDateItem.addClass("h6")
                displayDateItem.text(futureArr.formatedDate);
                $(displayCardEl).append(displayDateItem);
            var displayIconItem = $("<img>");
                displayIconItem.attr("src", futureArr.icon);
                $(displayCardEl).append(displayIconItem);
            var displayTempItem = $("<p>");
                displayTempItem.text("Temp: " + futureArr.temp + "°F");
                $(displayCardEl).append(displayTempItem);
            var displayHumidItem = $("<p>");
                displayHumidItem.text("Humidity: " + futureArr.humidity + "%");
                $(displayCardEl).append(displayHumidItem);
        }
};

searchEl.addEventListener("click", searchCityHandler);
renderSearchHistory(cityList);