CREATE DATABASE IF NOT EXISTS coffeehouse_db
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;
USE coffeehouse_db;

CREATE TABLE IF NOT EXISTS categories (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(80) NOT NULL UNIQUE,
    sort_order TINYINT UNSIGNED NOT NULL DEFAULT 0
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS recipes (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    category_id INT UNSIGNED NOT NULL,
    name VARCHAR(140) NOT NULL,
    description VARCHAR(500) NOT NULL,
    difficulty ENUM('Easy', 'Some practice', 'Barista-level') NOT NULL DEFAULT 'Easy',
    prep_time_min SMALLINT UNSIGNED NOT NULL DEFAULT 5,
    brew_temp_c TINYINT UNSIGNED NULL,
    grind_size VARCHAR(80) NULL,
    image_url VARCHAR(255) NULL,
    barista_tip VARCHAR(500) NULL,
    is_featured BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_recipes_category FOREIGN KEY (category_id)
        REFERENCES categories (id) ON UPDATE CASCADE ON DELETE RESTRICT,
    INDEX idx_recipes_category (category_id),
    INDEX idx_recipes_featured (is_featured, name)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS ingredients (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(120) NOT NULL UNIQUE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS recipe_ingredients (
    recipe_id INT UNSIGNED NOT NULL,
    ingredient_id INT UNSIGNED NOT NULL,
    amount DECIMAL(8, 2) NOT NULL DEFAULT 0,
    unit VARCHAR(40) NOT NULL DEFAULT '',
    notes VARCHAR(160) NULL,
    sort_order SMALLINT UNSIGNED NOT NULL DEFAULT 0,
    PRIMARY KEY (recipe_id, ingredient_id),
    CONSTRAINT fk_recipe_ingredients_recipe FOREIGN KEY (recipe_id)
        REFERENCES recipes (id) ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT fk_recipe_ingredients_ingredient FOREIGN KEY (ingredient_id)
        REFERENCES ingredients (id) ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS recipe_steps (
    recipe_id INT UNSIGNED NOT NULL,
    step_number TINYINT UNSIGNED NOT NULL,
    instruction TEXT NOT NULL,
    PRIMARY KEY (recipe_id, step_number),
    CONSTRAINT fk_recipe_steps_recipe FOREIGN KEY (recipe_id)
        REFERENCES recipes (id) ON UPDATE CASCADE ON DELETE CASCADE
) ENGINE=InnoDB;

INSERT IGNORE INTO categories (id, name, sort_order) VALUES
    (1, 'Espresso', 1),
    (2, 'Iced', 2),
    (3, 'Brew', 3),
    (4, 'Sweet Treats', 4),
    (5, 'Tea', 5);

INSERT IGNORE INTO recipes
    (id, category_id, name, description, difficulty, prep_time_min, brew_temp_c, grind_size, image_url, barista_tip, is_featured)
VALUES
    (1, 1, 'Classic Cappuccino', 'A velvety espresso classic with equal parts steamed milk and airy foam.', 'Easy', 7, NULL, 'Fine', '☕', 'Swirl the milk pitcher before pouring for silky, glossy foam.', TRUE),
    (2, 1, 'Vanilla Latte', 'A smooth double espresso softened with vanilla and steamed milk.', 'Easy', 6, NULL, 'Fine', '🥛', 'Add the vanilla to the cup before the espresso so it dissolves evenly.', TRUE),
    (3, 1, 'Caramel Macchiato', 'Vanilla milk layered with espresso and a buttery caramel finish.', 'Easy', 8, NULL, 'Fine', '🍮', 'Pour espresso slowly over the back of a spoon to keep the layers distinct.', FALSE),
    (4, 1, 'Flat White', 'A rich double ristretto topped with a thin layer of microfoam.', 'Some practice', 6, NULL, 'Fine', '🤎', 'Keep the milk foam fine and glossy rather than stiff.', FALSE),
    (5, 2, 'Iced Brown Sugar Latte', 'Espresso, brown sugar and cold milk over plenty of ice.', 'Easy', 5, NULL, 'Fine', '🧋', 'Stir the hot espresso with brown sugar first to make a quick syrup.', TRUE),
    (6, 2, 'Cold Brew', 'A mellow, slow-steeped coffee concentrate served over ice.', 'Easy', 15, 20, 'Extra coarse', '🧊', 'Steep in the fridge for a softer cup; dilute concentrate to taste.', TRUE),
    (7, 2, 'Iced Mocha', 'Chilled espresso meets chocolate, milk and a little afternoon joy.', 'Easy', 5, NULL, 'Fine', '🍫', 'Whisk cocoa into the warm espresso before pouring over ice.', FALSE),
    (8, 3, 'Pour-Over V60', 'A clean, bright single-cup brew that lets your coffee shine.', 'Some practice', 4, 94, 'Medium-fine', '🫖', 'Rinse the paper filter first and pour in slow, even circles.', TRUE),
    (9, 3, 'French Press', 'A full-bodied, comforting brew with a beautifully simple method.', 'Easy', 8, 93, 'Coarse', '☕', 'Let the coffee settle for a minute after plunging for a cleaner cup.', FALSE),
    (10, 4, 'Whipped Dalgona Coffee', 'Cloud-like whipped coffee spooned over cold or warm milk.', 'Easy', 8, NULL, 'Instant', '🍯', 'Use very hot water and whisk until the foam holds soft peaks.', FALSE),
    (11, 4, 'Cafe-Style Hot Chocolate', 'Deep cocoa, warm milk and a soft cap of whipped cream.', 'Easy', 10, NULL, NULL, '🍫', 'A pinch of salt makes the chocolate taste even richer.', FALSE),
    (12, 5, 'Dirty Chai Latte', 'Spiced chai and a shot of espresso come together in one cozy mug.', 'Easy', 7, NULL, 'Fine', '🫚', 'Use strongly brewed chai so its spices stay present alongside espresso.', FALSE);

INSERT IGNORE INTO ingredients (id, name) VALUES
    (1, 'Espresso'), (2, 'Whole milk'), (3, 'Vanilla syrup'), (4, 'Caramel sauce'),
    (5, 'Brown sugar'), (6, 'Ground coffee'), (7, 'Cold water'), (8, 'Ice'),
    (9, 'Chocolate sauce'), (10, 'Cocoa powder'), (11, 'Granulated sugar'),
    (12, 'Instant coffee'), (13, 'Whipped cream'), (14, 'Chai concentrate'),
    (15, 'Hot water');

INSERT IGNORE INTO recipe_ingredients (recipe_id, ingredient_id, amount, unit, notes, sort_order) VALUES
    (1, 1, 36, 'ml', 'double shot', 1), (1, 2, 120, 'ml', 'steamed and foamed', 2),
    (2, 1, 36, 'ml', 'double shot', 1), (2, 2, 180, 'ml', 'steamed', 2), (2, 3, 15, 'ml', '', 3),
    (3, 1, 36, 'ml', 'double shot', 1), (3, 2, 180, 'ml', 'steamed', 2), (3, 3, 15, 'ml', '', 3), (3, 4, 10, 'ml', 'to drizzle', 4),
    (4, 1, 36, 'ml', 'ristretto double', 1), (4, 2, 150, 'ml', 'textured', 2),
    (5, 1, 36, 'ml', 'double shot', 1), (5, 2, 150, 'ml', 'cold', 2), (5, 5, 15, 'g', 'dissolved in espresso', 3), (5, 8, 1, 'cup', '', 4),
    (6, 6, 100, 'g', 'coarsely ground', 1), (6, 7, 700, 'ml', 'cold and filtered', 2),
    (7, 1, 36, 'ml', 'double shot', 1), (7, 2, 150, 'ml', 'cold', 2), (7, 9, 20, 'ml', '', 3), (7, 8, 1, 'cup', '', 4),
    (8, 6, 18, 'g', 'medium-fine', 1), (8, 15, 300, 'ml', 'just off the boil', 2),
    (9, 6, 30, 'g', 'coarse', 1), (9, 15, 450, 'ml', 'hot', 2),
    (10, 12, 2, 'tbsp', '', 1), (10, 11, 2, 'tbsp', '', 2), (10, 15, 2, 'tbsp', 'very hot', 3), (10, 2, 200, 'ml', 'cold or warm', 4),
    (11, 10, 20, 'g', 'unsweetened', 1), (11, 11, 15, 'g', '', 2), (11, 2, 250, 'ml', '', 3), (11, 13, 1, 'dollop', 'optional', 4),
    (12, 14, 180, 'ml', 'strongly brewed', 1), (12, 1, 36, 'ml', 'double shot', 2), (12, 2, 60, 'ml', 'steamed', 3);

INSERT IGNORE INTO recipe_steps (recipe_id, step_number, instruction) VALUES
    (1, 1, 'Pull a double shot of espresso into a warm cup.'),
    (1, 2, 'Steam the milk until silky, then tap and swirl the pitcher to settle the foam.'),
    (1, 3, 'Pour the milk into the espresso, finishing with a soft cap of foam.'),
    (2, 1, 'Add vanilla syrup to a mug and pull the espresso directly over it.'),
    (2, 2, 'Steam the milk until smooth and glossy.'),
    (2, 3, 'Pour the milk into the espresso and serve warm.'),
    (3, 1, 'Add vanilla syrup to a glass and fill it with ice and cold milk.'),
    (3, 2, 'Slowly pour the espresso over the milk.'),
    (3, 3, 'Finish with a caramel drizzle and stir before drinking.'),
    (4, 1, 'Pull a double ristretto into a warmed cup.'),
    (4, 2, 'Steam milk with very fine microfoam and a glossy texture.'),
    (4, 3, 'Pour the milk low and steadily into the espresso.'),
    (5, 1, 'Stir brown sugar into the hot espresso until dissolved.'),
    (5, 2, 'Fill a tall glass with ice and cold milk.'),
    (5, 3, 'Pour the sweetened espresso over the milk and stir.'),
    (6, 1, 'Combine coarse coffee and cold water in a clean jar.'),
    (6, 2, 'Cover and steep for 12 to 18 hours in the refrigerator.'),
    (6, 3, 'Strain through a fine sieve or coffee filter. Serve over ice and dilute to taste.'),
    (7, 1, 'Stir chocolate sauce into the hot espresso until smooth.'),
    (7, 2, 'Fill a glass with ice and cold milk.'),
    (7, 3, 'Pour the mocha espresso over the milk and stir well.'),
    (8, 1, 'Rinse the paper filter with hot water and discard the rinse water.'),
    (8, 2, 'Add coffee grounds and pour just enough water to wet them. Wait 30 seconds.'),
    (8, 3, 'Pour the remaining water slowly in circles, finishing around 2 minutes 30 seconds.'),
    (9, 1, 'Add coarse coffee to the French press and pour in hot water.'),
    (9, 2, 'Stir once, place the lid on, and steep for 4 minutes.'),
    (9, 3, 'Press the plunger slowly and serve right away.'),
    (10, 1, 'Whisk instant coffee, sugar and hot water until thick, pale and fluffy.'),
    (10, 2, 'Fill a glass with milk and ice, or warm milk for a cozy version.'),
    (10, 3, 'Spoon the whipped coffee on top and stir to serve.'),
    (11, 1, 'Whisk cocoa, sugar and a splash of milk into a smooth paste.'),
    (11, 2, 'Warm the remaining milk in a saucepan, then whisk in the cocoa paste.'),
    (11, 3, 'Pour into a mug and finish with whipped cream if you like.'),
    (12, 1, 'Warm chai concentrate and milk together until steaming.'),
    (12, 2, 'Pull a double espresso into a mug.'),
    (12, 3, 'Pour in the chai mixture, stir gently and enjoy.');
