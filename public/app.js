const recipeGrid = document.querySelector("#recipe-grid");
const searchInput = document.querySelector("#search-input");
const recipeCount = document.querySelector("#recipe-count");
const emptyState = document.querySelector("#empty-state");
const statusMessage = document.querySelector("#status-message");
const recipeDialog = document.querySelector("#recipe-dialog");
const recipeDetails = document.querySelector("#recipe-details");
const addDialog = document.querySelector("#add-dialog");
const recipeForm = document.querySelector("#recipe-form");
const formError = document.querySelector("#form-error");
const filters = document.querySelector("#filters");
const storageKey = "daily-grind-custom-recipes-v1";

const starterRecipes = [
  {
    name: "Vanilla Latte",
    category: "Espresso",
    description: "A silky espresso latte with a little vanilla sweetness.",
    prepMinutes: 5,
    ingredients: ["2 shots espresso", "¾ cup milk", "1 tbsp vanilla syrup", "A little foam"],
    instructions: ["Pull two shots of espresso into a mug.", "Stir in the vanilla syrup.", "Steam the milk until silky and pour it over the espresso."],
  },
  {
    name: "Caramel Macchiato",
    category: "Espresso",
    description: "Vanilla-sweetened milk, rich espresso and a caramel finish.",
    prepMinutes: 6,
    ingredients: ["2 shots espresso", "¾ cup milk", "1 tbsp vanilla syrup", "1 tbsp caramel sauce"],
    instructions: ["Add vanilla syrup to a glass and pour in the steamed milk.", "Slowly pour espresso over the milk.", "Finish with a caramel drizzle."],
  },
  {
    name: "Classic Cappuccino",
    category: "Espresso",
    description: "A balanced café classic topped with a cloud of foam.",
    prepMinutes: 5,
    ingredients: ["2 shots espresso", "⅓ cup milk", "⅓ cup milk foam", "Cocoa powder, optional"],
    instructions: ["Pull espresso into a warm cup.", "Steam and texture milk until glossy, with a generous layer of foam.", "Pour the milk into the espresso and dust with cocoa if you like."],
  },
  {
    name: "Caffè Mocha",
    category: "Espresso",
    description: "Espresso and chocolate come together in a cozy, creamy cup.",
    prepMinutes: 6,
    ingredients: ["2 shots espresso", "1 tbsp chocolate sauce", "¾ cup milk", "Whipped cream, optional"],
    instructions: ["Stir the chocolate sauce into freshly pulled espresso.", "Steam the milk and pour it into the chocolate espresso.", "Add whipped cream for a treat-yourself finish."],
  },
  {
    name: "Honey Cinnamon Flat White",
    category: "Espresso",
    description: "Fine-textured milk meets espresso, honey and warming spice.",
    prepMinutes: 5,
    ingredients: ["2 shots ristretto or espresso", "¾ cup milk", "1 tsp honey", "A pinch of cinnamon"],
    instructions: ["Dissolve the honey in the hot espresso.", "Steam milk to a smooth microfoam.", "Pour the milk into the espresso and add a pinch of cinnamon."],
  },
  {
    name: "Brown Sugar Oat Latte",
    category: "Espresso",
    description: "Oat milk and brown sugar make a mellow, softly spiced latte.",
    prepMinutes: 6,
    ingredients: ["2 shots espresso", "¾ cup oat milk", "1 tbsp brown sugar", "A pinch of cinnamon"],
    instructions: ["Stir brown sugar and cinnamon into the hot espresso.", "Steam or warm the oat milk.", "Pour the oat milk over the espresso and stir gently."],
  },
  {
    name: "Iced Vanilla Latte",
    category: "Iced",
    description: "Cool, creamy and just sweet enough for a sunny afternoon.",
    prepMinutes: 5,
    ingredients: ["2 shots espresso, cooled", "¾ cup milk", "1 tbsp vanilla syrup", "1 cup ice"],
    instructions: ["Fill a tall glass with ice.", "Add vanilla syrup and milk.", "Pour the cooled espresso over the top and stir."],
  },
  {
    name: "Cold Brew",
    category: "Cold",
    description: "Smooth, slow-steeped coffee with a naturally mellow finish.",
    prepMinutes: 10,
    ingredients: ["1 cup coarsely ground coffee", "4 cups cold filtered water", "Ice and milk, to serve"],
    instructions: ["Combine coffee and cold water in a covered jar.", "Steep in the refrigerator for 12–16 hours.", "Strain through a fine filter. Serve over ice, diluted to taste."],
  },
  {
    name: "Iced Caramel Coffee",
    category: "Iced",
    description: "A quick iced coffee with buttery caramel in every sip.",
    prepMinutes: 4,
    ingredients: ["1 cup chilled strong coffee", "2 tbsp milk", "1 tbsp caramel sauce", "1 cup ice"],
    instructions: ["Stir caramel sauce into the chilled coffee.", "Fill a glass with ice and pour in the coffee.", "Top with milk and give it a quick stir."],
  },
  {
    name: "Espresso Tonic",
    category: "Cold",
    description: "Bright espresso meets bubbly tonic for a refreshing pick-me-up.",
    prepMinutes: 3,
    ingredients: ["1 double shot espresso, cooled", "¾ cup tonic water", "1 cup ice", "Orange slice, optional"],
    instructions: ["Fill a glass with ice and pour in the tonic water.", "Slowly pour the cooled espresso over the tonic.", "Garnish with an orange slice and serve without stirring."],
  },
  {
    name: "Affogato",
    category: "Treats",
    description: "A scoop of vanilla gelato finished with a hot espresso shot.",
    prepMinutes: 3,
    ingredients: ["1 scoop vanilla gelato", "1 shot hot espresso", "Shaved chocolate, optional"],
    instructions: ["Place a scoop of gelato in a small chilled cup.", "Pour hot espresso over the gelato.", "Add shaved chocolate and enjoy straight away."],
  },
  {
    name: "Spiced Chai Latte",
    category: "Tea",
    description: "A fragrant, warming tea latte with cinnamon and cardamom.",
    prepMinutes: 8,
    ingredients: ["1 black tea bag", "½ cup hot water", "½ cup milk", "1 tsp honey", "Pinch of cinnamon and cardamom"],
    instructions: ["Steep the tea bag with spices in hot water for 4 minutes.", "Warm and froth the milk.", "Remove the tea bag, stir in honey and top with the milk."],
  },
];

