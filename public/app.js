import * as Database from "../database.js";
import { addedRecipes } from "./added-recipes.js";

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
const accountButton = document.querySelector("#account-button");
const userSignupButton = document.querySelector("#user-signup-button");
const adminProfileSummary = document.querySelector("#admin-profile-summary");
const adminProfileName = document.querySelector("#admin-profile-name");
const adminProfileButton = document.querySelector("#admin-profile-button");
const adminSignoutButton = document.querySelector("#admin-signout-button");
const authDialog = document.querySelector("#auth-dialog");
const authForm = document.querySelector("#auth-form");
const authError = document.querySelector("#auth-error");
const authTitle = document.querySelector("#auth-title");
const authIntro = document.querySelector("#auth-intro");
const authSubmit = document.querySelector("#auth-submit");
const authToggle = document.querySelector("#auth-toggle");
const adminButton = document.querySelector("#admin-button");
const reviewButton = document.querySelector("#review-button");
const moderationDialog = document.querySelector("#moderation-dialog");
const moderationList = document.querySelector("#moderation-list");
const moderationStatus = document.querySelector("#moderation-status");
const adminProfileDialog = document.querySelector("#admin-profile-dialog");
const adminProfileForm = document.querySelector("#admin-profile-form");
const adminDisplayName = document.querySelector("#admin-display-name");
const adminProfileError = document.querySelector("#admin-profile-error");
const adminProfileSuccess = document.querySelector("#admin-profile-success");
const adminProfileSubmit = document.querySelector("#admin-profile-submit");

