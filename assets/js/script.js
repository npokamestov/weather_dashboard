var cityList = JSON.parse(localStorage.getItem("searchHistoryList")) || [];

function renderSearchHistory(cityList) {
    $("#history-list").empty();
    for (var i = 0; i < cityList.length; i++) {
        var searchHistoryItem = $('<li>');
        searchHistoryItem.addClass("list-group-item list-group-item-action")
        searchHistoryItem.text(cityList[i]);
        $("#history-list").prepend(searchHistoryItem)
    }
};

$("#search").on("click", function(event) {
    event.preventDefault();
    var city = $("#city")
        .val()
        .trim()
    cityList.push(city);
    renderSearchHistory(cityList);
    localStorage.setItem("searchHistoryList", JSON.stringify(cityList));
    $("#city").val("");
});

$(".list-group").on("click", ".list-group-item", function(event) {
    var historySelect = $(this).text()
    $(this).parent().find("li").removeClass("active")
    $(this).addClass("active")
    // console.log(historySelect)
})
renderSearchHistory(cityList);