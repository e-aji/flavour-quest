const RANDOM_RECIPE = "https://www.themealdb.com/api/json/v1/1/random.php";
const AUTO_COMPLETE = "https://wpdev3.com/flavour-quest/api/foods.json";
// Declaration of variables

var searchButtonEl = document.getElementById("search-button");
var xEl = document.getElementById("x");
var recipeButtonEl = document.getElementById("recipe-button");
var recipeResultsEl = document.getElementById("recipe-results");
var userInputEl = document.getElementById("user-input");
var recipeDescriptionEl = document.getElementById("recipe-description");
var recipeEl = document.getElementById("recipe");
var randomButtonEl = document.getElementById("randomBtn");
var goBackBtnEl = document.getElementById("goBackBtn");
var ingredientSearchEl = document.getElementById("ingredient-search");

// Function to initialise the autocomplete feature
// Fetches data from an API endpoint and populates the autocomplete list with the retrieved data
function initFoods(){

    const headers = new Headers();
    headers.append("Content-Type", "application/json");

    const requestOptions = {
    method: "GET",
    headers: headers,
    redirect: "follow"
    };

    fetch(`https://cors-anywhere.herokuapp.com/${AUTO_COMPLETE}`, requestOptions)
        .then((response) => response.text())
        .then((result) => {

            // fill the autocomplete array with the data from the API
            let data = JSON.parse(result);
            $('#ingredient-search').autocomplete({
                source: data,
            });     
        })
        .catch((error) => console.error(error));
}

// Function to handle the selection of an option from a dropdown list.
function selectOption() {
    let selectedValue = optionDropDown.options[optionDropDown.selectedIndex].text;
    console.log(selectedValue);

    // Hide the dropdown list after an option is selected
    
    document.getElementById("optionDropDown").style.display = "none";
 }

// Function to get list of meals that matches with the inputted ingredient
function getRecipeResults(e) {

    e.preventDefault();

    var ingredientSearch = document.getElementById("ingredient-search").value.trim();

    if (ingredientSearch === "") {
        return;
    };

    // Save user input in local storage

    localStorage.setItem("ingredientSearch", ingredientSearch);

    const apiUrl = `https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingredientSearch}`;

    fetch(apiUrl)
        .then((response) => response.json())
        .then((data) => {

        userInputEl.style.display = "none";
        goBackBtnEl.style.display = "block";
        recipeResultsEl.style.display = "block";


        let recipe = "";
        if (data.meals) {
            data.meals.forEach(function(meal) {

                recipe += `
                <div class="recipe-item" data-id="${meal.idMeal}">
                    <div class="recipe-img">
                       <img src="${meal.strMealThumb}" alt="${meal.strMeal}"> 
                    </div>
                   <div class="recipe-name"> 
                    <h3 class="meal-name"> ${meal.strMeal}</h3>
                    <button class="recipe-button" id="recipe-button" data-name="${meal.strMeal}" data-id="${meal.idMeal}" onclick="getRecipeDescription(event)"> See Recipe </button>
                </div>
                </div>`;   

                recipeEl.innerHTML = recipe;
            });
        } else {
            recipeResultsEl.innerHTML = "Sorry, No Recipe Results Can Be Found";
            recipeResultsEl.classList.add('no-results');
        }

        }); 
};
// Function to get a description of the recipe including instructions, ingredients, image and video link when see recipe button is clicked
function getRecipeDescription(event) {
    let mealName = event.target.dataset.name;
    const apiUrl = `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${event.target.dataset.id}`;

    fetch(apiUrl)
        .then((response) => response.json())
        .then((data) => {
            showRecipeDescription(data.meals, mealName);
            recipeResultsEl.style.display = "block";

        })
        .catch((error) => {
            console.error('Error fetching recipe description:', error);
        });
}

// Function to show recipe instructions, image and video link when the see recipe button is clicked
function showRecipeDescription(mealRecipe, mealName) {
    let recipes = mealRecipe[0];
    recipeDescriptionEl.style.display = "block";
    document.getElementById('recipe-label').innerHTML = mealName;
    document.getElementById('recipe-category').innerHTML = "<h2> Recipe Category:</h2> "  + recipes.strCategory;
    document.getElementById('recipe-instructions').innerHTML = "<h2>Recipe Instructions:</h2>" + recipes.strInstructions.split('\n').map(instruction => `<p>${instruction}</p>`).join(''); // makes sure the instructions are split by paragraphs
    document.getElementById('recipe-modal-image').innerHTML = `<img src="${recipes.strMealThumb}" alt="Image of ${mealName}">`;
    if(recipes.strYoutube == "") {
        document.getElementById('recipe-vid-link').innerHTML = "No Video Available";
    }else{

        document.getElementById('recipe-vid-link').innerHTML = `<a href="${recipes.strYoutube}" target="_blank"> Watch Recipe Video </a>`;
    }
};

function closeRecipeModal () {

    // When the user clicks on (x), close the modal    
        recipeDescriptionEl.style.display = "none";

};

// Function to get a random recipe
function randomSearch(e){

    e.preventDefault();

    console.log("random");
    document.getElementById("recipe-results").style.display = "none";

    var randomReciperUrl = RANDOM_RECIPE;

    fetch(randomReciperUrl)
    .then(function (response){
        return response.json();
    })
    .then(function (data){
        console.log(data);

        displayData(data)
    });
};


//Function to display the random recipe results

function displayData(data){
    document.getElementById("user-input").style.display = "none";
    document.getElementById("goBackBtn").style.display = "block";

    const listItem = document.createElement("li");
    listItem.classList = document.createElement("li");
    listItem.classList.add("randomResults");

    listItem.innerHTML = `
    <div class="recipe-item"> 
    <div class="randomRecipeImg"><img id="imgRandomRecipe" src="${data.meals[0].strMealThumb}"></div>
    <div class="randomRecipeName">${data.meals[0].strMeal}
    <button class = "randomRecipeButton" id="randomRecipeButton" data-name="${data.meals[0].strMeal}" data-id="${data.meals[0].idMeal}" onclick="getRecipeDescription(event)"> See Recipe </button>
    </div>
    </div>
    `

    document.getElementById("random-results").appendChild(listItem);

};

/// Load saved user input when page is refreshed (so they can see what they searched previously)

window.addEventListener("load", function(e) {
   
    var savedIngredientSearch = localStorage.getItem("ingredientSearch") || "";
    if (savedIngredientSearch) {
        document.getElementById("ingredient-search").value = savedIngredientSearch;
    }
});


 // If the user clicks anywhere outside the modal, close modal
 window.onclick = function(event) {
    if (event.target !== recipeDescriptionEl) {
      recipeDescriptionEl.style.display = "none";
    }
};

function goBack() {
        window.history.back();
      }

    goBack();


searchButtonEl.addEventListener("click", getRecipeResults);    
xEl.addEventListener("click", closeRecipeModal);
randomButtonEl.addEventListener("click", randomSearch);
goBackBtnEl.addEventListener("click", goBack);

initFoods();