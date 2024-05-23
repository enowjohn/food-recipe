const mealContainer = document.getElementById('mealcontainer')
const searchInput = document.getElementById('searchinput')
const favoritesContainer = document.getElementById('favorites-container')
const mymodal = document.getElementById('mymodal')
const modalBody = document.getElementById('modal-body')
const closeModal = document.querySelector('.close')

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
      </div>
    `

    const viewButton = mealDiv.querySelector('.view-btn')
    const ingredientDiv = mealDiv.querySelector('.details')
    viewButton.addEventListener('click', () => {
      showModal(ingredientDiv.innerHTML)
    })

const addButton = mealDiv.querySelector('.add-btn')
addButton.addEventListener('click', (event) => {
  event.stopPropagation()
  addButton.textContent = 'Added to Favorites'
  addButton.style.backgroundColor = 'lightgrey'
  addToFavorites(meal)


let favoritesContainer = document.getElementById('favorites-container');
if (!favoritesContainer) {
  favoritesContainer = document.createElement('div');
  favoritesContainer.id = 'favorites-container';

  const heading = document.createElement('h3');
  heading.textContent = 'Favorites Page';
  favoritesContainer.appendChild(heading);

  document.body.appendChild(favoritesContainer);
}


let imagesContainer = document.getElementById('images-container');
if (!imagesContainer) {
  imagesContainer = document.createElement('div');
  imagesContainer.id = 'images-container';
  imagesContainer.className = 'meal-images-container';
  favoritesContainer.appendChild(imagesContainer); 
}


const mealContainer = document.createElement('div');
mealContainer.className = 'meal-container';

const mealName = document.createElement('div');
mealName.className = 'meal-name';
mealName.textContent = meal.strMeal;
mealContainer.appendChild(mealName);

const mealImage = document.createElement('img');
mealImage.className = 'meal-image';
mealImage.src = meal.strMealThumb;
mealContainer.appendChild(mealImage);


imagesContainer.appendChild(mealContainer);

alert(`"${meal.strMeal}" has been added to favorites.`);

})


    mealContainer.appendChild(mealDiv)
  })
}

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

function addToFavorites(meal) {
  favorites.push(meal);
  localStorage.setItem('favorites', JSON.stringify(favorites))
  displayFavorites()
}

function displayFavorites() {
  if (!favoritesContainer) return

  favoritesContainer.innerHTML = ''
  favorites.forEach(meal => {
    const mealDiv = document.createElement('div')
    mealDiv.classList.add('meal')

    favoritesContainer.style.display = 'flex';
    favoritesContainer.style.flexWrap = 'wrap';
    favoritesContainer.querySelectorAll('.meal img').forEach(img => {
          img.style.width = '100px';
          img.style.height = 'auto';
        });

    mealDiv.innerHTML = `
      <h3>${meal.strMeal}</h3>
      <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
      <button class="remove-btn">Remove from Favorites</button>
    `

    const removeButton = mealDiv.querySelector('.remove-btn')
    removeButton.addEventListener('click', () => {
      removeFromFavorites(meal)
    })

    favoritesContainer.appendChild(mealDiv)
  })
}

function removeFromFavorites(meal) {
  favorites = favorites.filter(fav => fav.idMeal !== meal.idMeal)
  localStorage.setItem('favorites', JSON.stringify(favorites))
  displayFavorites()
}

async function searchMeals() {
  const searchTerm = searchInput.value
  const meals = await getMeals(searchTerm)
  displayMeals(meals)
}


const createModal = () => {
  const modal = document.createElement('div');
  modal.id = 'mymodal';
  modal.style.display = 'none'; 
  
  const modalContent = document.createElement('div');
  modalContent.style.backgroundColor = '#fefefe';
  modalContent.style.margin = '15% auto';
  modalContent.style.padding = '20px';
  modalContent.style.border = '1px solid #888';
  modalContent.style.width = '80%';
  modalContent.style.position = 'relative';

  const closeModal = document.createElement('span');
  closeModal.id = 'closeModal';
  closeModal.innerHTML = '&times;';

  const modalBody = document.createElement('div');
  modalBody.id = 'modalBody';

  modalContent.appendChild(closeModal);
  modalContent.appendChild(modalBody);
  modal.appendChild(modalContent);

  document.body.appendChild(modal);
};

function showModal(content, imageUrl) {
  const modalBody = document.getElementById('modalBody');
  
 
  modalBody.innerHTML = '';

  // Add the meal image
  const mealImage = document.createElement('img');
  mealImage.src =  '';
  mealImage.alt = 'Meal Image';
  mealImage.style.width = '100%';
  mealImage.style.marginBottom = '20px';

  
  const textContent = document.createElement('div');
  textContent.innerHTML = content;

  
  modalBody.appendChild(mealImage);
  modalBody.appendChild(textContent);
  
  const mymodal = document.getElementById('mymodal');
  mymodal.style.display = 'block';
}

document.addEventListener('click', (event) => {
  if (event.target.id === 'closeModal') {
    const mymodal = document.getElementById('mymodal');
    mymodal.style.display = 'none';
  }
});

window.onclick = function(event) {
  const mymodal = document.getElementById('mymodal');
  if (event.target === mymodal) {
    mymodal.style.display = 'none';
  }
};

window.onload = async () => {
  createModal();
  const meals = await getMeals('');
  displayMeals(meals);
  displayFavorites();
};



searchInput.addEventListener('input', searchMeals)