const cardAccents = ["lavender", "peach", "sage", "blue", "rose", "butter"];
const cardIcons = {
  Espresso: "☕",
  Iced: "🧊",
  Cold: "❄",
  Tea: "🍵",
  Treats: "✳",
};

let activeCategory = "";
let searchTimer;
let storageWarning = "";
let customRecipes = readCustomRecipes();

function makeElement(tagName, className, text) {
  const element = document.createElement(tagName);
  if (className) element.className = className;
  if (text !== undefined) element.textContent = text;
  return element;
}

function isRecipe(value) {
  return value
    && typeof value.id === "string"
    && typeof value.name === "string"
    && typeof value.category === "string"
    && typeof value.description === "string"
    && Number.isInteger(value.prepMinutes)
    && Array.isArray(value.ingredients)
    && Array.isArray(value.instructions)
    && value.ingredients.every((item) => typeof item === "string")
    && value.instructions.every((item) => typeof item === "string");
}

function readCustomRecipes() {
  try {
    const stored = localStorage.getItem(storageKey);
    if (!stored) return [];
    const recipes = JSON.parse(stored);
    if (!Array.isArray(recipes) || !recipes.every(isRecipe)) {
      throw new Error("Saved recipes have an unexpected format.");
    }
    return recipes;
  } catch (error) {
    storageWarning = `Saved recipes could not be loaded: ${error.message}`;
    return [];
  }
}

function renderRecipes(recipes) {
  recipeGrid.replaceChildren();
  recipeCount.textContent = `${recipes.length} ${recipes.length === 1 ? "recipe" : "recipes"} to love`;
  emptyState.hidden = recipes.length !== 0;

  for (const [index, recipe] of recipes.entries()) {
    const card = makeElement("article", "recipe-card");
    const art = makeElement("div", `card-art ${cardAccents[index % cardAccents.length]}`);
    const category = makeElement("span", "card-category", recipe.category);
    const icon = makeElement("span", "card-illustration", cardIcons[recipe.category] || "✳");
    icon.setAttribute("aria-hidden", "true");
    const time = makeElement("span", "card-time", `${recipe.prepMinutes} min`);
    const copy = makeElement("div", "card-copy");
    const title = makeElement("h3", "card-title", recipe.name);
    const description = makeElement("p", "card-description", recipe.description);
    const footer = makeElement("div", "card-footer");
    const ingredients = makeElement("span", "ingredient-count", `${recipe.ingredients.length} ingredients`);
    const openButton = makeElement("button", "card-open", "Get the recipe ↗");
    openButton.type = "button";
    openButton.setAttribute("aria-label", `View ${recipe.name} recipe`);
    openButton.addEventListener("click", () => showRecipe(recipe));

    art.append(category, icon, time);
    footer.append(ingredients, openButton);
    copy.append(title, description, footer);
    card.append(art, copy);
    recipeGrid.append(card);
  }
}

