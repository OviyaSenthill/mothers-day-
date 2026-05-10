const recipes = [
  {
    title: "Sunshine Tomato Basil Pasta",
    note: "A bright garden bowl for the days she makes simple food feel special.",
    ingredients: ["Tomatoes", "Basil", "Garlic"],
    lesson:
      "Thank you for teaching me to be kind and empathetic. \"No act of kindness, no matter how small, is ever wasted.\" I am forever thankful for you teaching me this.",
    photo: "assets/kind-empathy.jpg",
    photoAlt: "Mama and me smiling by a mountain lake.",
  },
  {
    title: "Cozy Garden Soup",
    note: "A little pot of comfort with carrots, thyme, and all the patient care she gives.",
    ingredients: ["Carrots", "Thyme", "Onion"],
    lesson:
      "Thank you for teaching me to push myself and grow. \"Growth begins where comfort ends.\" You have always shown me that I am capable of more than I think.",
    photo: "assets/push-grow.jpg",
    photoAlt: "Mama and me hugging by a decorated Christmas tree.",
  },
  {
    title: "Strawberry Mint Shortcake",
    note: "A sweet finish for every hug, laugh, and story that made home feel like home.",
    ingredients: ["Strawberries", "Mint", "Honey"],
    lesson:
      "Thank you for teaching me to be adventurous and free. You made the world feel big, beautiful, and possible, and you taught me to meet it with courage.",
    photo: "assets/adventurous-free.jpg",
    photoAlt: "Mama and me smiling together on a hike.",
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
const mealImage = document.querySelector("#mealImage");
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
  mealImage.src = activeRecipe.photo;
  mealImage.alt = activeRecipe.photoAlt;
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
