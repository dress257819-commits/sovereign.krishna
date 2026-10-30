# Sovereign Krishna — Portfolio

A standalone portfolio for Krishna Bhattarai, with an editorial hero, lime-accented art direction, portrait feature, cinematic intro, cursor trails, and scroll effects. It is plain HTML, CSS, and JavaScript and can be published directly with GitHub Pages; no React build is required.

## Run locally

From the `sovereign.krishna` directory, start a static file server. For example:

```bash
python -m http.server 8000
```

Then open http://localhost:8000. You can also use VS Code Live Server.

## Publish with GitHub Pages

1. Push the contents of this folder to the root of a GitHub repository on the `main` branch. The GitHub account you use must have write access to that repository.
2. In the repository, open **Settings → Pages**.
3. Under **Build and deployment**, choose **Deploy from a branch**, select `main` and `/(root)`, then save.
4. Wait for the Pages deployment to finish. A project site is usually available at `https://<owner>.github.io/<repository>/`.
5. If using a custom domain, configure it in GitHub Pages and update the canonical URL in `index.html`.

## Contact form

The contact form submits directly to `sovereignkrishna111@gmail.com` through FormSubmit; visitors do not need an email app. On the first real submission, FormSubmit sends a verification email to that inbox. Open it and confirm the address before expecting submissions to be delivered. Check spam/junk if the verification email is not in the inbox. FormSubmit is a third-party service that processes the form submission.

This folder is self-contained: `index.html`, `styles.css`, `script.js`, the animation scripts, favicon, and `assets/` make up the website. The original source folder is separate.

## Notes

- The cinematic intro uses the portrait provided in `assets/loader_hero.png`.
- The gallery uses the supplied `app*`, `product*`, and `book*` images in their matching categories.
- The sample project names are still placeholders and should be updated to match the actual projects before launch.
- GSAP and Lenis enhance the animations and smooth scrolling when their CDN scripts are available; the page remains readable without them and respects reduced-motion settings.
- The project gallery intentionally labels the supplied sample projects as concepts/placeholders.
- The contact form requires the one-time FormSubmit email verification described above.