import type { Recipe, RecipeStatus } from '../types';

const modules = import.meta.glob<{ default: Recipe }>('../data/recipes/*.json', {
  eager: true,
});

const includeDemo = import.meta.env.INCLUDE_DEMO === 'true';

export const recipes = Object.values(modules)
  .map((module) => module.default)
  .filter((recipe) => !recipe.draft || includeDemo)
  .sort((a, b) => b.publishedDate.localeCompare(a.publishedDate));

export const statusLabels: Record<RecipeStatus, string> = {
  'awaiting-verdict': 'Awaiting verdict',
  hit: 'Hit',
  'needs-work': 'Needs work',
  miss: 'Miss',
  'magnificent-disaster': 'Magnificent disaster',
};

export function formatMinutes(minutes: number): string {
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const remainder = minutes % 60;
  return remainder ? `${hours} hr ${remainder} min` : `${hours} hr`;
}
