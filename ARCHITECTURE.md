# QUICK NOTES architecture

This document is the implementation contract for extending the application
without introducing page-specific CSS forks.

## Style layers

Styles load in this order:

1. `styles/tokens.css` — semantic design, typography, motion, elevation and
   layout tokens.
2. `styles/components.css` — geometry shared by reusable components.
3. `styles.css` — the compatibility layer and approved theme visuals.
4. `styles/layout.css` — the single layout, viewport and sticky contract.

New screens must use the first, second and fourth layers. A selector added to
the compatibility layer must explain which approved legacy visual it preserves.

Themes may change colour, surfaces, imagery, shadows and decorative effects.
They must not change grid geometry, spacing, positioning, sticky offsets or
overflow. Existing theme geometry is tracked as legacy debt until its removal
can be approved without changing the visual baseline.

## Shared UI

`src/ui/components.js` owns reusable render helpers for buttons, icon buttons,
chips, segmented controls, sidebar items, note actions, note/category cards,
profile headers, dialogs and empty states. A future screen such as To Do must
compose these primitives instead of copying their markup or CSS.

`src/ui/lesson-mode.js` owns address selection and validation used by both the
separate Lesson Mode window and its in-page fallback.

## Application services

- `src/core/router.js` is the view registry. A new page registers a route; it
  must not add an independent visibility/navigation system.
- `src/core/i18n.js` is the only DOM translation engine. User-entered names,
  notes and custom categories are data and must never be translated.
- `src/core/storage.js` is the persistence boundary. The browser adapter is
  used by the web demo; a desktop file bridge can replace it without changing
  UI or domain code.

## Change rules

- No local override for an existing shared component without a documented
  variant or state.
- No theme selector may introduce layout geometry.
- Every structural stage must pass `node --check app.js`, the browser audit and
  the 14-screen visual comparison against `.audit/visual-baseline-stable`.
- Long text, empty data, dense data, RU/EN, every theme and constrained desktop
  sizes are part of the regression matrix.

## Baseline and rollback

The pre-refactor source snapshot is stored in
`.snapshots/system-refactor-baseline-20260813-221325` and its ZIP archive.
The original approved captures are stored in `.audit/visual-baseline-stable`.
After the explicitly approved unification of category-filter insets to 8px, the
current approved captures are stored in `.audit/visual-approved-post-refactor`.

## Refactor status

- Semantic tokens, shared component geometry and viewport/sticky contracts are
  separated into their own layers.
- Reusable UI markup lives in `src/ui/components.js`; Lesson Mode has one
  shared behavior and style source in `src/ui/lesson-mode.js`.
- DOM text and dynamic confirmation messages use the central RU/EN catalogs.
- Dashboard/workspace visibility is owned by the route registry.
- Browser and future desktop persistence use the same storage adapter contract.
- `.audit/full-regression-matrix.mjs` verifies every combination of the three
  approved themes, RU/EN, Dashboard/student/group/category/Settings/note dialog
  and 1600x900, 1120x720 and 900x650 desktop viewports (108 states).

Category-filter geometry is shared by every theme. Its 8px horizontal inset is
owned by the component layer; themes only change the divider's colour or
decorative visibility. The theme-geometry audit reports zero structural theme
declarations.

## Minimalism colour contract

`classic` is the **Minimalism** theme and receives the `theme-minimalism` body
class. Its accent palette is closed: new UI must not invent, rotate or
substitute accent colours.

Approved object mapping:

- sidebar background → `#1D2725`
- raised/search sidebar surface → `#26322F`
- selected sidebar surface → `#31413D`
- workspace canvas → `#F5F5F2`
- cards → `#FFFFFF`
- primary actions / Lesson mode / Add note → `#1C6856`
- QUICK NOTES brand mark → `#E19155`
- category/status filter chips (inactive) → `#E19155`
- selected filter chip → `#1D2725`
- Vocabulary icon → background `#E5ECF5`, glyph `#5D7392`
- Grammar icon → background `#E8E3F1`, glyph `#74658F`
- Errors icon → background `#F5E6E1`, glyph `#A26754`
- Interests icon → background `#E8EFE4`, glyph `#608259`
- Other / Ideas icon → background `#F2EBDD`, glyph `#9A7950`
- Dashboard Students & notes card → `#8497B0`
- Dashboard Quick note card → `#F9C66B`
- Dashboard To-do list card → `#839464`
- Dashboard Lesson mode card → `#E19155`
- To Do Today accent → `#F9C66B`
- To Do No Date accent → `#8497B0`
- To Do Upcoming accent → `#839464`

For newly created people/groups Minimalism may rotate only through the approved
avatar-role palette `#F9C66B`, `#839464`, `#F88572`, `#8497B0`.

Text is the only contrast-dependent exception: use the approved dark text
`#1B2422` on light/medium surfaces and light text `#F7FAF8` on dark surfaces.
Secondary text, dividers, hover states and soft surfaces may derive opacity or
`color-mix()` only from these approved tokens. They must not introduce a new
hand-picked hue. The category-icon colours listed above are part of the locked
reference palette and stay assigned to their named categories.

The Minimalism contract applies to **every screen**: Dashboard, Workspace,
student/group/category views, To Do, Settings/dialogs and both Lesson Mode
implementations. Page-specific CSS may change geometry for a unique domain
component, but it may not invent or reassign Minimalism colours.

## Workspace sticky header contract

Workspace uses one shared two-row sticky stack in every theme:

1. `.topbar` is row 1 and stays at `top: 0`. When the large profile header has
   scrolled away, `.workspace-context` becomes visible there with the current
   person's compact avatar/name so note ownership is never ambiguous.
2. `.category-filter` is row 2 and stays directly below the topbar at
   `top: var(--layout-topbar-height)`. All category chips, visibility control
   and Add note remain in this row.

Both rows must always have an actual theme-owned surface so note/card text can
never show through while scrolling. Themes may change only the two sticky
surface colours, divider, shadow/blur and text colours. They must not change
`position`, `top`, row height, z-index, offsets or visibility logic.
