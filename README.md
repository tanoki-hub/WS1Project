# Daily Grind — Coffeehouse recipes

A coffee-shop-inspired recipe website made with HTML, CSS, and browser JavaScript. Shared recipes and contributor accounts are stored in Supabase; no local server or build step is needed.

## Run with VS Code Live Server

1. Open this folder in VS Code.
2. Install the **Live Server** extension if it is not already installed.
3. Right-click the top-level `index.html` file and select **Open with Live Server**.

The site starts with popular coffeehouse-style recipes. Use the search box and category filters to find a drink, select **Get the recipe** to see its ingredients and steps, or sign in and choose **Add a recipe** to share your own.

## Connect Supabase

1. Create a Supabase project.
2. In the Supabase SQL Editor, run [`supabase/schema.sql`](./supabase/schema.sql) to create or update the `recipes` table, private admin allowlist, and row-level security policies. The script configures exactly three administrator email addresses in a private table. If re-running, it will replace that allowlist with the configured three.
3. In the project's API settings, copy the project URL and **anon/public** key into `SUPABASE_URL` and `SUPABASE_ANON_KEY` at the top of [`database.js`](./database.js). The anon key is intended for browser use; never put a service-role key in website code.
4. In Supabase Authentication settings, enable email/password sign-in. Configure the site's local and deployed URLs in the allowed redirect/site URL settings. All three admin accounts must sign in using the configured email addresses and have confirmed emails.
5. Open `index.html` with VS Code Live Server. Anyone can read approved shared recipes; signed-in users can submit recipes, which stay private until an admin approves them. User sign-in and sign-up are available in the header. Admin sign-in and sign-up are separate behind the coffee icon in the bottom-right corner; admin sign-up accepts only the three allowlisted email addresses. After an admin signs in, user sign-in/sign-up and the admin entry icon are hidden; admins can review recipes, edit their own display name in Supabase Auth metadata, or sign out. Admin checks, review actions, and recipe visibility are enforced by database functions and row-level security.

The coffee and pastry starter recipes are bundled with the website, including the additional 40 recipes in [`public/added-recipes.js`](./public/added-recipes.js). Matching starter recipes are replaced with the supplied versions rather than duplicated. Pastries and dessert-style drinks appear under **Treats**. Recipe cards use locally generated SVG illustrations, so no external image service is required. Approved user recipes are stored in Supabase and appear to everyone using the site; rejected recipes remain hidden.
