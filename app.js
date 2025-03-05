document.addEventListener('DOMContentLoaded', function () {
    const apiKey = '8c17bec049ff49e19cc5cc08b58ee5f5';
    //for this API, apiKey is needed from the spoonify website, so you have to sign up and get the api Key from there
    //here is to load the API key into the code

    // Get elements from the DOM
    const searchForm = document.getElementById('searchForm');
    const ingredientInput = document.getElementById('ingredientInput');
    const recipeResults = document.getElementById('recipe-results');
    const recipeDetail = document.getElementById('recipe-detail');

    // Ensure elements are loaded
    if (!searchForm || !ingredientInput) {
        console.error('Error: searchForm or ingredientInput not found.');
        return;
    }

    // Function to fetch recipes from Spoonacular API
    async function fetchRecipes(ingredient) {
        try {
            const response = await fetch(`https://api.spoonacular.com/recipes/findByIngredients?ingredients=${ingredient}&number=5&apiKey=${apiKey}`);
            const data = await response.json();
            //this changes the API data in json type of data
            displayRecipes(data);
        } catch (error) {
            recipeResults.innerHTML = `<p>Error fetching data. Please try again later.</p>`;
        }
    }

    // Function to display recipes on the page
    function displayRecipes(recipes) {
        // Clear previous results
        recipeResults.innerHTML = '';

        if (recipes.length === 0) {
            recipeResults.innerHTML = '<p>No recipes found for this ingredient.</p>';
            return;
        }

        // Loop through the recipes and create HTML for each one
        recipes.forEach(recipe => {
            const recipeCard = document.createElement('div');
            recipeCard.classList.add('card', 'mb-4');

            const title = document.createElement('h5');
            title.classList.add('card-title');
            title.textContent = recipe.title;

            const image = document.createElement('img');
            image.classList.add('card-img-top');
            image.src = recipe.image;
            image.alt = recipe.title;

            const button = document.createElement('button');
            button.classList.add('btn', 'btn-primary', 'm-2');
            button.textContent = 'View Details';
            button.onclick = () => showRecipeDetails(recipe.id);

            const cardBody = document.createElement('div');
            cardBody.classList.add('card-body');

            cardBody.appendChild(title);
            cardBody.appendChild(button);
            recipeCard.appendChild(image);
            recipeCard.appendChild(cardBody);
            recipeResults.appendChild(recipeCard);
        });
    }

    // Function to fetch and display detailed recipe information
    async function showRecipeDetails(recipeId) {
        try {
            const response = await fetch(`https://api.spoonacular.com/recipes/${recipeId}/information?apiKey=${apiKey}`);
            const recipe = await response.json();
            displayRecipeDetails(recipe);
        } catch (error) {
            recipeDetail.innerHTML = `<p>Error fetching recipe details. Please try again later.</p>`;
        }
    }

    // Function to display detailed recipe information
    function displayRecipeDetails(recipe) {
        recipeDetail.innerHTML = `
            <div class="card">
                <img src="${recipe.image}" class="card-img-top" alt="${recipe.title}">
                <div class="card-body">
                    <h5 class="card-title">${recipe.title}</h5>
                    <p class="card-text">${recipe.instructions}</p>
                    <h6>Ingredients:</h6>
                    <ul>
                        ${recipe.extendedIngredients.map(ingredient => `<li>${ingredient.name}</li>`).join('')}
                    </ul>
                </div>
            </div>
        `;
    }

    // Event listener for the search form
    searchForm.addEventListener('submit', (e) => {
        e.preventDefault(); // Prevent page reload
        const ingredient = ingredientInput.value.trim();

        if (ingredient) {
            fetchRecipes(ingredient);
        } else {
            recipeResults.innerHTML = '<p>Please enter an ingredient.</p>';
        }
    });
});