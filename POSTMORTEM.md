# FluffyJaws EDS Build Post-Mortem Notes

This file tracks CLI and workflow edge cases found while building the first
FluffyJaws Edge Delivery site. It is intentionally separate from the site
content so the final review can turn observations into DA CLI fixes or docs.

## Running Findings

1. **Content-first flow needs to be explicit.**
   The correct authoring loop is: seed DA content, preview the generated
   `.plain.html`, then write or refine blocks against that content contract.
   Starting from local block code first makes it too easy to design around a
   synthetic structure that may not match DA output.

2. **Missing `fstab.yaml` is a hard blocker but easy to miss.**
   `da site info --org somarc --repo fluffyjaws-eds` correctly reported that
   `fstab.yaml` was missing, and the production site returned 404 because EDS
   could not mount DA content. This should be a first-class setup check in any
   CLI-first site creation path.

3. **Global DA config can target the wrong repo.**
   The global config pointed at `somarc/da-cli-eds` while this project needed
   `somarc/fluffyjaws-eds`. A project-local `.da.json` prevents accidental
   writes to the wrong DA repo. The CLI docs should strongly recommend creating
   project-local config immediately after cloning/scaffolding.

4. **`da content put` path normalization is helpful but should be documented.**
   Uploading `/` normalizes to `/index.html`; uploading `/nav` normalizes to
   `/nav.html`. The CLI warning is useful, but content-driven docs should show
   the exact paths EDS expects for home, nav, and footer.

5. **Fragment documents need full EDS HTML source, not bare `.plain.html`.**
   Dry-run warned that bare nav/footer fragments with no `<main>` wrapper would
   render empty because Helix extracts only `<main>` content. This is a good CLI
   guardrail and should be called out in examples.

6. **`aem up --html-folder` local routing does not mirror root DA routing by default.**
   The draft page rendered at `/drafts/index.html`, while `/` still proxied the
   remote 404. This is workable, but the CLI-first docs should explain the local
   URL shape when using `--html-folder`, especially before DA content exists.

7. **Header/footer blocks fail noisily when fragments are missing.**
   Missing `/nav.plain.html` and `/footer.plain.html` caused block exceptions.
   The boilerplate could degrade more gracefully, or the CLI could flag missing
   required fragments before preview.

8. **`da design audit` was valuable as an early quality gate.**
   Running it against the local draft caught no findings after cleanup. It is a
   useful companion to `npm run lint` and should be part of the recommended loop.

9. **DA diffs can become noisy after round-tripping source HTML.**
   Updating an existing DA document from full HTML source produced a large diff
   because the stored version had been normalized to extracted body markup. The
   CLI still completed the right write, but the operator has to inspect past the
   noise to find the meaningful content change. A structural diff mode for EDS
   source documents would make this safer.

10. **Content, code, preview, and live are four distinct states.**
    After DA content was committed and GitHub code was pushed, the public preview
    still returned a 404 until `da deploy pages / --branch main --commit` ran.
    The CLI made the two-phase model clear once discovered, but the happy path
    should explicitly sequence content write, code push, preview, publish, and
    verification.

## Commands Worth Capturing In Docs

```sh
export PATH="/opt/homebrew/bin:/usr/local/bin:$HOME/.local/bin:$PATH"
da auth status
da config show
da site info --org somarc --repo fluffyjaws-eds fluffyjaws-eds
da content put / drafts/index.html
da content put /nav drafts/nav.html
da content put /footer drafts/footer.html
da deploy pages / --branch main --commit
da design audit http://localhost:3000/drafts/index.html
npm run lint
```
