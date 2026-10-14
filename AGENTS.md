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

## Content rules

- Markers that separate completed work from future work (the Learning Journey "AHEAD" badge and its timeline dots) must be driven by an explicit flag on the data item (`ahead` in `src/data/portfolio.ts`), never by a hardcoded array index — adding or reordering entries silently moves the boundary.
