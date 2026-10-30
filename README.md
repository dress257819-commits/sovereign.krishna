# Sovereign Krishna — Portfolio

A standalone portfolio for Krishna Bhattarai, with an editorial hero, lime-accented art direction, portrait feature, cinematic intro, cursor trails, and scroll effects. It is plain HTML, CSS, and JavaScript and can be published directly with GitHub Pages; no React build is required.

## Run locally

From the `sovereign.krishna` directory, start a static file server. For example:

```bash
python -m http.server 8000
```

Then open http://localhost:8000. You can also use VS Code Live Server.

## Publish with GitHub Pages

1. Create a GitHub repository for this site and upload the contents of `sovereign.krishna` to that repository's root.
2. In **Settings → Pages**, choose **Deploy from a branch**.
3. Select the branch you want to publish and the repository root (`/`) as the folder.
4. If using a custom domain, configure it in GitHub Pages and update the canonical URL in `index.html`.

This folder is self-contained: `index.html`, `styles.css`, `script.js`, the animation scripts, favicon, and `assets/` make up the website. The original source folder is separate.

## Notes

- The cinematic intro uses the portrait provided in `assets/loader_hero.png`.
- The gallery uses the supplied `app*`, `product*`, and `book*` images in their matching categories.
- The sample project names are still placeholders and should be updated to match the actual projects before launch.
- GSAP and Lenis enhance the animations and smooth scrolling when their CDN scripts are available; the page remains readable without them and respects reduced-motion settings.
- The project gallery intentionally labels the supplied sample projects as concepts/placeholders.
- The contact form opens the visitor's email application with the message addressed to `dhirajbhattarai111@gmail.com`; it does not submit data to a server.