const root = document.documentElement;
const themeToggle = document.querySelector(".theme-toggle");
const themeColor = document.querySelector('meta[name="theme-color"]');
const savedTheme = localStorage.getItem("campusly-theme");
const preferredTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";

function setTheme(theme) {
    root.dataset.theme = theme;
    themeToggle.classList.toggle("is-dark", theme === "dark");
    themeToggle.setAttribute("aria-label", `Switch to ${theme === "dark" ? "light" : "dark"} mode`);
    themeColor.setAttribute("content", theme === "dark" ? "#101727" : "#f7f9fc");
}

setTheme(savedTheme || preferredTheme);

themeToggle.addEventListener("click", () => {
    const nextTheme = root.dataset.theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    localStorage.setItem("campusly-theme", nextTheme);
});

const menuToggle = document.querySelector(".menu-toggle");
const navigation = document.querySelector(".primary-navigation");

function closeNavigation() {
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation");
    navigation.classList.remove("is-open");
    document.body.classList.remove("menu-open");
}

menuToggle.addEventListener("click", () => {
    const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
    menuToggle.setAttribute("aria-expanded", String(!isOpen));
    menuToggle.setAttribute("aria-label", isOpen ? "Open navigation" : "Close navigation");
    navigation.classList.toggle("is-open", !isOpen);
    document.body.classList.toggle("menu-open", !isOpen);
});

navigation.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeNavigation);
});

const searchDialog = document.querySelector(".search-dialog");
const searchInput = document.querySelector(".search-input");
const searchResults = document.querySelector(".search-results");
const searchableSections = [...document.querySelectorAll("main section[id]")];

function renderSearchResults(query) {
    const normalizedQuery = query.trim().toLocaleLowerCase();
    const matches = searchableSections.filter((section) => {
        const searchableText = `${section.id} ${section.innerText}`.toLocaleLowerCase();
        return !normalizedQuery || searchableText.includes(normalizedQuery);
    }).slice(0, 5);

    searchResults.replaceChildren();

    if (matches.length === 0) {
        const emptyMessage = document.createElement("p");
        emptyMessage.className = "search-empty";
        emptyMessage.textContent = "No sections found. Try a different search.";
        searchResults.append(emptyMessage);
        return;
    }

    matches.forEach((section) => {
        const heading = section.querySelector("h1, h2, h3");
        const link = document.createElement("a");
        const title = heading ? heading.innerText.replace(/\s+/g, " ").trim() : section.id;
        const titleLabel = document.createElement("span");
        const arrow = document.createElement("span");
        link.className = "search-result";
        link.href = `#${section.id}`;
        titleLabel.textContent = title;
        arrow.textContent = "→";
        arrow.setAttribute("aria-hidden", "true");
        link.append(titleLabel, arrow);
        link.addEventListener("click", () => searchDialog.close());
        searchResults.append(link);
    });
}

document.querySelector(".search-toggle").addEventListener("click", () => {
    searchInput.value = "";
    renderSearchResults("");
    searchDialog.showModal();
    searchInput.focus();
});

searchInput.addEventListener("input", () => renderSearchResults(searchInput.value));
searchDialog.addEventListener("click", (event) => {
    if (event.target === searchDialog) {
        searchDialog.close();
    }
});

const accessDialog = document.querySelector("#access-dialog");

document.querySelector(".header-login").addEventListener("click", () => accessDialog.showModal());
accessDialog.querySelector("a").addEventListener("click", () => accessDialog.close());
accessDialog.addEventListener("click", (event) => {
    if (event.target === accessDialog) {
        accessDialog.close();
    }
});

document.querySelector("#current-year").textContent = String(new Date().getFullYear());