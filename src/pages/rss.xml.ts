import type { APIRoute } from 'astro';
import { recipes } from '../lib/recipes';

const escapeXml = (value: string) =>
  value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export const GET: APIRoute = () => {
  const items = recipes
    .map(
      (recipe) => `
    <item>
      <title>${escapeXml(recipe.title)}</title>
      <link>https://cook.mellowgnome.site/recipes/${recipe.slug}/</link>
      <guid>https://cook.mellowgnome.site/recipes/${recipe.slug}/</guid>
      <pubDate>${new Date(`${recipe.publishedDate}T12:00:00Z`).toUTCString()}</pubDate>
      <description>${escapeXml(recipe.summary)}</description>
    </item>`,
    )
    .join('');

  const xml = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0">
  <channel>
    <title>1 Year Cooking with AI</title>
    <link>https://cook.mellowgnome.site/</link>
    <description>A candid year of cooking with an AI sous-chef.</description>${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' },
  });
};
