import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// These are public browser settings. Never put a service-role key in this file.
const SUPABASE_URL = "https://aglqijmarlfidljnylfo.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_4shEWAIYOIQbsyOTJZq8SA_lcBYueBW";

const configured = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);
const client = configured ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY) : null;

function requireClient() {
  if (!client) {
    throw new Error("Supabase is not configured. Add your project URL and anon key in database.js.");
  }
  return client;
}

function toRecipe(row) {
  return {
    id: row.id,
    name: row.name,
    category: row.category,
    description: row.description,
    prepMinutes: row.prep_minutes,
    ingredients: row.ingredients,
    instructions: row.instructions,
  };
}

export const isConfigured = configured;

export async function getSession() {
  return requireClient().auth.getSession();
}

export function onAuthStateChange(callback) {
  const { data } = requireClient().auth.onAuthStateChange((_event, session) => callback(session));
  return data.subscription;
}

export async function signIn(email, password) {
  return requireClient().auth.signInWithPassword({ email, password });
}

export async function signUp(email, password) {
  return requireClient().auth.signUp({ email, password });
}

export async function signOut() {
  return requireClient().auth.signOut();
}

export async function updateDisplayName(displayName) {
  return requireClient().auth.updateUser({
    data: { display_name: displayName },
  });
}

export async function listRecipes() {
  const { data, error } = await requireClient()
    .from("recipes")
    .select("id, name, category, description, prep_minutes, ingredients, instructions")
    .eq("status", "approved")
    .order("name");

  if (error) throw error;
  return data.map(toRecipe);
}

export async function addRecipe(recipe) {
  const supabase = requireClient();
  const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
  if (sessionError) throw sessionError;
  if (!sessionData.session) throw new Error("Sign in before saving a recipe.");

  const { data, error } = await supabase
    .from("recipes")
    .insert({
      user_id: sessionData.session.user.id,
      name: recipe.name,
      category: recipe.category,
      description: recipe.description,
      prep_minutes: recipe.prepMinutes,
      ingredients: recipe.ingredients,
      instructions: recipe.instructions,
      status: "pending",
    })
    .select("id, name, category, description, prep_minutes, ingredients, instructions")
    .single();

  if (error) throw error;
  return toRecipe(data);
}

export async function isRecipeAdmin() {
  const { data, error } = await requireClient().rpc("is_recipe_admin");
  if (error) throw error;
  return data === true;
}

export async function listPendingRecipes() {
  const { data, error } = await requireClient()
    .from("recipes")
    .select("id, name, category, description, prep_minutes, ingredients, instructions, created_at")
    .eq("status", "pending")
    .order("created_at", { ascending: true });

  if (error) throw error;
  return data.map((row) => ({ ...toRecipe(row), createdAt: row.created_at }));
}

export async function reviewRecipe(id, approved) {
  const { data, error } = await requireClient().rpc("review_recipe", {
    p_recipe_id: id,
    p_approve: approved,
  });
  if (error) throw error;
  if (data !== true) throw new Error("This recipe has already been reviewed or no longer exists.");
}
