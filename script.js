// DevVault resource directory: search, category filters, bookmarks, and grid/list views.
const resources = [
  {id:"mdn",name:"MDN Web Docs",initials:"M",category:"Learn",description:"Reliable documentation for HTML, CSS, JavaScript, and the open web.",url:"https://developer.mozilla.org/",tags:["HTML","CSS","JavaScript"],tone:"violet"},
  {id:"freecodecamp",name:"freeCodeCamp",initials:"fC",category:"Learn",description:"Learn to code through free interactive lessons and hands-on certifications.",url:"https://www.freecodecamp.org/",tags:["Beginner","Web"],tone:"green"},
  {id:"w3schools",name:"W3Schools",initials:"W3",category:"Learn",description:"Quick tutorials and examples for popular programming and web technologies.",url:"https://www.w3schools.com/",tags:["Tutorials","Reference"],tone:"green"},
  {id:"geeksforgeeks",name:"GeeksforGeeks",initials:"Gf",category:"Learn",description:"Programming tutorials, computer science concepts, and interview preparation.",url:"https://www.geeksforgeeks.org/",tags:["CS Basics","DSA"],tone:"green"},
  {id:"leetcode",name:"LeetCode",initials:"LC",category:"Practice",description:"Practice coding problems and strengthen your data structures and algorithms.",url:"https://leetcode.com/",tags:["DSA","Problems"],tone:"orange"},
  {id:"hackerrank",name:"HackerRank",initials:"HR",category:"Practice",description:"Solve coding challenges and practice languages through guided tracks.",url:"https://www.hackerrank.com/",tags:["Challenges","Skills"],tone:"green"},
  {id:"codewars",name:"Codewars",initials:"CW",category:"Practice",description:"Sharpen your skills with community-created coding kata at different levels.",url:"https://www.codewars.com/",tags:["Kata","Practice"],tone:"red"},
  {id:"codeforces",name:"Codeforces",initials:"CF",category:"Practice",description:"Take part in programming contests and learn competitive problem solving.",url:"https://codeforces.com/",tags:["Contests","Algorithms"],tone:"blue"},
  {id:"github",name:"GitHub",initials:"GH",category:"Build",description:"Host code, track changes with Git, and collaborate on software projects.",url:"https://github.com/",tags:["Git","Portfolio"],tone:"violet"},
  {id:"git",name:"Git",initials:"Git",category:"Build",description:"Learn the version control system that helps developers manage code changes.",url:"https://git-scm.com/doc",tags:["Version Control","CLI"],tone:"orange"},
  {id:"vercel",name:"Vercel",initials:"V",category:"Build",description:"Deploy frontend projects and share live previews of your websites.",url:"https://vercel.com/",tags:["Deploy","Web"],tone:"blue"},
  {id:"codepen",name:"CodePen",initials:"CP",category:"Build",description:"Experiment with front-end code and share small creative web projects.",url:"https://codepen.io/",tags:["Frontend","Sandbox"],tone:"pink"},
  {id:"kaggle",name:"Kaggle",initials:"K",category:"AI & Data",description:"Explore datasets, notebooks, competitions, and practical machine learning.",url:"https://www.kaggle.com/",tags:["Datasets","ML"],tone:"blue"},
  {id:"colab",name:"Google Colab",initials:"Co",category:"AI & Data",description:"Write and run Python notebooks in your browser without local setup.",url:"https://colab.research.google.com/",tags:["Python","Notebooks"],tone:"orange"},
  {id:"huggingface",name:"Hugging Face",initials:"HF",category:"AI & Data",description:"Discover open machine learning models, datasets, and interactive demos.",url:"https://huggingface.co/",tags:["Models","AI"],tone:"yellow"},
  {id:"roadmap",name:"roadmap.sh",initials:"R",category:"Tools",description:"Explore visual learning roadmaps for frontend, backend, DevOps, and more.",url:"https://roadmap.sh/",tags:["Career","Guides"],tone:"pink"},
  {id:"excalidraw",name:"Excalidraw",initials:"Ex",category:"Tools",description:"Sketch diagrams, system designs, and ideas with a simple virtual whiteboard.",url:"https://excalidraw.com/",tags:["Diagrams","Planning"],tone:"violet"},
  {id:"canIUse",name:"Can I use",initials:"Ci",category:"Tools",description:"Check browser support for modern HTML, CSS, and JavaScript features.",url:"https://caniuse.com/",tags:["Web","Compatibility"],tone:"cyan"}
];

const STORAGE_KEY = "devvault.saved.v1";
const grid = document.getElementById("resource-grid");
const savedContent = document.getElementById("saved-content");
const searchInput = document.getElementById("search-input");
let savedIds = loadSaved();
let activeCategory = "All";
let viewMode = "grid";

function loadSaved() {
  try {
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    return Array.isArray(data) ? data : [];
  } catch (error) {
    return [];
  }
}

function persistSaved() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(savedIds));
  } catch (error) {
    showToast("Browser storage is unavailable.");
  }
}

