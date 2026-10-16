<?php
declare(strict_types=1);

require_once __DIR__ . '/includes/functions.php';

$pageTitle = 'Brew & Bean — Coffeehouse recipe book';
$activePage = 'home';
$categories = [];
$recipes = [];
$databaseError = false;

try {
    $pdo = db();
    $categories = $pdo->query('SELECT id, name FROM categories ORDER BY sort_order, name')->fetchAll();
    $recipes = recipe_cards($pdo);
} catch (Throwable $exception) {
    error_log('Coffeehouse homepage could not load recipes: ' . $exception->getMessage());
    $databaseError = true;
}

require __DIR__ . '/includes/header.php';
?>
<section class="hero">
    <div class="hero-copy">
        <p class="eyebrow"><span class="eyebrow-line"></span> YOUR NEIGHBORHOOD RECIPE BOOK</p>
        <h1>Good coffee.<br><em>Made your way.</em></h1>
        <p class="hero-description">Cafe favorites, cozy classics, and little twists worth waking up for. Find your next favorite cup.</p>
        <a class="button button-dark" href="#the-collection">Find your next cup <span aria-hidden="true">↘</span></a>
        <div class="hero-stamp" aria-hidden="true">
            <span>GOOD<br>THINGS<br>BREW HERE</span>
            <span class="stamp-spark">✳</span>
        </div>
    </div>
    <div class="hero-art" role="img" aria-label="A freshly poured coffee with creamy latte art">
        <div class="hero-art-label"><span>EST. EVERY MORNING</span><span>✳</span></div>
        <div class="coffee-cup"><div class="latte-art"><span></span></div></div>
        <div class="hero-art-caption"><span>01 / 04</span><span>THE DAILY POUR</span></div>
    </div>
    <div class="hero-bottom"><span>ESPRESSO&nbsp;&nbsp; · &nbsp;&nbsp;SLOW BREW&nbsp;&nbsp; · &nbsp;&nbsp;SOMETHING SWEET</span><span>SCROLL TO SIP ↓</span></div>
</section>

<section class="collection section-wrap" id="the-collection" data-recipe-search>
    <div class="section-heading">
        <div>
            <p class="eyebrow"><span class="eyebrow-line"></span> THE GOOD STUFF</p>
            <h2>Find your <em>kind of cup.</em></h2>
        </div>
        <p class="section-aside">From first espresso to last iced latte.<br>Consider this your coffee shop, at home.</p>
    </div>

    <?php if ($databaseError): ?>
        <div class="notice notice-error" role="alert">
            <strong>Recipes are taking a coffee break.</strong>
            <span>Set up MySQL using <code>database/schema.sql</code>, then check the database settings in <code>config/db.php</code>.</span>
        </div>
    <?php else: ?>
        <div class="recipe-controls">
            <label class="search-box">
                <span class="sr-only">Search recipes</span>
                <span aria-hidden="true">⌕</span>
                <input type="search" name="q" placeholder="Search drinks, ingredients..." autocomplete="off" data-recipe-query>
                <kbd>⌘ K</kbd>
            </label>
            <div class="category-tabs" role="group" aria-label="Filter recipes by category">
                <button class="category-tab selected" type="button" data-category="" aria-pressed="true">Everything <span><?= count($recipes) ?></span></button>
                <?php foreach ($categories as $category): ?>
                    <button class="category-tab" type="button" data-category="<?= (int) $category['id'] ?>" aria-pressed="false"><?= h($category['name']) ?></button>
                <?php endforeach; ?>
            </div>
        </div>
        <p class="results-count" data-results-count><?= count($recipes) ?> recipes to fall for</p>
        <div class="recipe-grid" data-recipe-grid>
            <?php foreach ($recipes as $recipe): ?>
                <article class="recipe-card">
                    <a class="recipe-card-link" href="recipe.php?id=<?= (int) $recipe['id'] ?>">
                        <div class="card-image <?= h(strtolower(str_replace(' ', '-', $recipe['category_name']))) ?>">
                            <span class="card-category"><?= h($recipe['category_name']) ?></span>
                            <span class="card-art" aria-hidden="true"><?= h($recipe['image_url'] ?: '☕') ?></span>
                            <span class="card-arrow" aria-hidden="true">↗</span>
                        </div>
                        <div class="card-content">
                            <div class="card-meta"><span><?= h($recipe['difficulty']) ?></span><span><?= (int) $recipe['prep_time_min'] ?> MIN</span></div>
                            <h3><?= h($recipe['name']) ?></h3>
                            <p><?= h($recipe['description']) ?></p>
                        </div>
                    </a>
                </article>
            <?php endforeach; ?>
        </div>
        <p class="empty-state" data-empty-state hidden>No recipes found. Try another search or category.</p>
        <p class="notice notice-error" data-search-error hidden role="alert">We couldn’t load recipes. Please try again in a moment.</p>
    <?php endif; ?>
</section>
<?php require __DIR__ . '/includes/footer.php'; ?>