const originalStarterRecipes = [
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

const replacedStarterNames = new Set([
  "Vanilla Latte",
  "Caramel Macchiato",
  "Classic Cappuccino",
  "Caffè Mocha",
  "Cold Brew",
  "Espresso Tonic",
  "Affogato",
]);
const starterRecipes = [
  ...originalStarterRecipes.filter((recipe) => !replacedStarterNames.has(recipe.name)),
  ...addedRecipes,
];

const cardAccents = ["lavender", "peach", "sage", "blue", "rose", "butter"];
const recipeArtPalettes = {
  Espresso: ["#ead8bf", "#a36b3f", "#68402d"],
  Iced: ["#dce9e8", "#c58b55", "#72503b"],
  Cold: ["#dce5e6", "#78503a", "#422e28"],
  Tea: ["#e6e8d8", "#b47d48", "#775037"],
  Treats: ["#efe1d3", "#ead6ad", "#9a613f"],
};

const adminEmails = new Set([
  "wackyvillarina@gmail.com",
  "taniel@gmail.com",
  "jaylord@gmail.com",
]);

let activeCategory = "";
let searchTimer;
let customRecipes = [];
let currentSession = null;
let isAdmin = false;
let authMode = "sign-in";
let authIntent = "user";

function makeElement(tagName, className, text) {
  const element = document.createElement(tagName);
  if (className) element.className = className;
  if (text !== undefined) element.textContent = text;
  return element;
}

function createPastryArtwork(name) {
  if (/cinnamon rolls|morning bun/i.test(name)) {
    return `<ellipse cx="160" cy="153" rx="77" ry="15" fill="#76523d" opacity=".17"/>
      <circle cx="160" cy="104" r="58" fill="#c88b4d"/>
      <circle cx="160" cy="104" r="47" fill="none" stroke="#f4d596" stroke-width="10"/>
      <path d="M160 104c20-28 47-6 30 14-15 18-49 8-42-13 7-19 37-12 30 4-4 10-18 6-15-2" fill="none" stroke="#8b4c2c" stroke-width="8" stroke-linecap="round"/>
      <path d="M108 85c12-21 26-31 47-37m23 6c18 10 30 24 35 44" fill="none" stroke="#fff0cc" stroke-width="4" stroke-linecap="round"/>`;
  }
  if (/madeleine/i.test(name)) {
    return `<ellipse cx="160" cy="150" rx="76" ry="14" fill="#76523d" opacity=".16"/>
      <path d="M82 112c0-34 32-55 78-55s78 21 78 55c0 31-32 45-78 45s-78-14-78-45z" fill="#d8a05b" stroke="#fff2d5" stroke-width="6"/>
      <path d="M111 78c-2 22 1 42 9 65m12-78c-2 27 1 52 8 73m11-76c-1 29 0 54 3 77m15-76c1 27 0 52-3 75m19-70c3 25 1 46-5 66m22-56c5 20 2 37-4 50" fill="none" stroke="#f0c987" stroke-width="5" stroke-linecap="round"/>`;
  }
  if (/scone/i.test(name)) {
    return `<ellipse cx="160" cy="155" rx="74" ry="13" fill="#76523d" opacity=".16"/>
      <path d="M86 141 113 75l44-22 61 44-8 51c-35 18-86 16-124-7z" fill="#d6a261" stroke="#fff1d3" stroke-width="6" stroke-linejoin="round"/>
      <circle cx="130" cy="104" r="6" fill="#6079a0"/><circle cx="164" cy="86" r="6" fill="#6079a0"/><circle cx="187" cy="119" r="6" fill="#6079a0"/>
      <path d="m101 136 18 5m55 3 23-6" stroke="#f5dcae" stroke-width="5" stroke-linecap="round"/>`;
  }
  if (/turnover/i.test(name)) {
    const fruit = /raspberry/i.test(name) ? "#ad5363" : "#c98248";
    return `<ellipse cx="160" cy="155" rx="78" ry="13" fill="#76523d" opacity=".16"/>
      <path d="m82 128 68-70 91 69-75 38z" fill="#e2ae69" stroke="#fff4dc" stroke-width="7" stroke-linejoin="round"/>
      <path d="m105 124 47-47 64 49-54 24z" fill="${fruit}"/>
      <path d="m91 130 76 27m-62-43 63 36m-46-52 63 36m-46-52 62 36" stroke="#f7dfb3" stroke-width="5" stroke-linecap="round"/>`;
  }
  if (/danish|tartlet/i.test(name)) {
    const center = /lemon/i.test(name) ? "#e8c65b" : "#e9d2ac";
    return `<ellipse cx="160" cy="153" rx="77" ry="13" fill="#76523d" opacity=".16"/>
      <path d="M91 106c0-37 30-61 69-61s69 24 69 61v21c0 16-13 28-29 28h-80c-16 0-29-12-29-28z" fill="#dba960" stroke="#fff1d4" stroke-width="7"/>
      <ellipse cx="160" cy="101" rx="52" ry="37" fill="${center}"/>
      <path d="M109 103h102m-91-19 80 39m-2-40-79 42" stroke="#f8e4be" stroke-width="4" opacity=".8"/>`;
  }
  if (/muffin/i.test(name)) {
    return `<ellipse cx="160" cy="153" rx="67" ry="12" fill="#76523d" opacity=".16"/>
      <path d="M108 86h104l-11 67c-1 8-9 13-18 13h-46c-9 0-17-5-18-13z" fill="#d8a25d" stroke="#fff0d1" stroke-width="6"/>
      <path d="M101 88c0-31 22-49 59-49s59 18 59 49z" fill="#c6894b" stroke="#fff0d1" stroke-width="6"/>
      <circle cx="132" cy="66" r="5" fill="#54362f"/><circle cx="166" cy="53" r="5" fill="#54362f"/><circle cx="190" cy="72" r="5" fill="#54362f"/>
      <path d="m132 103 6 45m25-45v48m25-48-5 45" stroke="#efc982" stroke-width="5" stroke-linecap="round"/>`;
  }
  if (/almond croissant/i.test(name)) {
    return `<ellipse cx="160" cy="151" rx="81" ry="14" fill="#76523d" opacity=".16"/>
      <path d="M82 132c6-42 28-65 51-58 15 4 19 22 27 19 8-3 10-23 28-24 28-1 45 31 50 68-23 23-53 34-82 34s-56-14-74-39z" fill="#d69a53" stroke="#fff0d2" stroke-width="6"/>
      <path d="M96 128c12-15 25-28 39-40m-27 59c19-21 37-40 55-55m-38 70c21-23 41-44 60-60m-39 70c22-24 43-44 63-58" fill="none" stroke="#f4d39e" stroke-width="7" stroke-linecap="round"/>
      <path d="m139 72 8-12m17 28 7-13m24 5 7-12m-77 12 7-11" stroke="#fff1ce" stroke-width="5" stroke-linecap="round"/>`;
  }
  if (/palmier/i.test(name)) {
    return `<ellipse cx="160" cy="153" rx="75" ry="13" fill="#76523d" opacity=".15"/>
      <path d="M160 149c-17-17-69-46-63-77 4-22 33-28 48-4l15 24 15-24c15-24 44-18 48 4 6 31-46 60-63 77z" fill="#d9a05b" stroke="#fff1d3" stroke-width="7"/>
      <path d="M160 133c-10-14-40-34-39-55 1-13 17-16 26-3l13 19 13-19c9-13 25-10 26 3 1 21-29 41-39 55z" fill="none" stroke="#f6dba8" stroke-width="7" stroke-linecap="round"/>
      <path d="m122 79 8 8m60-8-8 8" stroke="#fff7e6" stroke-width="5" stroke-linecap="round"/>`;
  }
  if (/brioche/i.test(name)) {
    return `<ellipse cx="160" cy="154" rx="78" ry="13" fill="#76523d" opacity=".15"/>
      <path d="M89 129c0-14 11-24 26-24h91c15 0 25 10 25 24v27H89z" fill="#d9a15e" stroke="#fff1d4" stroke-width="6"/>
      <path d="M91 105c0-33 23-54 69-54s69 21 69 54z" fill="#e3ae69" stroke="#fff1d4" stroke-width="6"/>
      <path d="M114 115v30m23-34v38m25-38v39m25-38v36m22-34v30" stroke="#f2d29c" stroke-width="5" stroke-linecap="round"/>`;
  }
  if (/eclair/i.test(name)) {
    return `<ellipse cx="160" cy="147" rx="88" ry="14" fill="#76523d" opacity=".16"/>
      <path d="M66 108c8-18 27-27 47-27h94c20 0 39 9 47 27l-10 29c-6 17-23 27-43 27h-82c-20 0-37-10-43-27z" fill="#d9a05d" stroke="#fff0d3" stroke-width="7"/>
      <path d="M82 101c10-17 24-24 43-24h70c19 0 34 7 43 24-27 11-47 8-70 2-27-7-52 8-86-2z" fill="#694233"/>
      <path d="M107 112h106" stroke="#9a6445" stroke-width="5" stroke-linecap="round"/>`;
  }
  if (/pain au chocolat/i.test(name)) {
    return `<ellipse cx="160" cy="151" rx="80" ry="13" fill="#76523d" opacity=".16"/>
      <path d="M89 78h142v68c0 15-12 26-27 26h-88c-15 0-27-11-27-26z" fill="#dda55f" stroke="#fff1d2" stroke-width="7"/>
      <path d="M99 98h122m-122 20h122m-122 20h122" stroke="#f4d7a5" stroke-width="7"/>
      <path d="M121 78v94m39-94v94m39-94v94" stroke="#f8e3bf" stroke-width="4"/>
      <path d="M105 93h106m-106 21h106m-106 21h106" stroke="#704332" stroke-width="8" stroke-linecap="round"/>`;
  }
  if (/croissant/i.test(name)) {
    return `<ellipse cx="160" cy="151" rx="82" ry="14" fill="#76523d" opacity=".16"/>
      <path d="M83 138c7-42 24-72 47-70 16 1 18 24 30 24s15-23 31-24c23-2 40 28 47 70-21 21-47 32-77 32s-57-11-78-32z" fill="#d99c54" stroke="#fff0d1" stroke-width="7"/>
      <path d="M101 134c14-18 25-39 39-58m-22 75c18-23 31-49 46-69m-27 83c20-27 35-54 51-74m-29 81c21-28 37-54 54-74m-29 73c17-23 32-43 47-57" fill="none" stroke="#f4d39e" stroke-width="7" stroke-linecap="round"/>`;
  }
  return `<ellipse cx="160" cy="151" rx="77" ry="14" fill="#76523d" opacity=".16"/>
    <path d="M91 103h138l-13 47c-4 13-17 21-33 21h-46c-16 0-29-8-33-21z" fill="#fffaf0" stroke="#e1d1bb" stroke-width="5"/>
    <ellipse cx="160" cy="103" rx="69" ry="18" fill="#e8d3ad"/>
    <path d="M130 101c10-12 21-12 30 0 10-12 21-12 31 0" fill="none" stroke="#8a5637" stroke-width="5" stroke-linecap="round"/>`;
}

function createRecipeImage(recipe) {
  const palette = recipeArtPalettes[recipe.category] || recipeArtPalettes.Espresso;
  const background = palette[0];
  const liquid = /mocha|chocolate/i.test(recipe.name)
    ? "#704332"
    : /caramel|brown sugar/i.test(recipe.name)
      ? "#a96d3d"
      : /chai|cinnamon/i.test(recipe.name)
        ? "#9a5c35"
        : /vanilla|cappuccino|flat white/i.test(recipe.name)
          ? "#c6a477"
          : palette[1];
  const isGlass = recipe.category === "Iced" || recipe.category === "Cold";
  const isAffogato = /affogato/i.test(recipe.name);
  const isPastry = recipe.category === "Treats"
    && /croissant|cinnamon rolls|madeleine|scone|pain au chocolat|turnover|danish|tartlet|muffin|palmier|morning bun|brioche|eclair/i.test(recipe.name);
  const artwork = isPastry
    ? createPastryArtwork(recipe.name)
    : isAffogato
    ? `<ellipse cx="160" cy="133" rx="71" ry="14" fill="#76523d" opacity=".18"/>
       <path d="M90 100h140l-14 48c-4 14-18 23-35 23h-42c-17 0-31-9-35-23z" fill="#fffaf0" stroke="#e1d1bb" stroke-width="5"/>
       <ellipse cx="160" cy="101" rx="70" ry="19" fill="#f7efe0"/>
       <circle cx="139" cy="86" r="27" fill="#f0dfbd"/><circle cx="180" cy="85" r="27" fill="#ead4a8"/>
       <path d="M125 85c4-13 17-19 27-13M168 84c4-12 16-18 26-12" fill="none" stroke="#fff8e9" stroke-width="5" stroke-linecap="round"/>
       <path d="M128 77l5 8m44-10 5 9" stroke="#754630" stroke-width="3" stroke-linecap="round"/>`
    : isGlass || /irish coffee|martini|shakerato|frappé/i.test(recipe.name)
      ? `<defs><clipPath id="drinkClip"><path d="M111 62h98l-11 104c-1 9-7 15-16 15h-44c-9 0-15-6-16-15z"/></clipPath></defs>
         <ellipse cx="160" cy="176" rx="56" ry="12" fill="#76523d" opacity=".17"/>
         <path d="M111 62h98l-11 104c-1 9-7 15-16 15h-44c-9 0-15-6-16-15z" fill="#ffffff75" stroke="#fffaf0" stroke-width="6"/>
         <g clip-path="url(#drinkClip)">
           <path d="M103 98h114v92H103z" fill="${liquid}"/>
           <ellipse cx="160" cy="99" rx="57" ry="13" fill="${palette[1]}"/>
           <path d="M132 84l19 21-14 25-20-23zm44 4 18 20-13 23-20-22z" fill="#fff4d7" opacity=".82"/>
           <path d="M183 50l-8 81" stroke="#a65d3e" stroke-width="8" stroke-linecap="round"/>
         </g>
         <path d="M126 69l10 94" stroke="#fff" stroke-width="5" opacity=".55" stroke-linecap="round"/>`
      : `<ellipse cx="159" cy="171" rx="75" ry="14" fill="#76523d" opacity=".17"/>
         <path d="M92 82h133v64c0 25-20 44-45 44h-43c-25 0-45-19-45-44z" fill="#fffaf0" stroke="#e2d3c0" stroke-width="5"/>
         <path d="M225 99h21c17 0 25 12 25 27s-9 27-26 27h-27" fill="none" stroke="#e2d3c0" stroke-width="12"/>
         <ellipse cx="158" cy="83" rx="66" ry="18" fill="${liquid}"/>
         <ellipse cx="158" cy="81" rx="55" ry="11" fill="#ead8b9"/>
         <path d="M139 83c10-12 23-12 34 0-10 11-24 11-34 0z" fill="#fff6e5"/>
         <path d="M122 105v47" stroke="#fff" stroke-width="6" opacity=".62" stroke-linecap="round"/>
         <path d="M139 60c-8-12 9-15 3-28m27 27c-8-12 9-15 3-28" fill="none" stroke="#fffaf0" stroke-width="4" opacity=".78" stroke-linecap="round"/>`;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 200">
    <defs><linearGradient id="bg" x2="0" y2="1"><stop stop-color="${background}"/><stop offset="1" stop-color="#fffaf0"/></linearGradient></defs>
    <rect width="320" height="200" fill="url(#bg)"/>
    <circle cx="252" cy="42" r="54" fill="#fff" opacity=".25"/>
    <circle cx="53" cy="150" r="38" fill="#fff" opacity=".18"/>
    <path d="M0 169c65-19 109 12 169-2s101-14 151 1v32H0z" fill="#fffaf0" opacity=".48"/>
    <circle cx="72" cy="67" r="3" fill="#fff" opacity=".65"/><circle cx="251" cy="124" r="4" fill="#fff" opacity=".6"/>
    ${artwork}
  </svg>`;
  const image = makeElement("img", "card-image");
  image.src = `data:image/svg+xml,${encodeURIComponent(svg)}`;
  image.alt = `${recipe.name} illustration`;
  image.loading = "lazy";
  return image;
}

function renderRecipes(recipes) {
  recipeGrid.replaceChildren();
  recipeCount.textContent = `${recipes.length} ${recipes.length === 1 ? "recipe" : "recipes"} to love`;
  emptyState.hidden = recipes.length !== 0;

  for (const [index, recipe] of recipes.entries()) {
    const card = makeElement("article", "recipe-card");
    const art = makeElement("div", `card-art ${cardAccents[index % cardAccents.length]}`);
    const category = makeElement("span", "card-category", recipe.category);
    const image = createRecipeImage(recipe);
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

    art.append(image, category, time);
    footer.append(ingredients, openButton);
    copy.append(title, description, footer);
    card.append(art, copy);
    recipeGrid.append(card);
  }
}

function loadRecipes() {
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

function openAddDialog() {
  formError.textContent = "";
  addDialog.showModal();
}

function openAuthDialog() {
  authError.textContent = "";
  authDialog.showModal();
}

function openAuth(intent, mode) {
  authIntent = intent;
  setAuthMode(mode);
  openAuthDialog();
}

function setAuthMode(mode) {
  authMode = mode;
  const signingUp = mode === "sign-up";
  authTitle.innerHTML = signingUp
    ? authIntent === "admin" ? "Create admin <em>account.</em>" : "Create your <em>account.</em>"
    : authIntent === "admin" ? "Admin <em>sign in.</em>" : "Sign in to <em>share.</em>";
  authIntro.textContent = authIntent === "admin"
    ? signingUp
      ? "Admin accounts are limited to the three designated email addresses."
      : "Sign in with one of the three designated admin accounts to review recipes."
    : signingUp
      ? "Create an account to add your recipes to the shared recipe book."
      : "Sign in to add your recipes to the shared recipe book.";
  authSubmit.textContent = signingUp
    ? authIntent === "admin" ? "Create admin account" : "Create account"
    : "Sign in";
  authForm.elements.password.autocomplete = signingUp ? "new-password" : "current-password";
  authForm.elements.password.minLength = signingUp ? 8 : 1;
  authToggle.textContent = signingUp
    ? authIntent === "admin" ? "Already an admin? Sign in" : "Already have an account? Sign in"
    : authIntent === "admin" ? "Need an admin account? Sign up" : "Need an account? Sign up";
  authToggle.hidden = false;
  authError.textContent = "";
}

function updateAccountButton() {
  accountButton.textContent = currentSession ? "Sign out" : "Sign in";
  accountButton.setAttribute("aria-label", currentSession
    ? `Sign out ${currentSession.user.email}`
    : "User sign in");
  accountButton.hidden = isAdmin;
  userSignupButton.hidden = isAdmin;
  reviewButton.hidden = !currentSession || !isAdmin;
  adminProfileSummary.hidden = !currentSession || !isAdmin;
  adminProfileName.textContent = currentSession && isAdmin
    ? currentSession.user.user_metadata?.display_name
      || currentSession.user.user_metadata?.full_name
      || currentSession.user.email
    : "";
  adminSignoutButton.hidden = !currentSession || !isAdmin;
  adminButton.hidden = isAdmin;
}

async function updateAdminStatus() {
  isAdmin = currentSession ? await Database.isRecipeAdmin() : false;
  updateAccountButton();
}

document.querySelector("#open-add").addEventListener("click", () => {
  if (!Database.isConfigured) {
    statusMessage.textContent = "Set your Supabase project URL and anon key in database.js to enable shared recipes.";
    return;
  }
  if (!currentSession) {
    openAuth("user", "sign-in");
    return;
  }
  openAddDialog();
});

async function signOutCurrentUser() {
  if (!Database.isConfigured) {
    statusMessage.textContent = "Set your Supabase project URL and anon key in database.js to enable accounts.";
    return;
  }
  try {
    const { error } = await Database.signOut();
    if (error) throw error;
    currentSession = null;
    isAdmin = false;
    updateAccountButton();
  } catch (error) {
    statusMessage.textContent = `Couldn't sign out: ${error.message}`;
  }
}

