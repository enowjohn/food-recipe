const mealContainer = document.getElementById('mealcontainer')
const searchInput = document.getElementById('searchinput')
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
      <div class="btns">
        <button class="add-btn">Add to Favorites</button>
      </div>
    `
    
    mealDiv.addEventListener('click', () => {
      showIngredients(meal)
    })

    const addButton = mealDiv.querySelector('.add-btn')
    addButton.addEventListener('click', (event) => {
      event.stopPropagation(); // Prevent click event from triggering meal click
      addButton.textContent = 'Added to Favorites'
      addButton.style.backgroundColor = 'lightgrey'
      alert(`"${meal.strMeal}" has been added to favorites.`)
    })

    mealContainer.appendChild(mealDiv)
  })
}

// Show ingredients modal with image and return button
const showIngredients = (meal) => {
  overlay.style.display = 'block'
  overlay.innerHTML = `
    <div class="modal">
      <span class="close" onclick="closeModal()">&times;</span>
      <h2>${meal.strMeal}</h2>
      <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
      <div class="ingredients">
        <h4>Ingredients:</h4>
        <ul>
          ${getIngredientsList(meal)}
        </ul>
      </div>
      <button onclick="closeModal()">Return</button>
    </div>
  `
}

// Get ingredients list
function getIngredientsList(meal) {
  const ingredients = []
  for (let i = 1; i <= 20; i++) {
    const ingredient = meal[`strIngredient${i}`]
    if (ingredient) {
      const measure = meal[`strMeasure${i}`]
      ingredients.push(`<li>${ingredient} - ${measure}</li>`)
    }
  }
  return ingredients.join('')
}

// Close ingredients modal
function closeModal() {
  overlay.style.display = 'none'
}

// Search meals based on user input
async function searchMeals() {
  const searchTerm = searchInput.value;
  const meals = await getMeals(searchTerm);
  displayMeals(meals)
}

// Load all meals initially
window.onload = async () => {
  const meals = await getMeals('')
  displayMeals(meals)
}

// Real-time search as user types
searchInput.addEventListener('input', searchMeals)
