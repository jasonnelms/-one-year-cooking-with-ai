# 1 Year Cooking with AI

This is Jason's public Astro cookbook at `https://cook.mellowgnome.site`. Recipes are individual JSON files in `src/data/recipes/`. Never edit generated `dist/` files.

## Recipe publishing

When Jason says **“Publish it”** in a conversation containing a finalized recipe:

1. Convert the recipe into the schema used by `src/types.ts` and the example in `src/data/recipes/demo.json`.
2. Create `src/data/recipes/<slug>.json` on `main` in `jasonnelms/-one-year-cooking-with-ai`.
3. Set `publishedDate` to the current local date, `status` to `awaiting-verdict`, and omit `verdict`.
4. Preserve the final recipe actually agreed upon in the conversation, not an earlier draft.
5. Repeat ingredient quantities inside the relevant step text so Cook Mode is usable without reopening the ingredient list.
6. Use `timerMinutes` for unattended cooking or resting periods.
7. Keep private health, family, location, and conversation details out of the public file unless Jason explicitly asks to publish them.
8. Return `https://cook.mellowgnome.site/recipes/<slug>/` and note that GitHub Pages may need a few minutes to update.

When Jason says **“Log the result”**, **“Update the verdict”**, or gives a post-meal result:

1. Fetch the existing recipe file.
2. Preserve the proposed ingredients and method unless Jason explicitly corrects them.
3. Record kitchen substitutions in `actualChanges`.
4. Change `status` to `hit`, `needs-work`, `miss`, or `magnificent-disaster`.
5. Add a matching `verdict` with `loggedDate`, optional 0–5 rating, household reaction, what worked, what did not, and next-time changes.
6. Update the existing file on `main` and return the same recipe URL.

## Development

- Run `npm run validate:recipes` before building.
- Run `npm run build` before publishing structural site changes.
- Use `INCLUDE_DEMO=true npm run build` to exercise the private demo recipe page.
- Keep the site mobile-first, accessible, and functional without server-side code.
- Do not put secrets in this public repository.
