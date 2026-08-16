# QUICK NOTES

A lightweight local-first tool for capturing observations by student or group and keeping a personal To Do Board.

## Web version

The static web version is ready for GitHub Pages. A fresh browser starts with an empty workspace and Midnight Focus as the default theme. Browser data is stored only in that browser's `localStorage`.

Open `index.html` directly, or serve the folder locally:

```bash
npx serve .
```

## Desktop version

The same interface is packaged as a Windows desktop app with Electron.

Desktop workspace data is stored locally in:

`Documents\QUICK NOTES\data\workspace.json`

Portable backups can be exported from Settings → Data & Backup and restored on another computer. Automatic daily backups are stored under `Documents\QUICK NOTES\backups\auto\`.

A fresh installation contains no students, groups, notes, To Do lists or tasks. System categories remain available so the app is ready to use immediately.

## Current scope

- Separate student and group navigation
- Customisable note categories
- Add, edit, move, search and delete notes
- Create, rename and delete student/group profiles
- Compact Lesson Mode with quick capture
- To Do Board with lists and standalone tasks
- Local desktop storage and portable backup/restore
- GitHub Release based Install / Update flow

## Privacy

The project does not require an account or cloud storage. Desktop workspace data stays on the user's computer. The web version stores its workspace only in that browser.
