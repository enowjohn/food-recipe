const mealContainer = document.getElementById('mealcontainer')
const searchInput = document.getElementById('searchinput')
const mealName = document.getElementById('mealName')
const ingredientList = document.getElementById('ingredient')
const overlay = document.getElementById('overlay')

// Fetch meals from the API
async function getMeals(searchTerm) {
  try {
    const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${searchTerm}`)
    const data = await response.json()
    return data.meals
  } catch (error) {
    console.error('Error fetching meals:', error)
  }
}

// Display meals on the page
function displayMeals(meals) {
  mealContainer.innerHTML = ''

  meals.forEach(meal => {
    const mealDiv = document.createElement('div')
    mealDiv.classList.add('meal')

    mealDiv.innerHTML = `
            <h3>${meal.strMeal}</h3>
            <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
            <p>${meal.strCategory}</p>
            <p>${meal.strArea}</p>
            <div class="ingredients">
              <h4>Ingredients:</h4>
              <ul></ul>
            </div>
        `

    mealDiv.addEventListener('click', () => {
      showIngredients(meal.strMeal, meal.strInstructions)
    })

    mealContainer.appendChild(mealDiv)
  })
}

//shows the ingredients
const showIngredients = (mealName, instructions) => {
  const ingredientsDiv = document.createElement('div')
  ingredientsDiv.innerHTML = `
    <h4>Ingredients for ${mealName}:</h4>
    <p>${instructions}</p>
  `

  const mealDiv = event.target.closest('.meal')
  mealDiv.appendChild(ingredientsDiv)
}


// Search meals based on user input
async function searchMeals() {
  const searchTerm = searchInput.value
  const meals = await getMeals(searchTerm)
  displayMeals(meals)
}

// Load all meals initially
window.onload = () => {
  searchMeals('')
}
