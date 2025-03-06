
document.addEventListener('DOMContentLoaded', function () {
    console.log("JavaScript Loaded Successfully!"); // Debugging

    const apiKey = '8c17bec049ff49e19cc5cc08b58ee5f5'; // Replace with your API key
    const searchForm = document.getElementById('searchForm');
    const ingredientInput = document.getElementById('ingredientInput');
    const recipeResults = document.getElementById('recipe-results');

    // Ensure elements are loaded
    if (!searchForm || !ingredientInput) {
        console.error('Error: searchForm or ingredientInput not found.');
        return;
    }

    // Function to fetch recipes
    //this async function allows us to perform task such as fetching data from API without blocking the rest of the code. 
    //useful for delayed operations like network request (calling API)
    //this makes the page still responsive while waiting for the fetched content
    async function fetchRecipes(ingredient) {
        try {
            const response = await fetch(`https://api.spoonacular.com/recipes/findByIngredients?ingredients=${ingredient}&number=5&apiKey=${apiKey}`);
            const data = await response.json();
            displayRecipes(data);
        } catch (error) {
            console.error("Error fetching recipes:", error);
            recipeResults.innerHTML = `<p>Error fetching data. Please try again later.</p>`;
        }
    }

    // Function to display recipes
    function displayRecipes(recipes) {
        recipeResults.innerHTML = '';

        if (recipes.length === 0) {
            recipeResults.innerHTML = '<p>No recipes found.</p>';
            return;
        }

        recipes.forEach(recipe => {
            const recipeCard = document.createElement('div');
            recipeCard.classList.add('card', 'mb-4', 'p-3');

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
            button.onclick = () => showRecipeDetails(recipe.id); // Click event

            const cardBody = document.createElement('div');
            cardBody.classList.add('card-body');
            cardBody.appendChild(title);
            cardBody.appendChild(button);

            recipeCard.appendChild(image);
            recipeCard.appendChild(cardBody);
            recipeResults.appendChild(recipeCard);
        });
    }

    // Function to fetch and show recipe details in the modal
    async function showRecipeDetails(recipeId) {
        console.log("Fetching details for Recipe ID:", recipeId); // Debugging

        try {
            const response = await fetch(`https://api.spoonacular.com/recipes/${recipeId}/information?apiKey=${apiKey}`);
            const recipe = await response.json();
            displayRecipeDetails(recipe);
        } catch (error) {
            console.error('Error fetching recipe details:', error);
        }
    }

    // Function to display details inside the modal
    //modal is an element of UI that appears at the top of the main content and requires the user to interact with it before
    //they can return to the main content. Like pop-up dialog
    function displayRecipeDetails(recipe) {
        const modalBody = document.getElementById('recipeModalBody');

        if (!modalBody) {
            console.error("Modal body not found!");
            return;
        }

        modalBody.innerHTML = `
            <div class="text-center">
                <img src="${recipe.image}" class="img-fluid rounded mb-3" alt="${recipe.title}">
            </div>
            <h5>${recipe.title}</h5>
            <p>${recipe.instructions || "No instructions available."}</p>
            <h6>Ingredients:</h6>
            <ul>
                ${recipe.extendedIngredients.map(ingredient => `<li>${ingredient.name}</li>`).join('')}
            </ul>
        `;

        // Show modal using Bootstrap's API
        const recipeModal = new bootstrap.Modal(document.getElementById('recipeModal'));
        recipeModal.show();
    }

    // Event listener for the search form
    searchForm.addEventListener('submit', (e) => {
        e.preventDefault(); //without this, the page reloads when submitting so this prevent the default setting of the page reloading
        const ingredient = ingredientInput.value.trim();
        if (ingredient) {
            fetchRecipes(ingredient);
        } else {
            recipeResults.innerHTML = '<p>Please enter an ingredient.</p>';
        }
    });
});