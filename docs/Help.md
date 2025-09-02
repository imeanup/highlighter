# Highlight-v2 — Help & Guide

Welcome to **Highlight-v2** — a small extension to highlight multiple words on web pages.

---

## Quick start
1. Open the popup (click the extension icon).  
2. Enter words separated by spaces in the textbox (e.g. `todo bug note`).  
3. Toggle the switch to enable/disable highlighting.

The extension highlights whole-word matches in the page (case-insensitive).

---

## Popup UI
- **Textbox** — type highlight words separated by spaces.
- **Switch** — toggles highlight on/off.
- **Donate** — link to the project.
- **Help** — this page.
- **Report issue** — use GitHub Issues if you find bugs (link in the repo).

---

## Examples
- Enter `error warning` → highlights “error” and “warning”.
- Use multiple words: `todo fix review`.

---

## Behavior notes & tips
- Words shorter than 2 characters are ignored.
- Matching is case-insensitive.
- Highlighted style cycles through several color themes.
- If changes in the popup do not appear on the page:
  1. Try reloading the page.
  2. Ensure the extension is allowed on the site (file:// or special pages require permission).
  3. Open the popup again to confirm the saved keywords.

---

## Troubleshooting
- **Problem:** New words disappear when switching tabs.
  - **Fix:** Make sure to wait ~200ms for the popup to save (or open popup and wait briefly). If you often lose changes, update the extension; we persist on popup close too.
- **Problem:** “message port closed” console warnings.
  - **Fix:** Use the latest extension version — this has been addressed in v1.0.2+.

---

## Advanced / Developer notes
- Highlighting is injected into pages via `content-action.js` and `highlighter.js`.
- Styles live in `css/highlight.css`.
- For development:
  - Clone repo, run `npm ci` (if using dev tools).
  - Load unpacked extension in Chrome via `chrome://extensions` → **Load unpacked**.

---

## Reporting bugs / feature requests
If you find a bug or want a feature, please open an issue [here](https://github.com/imeanup/highlighter/issues/new)

### Template:
1. Bug report / Feature request
    * `Type: Bug [] / Feature []`
2. Extension version installed: `v1.0.x`
3. Browser (name and version): `e.g. Chrome 114.0.5735.199`
4. OS (name and version): `e.g. macOS 13.4, Windows 10`
5. Steps to reproduce
    * Go to ...
    * Click ...
    * Enter ...
    * Observe...
6. Expected behavior: Describe what you expected to happen.
7. Actual behavior: Describe what actually happened (error messages, wrong output, etc).
8. Reproducible URL (if applicable): Provide a link to a page that reproduces the problem or a minimal test case.
9. Console errors / logs: Paste any relevant console output (DevTools → Console). Wrap multi-line text in triple backticks:
`[Paste console output here]`

10. Screenshots: Attach screenshots or a short GIF showing the problem.
11. Additional context: Add any other information (network conditions, extensions that might conflict, custom settings).

> If any of the required items are missing, the issue may be marked "Incomplete request" and closed to keep the backlog manageable. You can reopen or comment on the issue once you add the missing information.
---

## Changelog (short)
- v1.0.3 — Fixed `last.runtime.error` and search box auto expand. Added help.md file.
- v1.0.2 — Fixed messaging port issue and popup save behavior.

---

Thanks for using Highlight-v2! 