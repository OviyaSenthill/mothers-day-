const recipes = [
  {
    title: "Sunshine Tomato Basil Pasta",
    note: "A bright garden bowl for the days she makes simple food feel special.",
    ingredients: ["Tomatoes", "Basil", "Garlic"],
    lesson: "You taught me that love does not need to be loud to be felt. Sometimes it is a warm plate, a clean counter, and someone asking if I have eaten.",
    mealArt:
      "radial-gradient(circle at 50% 55%, #f7d36d 0 18%, transparent 19%), radial-gradient(circle at 35% 48%, #d94f3f 0 9%, transparent 10%), radial-gradient(circle at 62% 42%, #d94f3f 0 8%, transparent 9%), radial-gradient(circle at 52% 70%, #3c8b5c 0 7%, transparent 8%), linear-gradient(135deg, #f9e4a6, #fff8e8 48%, #c6483c 49% 61%, #f4c04e 62%)",
  },
  {
    title: "Cozy Garden Soup",
    note: "A little pot of comfort with carrots, thyme, and all the patient care she gives.",
    ingredients: ["Carrots", "Thyme", "Onion"],
    lesson: "You taught me patience: that good things soften with time, and that taking care of people is one of the strongest things a person can do.",
    mealArt:
      "radial-gradient(circle at 50% 54%, #d86f39 0 30%, transparent 31%), radial-gradient(circle at 42% 45%, #f2a65d 0 8%, transparent 9%), radial-gradient(circle at 58% 62%, #f7c177 0 7%, transparent 8%), radial-gradient(circle at 57% 42%, #6aa05c 0 5%, transparent 6%), linear-gradient(135deg, #fff8e8, #f4d6a1)",
  },
  {
    title: "Strawberry Mint Shortcake",
    note: "A sweet finish for every hug, laugh, and story that made home feel like home.",
    ingredients: ["Strawberries", "Mint", "Honey"],
    lesson: "You taught me to notice the sweetness in ordinary days and to share it generously. That is one of the best gifts I could have learned.",
    mealArt:
      "radial-gradient(circle at 48% 52%, #fff5d9 0 22%, transparent 23%), radial-gradient(circle at 40% 40%, #d94452 0 8%, transparent 9%), radial-gradient(circle at 60% 46%, #d94452 0 8%, transparent 9%), radial-gradient(circle at 53% 66%, #58a06c 0 6%, transparent 7%), linear-gradient(135deg, #f8d7d8, #fff8e8 55%, #efb64c)",
  },
];

const plants = [
  { name: "Tomatoes", art: "🍅" },
  { name: "Basil", art: "🌿" },
  { name: "Garlic", art: "🧄" },
  { name: "Carrots", art: "🥕" },
  { name: "Thyme", art: "🌱" },
  { name: "Onion", art: "🧅" },
  { name: "Strawberries", art: "🍓" },
  { name: "Mint", art: "🍃" },
  { name: "Honey", art: "🍯" },
];

const gardenGrid = document.querySelector("#gardenGrid");
const pot = document.querySelector("#pot");
const potCount = document.querySelector("#potCount");
const startButton = document.querySelector("#startButton");
const bookCover = document.querySelector("#bookCover");
const recipePage = document.querySelector("#recipePage");
const recipeTitle = document.querySelector("#recipeTitle");
const recipeNote = document.querySelector("#recipeNote");
const recipeProgress = document.querySelector("#recipeProgress");
const recipeStatus = document.querySelector("#recipeStatus");
const ingredientList = document.querySelector("#ingredientList");
const prevButton = document.querySelector("#prevButton");
const nextButton = document.querySelector("#nextButton");
const lessonModal = document.querySelector("#lessonModal");
const closeLesson = document.querySelector("#closeLesson");
const continueButton = document.querySelector("#continueButton");
const lessonTitle = document.querySelector("#lessonTitle");
const lessonText = document.querySelector("#lessonText");
const mealPhoto = document.querySelector("#mealPhoto");
const finalModal = document.querySelector("#finalModal");

let currentRecipe = 0;
let started = false;
const completedRecipes = new Set();
const gatheredByRecipe = recipes.map(() => new Set());

function recipe() {
  return recipes[currentRecipe];
}

