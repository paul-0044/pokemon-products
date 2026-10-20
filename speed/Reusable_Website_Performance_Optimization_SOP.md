# Reusable Website Performance Optimization SOP

## Master Instructions for Claude, Antigravity, Codex, or Any Coding Agent

Version: 1.0  
Purpose: Safely diagnose and improve the speed of any website without blindly applying generic tricks or breaking business-critical functionality.

---

## How to Use This File

Place this file in the website project, preferably at:

\`docs/Reusable_Website_Performance_Optimization_SOP.md\`

Then tell the coding agent:

> Read \`docs/Reusable_Website_Performance_Optimization_SOP.md\` completely. Treat it as the governing performance SOP for this project. Inspect the real stack and repository first, establish a measured baseline, then implement only relevant optimizations in priority order. Continue automatically through safe, reversible changes, test after every stage, and provide a before-and-after report. Never deploy to production without authorization.

This SOP is stack-neutral. The agent must adapt it to the actual framework, hosting platform, database, CMS, and traffic level.

---

## 1. Operating Rules

The agent must:

1. Inspect the repository, package files, build configuration, hosting configuration, API routes, database access, image sources, third-party scripts, and deployment environment before changing anything.
2. Establish a baseline before optimization. Never claim improvement without before-and-after measurements.
3. Preserve existing design, responsive behavior, SEO metadata, accessibility, analytics, authentication, cart, checkout, payments, contact forms, emails, dashboards, and admin functions.
4. Work in small stages and test after each stage so regressions can be traced and reversed.
5. Prefer existing platform capabilities over adding unnecessary packages, plugins, proxies, CDNs, or cache layers.
6. Never expose environment variables, API keys, database credentials, webhook secrets, or private customer data.
7. Never cache private, personalized, authentication, cart, checkout, admin, payment, webhook, inventory-write, or order-status responses unless the cache behavior is explicitly designed and proven safe.
8. Never change product prices, stock, order totals, payment logic, or server-side validation merely to make a page appear faster.
9. Never reduce image quality until products become misleading, blurry, or difficult to inspect.
10. Skip methods that are irrelevant to the stack and explain why they were skipped.
11. Do not add a load balancer merely because it appears in a checklist. First confirm that traffic and infrastructure require one and that the hosting provider does not already supply managed balancing.
12. Do not create database indexes blindly. Base indexes on real filters, joins, sorting, query plans, and slow-query evidence.
13. Do not use loading skeletons to hide genuinely slow code. Fix the underlying bottleneck and use skeletons only for useful perceived-performance feedback.
14. Do not deploy to production or run destructive database operations without explicit authorization.

---

## 2. Required Project Information

The agent should discover these automatically and ask only for information it cannot determine safely:

| Item | Value |
|---|---|
| Project name | To be discovered or supplied |
| Local command | To be discovered |
| Production build command | To be discovered |
| Framework/CMS | To be discovered |
| Hosting provider | To be discovered |
| Database | To be discovered |
| Image storage/CDN | To be discovered |
| Public URL or preview URL | To be supplied if unavailable |
| Critical routes | Home, categories, search, product, cart, checkout, account, admin, or relevant equivalents |
| Critical integrations | Payments, email, analytics, chat, maps, authentication, uploads, webhooks |

---

## 3. Success Targets

### Core Web Vitals

Evaluate field data at the 75th percentile when sufficient real-user data exists:

| Metric | Good target |
|---|---:|
| Largest Contentful Paint (LCP) | 2.5 seconds or less |
| Interaction to Next Paint (INP) | 200 milliseconds or less |
| Cumulative Layout Shift (CLS) | 0.1 or less |

### Supporting Goals

- Aim for a mobile Lighthouse Performance score of 90 or higher where realistically achievable.
- Treat Lighthouse as a repeatable laboratory diagnostic, not a Google ranking score or a guarantee of real-user performance.
- Reduce transferred bytes, request count, main-thread blocking, duplicate requests, API latency, and database query time.
- Eliminate broken images, oversized product images, avoidable layout shifts, and long blank loading states.
- Preserve or improve accessibility, SEO, security, visual quality, and conversion flow.
- Compare the same pages, build mode, device profile, network conditions, and test location before and after.

---

## 4. Phase 0 — Safeguard and Baseline

Before changing code:

1. Record the current Git status and preserve unrelated user changes.
2. Create a safe branch or recoverable checkpoint when permitted.
3. Run the existing build, type checks, linting, and tests.
4. Confirm the site’s important flows currently work.
5. Produce a production build for performance testing. Do not judge production speed from a development server alone.
6. Test at least:
   - Home page
   - Category or listing page
   - Search page
   - One image-heavy product/content page
   - Cart and checkout
   - Login/account
   - Admin/dashboard, if applicable
7. Run Lighthouse on mobile and desktop at least three times and use the median result.
8. Inspect:
   - Network waterfall
   - Largest files and images
   - Number of requests
   - JavaScript and CSS bundle sizes
   - Main-thread long tasks
   - Render-blocking resources
   - Third-party scripts
   - API response times and sizes
   - Duplicate or repeated requests
   - Server/function logs
   - Slow database queries and N+1 patterns
9. Record the baseline in the reporting table in Section 14.

Do not begin broad optimization until the main bottlenecks are identified.

---

## 5. Phase 1 — Images, Video, Fonts, and Static Assets

Images are often the largest ecommerce and content-site bottleneck.

### 5.1 Image Audit

- Find oversized originals, duplicate assets, incorrect file extensions, broken URLs, remote hotlinks, and images much larger than their rendered dimensions.
- Record each major image’s format, intrinsic dimensions, rendered dimensions, file size, route, and whether it is above or below the fold.
- Check product grids, product galleries, banners, hero images, logos, thumbnails, blog images, avatars, and dashboard uploads.

### 5.2 Image Optimization

- Generate modern AVIF and/or WebP variants while retaining a compatible fallback where necessary.
- Generate multiple responsive sizes instead of sending the full-resolution image to every device.
- Use \`srcset\` and \`sizes\`, or the framework’s optimized image component.
- Give images explicit \`width\` and \`height\`, or a stable \`aspect-ratio\`, to prevent layout shifts.
- Use small thumbnails in grids and larger files only in the detailed gallery or zoom view.
- Strip unnecessary metadata while preserving orientation and needed color information.
- Use an image CDN or transformation service only when it improves the current architecture and does not duplicate an existing service.
- Add an automatic optimization pipeline for future user/admin uploads so the problem does not return.

### 5.3 Correct Loading Priority

- Never lazy-load the likely LCP/hero image.
- Load the LCP image eagerly and consider \`fetchpriority="high"\` or a carefully chosen preload.
- Lazy-load below-the-fold images and noncritical iframes.
- Do not preload many images; excessive preloading competes with critical resources.
- Use placeholders only when they are lightweight and do not inflate HTML or JavaScript.

### 5.4 Video and Embedded Content

- Avoid autoplaying heavy video unless essential.
- Use a poster image and load the player/video after interaction when possible.
- Lazy-load below-the-fold YouTube, maps, social embeds, chat widgets, and other iframes.

### 5.5 Fonts

- Remove unused font families, weights, and styles.
- Prefer WOFF2 and subset fonts to required characters.
- Preload only the critical above-the-fold font files.
- Use an appropriate \`font-display\` strategy and stable fallback metrics to reduce invisible text and layout shift.

Verification:

- Compare image transfer size and request count.
- Visually inspect every optimized image at mobile and desktop sizes.
- Confirm alt text, product accuracy, zoom, galleries, and uploads still work.

---

## 6. Phase 2 — Frontend, JavaScript, CSS, and Rendering

### 6.1 Split Code into Chunks

- Use route-level and component-level code splitting.
- Dynamically import heavy editors, maps, charts, galleries, admin tools, and modals that are not needed on first render.
- Keep the number of chunks reasonable; many tiny chunks can create request overhead.
- Verify that the production build actually creates useful chunks.

### 6.2 Remove Unused Dependencies and Code

- Identify unused packages, duplicate libraries, obsolete polyfills, dead components, unused CSS, and duplicate utility code.
- Remove one item at a time and rebuild/test.
- Prefer small native platform features over large dependencies where maintainability remains good.
- Confirm tree-shaking works and imports do not pull entire libraries unnecessarily.

### 6.3 Minify and Compress Production Assets

- Ensure production JavaScript and CSS are minified.
- Ensure source maps follow the project’s security and debugging policy.
- Do not manually minify source files committed for development.

### 6.4 Defer Noncritical Scripts

- Load noncritical scripts with the appropriate \`defer\`, \`async\`, dynamic import, delayed initialization, or interaction-based loading.
- Delay chat, heatmaps, social widgets, recommendation tools, and nonessential analytics when business requirements allow.
- Preserve scripts required for consent, security, checkout, fraud prevention, or core functionality.

### 6.5 Avoid Unnecessary Re-renders

- Profile before using memoization.
- Stabilize component props and callbacks only where profiling identifies waste.
- Avoid duplicated state and broad global-state subscriptions.
- Prevent repeated API fetching caused by effect dependencies or component remounts.
- Virtualize very large interactive lists only when pagination alone is insufficient.

### 6.6 Debounce and Throttle Responsibly

- Debounce search, filtering, autosuggest, resize, and similar high-frequency handlers.
- Choose a delay appropriate to the interaction, commonly around 150–300 ms for search input.
- Cancel stale network requests.
- Never debounce checkout, payment, submit, accessibility, or safety-critical actions in a way that hides user intent.

### 6.7 CSS and DOM

- Remove unused CSS and duplicate styles.
- Keep critical above-the-fold CSS small.
- Avoid excessive DOM depth and huge hidden component trees.
- Prefer transform and opacity for animations.
- Respect reduced-motion preferences.

Verification:

- Compare compressed initial JavaScript/CSS sizes.
- Inspect long tasks, INP diagnostics, and route-level network waterfalls.
- Test navigation, forms, modals, filters, cart, checkout, admin, and keyboard access.

---

## 7. Phase 3 — Lazy Loading and Perceived Performance

### Lazy Loading

- Lazy-load below-the-fold images, iframes, media, routes, and heavy components.
- Do not lazy-load content needed for the first viewport, LCP, primary navigation, or immediate interaction.
- Ensure lazy-loaded content remains crawlable where SEO matters.

### Loading Skeletons

- Use skeletons for content with a genuine asynchronous wait.
- Match the final component’s dimensions so the page does not jump.
- Do not place skeletons over already-fast content.
- Avoid endless skeletons; add timeout, empty, and error states.
- A skeleton improves perceived performance, not server or network speed.

### Additional Perceived-Speed Improvements

- Render meaningful page structure early.
- Stream or progressively reveal content when the stack supports it.
- Preserve previous results during filter transitions when safe.
- Prefetch only highly probable next routes and avoid wasting mobile data.
- Never optimistically show a payment as successful before verified server confirmation.

---

## 8. Phase 4 — CDN, HTTP Caching, Compression, and Payloads

### 8.1 Add or Verify a CDN

- Determine whether hosting already provides a CDN or edge network.
- Serve static images, fonts, JavaScript, and CSS from geographically distributed edge locations.
- Do not place authenticated or dynamic private data into a public cache.
- Purge or version assets correctly after updates.

### 8.2 Browser and CDN Cache Policy

- Use long-lived immutable caching for fingerprinted static assets.
- Use revalidation or short appropriate TTLs for HTML and frequently changing resources.
- Use \`ETag\` or \`Last-Modified\` where appropriate.
- Design explicit invalidation for product data, prices, stock, and content updates.
- Verify cache keys include every dimension that changes the response, such as locale or permitted public query parameters.

### 8.3 Cache API Responses

- Cache only safe, repeatable responses.
- Prefer caching public GET requests with clear TTL and invalidation rules.
- Use stale-while-revalidate where slightly stale public content is acceptable.
- Never publicly cache authenticated profiles, carts, checkout, orders, payment status, admin data, secrets, or webhooks.
- Confirm cache HIT/MISS behavior from response headers and logs.

### 8.4 Server-Side Caching

- Cache expensive rendered pages, fragments, external API results, or computed data where correctness permits.
- Document the cache key, TTL, invalidation trigger, maximum staleness, and fallback behavior.
- Prevent cache stampedes with request coalescing or locking when needed.

### 8.5 Cache Expensive Queries

- First optimize the query and indexes.
- Cache only queries with repeated demand and acceptable staleness.
- Invalidate on relevant writes or use a clearly bounded TTL.
- Do not let query caching return stale price, stock, order, payment, permission, or security data.

### 8.6 Compress API and Text Payloads

- Enable Brotli and/or gzip for HTML, CSS, JavaScript, JSON, XML, SVG, and other compressible text.
- Do not recompress already compressed formats unnecessarily.
- Return only fields needed by the current view.
- Remove duplicate nested data and oversized debug metadata.
- Paginate large payloads.
- Verify \`Content-Encoding\`, \`Vary: Accept-Encoding\`, and actual transferred size.

---

## 9. Phase 5 — API and Backend Optimization

- Parallelize independent server operations while respecting service limits.
- Remove avoidable sequential request waterfalls.
- Add timeouts and safe failure handling for external services.
- Reuse already-fetched data inside one request.
- Batch compatible reads and writes.
- Select only needed database columns.
- Use cursor pagination for large or frequently changing datasets when appropriate.
- Add sensible limits to search and listing endpoints.
- Prevent repeated API calls from rapid UI changes with cancellation, deduplication, and debounce.
- Measure each slow endpoint’s application time, database time, external-service time, and serialized response size.
- Keep serverless functions focused and avoid loading large unused modules.

---

## 10. Phase 6 — Database Performance

Skip this phase when the site has no database.

### 10.1 Eliminate N+1 Queries

- Inspect list pages and loops that fetch related data one record at a time.
- Replace N+1 patterns with joins, eager loading, batched queries, or DataLoader-style batching appropriate to the stack.
- Verify query count for a request before and after.

### 10.2 Index the Database Correctly

- Identify slow queries using database logs and real endpoint traces.
- Use \`EXPLAIN\` and, safely in a suitable environment, \`EXPLAIN ANALYZE\`.
- Index columns frequently used in selective \`WHERE\`, \`JOIN\`, and \`ORDER BY\` operations.
- Consider composite, partial, unique, full-text, or specialized indexes only when the workload supports them.
- Review column order for composite indexes.
- Avoid redundant and unused indexes because they consume storage and slow writes.
- Create large production indexes with the database’s safe online/concurrent method when supported.

### 10.3 Connection Pooling

- Use the database provider’s supported pooler, especially with serverless deployments.
- Set pool sizes based on the database connection limit and application concurrency.
- Do not create a new unbounded pool per request.
- Confirm idle, timeout, retry, and shutdown behavior.
- For managed PostgreSQL/Supabase, use the recommended transaction/session pooler for the actual runtime.

### 10.4 Query and Data Practices

- Paginate large tables and lists.
- Avoid \`SELECT *\` on hot paths.
- Batch inserts/updates where safe.
- Keep planner statistics current.
- Archive or partition only when data scale and query patterns justify it.
- Re-measure after every index or query change.

---

## 11. Phase 7 — Infrastructure and Load Balancing

### CDN and Region

- Place application compute near the database and major user population where possible.
- Avoid unnecessary cross-region application-to-database calls.
- Confirm DNS, TLS, HTTP/2 or HTTP/3, compression, and CDN features supplied by the host.

### Load Balancer

Add or change a load balancer only when:

- The application runs across multiple servers or regions;
- Traffic, availability, health checking, or failover requires it; and
- The hosting platform does not already manage it.

Before adding one, measure current capacity, saturation, latency, and error rate. A load balancer does not fix slow code, oversized images, poor queries, or a slow database.

### Serverless and Autoscaling

- Reduce cold-start dependencies and initialization work.
- Keep application and database regions aligned.
- Use connection pooling.
- Set realistic memory and timeout values.
- Monitor concurrency, execution time, errors, and cost.

---

## 12. Screenshot Checklist — Every Method Accounted For

| Method from source image | Correct implementation rule | Proof required |
|---|---|---|
| Cache API responses | Cache only safe repeatable responses with TTL, key, and invalidation | HIT/MISS headers or logs and stale-data tests |
| Load balancer | Add only for measured scale/availability need; check managed hosting first | Capacity evidence and health/failover test |
| Index the database | Index measured query patterns, not every column | Before/after query plan and timing |
| Compress images | Use modern formats, variants, correct dimensions, and visual QA | Byte reduction and screenshot comparison |
| Loading skeletons | Use for genuine waits with stable dimensions | No layout shift; error and empty states work |
| Cache expensive queries | Optimize first; cache with safe staleness/invalidation | Query timing and invalidation test |
| Eliminate N+1 queries | Join, eager-load, or batch related records | Reduced query count |
| Debounce input handlers | Apply to high-frequency noncritical input | Fewer calls with responsive UX |
| Split code into chunks | Split by route/heavy feature | Smaller initial bundle and working navigation |
| Add CDN | Verify host does not already provide one | Edge cache headers and regional test |
| Server-side caching | Cache render/computation only where correctness permits | Cache behavior and invalidation proof |
| Paginate large lists | Use limit/offset or cursor as appropriate | Bounded payload and correct navigation |
| Lighthouse audit | Run consistent before/after mobile and desktop tests | Median reports |
| Compress API payloads | Brotli/gzip plus smaller JSON shape | Content-Encoding and transferred bytes |
| Avoid unnecessary re-renders | Profile and fix measured render waste | Profiler evidence |
| Minify JS and CSS | Use production build tooling | Minified production artifacts |
| Add lazy loading | Lazy-load below-fold/noncritical content only | Network waterfall and LCP protection |
| Defer noncritical scripts | Delay scripts not needed for initial render | Reduced blocking with integrations intact |
| Remove unused dependencies | Remove incrementally and test | Bundle reduction and passing build/tests |
| Database connection pooling | Use provider-supported bounded pool | Connection metrics under concurrency |

---

## 13. Priority Order

Unless measurements point elsewhere, work in this order:

1. Broken, missing, oversized, or incorrectly loaded images.
2. LCP resource discovery and loading priority.
3. Render-blocking scripts, styles, fonts, and third-party widgets.
4. Initial JavaScript bundle and unused dependencies.
5. Duplicate requests, API waterfalls, and oversized payloads.
6. Safe browser/CDN/server caching and text compression.
7. Large-list pagination and frontend rendering waste.
8. N+1 queries, slow queries, indexes, and pooling.
9. Infrastructure scaling or load balancing only after application bottlenecks are addressed.
10. Loading skeletons and other perceived-performance polish.

---

## 14. Required Before-and-After Report

### Page Measurements

| Route | Device | LCP before | LCP after | INP/TBT before | INP/TBT after | CLS before | CLS after | Transfer before | Transfer after |
|---|---|---:|---:|---:|---:|---:|---:|---:|---:|
| Home | Mobile |  |  |  |  |  |  |  |  |
| Listing | Mobile |  |  |  |  |  |  |  |  |
| Product/content | Mobile |  |  |  |  |  |  |  |  |
| Cart/critical flow | Mobile |  |  |  |  |  |  |  |  |

### Change Log

| Priority | Bottleneck found | Exact change | Files changed | Measured result | Risk/regression test |
|---|---|---|---|---|---|
|  |  |  |  |  |  |

### Final Status

Report:

- Build, type-check, lint, and test results.
- Lighthouse mobile and desktop results.
- Core Web Vitals field data if available.
- Largest remaining bottlenecks.
- Methods skipped and why.
- Any infrastructure or account action the owner must complete.
- Exact production deployment status. Never imply a deployment occurred when it did not.
- Rollback instructions.

---

## 15. Regression Checklist

Confirm all relevant items:

- [ ] Home, navigation, search, filters, pagination, and links work.
- [ ] Product/content images are correct and sharp.
- [ ] Galleries, zoom, upload, crop, and deletion work.
- [ ] Cart quantities, prices, taxes, shipping, discounts, and totals remain correct.
- [ ] Checkout and payment redirects work.
- [ ] Webhooks and verified payment status remain server-controlled.
- [ ] Login, logout, password reset, permissions, and protected routes work.
- [ ] Contact forms and email notifications work when configured.
- [ ] Admin/dashboard functions work.
- [ ] SEO titles, descriptions, canonical tags, structured data, robots rules, sitemap, and crawlability remain correct.
- [ ] Accessibility, keyboard navigation, labels, alt text, focus, and contrast remain correct.
- [ ] Mobile, tablet, and desktop layouts remain correct.
- [ ] Cache invalidation works after content, price, stock, and image updates.
- [ ] No secret or personal data appears in bundles, logs, HTML, or caches.

---

## 16. Stack Adaptation Notes

### React/Vite

- Use dynamic imports and \`React.lazy\` for routes/heavy features.
- Inspect the production bundle; Vite minification alone does not solve oversized dependencies.
- Prevent repeated effects and broad context updates.
- Vite does not automatically create an ecommerce-grade image transformation pipeline.

### Next.js

- Use the framework image component correctly.
- Evaluate server/client component boundaries.
- Use route and data caching only with explicit revalidation rules.
- Avoid converting large server-renderable sections into client JavaScript unnecessarily.

### WordPress/WooCommerce

- Audit themes and plugins before adding another optimization plugin.
- Generate appropriate image sizes and modern formats.
- Use page cache, object cache, database optimization, and CDN according to hosting compatibility.
- Exclude cart, checkout, account, admin, and personalized fragments from public page caching.
- Test WooCommerce sessions, prices, stock, payment callbacks, and emails.

### Vercel/Managed Edge Hosting

- Verify built-in CDN, compression, caching, and routing before adding external layers.
- Use stable asset URLs and correct response headers.
- Keep serverless functions and dependencies lean.
- Align function and database regions and use supported database pooling.

### Supabase/PostgreSQL

- Use the supported pooler for serverless workloads.
- Inspect queries and plans before adding indexes.
- Preserve Row Level Security and authorization.
- Never replace secure database checks with client-side caching.

---

## 17. Final Agent Command

> Act as a senior web performance engineer. Read and follow this SOP fully. Start by inspecting the project and producing the Phase 0 baseline. Then implement the highest-impact, lowest-risk optimizations in measured stages. Apply every relevant item from the source checklist, skip irrelevant items with an explanation, and never optimize blindly. Preserve design, SEO, accessibility, security, data correctness, checkout, payments, authentication, and admin behavior. Test after each stage. Continue automatically through safe and reversible work, but do not deploy to production or perform destructive operations without authorization. Finish with the completed before-and-after tables, exact files changed, tests run, remaining bottlenecks, and rollback instructions.

---

## 18. Primary Reference Material

- Google web.dev — Web Vitals: https://web.dev/articles/vitals
- Google Search documentation — Core Web Vitals: https://developers.google.com/search/docs/appearance/core-web-vitals
- web.dev — Optimize Largest Contentful Paint: https://web.dev/articles/optimize-lcp
- web.dev — Reduce JavaScript payloads with code splitting: https://web.dev/articles/reduce-javascript-payloads-with-code-splitting/
- MDN — Lazy loading: https://developer.mozilla.org/en-US/docs/Web/Performance/Guides/Lazy_loading
- MDN — HTTP caching: https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Caching
- MDN — HTTP compression: https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Compression
- MDN — Multimedia and image performance: https://developer.mozilla.org/en-US/docs/Learn_web_development/Extensions/Performance/Multimedia
- PostgreSQL — Using EXPLAIN: https://www.postgresql.org/docs/current/using-explain.html
- PostgreSQL — CREATE INDEX: https://www.postgresql.org/docs/current/sql-createindex.html

These references establish principles and targets. The correct implementation still depends on the project’s actual stack, measurements, users, and business requirements.
