<?php
declare(strict_types=1);

require_once __DIR__ . '/includes/functions.php';

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');

try {
    $search = trim((string) ($_GET['q'] ?? ''));
    if (strlen($search) > 100) {
        http_response_code(400);
        echo json_encode(['error' => 'Search text must be 100 characters or fewer.']);
        exit;
    }

    $rawCategory = $_GET['category'] ?? '';
    $categoryId = null;
    if ($rawCategory !== '') {
        $validatedCategory = filter_var($rawCategory, FILTER_VALIDATE_INT, ['options' => ['min_range' => 1]]);
        if ($validatedCategory === false) {
            http_response_code(400);
            echo json_encode(['error' => 'Invalid category.']);
            exit;
        }
        $categoryId = $validatedCategory;
    }

    $recipes = recipe_cards(db(), $search, $categoryId);
    echo json_encode(['recipes' => $recipes], JSON_THROW_ON_ERROR | JSON_INVALID_UTF8_SUBSTITUTE);
} catch (Throwable $exception) {
    error_log('Coffeehouse recipe search failed: ' . $exception->getMessage());
    http_response_code(500);
    echo json_encode(['error' => 'Recipes could not be loaded.']);
}
