const mealContainer = document.getElementById('mealContainer');
const searchInput = document.getElementById('searchInput');

// Fetch meals from the API
async function getMeals(searchTerm) {
    try {
        const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${searchTerm}`);
        const data = await response.json();
        return data.meals;
    } catch (error) {
        console.error('Error fetching meals:', error);
    }
}

// Display meals on the page
function displayMeals(meals) {
    mealContainer.innerHTML = '';

    meals.forEach(meal => {
        const mealDiv = document.createElement('div');
        mealDiv.classList.add('meal');

        mealDiv.innerHTML = `
            <h3>${meal.strMeal}</h3>
            <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
            <p>${meal.strCategory}</p>
            <p>${meal.strArea}</p>
        `;

        mealContainer.appendChild(mealDiv);
    });
}

// Search meals based on user input
async function searchMeals() {
    const searchTerm = searchInput.value;
    const meals = await getMeals(searchTerm);
    displayMeals(meals);
}

// Load all meals initially
window.onload = () => {
    searchMeals('');
};