function createElement(tag, className, text) {
  const element = document.createElement(tag);
  if (className) element.className = className;
  if (text !== undefined) element.textContent = text;
  return element;
}

function makeResourceCard(resource, savedArea = false) {
  const card = createElement("article", "resource-card");
  const top = createElement("div", "card-top");
  const logo = createElement("div", `resource-logo logo-${resource.tone}`, resource.initials);
  const bookmark = createElement("button", `bookmark-btn${savedIds.includes(resource.id) ? " saved" : ""}`, savedIds.includes(resource.id) ? "▣" : "⌑");
  bookmark.type = "button";
  bookmark.title = savedIds.includes(resource.id) ? "Remove bookmark" : "Save resource";
  bookmark.setAttribute("aria-label", `${bookmark.title}: ${resource.name}`);
  bookmark.addEventListener("click", () => toggleSaved(resource.id));
  top.append(logo, bookmark);

  const category = createElement("div", "card-category", resource.category);
  const title = createElement("h3", "", resource.name);
  const description = createElement("p", "", resource.description);
  const bottom = createElement("div", "card-bottom");
  const tags = createElement("div", "resource-tags");
  resource.tags.forEach(tag => tags.append(createElement("span", "resource-tag", tag)));
  const link = createElement("a", "visit-link", "Visit resource ");
  link.href = resource.url;
  link.target = "_blank";
  link.rel = "noopener noreferrer";
  link.append(createElement("span", "", "↗"));
  bottom.append(tags, link);
  card.append(top, category, title, description, bottom);
  return card;
}

function getFilteredResources() {
  const query = searchInput.value.trim().toLowerCase();
  let list = resources.filter(resource => {
    const matchesCategory = activeCategory === "All" || resource.category === activeCategory;
    const searchable = `${resource.name} ${resource.category} ${resource.description} ${resource.tags.join(" ")}`.toLowerCase();
    return matchesCategory && searchable.includes(query);
  });
  if (document.getElementById("sort-select").value === "az") {
    list.sort((a, b) => a.name.localeCompare(b.name));
  }
  return list;
}

function renderResources() {
  const list = getFilteredResources();
  grid.innerHTML = "";
  grid.classList.toggle("list-view", viewMode === "list");
  list.forEach(resource => grid.append(makeResourceCard(resource)));
  document.getElementById("resource-count").textContent = resources.length;
  document.getElementById("results-label").textContent = `Showing ${list.length} of ${resources.length} resources`;
  document.getElementById("no-results").hidden = list.length !== 0;
}

function renderSaved() {
  document.getElementById("saved-count").textContent = `${savedIds.length} saved`;
  document.getElementById("saved-nav-count").textContent = savedIds.length;
  savedContent.innerHTML = "";
  const savedResources = savedIds.map(id => resources.find(resource => resource.id === id)).filter(Boolean);
  if (!savedResources.length) {
    savedContent.className = "saved-content";
    const icon = createElement("span", "bookmark-big", "⌑");
    const textWrap = createElement("div");
    textWrap.append(createElement("strong", "", "Your vault is waiting."), createElement("p", "", "Bookmark resources you want to explore later."));
    savedContent.append(icon, textWrap);
    return;
  }
  savedContent.className = "saved-content filled";
  const savedGrid = createElement("div", "resource-grid");
  savedResources.forEach(resource => savedGrid.append(makeResourceCard(resource, true)));
  savedContent.append(savedGrid);
}

function toggleSaved(id) {
  if (savedIds.includes(id)) {
    savedIds = savedIds.filter(savedId => savedId !== id);
    showToast("Removed from your saved resources.");
  } else {
    savedIds.push(id);
    showToast("Saved to your personal vault.");
  }
  persistSaved();
  renderResources();
  renderSaved();
}

function showToast(message) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(showToast.timeout);
  showToast.timeout = setTimeout(() => toast.classList.remove("show"), 2100);
}

document.querySelectorAll(".category-chip").forEach(button => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".category-chip").forEach(chip => chip.classList.remove("selected"));
    button.classList.add("selected");
    activeCategory = button.dataset.category;
    renderResources();
  });
});

searchInput.addEventListener("input", renderResources);
document.getElementById("sort-select").addEventListener("change", renderResources);
document.getElementById("grid-view").addEventListener("click", () => setView("grid"));
document.getElementById("list-view").addEventListener("click", () => setView("list"));

function setView(mode) {
  viewMode = mode;
  document.getElementById("grid-view").classList.toggle("active", mode === "grid");
  document.getElementById("list-view").classList.toggle("active", mode === "list");
  renderResources();
}

document.getElementById("reset-filters").addEventListener("click", () => {
  searchInput.value = "";
  activeCategory = "All";
  document.querySelectorAll(".category-chip").forEach(chip => chip.classList.toggle("selected", chip.dataset.category === "All"));
  renderResources();
});

document.addEventListener("keydown", event => {
  if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
    event.preventDefault();
    searchInput.focus();
  }
});

renderResources();
renderSaved();
