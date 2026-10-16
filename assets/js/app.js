(() => {
    const searchRoot = document.querySelector('[data-recipe-search]');
    if (!searchRoot) return;

    const searchInput = searchRoot.querySelector('[data-recipe-query]');
    const grid = searchRoot.querySelector('[data-recipe-grid]');
    const resultCount = searchRoot.querySelector('[data-results-count]');
    const emptyState = searchRoot.querySelector('[data-empty-state]');
    const errorMessage = searchRoot.querySelector('[data-search-error]');
    const categoryButtons = [...searchRoot.querySelectorAll('[data-category]')];
    let activeCategory = '';
    let debounceTimer;
    let requestController;

    function makeCard(recipe) {
        const article = document.createElement('article');
        article.className = 'recipe-card';
        const link = document.createElement('a');
        link.className = 'recipe-card-link';
        link.href = `recipe.php?id=${encodeURIComponent(recipe.id)}`;

        const image = document.createElement('div');
        image.className = `card-image ${String(recipe.category_name).toLowerCase().replaceAll(' ', '-')}`;
        const category = document.createElement('span');
        category.className = 'card-category';
        category.textContent = recipe.category_name;
        const art = document.createElement('span');
        art.className = 'card-art';
        art.setAttribute('aria-hidden', 'true');
        art.textContent = recipe.image_url || '☕';
        const arrow = document.createElement('span');
        arrow.className = 'card-arrow';
        arrow.setAttribute('aria-hidden', 'true');
        arrow.textContent = '↗';
        image.append(category, art, arrow);

        const content = document.createElement('div');
        content.className = 'card-content';
        const meta = document.createElement('div');
        meta.className = 'card-meta';
        const difficulty = document.createElement('span');
        difficulty.textContent = recipe.difficulty;
        const time = document.createElement('span');
        time.textContent = `${recipe.prep_time_min} MIN`;
        meta.append(difficulty, time);
        const title = document.createElement('h3');
        title.textContent = recipe.name;
        const description = document.createElement('p');
        description.textContent = recipe.description;
        content.append(meta, title, description);
        link.append(image, content);
        article.append(link);
        return article;
    }

    async function loadRecipes() {
        if (requestController) requestController.abort();
        requestController = new AbortController();
        const params = new URLSearchParams();
        const search = searchInput.value.trim();
        if (search) params.set('q', search);
        if (activeCategory) params.set('category', activeCategory);

        try {
            const response = await fetch(`search.php?${params}`, { signal: requestController.signal });
            if (!response.ok) throw new Error(`Search request failed (${response.status}).`);
            const data = await response.json();
            if (!Array.isArray(data.recipes)) throw new Error('Search response was invalid.');
            grid.replaceChildren(...data.recipes.map(makeCard));
            resultCount.textContent = `${data.recipes.length} ${data.recipes.length === 1 ? 'recipe' : 'recipes'} to fall for`;
            emptyState.hidden = data.recipes.length !== 0;
            errorMessage.hidden = true;
        } catch (error) {
            if (error.name === 'AbortError') return;
            errorMessage.hidden = false;
            emptyState.hidden = true;
        }
    }

    searchInput.addEventListener('input', () => {
        window.clearTimeout(debounceTimer);
        debounceTimer = window.setTimeout(loadRecipes, 180);
    });

    categoryButtons.forEach((button) => {
        button.addEventListener('click', () => {
            activeCategory = button.dataset.category;
            categoryButtons.forEach((item) => {
                const selected = item === button;
                item.classList.toggle('selected', selected);
                item.setAttribute('aria-pressed', String(selected));
            });
            loadRecipes();
        });
    });

    document.addEventListener('keydown', (event) => {
        if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
            event.preventDefault();
            searchInput.focus();
        }
    });
})();
