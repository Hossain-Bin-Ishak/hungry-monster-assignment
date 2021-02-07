const search = document.getElementById("search"),
    submit = document.getElementById("submit"),
    mealsEl = document.getElementById("meals"),
    resultHeading = document.getElementById("resultHeading"),
    singleMealEl = document.getElementById("singleMeal");


submit.addEventListener("submit", searchMeal);

function searchMeal(e) {
    e.preventDefault();
    singleMealEl.innerHTML = "";
    const term = search.value;
    if (term.trim()) {
        fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${term}`)
            .then((res) => res.json())
            .then((data) => {
                resultHeading.innerHTML = `<h2>Search results for '${term}':</h2>`;
                if (data.meals === null) {
                    resultHeading.innerHTML = `<p>There are no search results. Try with another search term again!</p>`;
                } else {
                    mealsEl.innerHTML = data.meals
                        .map(
                            (meal) => `
            <div class="meal">
            <img src="${meal.strMealThumb}" alt="${meal.strMeal}"/>
            <div class="mealInfo" dataMealId="${meal.idMeal}">
            <h5>${meal.strMeal}</h5></div>
            </div>`
                        )
                        .join("");
                }
            });
        search.value = "";
    } else {
        alert("Please enter a search term related with food:");
    }
}

function getMealById(mealId) {
    fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`)
        .then((res) => res.json())
        .then((data) => {
            const meal = data.meals[0];
            addMeal(meal);
        });
}

function addMeal(meal) {
    const ingredients = [];
    for (let i = 1; i <= 20; i++) {
        if (meal[`strIngredient${i}`]) {
            ingredients.push(
                    `${meal[`strIngredient${i}`]}-${meal[`strMeasure${i}`]}`
      );
    } else {
      break;
    }
  }
  singleMealEl.innerHTML = `
  <div class="singleMeal">
    <h2>${meal.strMeal}</h2>
    <img src="${meal.strMealThumb}" alt="${meal.strMeal}"/>
    <div class="singleMealInfo">
        ${meal.strCategory ? `<p>${meal.strCategory}</p>` : ""}
        ${meal.strArea ? `<p>${meal.strArea}</p>` : ""}
    </div>
    <div class="instructions">
        <p>${meal.strInstructions}</p>
        <h3>Ingredients</h3>
        <ul>
            ${ingredients.map((ing) => `<li>${ing}</li>`).join("")}
        </ul>
    </div>
  </div>`;
  
}
mealsEl.addEventListener("click", (e) => {
  const mealInfo = e.path.find((item) => {
    if (item.classList) {
      return item.classList.contains("mealInfo");
    } else {
      return false;
    }
  });
  if (mealInfo) {
    const mealId = mealInfo.getAttribute("dataMealId");
    getMealById(mealId);
  }
});