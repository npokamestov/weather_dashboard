var apiKey = "8e10b7ae032afb26cab5474e291c55b7";
var cityList = JSON.parse(localStorage.getItem("searchHistoryList")) || [];
var cityEl = document.querySelector("#city");
var searchEl = document.querySelector("#search");
var historyListEl = document.querySelector("#history-list");
var historyListItemEl = document.querySelector(".list-group-item");

function renderSearchHistory(cityList) {
    $("#history-list").empty();
    for (var i = 0; i < cityList.length; i++) {
        var searchHistoryItem = $('<li>');
        searchHistoryItem.addClass("list-group-item list-group-item-action");
        searchHistoryItem.text(cityList[i]);
        $("#history-list").prepend(searchHistoryItem);
    };
};

function searchCityHandler(event) {
    event.preventDefault();
    if (!cityEl.value) {
        alert("You must enter a city!")
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

$(".list-group").on("click", ".list-group-item", function(event) {
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
                    uvi()
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

function displayCurrentWeather(city, data) {
    // console.log(city)
    // console.log(data)
    // var cityCoord = JSON.stringify(data.coord);
    // console.log(cityCoord)
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
    console.log(humidity + " humidity");
    var windSpeed = Math.floor(data.wind.speed);
    // console.log(windSpeed + " windspeed");
    var iconCode = data.weather[0].icon
    // console.log(iconCode)
    var icon = "https://openweathermap.org/img/wn/" + iconCode + ".png"
    // console.log(icon)
};

function uvi(lat, lon) {
    var uvApiUrl = "https://api.openweathermap.org/data/2.5/uvi?appid=8e10b7ae032afb26cab5474e291c55b7&lat=26.62&lon=-81.84";
        fetch(uvApiUrl)
            .then(function(response) {
                if (response.ok) {
                    response.json().then(function(data) {
                        // console.log(response)
                        // console.log(data)
                        displayUV(lat, lon, data)
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

function displayUV(lat, lon, data) {
    var uv = data.value
    // console.log(uv + " UV Index")
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
    var futureDays = data.list;
    // console.log(futureDays)
    var every8th = (futureDays) => futureDays.filter((e, i) => i % 8 === 8 - 1);
    // console.log(every8th(futureDays));
    for (i = 0; i < every8th(futureDays).length; i++) {
       var unixTime = every8th(futureDays)[i].dt;
    //    console.log(unixTime);
       var date = new Date(unixTime*1000);
       var formatedDate = moment(date).format("MM/DD/YYYY");
    //    console.log(formatedDate);
       var temp = Math.floor(every8th(futureDays)[i].main.temp);
    //    console.log(temp + " degrees");
       var humidity = every8th(futureDays)[i].main.humidity;
       console.log(humidity + "%");
       var iconCode = every8th(futureDays)[i].weather[0].icon
    //    console.log(iconCode)
       var icon = "https://openweathermap.org/img/wn/" + iconCode + ".png"
    //    console.log(icon)
    }
};

searchEl.addEventListener("click", searchCityHandler)
// historyListEl.addEventListener("click", revisitHistoryHandler)
renderSearchHistory(cityList);