function loadRecipes() {
  statusMessage.textContent = storageWarning;
  const query = searchInput.value.trim().toLocaleLowerCase();
  const recipes = [...starterRecipes, ...customRecipes].filter((recipe) => {
    const matchesCategory = !activeCategory || recipe.category === activeCategory;
    const matchesSearch = !query
      || [recipe.name, recipe.description, recipe.category, ...recipe.ingredients]
        .some((value) => value.toLocaleLowerCase().includes(query));
    return matchesCategory && matchesSearch;
  });
  recipes.sort((first, second) => first.name.localeCompare(second.name));
  renderRecipes(recipes);
}

function showRecipe(recipe) {
  recipeDetails.replaceChildren();
  const category = makeElement("p", "eyebrow", recipe.category.toUpperCase());
  const title = makeElement("h2", "detail-title", recipe.name);
  title.id = "dialog-title";
  title.append(makeElement("em", "", " recipe"));
  const description = makeElement("p", "detail-description", recipe.description);
  const meta = makeElement("p", "detail-meta", `${recipe.prepMinutes} MINUTES  ·  ${recipe.ingredients.length} INGREDIENTS`);
  const columns = makeElement("div", "detail-columns");
  const ingredientSection = makeElement("section", "detail-section");
  const instructionSection = makeElement("section", "detail-section");
  ingredientSection.append(makeElement("h3", "", "What you'll need"));
  instructionSection.append(makeElement("h3", "", "Let's make it"));
  const ingredientList = makeElement("ul", "ingredient-list");
  const instructionList = makeElement("ol", "instruction-list");
  for (const ingredient of recipe.ingredients) ingredientList.append(makeElement("li", "", ingredient));
  for (const instruction of recipe.instructions) instructionList.append(makeElement("li", "", instruction));
  ingredientSection.append(ingredientList);
  instructionSection.append(instructionList);
  columns.append(ingredientSection, instructionSection);
  recipeDetails.append(category, title, description, meta, columns);
  recipeDialog.showModal();
}

function updateActiveFilter(selectedButton) {
  for (const chip of filters.querySelectorAll(".filter-chip")) {
    const selected = chip === selectedButton;
    chip.classList.toggle("active", selected);
    chip.setAttribute("aria-pressed", String(selected));
  }
}

filters.addEventListener("click", (event) => {
  const button = event.target.closest("[data-category]");
  if (!button) return;
  activeCategory = button.dataset.category;
  updateActiveFilter(button);
  loadRecipes();
});

searchInput.addEventListener("input", () => {
  window.clearTimeout(searchTimer);
  searchTimer = window.setTimeout(loadRecipes, 120);
});

document.querySelector("#clear-filters").addEventListener("click", () => {
  searchInput.value = "";
  activeCategory = "";
  updateActiveFilter(filters.querySelector('[data-category=""]'));
  loadRecipes();
});

document.querySelector("#open-add").addEventListener("click", () => {
  formError.textContent = "";
  addDialog.showModal();
});

document.querySelectorAll("[data-close-dialog]").forEach((button) => {
  button.addEventListener("click", () => button.closest("dialog").close());
});

for (const dialog of [recipeDialog, addDialog]) {
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) dialog.close();
  });
}

recipeForm.addEventListener("submit", (event) => {
  event.preventDefault();
  formError.textContent = "";
  const formData = new FormData(recipeForm);
  const ingredients = formData.get("ingredients").split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
  const instructions = formData.get("instructions").split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
  const recipe = {
    id: globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    name: formData.get("name").trim(),
    category: formData.get("category"),
    prepMinutes: Number(formData.get("prepMinutes")),
    description: formData.get("description").trim(),
    ingredients,
    instructions,
  };

  if (!recipe.name || !recipe.description || !Number.isInteger(recipe.prepMinutes)
      || recipe.prepMinutes < 1 || recipe.prepMinutes > 1440) {
    formError.textContent = "Add a name, description, and prep time between 1 and 1440 minutes.";
    return;
  }
  if (ingredients.length === 0 || ingredients.length > 30
      || ingredients.some((item) => item.length > 160)) {
    formError.textContent = "Add between 1 and 30 ingredients, each 160 characters or fewer.";
    return;
  }
  if (instructions.length === 0 || instructions.length > 20
      || instructions.some((item) => item.length > 500)) {
    formError.textContent = "Add between 1 and 20 steps, each 500 characters or fewer.";
    return;
  }

  customRecipes = [...customRecipes, recipe];
  try {
    localStorage.setItem(storageKey, JSON.stringify(customRecipes));
    storageWarning = "";
  } catch (error) {
    storageWarning = `Recipe added for this visit, but couldn't be saved in this browser: ${error.message}`;
  }
  recipeForm.reset();
  recipeForm.elements.prepMinutes.value = "5";
  addDialog.close();
  searchInput.value = "";
  activeCategory = "";
  updateActiveFilter(filters.querySelector('[data-category=""]'));
  loadRecipes();
  showRecipe(recipe);
});

loadRecipes();
