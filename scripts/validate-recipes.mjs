import { readdir, readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const recipeDirectory = resolve('src/data/recipes');
const allowedStatuses = new Set([
  'awaiting-verdict',
  'hit',
  'needs-work',
  'miss',
  'magnificent-disaster',
]);

const files = (await readdir(recipeDirectory)).filter((file) => file.endsWith('.json'));
const slugs = new Set();
const errors = [];

const requireText = (value, field, file) => {
  if (typeof value !== 'string' || !value.trim()) errors.push(`${file}: ${field} must be non-empty text`);
};

for (const file of files) {
  let recipe;
  try {
    recipe = JSON.parse(await readFile(resolve(recipeDirectory, file), 'utf8'));
  } catch (error) {
    errors.push(`${file}: invalid JSON (${error.message})`);
    continue;
  }

  requireText(recipe.slug, 'slug', file);
  requireText(recipe.title, 'title', file);
  requireText(recipe.summary, 'summary', file);
  requireText(recipe.publishedDate, 'publishedDate', file);

  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(recipe.slug || '')) {
    errors.push(`${file}: slug must contain only lowercase letters, numbers, and single hyphens`);
  }
  if (slugs.has(recipe.slug)) errors.push(`${file}: duplicate slug ${recipe.slug}`);
  slugs.add(recipe.slug);

  if (!/^\d{4}-\d{2}-\d{2}$/.test(recipe.publishedDate || '')) {
    errors.push(`${file}: publishedDate must use YYYY-MM-DD`);
  }
  if (!allowedStatuses.has(recipe.status)) errors.push(`${file}: unsupported status ${recipe.status}`);
  if (!Number.isInteger(recipe.servings) || recipe.servings < 1) errors.push(`${file}: servings must be a positive integer`);
  if (!Number.isFinite(recipe.prepMinutes) || recipe.prepMinutes < 0) errors.push(`${file}: prepMinutes must be zero or greater`);
  if (!Number.isFinite(recipe.cookMinutes) || recipe.cookMinutes < 0) errors.push(`${file}: cookMinutes must be zero or greater`);
  if (!Array.isArray(recipe.tags) || recipe.tags.length === 0) errors.push(`${file}: include at least one tag`);
  if (!Array.isArray(recipe.ingredients) || recipe.ingredients.length === 0) {
    errors.push(`${file}: include at least one ingredient`);
  } else {
    recipe.ingredients.forEach((ingredient, index) => {
      requireText(ingredient.item, `ingredients[${index}].item`, file);
      if (ingredient.quantity !== null && (!Number.isFinite(ingredient.quantity) || ingredient.quantity < 0)) {
        errors.push(`${file}: ingredients[${index}].quantity must be a non-negative number or null`);
      }
    });
  }
  if (!Array.isArray(recipe.steps) || recipe.steps.length === 0) {
    errors.push(`${file}: include at least one step`);
  } else {
    recipe.steps.forEach((step, index) => {
      requireText(step.text, `steps[${index}].text`, file);
      if (step.timerMinutes !== undefined && (!Number.isFinite(step.timerMinutes) || step.timerMinutes <= 0)) {
        errors.push(`${file}: steps[${index}].timerMinutes must be greater than zero`);
      }
    });
  }

  if (recipe.status === 'awaiting-verdict' && recipe.verdict) {
    errors.push(`${file}: awaiting-verdict recipes cannot have a verdict`);
  }
  if (recipe.status !== 'awaiting-verdict' && !recipe.verdict) {
    errors.push(`${file}: completed recipes must include a verdict`);
  }
  if (recipe.verdict) {
    if (recipe.verdict.status !== recipe.status) errors.push(`${file}: verdict.status must match recipe.status`);
    requireText(recipe.verdict.loggedDate, 'verdict.loggedDate', file);
    if (recipe.verdict.rating !== undefined &&
        (!Number.isFinite(recipe.verdict.rating) || recipe.verdict.rating < 0 || recipe.verdict.rating > 5)) {
      errors.push(`${file}: verdict.rating must be between 0 and 5`);
    }
  }
}

if (errors.length) {
  console.error(`Recipe validation failed with ${errors.length} error${errors.length === 1 ? '' : 's'}:`);
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}

console.log(`Validated ${files.length} recipe file${files.length === 1 ? '' : 's'}.`);
