# Task 5: Exact Replica Architecture & Implementation Blueprint

**Target Website**: [https://ptccollectibles.com](https://ptccollectibles.com)  
**Specified Tech Stack**: React with Vite (Front End) + Supabase (Back End)  
**Status**: Discovery, indexing, and asset harvesting COMPLETE. Ready for implementation.  

---

## 1. Architecture Overview

To achieve an **exact replica** with 1:1 structural, visual, and behavioral fidelity:
- **Frontend**: React + Vite + React Router + CSS Design System mirroring Shopify Dawn 16.1.0 (`2026 PTC THEME - 16.1.0`).
- **Styling**: Pre-configured CSS variables matching PTC Collectibles color schemes (`#ffffff`, `#f3f3f3`, `#121212`, `#e22120` Red), typography (`Assistant`), and button radius.
- **Currency**: **USD ($)** as the primary store currency across all product cards, spotlights, detail views, and checkout carts.
- **Backend & Database**: Supabase PostgreSQL database holding all 35 collections, 1,536 unique products, 2,561 variants, images, custom pages, policies, and blog articles.
- **Client Supabase SDK**: Configured via `.env` (`VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`), with fallback offline crawled JSON dataset ready immediately until the user provides keys.

---

## 2. Supabase SQL Database Schema (Ready to Execute)

```sql
-- 1. COLLECTIONS TABLE
CREATE TABLE collections (
  id BIGINT PRIMARY KEY,
  title TEXT NOT NULL,
  handle TEXT UNIQUE NOT NULL,
  description TEXT,
  image_url TEXT,
  published_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. PRODUCTS TABLE
CREATE TABLE products (
  id BIGINT PRIMARY KEY,
  title TEXT NOT NULL,
  handle TEXT UNIQUE NOT NULL,
  body_html TEXT,
  vendor TEXT,
  product_type TEXT,
  tags TEXT[],
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  published_at TIMESTAMPTZ
);

-- 3. PRODUCT VARIANTS TABLE
CREATE TABLE product_variants (
  id BIGINT PRIMARY KEY,
  product_id BIGINT REFERENCES products(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  price NUMERIC(10, 2) NOT NULL,
  compare_at_price NUMERIC(10, 2),
  sku TEXT,
  inventory_quantity INT DEFAULT 1,
  available BOOLEAN DEFAULT TRUE,
  option1 TEXT,
  option2 TEXT,
  option3 TEXT
);

-- 4. PRODUCT IMAGES TABLE
CREATE TABLE product_images (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  product_id BIGINT REFERENCES products(id) ON DELETE CASCADE,
  src TEXT NOT NULL,
  alt TEXT,
  position INT DEFAULT 1
);

-- 5. PAGES TABLE
CREATE TABLE pages (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  body_html TEXT NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. POLICIES TABLE
CREATE TABLE policies (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  body_html TEXT NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. BLOG ARTICLES TABLE
CREATE TABLE articles (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  author TEXT DEFAULT 'PTC Collectibles',
  published_at TIMESTAMPTZ DEFAULT NOW(),
  body_html TEXT NOT NULL,
  image_url TEXT
);
```

---

## 3. Frontend Component Hierarchy (Exact 1:1 Layout)

```
src/
├── components/
│   ├── layout/
│   │   ├── AnnouncementBar.jsx      (Rotating 6 announcements + code "5PERCENT")
│   │   ├── Header.jsx              (Logo, currency selector, search, account, cart drawer)
│   │   ├── MegaMenu.jsx            (Desktop dropdown menu with 38 categories)
│   │   ├── MobileDrawer.jsx        (Mobile slide-over navigation)
│   │   ├── Footer.jsx              (4-column footer, newsletter 15% OFF, payment icons)
│   │   └── CartDrawer.jsx          (Slide-over cart with free shipping bar)
│   ├── home/
│   │   ├── HeroSlider.jsx          (Full-width banner slider with CTA)
│   │   ├── BrandGrid.jsx           (Shop By Brand grid: Pokemon, One Piece, etc.)
│   │   ├── LanguageGrid.jsx        (Shop By Language: EN, JA, CN, KR)
│   │   ├── FeaturedSpotlight.jsx   (Flagship spotlight blocks: God Pack, Mystery Box, Graded Slab)
│   │   ├── CollectionCarousel.jsx  (Horizontal scrolling product rail)
│   │   └── ReviewsWidget.jsx       (Judge.me review testimonials & 4.9 star badge)
│   └── product/
│       ├── ProductCard.jsx         (Image, badge, title, price, compare price, quick buy)
│       ├── ProductGallery.jsx      (Multi-angle thumbnails & main zoom preview)
│       └── VariantSelector.jsx     (Condition / Edition / Language pills)
├── pages/
│   ├── HomePage.jsx                (Full 25-section exact replica layout)
│   ├── CollectionPage.jsx          (Grid, filter by price/brand, sort dropdown)
│   ├── ProductDetailPage.jsx       (Specs, variant selection, reviews, description)
│   ├── CartPage.jsx                (Full-page cart view)
│   ├── CustomPage.jsx              (Contact Us, Rewards, Affiliate, Sell Your Cards)
│   ├── PolicyPage.jsx              (Refund, Shipping, Privacy, Terms)
│   └── BlogArticlePage.jsx         (Article view with sidebar recommendations)
├── lib/
│   └── supabase.js                 (Supabase client initialization + local JSON fallback)
├── assets/                         (Local CSS tokens, SVGs, icons)
├── App.jsx                         (Router configuration)
└── main.jsx                        (React entry point)
```

---

## 4. Implementation Readiness & Next Steps

All foundational research, page indexing, catalog crawling, and asset downloading are complete:
- [x] **Metadata & SEO Extracted**: [TASK_1_SITE_METADATA.md](file:///c:/Users/ngole/pokemon%20products/TASK_1_SITE_METADATA.md)
- [x] **All Pages & Navigation Indexed**: [TASK_2_PAGE_INDEX_AND_NAVIGATION.md](file:///c:/Users/ngole/pokemon%20products/TASK_2_PAGE_INDEX_AND_NAVIGATION.md)
- [x] **All Collections & Products Cataloged**: [TASK_3_COLLECTIONS_AND_CATALOG.md](file:///c:/Users/ngole/pokemon%20products/TASK_3_COLLECTIONS_AND_CATALOG.md)
- [x] **Images Grepped & Downloaded Locally**: [TASK_4_IMAGE_AND_ASSET_INVENTORY.md](file:///c:/Users/ngole/pokemon%20products/TASK_4_IMAGE_AND_ASSET_INVENTORY.md)
- [x] **Exact Replica Blueprint Prepared**: [TASK_5_EXACT_REPLICA_PLAN.md](file:///c:/Users/ngole/pokemon%20products/TASK_5_EXACT_REPLICA_PLAN.md)

### Required Action from You
Whenever you are ready to proceed with building the site, confirm your approval and I will initialize the React + Vite application, assemble the exact UI components with the downloaded assets, and connect the data layer. You can send the Supabase credentials whenever available.
