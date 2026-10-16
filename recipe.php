<?php
declare(strict_types=1);

require_once __DIR__ . '/includes/functions.php';

$rawId = filter_input(INPUT_GET, 'id', FILTER_VALIDATE_INT, ['options' => ['min_range' => 1]]);
if ($rawId === false || $rawId === null) {
    http_response_code(404);
}

$recipe = null;
$ingredients = [];
$steps = [];
$databaseError = false;
if ($rawId !== false && $rawId !== null) {
    try {
        $pdo = db();
        $statement = $pdo->prepare(
            'SELECT r.*, c.name AS category_name
             FROM recipes r INNER JOIN categories c ON c.id = r.category_id
             WHERE r.id = :id'
        );
        $statement->execute(['id' => $rawId]);
        $recipe = $statement->fetch() ?: null;

        if ($recipe !== null) {
            $statement = $pdo->prepare(
                'SELECT i.name, ri.amount, ri.unit, ri.notes
                 FROM recipe_ingredients ri INNER JOIN ingredients i ON i.id = ri.ingredient_id
                 WHERE ri.recipe_id = :id ORDER BY ri.sort_order, i.name'
            );
            $statement->execute(['id' => $rawId]);
            $ingredients = $statement->fetchAll();

            $statement = $pdo->prepare(
                'SELECT instruction FROM recipe_steps WHERE recipe_id = :id ORDER BY step_number'
            );
            $statement->execute(['id' => $rawId]);
            $steps = $statement->fetchAll();
        } else {
            http_response_code(404);
        }
    } catch (Throwable $exception) {
        error_log('Coffeehouse recipe detail could not be loaded: ' . $exception->getMessage());
        $databaseError = true;
        http_response_code(503);
    }
}

$pageTitle = $recipe ? $recipe['name'] . ' — Brew & Bean' : 'Recipe unavailable — Brew & Bean';
require __DIR__ . '/includes/header.php';
?>
<section class="recipe-detail section-wrap">
    <a class="back-link" href="index.php">← Back to all recipes</a>
    <?php if ($databaseError): ?>
        <div class="notice notice-error" role="alert"><strong>Recipes are taking a coffee break.</strong><span>Please check the database setup and try again.</span></div>
    <?php elseif ($recipe === null): ?>
        <div class="detail-missing">
            <p class="eyebrow">NOT ON THE MENU</p>
            <h1>We couldn't find<br><em>that recipe.</em></h1>
            <a class="button button-dark" href="index.php">Browse all recipes</a>
        </div>
    <?php else: ?>
        <div class="detail-layout">
            <div class="detail-main">
                <p class="eyebrow"><span class="eyebrow-line"></span> <?= h(strtoupper($recipe['category_name'])) ?></p>
                <h1><?= h($recipe['name']) ?></h1>
                <p class="detail-description"><?= h($recipe['description']) ?></p>
                <div class="detail-stats">
                    <span><small>PREP TIME</small><strong><?= (int) $recipe['prep_time_min'] ?> min</strong></span>
                    <span><small>DIFFICULTY</small><strong><?= h($recipe['difficulty']) ?></strong></span>
                    <?php if ($recipe['brew_temp_c'] !== null): ?>
                        <span><small>WATER TEMP</small><strong><?= (int) $recipe['brew_temp_c'] ?>°C</strong></span>
                    <?php endif; ?>
                    <?php if ($recipe['grind_size']): ?>
                        <span><small>GRIND</small><strong><?= h($recipe['grind_size']) ?></strong></span>
                    <?php endif; ?>
                </div>
                <section class="detail-section">
                    <p class="eyebrow">WHAT YOU'LL NEED</p>
                    <h2>The ingredients</h2>
                    <?php if ($ingredients === []): ?>
                        <p>Ingredients haven’t been added for this recipe yet.</p>
                    <?php else: ?>
                        <ul class="ingredient-list">
                            <?php foreach ($ingredients as $ingredient): ?>
                                <li><span><?= h($ingredient['name']) ?><?= $ingredient['notes'] ? ' · ' . h($ingredient['notes']) : '' ?></span><strong><?= h((string) $ingredient['amount']) ?> <?= h($ingredient['unit']) ?></strong></li>
                            <?php endforeach; ?>
                        </ul>
                    <?php endif; ?>
                </section>
                <section class="detail-section">
                    <p class="eyebrow">TAKE IT STEP BY STEP</p>
                    <h2>Let's make it.</h2>
                    <?php if ($steps === []): ?>
                        <p>Instructions haven’t been added for this recipe yet.</p>
                    <?php else: ?>
                        <ol class="step-list">
                            <?php foreach ($steps as $index => $step): ?>
                                <li><span class="step-number"><?= str_pad((string) ($index + 1), 2, '0', STR_PAD_LEFT) ?></span><p><?= h($step['instruction']) ?></p></li>
                            <?php endforeach; ?>
                        </ol>
                    <?php endif; ?>
                </section>
            </div>
            <aside class="detail-aside">
                <div class="detail-art <?= h(strtolower(str_replace(' ', '-', $recipe['category_name']))) ?>">
                    <span class="detail-art-label">A BREW & BEAN FAVORITE</span>
                    <span aria-hidden="true"><?= h($recipe['image_url'] ?: '☕') ?></span>
                </div>
                <p class="aside-tip"><strong>A little tip</strong><?= h($recipe['barista_tip'] ?: 'Taste as you go, and make it yours.') ?></p>
            </aside>
        </div>
    <?php endif; ?>
</section>
<?php require __DIR__ . '/includes/footer.php'; ?>
