<?php
declare(strict_types=1);

require_once __DIR__ . '/../config/db.php';

function h(?string $value): string
{
    return htmlspecialchars($value ?? '', ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
}

function recipe_cards(PDO $pdo, string $search = '', ?int $categoryId = null, int $limit = 60): array
{
    $sql = 'SELECT r.id, r.name, r.description, r.difficulty, r.prep_time_min,
                   r.image_url, c.name AS category_name
            FROM recipes r
            INNER JOIN categories c ON c.id = r.category_id';
    $conditions = [];
    $parameters = [];

    if ($search !== '') {
        $conditions[] = '(r.name LIKE :search_name OR r.description LIKE :search_description
                          OR c.name LIKE :search_category)';
        $term = '%' . $search . '%';
        $parameters['search_name'] = $term;
        $parameters['search_description'] = $term;
        $parameters['search_category'] = $term;
    }

    if ($categoryId !== null) {
        $conditions[] = 'r.category_id = :category_id';
        $parameters['category_id'] = $categoryId;
    }

    if ($conditions !== []) {
        $sql .= ' WHERE ' . implode(' AND ', $conditions);
    }

    $sql .= ' ORDER BY r.is_featured DESC, r.name ASC LIMIT :result_limit';
    $statement = $pdo->prepare($sql);
    foreach ($parameters as $name => $value) {
        $statement->bindValue(':' . $name, $value, PDO::PARAM_STR);
    }
    $statement->bindValue(':result_limit', $limit, PDO::PARAM_INT);
    $statement->execute();

    return $statement->fetchAll();
}