accountButton.addEventListener("click", async () => {
  if (!currentSession) {
    if (!Database.isConfigured) {
      statusMessage.textContent = "Set your Supabase project URL and anon key in database.js to enable accounts.";
      return;
    }
    openAuth("user", "sign-in");
    return;
  }
  await signOutCurrentUser();
});

adminSignoutButton.addEventListener("click", signOutCurrentUser);

adminProfileButton.addEventListener("click", () => {
  if (!isAdmin || !currentSession) return;
  adminProfileError.textContent = "";
  adminProfileSuccess.hidden = true;
  adminDisplayName.value = currentSession.user.user_metadata?.display_name
    || currentSession.user.user_metadata?.full_name
    || "";
  adminProfileDialog.showModal();
});

adminButton.addEventListener("click", () => {
  openAuth("admin", "sign-in");
});

userSignupButton.addEventListener("click", () => {
  openAuth("user", "sign-up");
});

reviewButton.addEventListener("click", async () => {
  moderationDialog.showModal();
  await loadPendingRecipes();
});

authToggle.addEventListener("click", () => {
  setAuthMode(authMode === "sign-in" ? "sign-up" : "sign-in");
});

authForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  authError.textContent = "";
  authSubmit.disabled = true;
  try {
    if (!Database.isConfigured) {
      throw new Error("Account access isn't connected yet. Add your Supabase project URL and anon/public key in database.js.");
    }
    const email = authForm.elements.email.value.trim();
    const password = authForm.elements.password.value;
    if (authIntent === "admin" && authMode === "sign-up" && !adminEmails.has(email.toLowerCase())) {
      throw new Error("Admin sign-up is limited to the three designated admin email addresses.");
    }
    const { data, error } = authMode === "sign-up"
      ? await Database.signUp(email, password)
      : await Database.signIn(email, password);
    if (error) throw error;
    if (authMode === "sign-up" && !data.session) {
      setAuthMode("sign-in");
      authError.textContent = "Account created. Check your email to confirm it, then sign in.";
      return;
    }
    const loginIntent = authIntent;
    currentSession = data.session;
    try {
      await updateAdminStatus();
    } catch (error) {
      if (loginIntent === "admin") {
        const { error: signOutError } = await Database.signOut();
        if (signOutError) {
          updateAccountButton();
          throw new Error(`Admin access couldn't be verified. Run the latest supabase/schema.sql, then try again. Sign-out also failed: ${signOutError.message}`);
        }
        currentSession = null;
        isAdmin = false;
        updateAccountButton();
      }
      throw new Error(`Admin access couldn't be verified. Run the latest supabase/schema.sql in Supabase, then try again. ${error.message}`);
    }
    if (loginIntent === "admin" && !isAdmin) {
      const { error: signOutError } = await Database.signOut();
      if (signOutError) {
        updateAccountButton();
        throw new Error(`This account isn't one of the three designated admins. Sign-out also failed: ${signOutError.message}`);
      }
      currentSession = null;
      isAdmin = false;
      updateAccountButton();
      authError.textContent = "This account isn't one of the three designated admins. Use one of the three allowlisted emails.";
      return;
    }
    updateAccountButton();
    authDialog.close();
    authForm.reset();
    authIntent = "user";
    if (currentSession && !isAdmin) openAddDialog();
    if (currentSession && isAdmin) await loadPendingRecipes();
  } catch (error) {
    authError.textContent = `Couldn't ${authMode === "sign-up" ? "create your account" : "sign in"}: ${error.message}`;
  } finally {
    authSubmit.disabled = false;
  }
});

adminProfileForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  adminProfileError.textContent = "";
  adminProfileSuccess.hidden = true;
  adminProfileSubmit.disabled = true;

  try {
    if (!isAdmin || !currentSession) {
      throw new Error("Only a signed-in admin can update this display name.");
    }
    const displayName = adminDisplayName.value.trim();
    if (!displayName) throw new Error("Enter a display name.");

    const { data, error } = await Database.updateDisplayName(displayName);
    if (error) throw error;
    currentSession = { ...currentSession, user: data.user };
    adminProfileName.textContent = displayName;
    adminProfileSuccess.textContent = "Your display name was updated.";
    adminProfileSuccess.hidden = false;
  } catch (error) {
    adminProfileError.textContent = `Couldn't update your name: ${error.message}`;
  } finally {
    adminProfileSubmit.disabled = false;
  }
});

document.querySelectorAll("[data-close-dialog]").forEach((button) => {
  button.addEventListener("click", () => button.closest("dialog").close());
});

authDialog.addEventListener("close", () => {
  authIntent = "user";
  setAuthMode("sign-in");
});

for (const dialog of [recipeDialog, addDialog, authDialog, adminProfileDialog, moderationDialog]) {
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) dialog.close();
  });
}

recipeForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  formError.textContent = "";
  const formData = new FormData(recipeForm);
  const ingredients = formData.get("ingredients").split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
  const instructions = formData.get("instructions").split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
  const recipe = {
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

  try {
    await Database.addRecipe(recipe);
  } catch (error) {
    formError.textContent = `Recipe couldn't be saved: ${error.message}`;
    return;
  }
  recipeForm.reset();
  recipeForm.elements.prepMinutes.value = "5";
  addDialog.close();
  searchInput.value = "";
  activeCategory = "";
  updateActiveFilter(filters.querySelector('[data-category=""]'));
  loadRecipes();
  statusMessage.textContent = "Your recipe was submitted and is waiting for admin review.";
});

