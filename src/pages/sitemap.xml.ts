import type { APIRoute } from 'astro';
import { recipes } from '../lib/recipes';

export const GET: APIRoute = () => {
  const paths = ['/', '/recipes/', '/about/', ...recipes.map((recipe) => `/recipes/${recipe.slug}/`)];
  const urls = paths
    .map((path) => `<url><loc>https://cook.mellowgnome.site${path}</loc></url>`)
    .join('');

  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`,
    { headers: { 'Content-Type': 'application/xml; charset=utf-8' } },
  );
};
