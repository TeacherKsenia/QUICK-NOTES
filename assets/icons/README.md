# QUICK NOTES icons

Folders:

- `ui/` — interface icons
- `category-picker/` — category picker icons

The app uses SVG shapes as CSS masks. The visible colour comes from QUICK NOTES CSS/theme, not from the SVG file itself.

## Replace an icon while opening QUICK NOTES directly from `index.html`

1. Replace the SVG in `ui/` or `category-picker/`.
2. Keep the same filename.
3. Double-click `UPDATE_ICONS.bat` in the project root.
4. Refresh QUICK NOTES in Chrome.

The SVG's own red/black/blue colour is ignored. Only its shape is used.

Why the update step exists: Chrome applies CORS restrictions to external SVG files used as CSS masks when a page is opened with `file://`. `UPDATE_ICONS.bat` embeds the current folder SVGs into `styles/icons.css` as data-URI masks, so the icons work in the existing double-click `index.html` workflow.

## Icon size controls

Do not hunt through component CSS. All mask-icon sizes are controlled by five tokens in `styles/tokens.css`:

- `--icon-size-small` — compact controls
- `--icon-size-ui` — normal interface icons
- `--icon-size-sidebar` — sidebar/navigation icons
- `--icon-size-category` — category icons
- `--icon-size-feature` — large dashboard/settings icons

The current V27 values are intentionally larger: `16 / 20 / 22 / 22 / 27px`.
Changing these tokens changes size only; theme colours stay untouched.