function renderGarden() {
  gardenGrid.innerHTML = "";
  const needed = new Set(recipe().ingredients);
  const gathered = gatheredByRecipe[currentRecipe];

  plants.forEach((plant) => {
    const isNeeded = needed.has(plant.name);
    const isUsed = gathered.has(plant.name);
    const plantButton = document.createElement("button");
    plantButton.className = "plant";
    plantButton.type = "button";
    plantButton.draggable = started && isNeeded && !isUsed;
    plantButton.dataset.ingredient = plant.name;
    plantButton.setAttribute("aria-label", `${plant.name} plant`);

    if (!started || !isNeeded) plantButton.classList.add("locked");
    if (isUsed) plantButton.classList.add("used");

    plantButton.innerHTML = `
      <span class="plant-art" aria-hidden="true">${plant.art}</span>
      <span class="plant-name">${plant.name}</span>
    `;

    plantButton.addEventListener("dragstart", (event) => {
      if (!isNeeded || isUsed) {
        event.preventDefault();
        return;
      }
      event.dataTransfer.setData("text/plain", plant.name);
    });

    plantButton.addEventListener("click", () => addIngredient(plant.name));
    gardenGrid.appendChild(plantButton);
  });
}

function renderRecipe() {
  const activeRecipe = recipe();
  const gathered = gatheredByRecipe[currentRecipe];
  const complete = gathered.size === activeRecipe.ingredients.length;

  recipeTitle.textContent = activeRecipe.title;
  recipeNote.textContent = activeRecipe.note;
  recipeProgress.textContent = `Recipe ${currentRecipe + 1} of ${recipes.length}`;
  recipeStatus.textContent = complete ? "Complete" : "Gathering";
  potCount.textContent = `${gathered.size} / ${activeRecipe.ingredients.length}`;
  pot.classList.toggle("ready", complete);

  ingredientList.innerHTML = "";
  activeRecipe.ingredients.forEach((ingredient) => {
    const row = document.createElement("div");
    row.className = "ingredient-pill";
    if (gathered.has(ingredient)) row.classList.add("done");
    row.innerHTML = `<span>${ingredient}</span><span>${gathered.has(ingredient) ? "Added" : "Needed"}</span>`;
    ingredientList.appendChild(row);
  });

  prevButton.disabled = currentRecipe === 0;
  nextButton.disabled = !completedRecipes.has(currentRecipe) || currentRecipe === recipes.length - 1;
  renderGarden();
}

function addIngredient(ingredient) {
  if (!started) return;

  const activeRecipe = recipe();
  const gathered = gatheredByRecipe[currentRecipe];
  if (!activeRecipe.ingredients.includes(ingredient) || gathered.has(ingredient)) return;

  gathered.add(ingredient);
  renderRecipe();

  if (gathered.size === activeRecipe.ingredients.length) {
    completedRecipes.add(currentRecipe);
    setTimeout(showLesson, 260);
  }
}

function showLesson() {
  const activeRecipe = recipe();
  lessonTitle.textContent = activeRecipe.title;
  lessonText.textContent = activeRecipe.lesson;
  mealPhoto.style.setProperty("--meal-art", activeRecipe.mealArt);
  lessonModal.hidden = false;
  continueButton.focus();
}

function closeLessonModal() {
  lessonModal.hidden = true;
  if (completedRecipes.size === recipes.length) {
    finalModal.hidden = false;
  }
  renderRecipe();
}

function openCookbook() {
  started = true;
  bookCover.hidden = true;
  recipePage.hidden = false;
  startButton.hidden = true;
  renderRecipe();
}

startButton.addEventListener("click", openCookbook);

pot.addEventListener("dragover", (event) => {
  event.preventDefault();
});

pot.addEventListener("drop", (event) => {
  event.preventDefault();
  addIngredient(event.dataTransfer.getData("text/plain"));
});

prevButton.addEventListener("click", () => {
  if (currentRecipe > 0) {
    currentRecipe -= 1;
    renderRecipe();
  }
});

nextButton.addEventListener("click", () => {
  if (completedRecipes.has(currentRecipe) && currentRecipe < recipes.length - 1) {
    currentRecipe += 1;
    renderRecipe();
  }
});

closeLesson.addEventListener("click", closeLessonModal);
continueButton.addEventListener("click", closeLessonModal);

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !lessonModal.hidden) closeLessonModal();
});

renderGarden();
