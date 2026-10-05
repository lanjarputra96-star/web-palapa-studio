<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Keep the public school website as a single scrolling homepage because its navigation is an overview of one institution.
- Use only verified school facts from the reference site; avoid inventing names, dates, contact details, or service capabilities.
- Standalone Cloudflare deploys get the D1 database through the `DB` binding declared in root wrangler.jsonc (merged into the build output), so the binding survives every Git deploy.
