# IqraFlow — Marketing Site

Static marketing site for **IqraFlow** (landing, privacy, terms, support). Every page is a single self-contained HTML file — fonts, images and the WebGL hero are inlined. **No build step.**

## Files

| File | Route |
|---|---|
| `index.html` | `/` — landing page |
| `privacy.html` | `/privacy` |
| `terms.html` | `/terms` |
| `support.html` | `/support` |
| `404.html` | not-found page |
| `icon.png` | favicon / touch icon |

Clean URLs (`/privacy` → `privacy.html`) are handled automatically by Cloudflare Pages.

## Deploy — GitHub + Cloudflare Pages

1. **Create the repo** — on github.com, create `IqraFlowSite` (public or private), then upload everything in this folder (drag-and-drop onto the repo page works; files are large, give it a minute).
2. **Connect to Pages** — Cloudflare dashboard → *Workers & Pages* → *Create* → *Pages* → *Connect to Git* → select `IqraFlowSite`.
3. **Build settings** — Framework preset: **None** · Build command: *(leave empty)* · Build output directory: `/`. Click **Save and Deploy**.
4. **Custom domain** — in the Pages project → *Custom domains* → *Add* → `iqraflow.alshawi.org`. Since `alshawi.org` is already on Cloudflare, the CNAME record is created for you and HTTPS goes live within a few minutes.

## Before launch

- The **Notify me** form currently saves the email in the visitor's browser only. Wire it to a Cloudflare Worker + KV (or a form service like Formspree) to actually collect signups.
- Replace placeholder contact emails (`hello@iqraflow.app`, etc.) and the `[jurisdiction]` note in the terms.
- Swap store badges for real App Store / Google Play links at launch.
