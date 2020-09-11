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

var searchCityHandler = function(event) {
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

var getCurrentWeather = function(city) {
    var apiUrlCurrent = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + apiKey + "&units=imperial";
    fetch(apiUrlCurrent)
        .then(function(response) {
            if (response.ok) {
                response.json().then(function(data) {
                    console.log(response)
                    console.log(data)
                }); 
            }
            else {
                alert("Error " + response.statusText)
            }
        })
        .catch(function(error) {
            alert("Unable to connect");
        });
        
};

var getFutureWeather = function(city) {
    var apiUrlFuture = "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&appid=" + apiKey + "&units=imperial";
    fetch(apiUrlFuture)
        .then(function(response) {
            if (response.ok) {
                response.json().then(function(data) {
                    console.log(response)
                    console.log(data)
                }); 
            }
            else {
                alert("Error " + response.statusText)
            }
        })
        .catch(function(error) {
            alert("Unable to connect");
        });
        
};

// var displayCurrentWeather = function (d) {
//     var fahrenheit = Math.round(((parseFloat(d.main.temp)-273.15)*1.8)+32);
//     document.getElementById("descirption").innerHTML = d.weather[0].description;
//     document.getElementById("temp").innerHTML = fahrenheit + "&deg;";
//     document.getElementById("location").innerHTML = d.name;
// }

// var displayCurrentWeather = function(data) {
//     var conditions = data.list[0];
//     console.log(conditions);
//     var currentTemp = conditions.main.temp;
//     console.log(currentTemp);
//     var currentHumidity = conditions.main.humidity;
//     console.log(currentHumidity);
//     var currentWind = conditions.wind;
//     console.log(currentWind);
//     currentTime = conditions.city
//     console.log(currentTime)

//     var showConditions = document.createElement("div");
//     var cityConditiions = document.querySelector("#current-row");
//     cityConditiions.appendChild(showConditions)
// }

searchEl.addEventListener("click", searchCityHandler)
// historyListEl.addEventListener("click", revisitHistoryHandler)
renderSearchHistory(cityList);