function renderPendingRecipes(recipes) {
  moderationList.replaceChildren();
  if (recipes.length === 0) {
    moderationList.append(makeElement("p", "moderation-empty", "No recipes are waiting for review."));
    return;
  }

  for (const recipe of recipes) {
    const card = makeElement("article", "moderation-card");
    const category = makeElement("p", "eyebrow", recipe.category.toUpperCase());
    const title = makeElement("h3", "moderation-recipe-title", recipe.name);
    const description = makeElement("p", "moderation-description", recipe.description);
    const submitted = makeElement(
      "p",
      "moderation-date",
      `Submitted ${new Date(recipe.createdAt).toLocaleString()}`
    );
    const ingredients = makeElement("ul", "moderation-lines");
    const instructions = makeElement("ol", "moderation-lines");
    for (const ingredient of recipe.ingredients) ingredients.append(makeElement("li", "", ingredient));
    for (const instruction of recipe.instructions) instructions.append(makeElement("li", "", instruction));
    const actions = makeElement("div", "moderation-actions");
    const reject = makeElement("button", "button button-light", "Reject");
    const approve = makeElement("button", "button button-dark", "Approve recipe");
    reject.type = "button";
    approve.type = "button";
    reject.addEventListener("click", () => reviewPendingRecipe(recipe, false, actions));
    approve.addEventListener("click", () => reviewPendingRecipe(recipe, true, actions));

    card.append(
      category,
      title,
      description,
      submitted,
      makeElement("h4", "moderation-subheading", "Ingredients"),
      ingredients,
      makeElement("h4", "moderation-subheading", "Instructions"),
      instructions,
      actions
    );
    actions.append(reject, approve);
    moderationList.append(card);
  }
}

