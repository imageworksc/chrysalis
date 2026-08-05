# Chrysalis Health — Children's Mental Health Services

Static landing page published with GitHub Pages: <https://imageworksc.github.io/chrysalis/>

Single self-contained file: [`index.html`](index.html) (inline CSS + JS, no build step).
Photography is served from Cloudinary with `f_auto,q_auto` and responsive `srcset`.

## Pending wiring

The request form at `#request-form` is not connected to a backend. To enable it, add a
POST endpoint to the form tag:

```html
<form id="ch-request-form" data-endpoint="https://your-intake-endpoint" novalidate>
```

The handler posts the fields as JSON. Without `data-endpoint`, the form shows a message
directing visitors to (888) 587-0335 instead of silently failing.

Header nav items still pointing at `#` are placeholders for the real site URLs.

## Structure

- Header (`.ch-lp-*`) — logo, actions, desktop dropdowns, mobile menu, announcement bar
- Page (`.ch-cmh-*`) — hero, services, concerns, play therapy, telehealth, steps, FAQ, CTA + form
- Footer — contact, quick links, 988/911 crisis information
- JSON-LD — `MedicalBusiness`, `WebPage`, `FAQPage`
