const mealContainer = document.getElementById('mealcontainer')
const searchInput = document.getElementById('searchinput')
const favoritesContainer = document.getElementById('favorites-container')
const mymodal = document.getElementById('mymodal')

let favorites = JSON.parse(localStorage.getItem('favorites')) || [] 


async function getMeals(searchTerm) {
  try {
    const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${searchTerm}`)
    const data = await response.json()
    
    return data.meals
  } catch (error) {
    console.error('Error fetching meals:', error)
  }
}


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
        <button class="view-btn">View details</button>
      </div>
      <div class="details" style="display: none;">
        <h4>Ingredients:</h4>
        <ul>${getIngredientsList(meal)}</ul>
        <button class="close-details">Close Details</button>
      </div>
    `

    const viewButton = mealDiv.querySelector('.view-btn')
    viewButton.addEventListener('click', () => {
      toggleDetails(mealDiv)
      mymodal.style.display = "block"
    })

    const closeButton = mealDiv.querySelector('.close-details')
    closeButton.addEventListener('click', () => {
      toggleDetails(mealDiv);
    })

    const addButton = mealDiv.querySelector('.add-btn')
    addButton.addEventListener('click', (event) => {
      event.stopPropagation()
      addButton.textContent = 'Added to Favorites'
      addButton.style.backgroundColor = 'lightgrey'
      addToFavorites(meal)
      const favoritesContainer = document.createElement('div');
      favoritesContainer.textContent = meal.strMeal;
      document.body.appendChild(favoritesContainer);
      const mealImage = document.createElement('img');
      mealImage.src = meal.strMealThumb;
      mealDiv.parentNode.insertBefore(favoritesContainer, mealDiv.nextSibling)
      // document.body.appendChild(favoritesContainer);
      document.body.appendChild(mealImage);
      
      alert(`"${meal.strMeal}" has been added to favorites.`)
      
    })

    mealContainer.appendChild(mealDiv)
  })
  
}


function toggleDetails(mealDiv) {
  const detailsDiv = mealDiv.querySelector('.details');
  detailsDiv.style.display = detailsDiv.style.display === 'none' ? 'block' : 'none'
}


function getIngredientsList(meal) {
  const ingredients = [];
  for (let i = 1; i <= 20; i++) {
    const ingredient = meal[`strIngredient${i}`]
    if (ingredient) {
      const measure = meal[`strMeasure${i}`];
      ingredients.push(`<li>${ingredient} - ${measure}</li>`)
    }
  }
  return ingredients.join('')
}


function addToFavorites(meal) {
  favorites.push(meal);
  localStorage.setItem('favorites', JSON.stringify(favorites))
  displayFavorites()
}


function displayFavorites() {
  if (!favoritesContainer) return

  favoritesContainer.innerHTML = ''
  favorites.forEach(meal => {
    const mealDiv = document.createElement('div');
    mealDiv.classList.add('meal')

    mealDiv.innerHTML = `
      <h3>${meal.strMeal}</h3>
      <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
      <button class="remove-btn">Remove from Favorites</button>
    `

    const removeButton = mealDiv.querySelector('.remove-btn')
    removeButton.addEventListener('click', () => {
      removeFromFavorites(meal)
    })

    favoritesContainer.appendChild(mealDiv);
  })
}

function removeFromFavorites(meal) {
  favorites = favorites.filter(fav => fav.idMeal !== meal.idMeal)
  localStorage.setItem('favorites', JSON.stringify(favorites))
  displayFavorites()
}


async function searchMeals() {
  const searchTerm = searchInput.value;
  const meals = await getMeals(searchTerm)
  displayMeals(meals)
}


window.onload = async () => {
  const meals = await getMeals('')
  displayMeals(meals)
  displayFavorites()
}


searchInput.addEventListener('input', searchMeals)
