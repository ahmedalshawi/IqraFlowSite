# IqraFlow - Marketing Site

Static marketing site for **IqraFlow** (landing, privacy, terms, support). Plain HTML + CSS + a little vanilla JS - **no build step, no frameworks**. Pages render instantly; fonts, styles and scripts are ordinary cached files under `assets/`.

## Files

| File | Route |
|---|---|
| `index.html` | `/` - landing page |
| `privacy.html` | `/privacy` |
| `terms.html` | `/terms` |
| `support.html` | `/support` |
| `404.html` | not-found page |
| `icon.png` | favicon / touch icon |
| `assets/site.css` | fonts, shared styles, responsive layout |
| `assets/app.js` | landing-page interactivity (mobile nav, waitlist form, FAQ, WebGL hero) |
| `assets/three.min.js` | three.js (self-hosted) for the hero particle animation |
| `assets/fonts/` | Inter, Outfit and KFGQPC Uthmanic Hafs (self-hosted) |
| `assets/logo-128.png` | small logo used in the nav and footer |

Clean URLs (`/privacy` → `privacy.html`) are handled automatically by Cloudflare Pages.

The site is fully responsive (phones from 320px wide, tablets, laptops, large monitors). Only the landing page loads JavaScript; the legal/support pages are pure HTML + CSS.

## Deploy - GitHub + Cloudflare Pages

1. **Create the repo** - on github.com, create `IqraFlowSite` (public or private), then upload everything in this folder.
2. **Connect to Pages** - Cloudflare dashboard → *Workers & Pages* → *Create* → *Pages* → *Connect to Git* → select `IqraFlowSite`.
3. **Build settings** - Framework preset: **None** · Build command: *(leave empty)* · Build output directory: `/`. Click **Save and Deploy**.
4. **Custom domain** - in the Pages project → *Custom domains* → *Add* → `iqraflow.alshawi.org`. Since `alshawi.org` is already on Cloudflare, the CNAME record is created for you and HTTPS goes live within a few minutes.

## Before launch

- The **Notify me** form currently saves the email in the visitor's browser only (`localStorage`). Wire it to a Cloudflare Worker + KV (or a form service like Formspree) to actually collect signups - the submit logic lives in `assets/app.js` (`setupForm`).
- Replace placeholder contact emails (`hello@iqraflow.app`, etc.) and the `[jurisdiction]` note in the terms.
- Swap store badges for real App Store / Google Play links at launch.
