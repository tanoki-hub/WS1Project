# Brew & Bean

A responsive coffeehouse recipe catalog built with PHP, MySQL/MariaDB, HTML, CSS, and vanilla JavaScript. The starter database includes 12 drinks across espresso, iced coffee, brewing, sweet treats, and tea.

## Run locally

1. Install PHP with the PDO MySQL extension and MySQL or MariaDB (for example, XAMPP).
2. Import `database/schema.sql` into MySQL. The script creates `coffeehouse_db` and its tables, recipes, ingredients, and instructions.
3. Set database environment variables if your local MySQL credentials differ from the defaults:
   - `DB_HOST` (default `127.0.0.1`)
   - `DB_NAME` (default `coffeehouse_db`)
   - `DB_USER` (default `root`)
   - `DB_PASS` (default empty)
4. From the project directory, start PHP's development server:

   ```sh
   php -S localhost:8000
   ```

5. Open `http://localhost:8000`.

The recipes page uses `search.php` for live search and category filtering. Select any recipe card to open its ingredients, brewing parameters, and step-by-step instructions.

## Project files

- `index.php` — recipe catalog and search controls
- `recipe.php` — recipe details
- `search.php` — JSON endpoint for live filtering
- `config/db.php` — PDO connection configuration
- `database/schema.sql` — schema and starter recipe data
- `assets/css/styles.css`, `assets/js/app.js` — responsive UI and interactions
