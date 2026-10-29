# Laws of Beauty Academy – Website

Static website for Laws of Beauty Academy, a beauty, hair, and fashion training school at Santa Maria, A-Lang Rd, Accra.

The site is plain HTML, CSS, and JavaScript. It has no build step and no server code.

## Pages

| File | Page |
|---|---|
| `index.html` | Homepage: hero, about, courses, admissions, gallery preview, testimonials, FAQ, contact, map |
| `courses.html` | All seven courses with durations, schedules, and Beauty / Hair / Fashion filters |
| `gallery.html` | Student work with category filters and a full-screen image viewer |
| `apply.html` | Admission steps, application form, admission FAQs, map |
| `privacy.html`, `terms.html` | Privacy Policy and Terms & Conditions |
| `404.html` | "Page not found" page |

## Project structure

```
assets/
  css/styles.css      All styles, shared by every page
  js/main.js          All scripts, shared by every page
  img/logo-mark.svg   Logo emblem (header and footer)
  img/favicon.svg     Simplified emblem for the browser tab
  img/icon-*.png      Home-screen icons (iPhone and Android)
  img/og-image.png    Preview image shown when the site is shared on WhatsApp, Facebook, etc.
robots.txt            Search engine rules
sitemap.xml           Page list for search engines
site.webmanifest      App name and icons for phones
```

Every page loads the same `styles.css` and `main.js`, so a style change applies everywhere.

## How things work

**Enquiry and application forms.** The site has no backend. Submitting a form opens WhatsApp with the person's details already filled in, addressed to 024 454 5945. They press send to deliver it. The WhatsApp number is set at the top of `assets/js/main.js`.

**Course pre-selection.** Each course's "Enquire Now" button links to `apply.html?course=<slug>`, for example `apply.html?course=barbering`, and the course is already selected in the form.

**Map and route finder.** The map is pinned to the academy's Google Maps listing. "Show route from my location" asks the visitor for their location, then draws the route and shows the distance. Browsers only allow this on HTTPS sites, so it works once the site is live, not when the page is opened as a local file.

## Editing common content

| To change | Where |
|---|---|
| A course (name, description, duration, schedule, photo) | Course cards in `index.html` and `courses.html`. The course name also appears in the course dropdown in `index.html` and `apply.html`, and in the footer of every page. |
| Add or remove a course | Same places as above. On `courses.html`, set the card's `data-category` to `beauty`, `hair`, or `fashion` so the filters work. |
| Phone numbers | Contact section and footer of every page, the location section, and `WHATSAPP_NUMBER` in `assets/js/main.js` |
| Map location | `ACADEMY` in `assets/js/main.js` and the map `<iframe>` in each page's location section |
| Colours and fonts | Variables at the top of `assets/css/styles.css` |
| Gallery photos | `gallery.html`. Give each item a `data-category` that matches a filter button. |

## Deploying

Upload the whole folder to any static host, such as Netlify, Vercel, GitHub Pages, or cPanel hosting. Then:

1. Serve the site over **HTTPS**. The route finder needs it.
2. Set `404.html` as the "not found" page. Netlify and GitHub Pages do this automatically. On Apache/cPanel, add `ErrorDocument 404 /404.html` to `.htaccess`.
3. If the domain is not `www.lawsofbeautyacademy.org`, replace it in `sitemap.xml`, `robots.txt`, and the `canonical` / `og:url` tags in each page's `<head>`.

## Before launch – please confirm

The following content was written for the demo or came from earlier drafts. Please check it with the academy:

- [ ] **Stats on the homepage.** "2,000+ students trained", "15+ years of experience", and "1:1 mentor support". The 4.8★ rating comes from the academy's Google listing.
- [ ] **Course durations and schedules.** For example, Cosmetology is listed as 12 weeks, weekday and weekend. Modeling is shown as "Duration on request".
- [ ] **Course descriptions**, especially Fashion Design, Barbering, Beading, and Modeling.
- [ ] **Testimonials** (Abena M., Efua K.). Use real, permitted quotes.
- [ ] **Facebook link.** It currently runs a Facebook search. Replace it with the page URL in the footer of every page (marked `TODO`).
- [ ] **Photos.** All photos are Unsplash stock images. Replace them with the academy's own photos where possible.
- [ ] **Privacy Policy and Terms.** Have both reviewed before going live.
