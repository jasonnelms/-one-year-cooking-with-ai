import type { APIRoute } from 'astro';
import { recipes, statusLabels } from '../lib/recipes';

const escapeXml = (value: string) =>
  value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const joinNotes = (values: string[]) =>
  values.map((value) => value.trim().replace(/[.!?]+$/, '')).join('; ');

const verdictSummary = (recipe: (typeof recipes)[number]) => {
  if (!recipe.verdict) return '';

  return [
    `The verdict is in: ${statusLabels[recipe.verdict.status]}.`,
    recipe.verdict.rating !== undefined ? `Rating: ${recipe.verdict.rating}/5.` : '',
    recipe.verdict.familyReaction ? `Reaction: ${recipe.verdict.familyReaction}` : '',
    recipe.verdict.whatWorked?.length ? `What worked: ${joinNotes(recipe.verdict.whatWorked)}.` : '',
    recipe.verdict.whatDidnt?.length ? `What didn't: ${joinNotes(recipe.verdict.whatDidnt)}.` : '',
    recipe.verdict.nextTime ? `Next time: ${recipe.verdict.nextTime}` : '',
  ]
    .filter(Boolean)
    .join(' ');
};

export const GET: APIRoute = () => {
  const judgedRecipes = recipes
    .filter((recipe) => recipe.verdict)
    .sort((a, b) => (b.verdict?.loggedDate || '').localeCompare(a.verdict?.loggedDate || ''));

  const items = judgedRecipes
    .map((recipe) => {
      const verdict = recipe.verdict!;
      const url = `https://cook.mellowgnome.site/recipes/${recipe.slug}/`;

      return `
    <item>
      <title>${escapeXml(`${recipe.title}: ${statusLabels[verdict.status]}`)}</title>
      <link>${url}</link>
      <guid isPermaLink="false">${escapeXml(`${recipe.slug}-verdict-${verdict.loggedDate}`)}</guid>
      <pubDate>${new Date(`${verdict.loggedDate}T12:00:00Z`).toUTCString()}</pubDate>
      <description>${escapeXml(verdictSummary(recipe))}</description>
    </item>`;
    })
    .join('');

  const xml = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0">
  <channel>
    <title>1 Year Cooking with AI — Verdicts</title>
    <link>https://cook.mellowgnome.site/</link>
    <description>The post-meal verdicts from one year of cooking with an AI sous-chef.</description>
    <language>en-us</language>${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' },
  });
};
