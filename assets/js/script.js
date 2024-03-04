const RANDOM_RECIPE = "https://www.themealdb.com/api/json/v1/1/random.php";

var randomButtonEl = document.getElementById("randomBtn");
var goBackBtnEl = document.getElementById("goBackBtn");

function randomSearch(){
    document.getElementById("recipe-results").style.display = "none";

    console.log("Random recipe");
    var randomReciperUrl = RANDOM_RECIPE;

    fetch(randomReciperUrl)
    .then(function (response){
        return response.json();
    })
    .then(function (data){
        console.log(data);

        displayData(data)
    });
}
function displayData(data){
    document.getElementById("randomBtn").style.display = "none";
    document.getElementById("ingredient-search").style.display = "none";
    document.getElementById("search-btn").style.display = "none";
    document.getElementById("goBackBtn").style.display = "block";

    const listItem = document.createElement("li");
    listItem.classList = document.createElement("li");
    listItem.classList.add("randomResults");

    listItem.innerHTML = `
    <div class="randomRecipeName">${data.meals[0].strMeal}</div>
    <div class="cuisineName">${data.meals[0].strArea} Cuisine</div>
    <div class="randomRecipeImg"><img id="imgRandomRecipe" src="${data.meals[0].strMealThumb}"></div>
    <div  class="randomRecipUrl"><a href = "${data.meals[0].strYoutube}"  target="_blank">Click Me to see the recipe 👩‍🍳</a></div>;
    `

    document.getElementById("random-results").appendChild(listItem);

}
function reloadMainPage(){
    console.log("hello");
}

randomButtonEl.addEventListener("click", randomSearch);
goBackBtnEl.addEventListener("click", reloadMainPage);