async function loadPendingRecipes() {
  moderationStatus.textContent = "Loading pending recipes…";
  moderationList.replaceChildren();
  try {
    const recipes = await Database.listPendingRecipes();
    moderationStatus.textContent = "";
    reviewButton.setAttribute("aria-label", `Review pending recipes (${recipes.length})`);
    renderPendingRecipes(recipes);
  } catch (error) {
    moderationStatus.textContent = `Pending recipes couldn't be loaded: ${error.message}`;
  }
}

async function reviewPendingRecipe(recipe, approved, actions) {
  for (const button of actions.querySelectorAll("button")) button.disabled = true;
  moderationStatus.textContent = "";
  try {
    await Database.reviewRecipe(recipe.id, approved);
    if (approved) customRecipes = [...customRecipes, recipe];
    loadRecipes();
    await loadPendingRecipes();
    moderationStatus.textContent = approved
      ? `"${recipe.name}" was approved and is now public.`
      : `"${recipe.name}" was rejected.`;
  } catch (error) {
    moderationStatus.textContent = `Recipe review failed: ${error.message}`;
    for (const button of actions.querySelectorAll("button")) button.disabled = false;
  }
}

async function initialize() {
  loadRecipes();
  if (!Database.isConfigured) {
    statusMessage.textContent = "Supabase is not configured yet. Add your project URL and anon key in database.js.";
    return;
  }

  try {
    const { data, error } = await Database.getSession();
    if (error) throw error;
    currentSession = data.session;
    await updateAdminStatus();
    Database.onAuthStateChange((session) => {
      currentSession = session;
      window.setTimeout(() => {
        updateAdminStatus().catch((adminError) => {
          isAdmin = false;
          updateAccountButton();
          statusMessage.textContent = `Admin permissions couldn't be checked: ${adminError.message}`;
        });
      }, 0);
    });
    customRecipes = await Database.listRecipes();
    statusMessage.textContent = "";
    loadRecipes();
  } catch (error) {
    statusMessage.textContent = `Shared recipes couldn't be loaded: ${error.message}`;
  }
}

initialize();
