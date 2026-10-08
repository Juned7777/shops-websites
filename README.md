# Mentina Web — Business Demo Websites

Premium demo websites for local businesses (cafes, restaurants, salons, gyms & more).

## Live demo URLs

Every business lives in its own folder, so its site is live at:

```
https://juned7777.github.io/shops-websites/<BUSINESS-CODE>/
```

Example: `https://juned7777.github.io/shops-websites/MP-BHO-CAFE-0019/`

## Folder structure

```
<BUSINESS-CODE>/
├── index.html    # complete website (semantic + SEO + JSON-LD)
├── style.css     # design system (theme tokens per business)
└── app.js        # demo-lock modal + interactions
```

## Demo protection

Each site ships with:
- a sticky demo banner, and
- a global **Demo Lock** modal that intercepts every action click
  (book / order / call buttons) and routes the visitor to the agency
  (WhatsApp + agency site).

Deploying a site for a client means removing the `data-demo` hooks and the
`#demoModal` block, then shipping the same three files.

---
Built & maintained by [Mentina Web](https://mentinaweb.netlify.app/).
