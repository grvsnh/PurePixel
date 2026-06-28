# Pure Pixel

Pure Pixel is a frontend-only luxury beauty e-commerce portfolio project built with HTML5, CSS3, and vanilla JavaScript.

## Pages

- `index.html` - home, hero, categories, featured products, routine, quiz CTA, testimonials, journal preview, newsletter
- `shop.html` - searchable, filterable, sortable product grid
- `product.html` - dynamic product detail page using `?id=`
- `journal.html` - editorial beauty content
- `wishlist.html` - localStorage wishlist
- `cart.html` - localStorage cart with quantities and totals
- `checkout.html` - frontend-only checkout flow
- `about.html` - brand and project story

## Architecture

- `css/variables.css` centralizes design tokens.
- `css/reset.css`, `css/global.css`, `css/components.css`, and `css/animations.css` form the shared design system.
- `css/pages/` contains page-specific layout styles.
- `data/products.json` and `data/reviews.json` provide reusable content data.
- `js/utils.js`, `theme.js`, `animations.js`, `products.js`, `wishlist.js`, `cart.js`, and `app.js` each keep a single responsibility.

## Run Locally

Use a local server so JSON loading works:

```bash
python3 -m http.server 4173
```

Then open:

```text
http://127.0.0.1:4173/
```

## Features

- Responsive navigation and mobile drawer
- Light and dark theme persistence
- Product rendering from JSON
- Search, category filtering, and sorting
- Wishlist persistence with localStorage
- Cart persistence, quantity controls, subtotals, and checkout summary
- Product detail routing via query string
- Scroll progress, reveal animations, loader, and back-to-top control
- Semantic markup and accessible labels for key controls
