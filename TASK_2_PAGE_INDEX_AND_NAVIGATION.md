# Task 2: Page Index, Site Map & Navigation Architecture

**Target Website**: [https://ptccollectibles.com](https://ptccollectibles.com)  
**Total Indexed Pages**: 16 custom pages + 5 policies + 5 blog articles + 35 collection pages + 4,606 product pages  

---

## 1. Complete Site Page Directory

### A. Core E-Commerce & Storefront Pages
| Route | Page Type | Status | Key Features |
| :--- | :--- | :--- | :--- |
| `/` | Homepage | Active | Announcement bar, Hero banner, Brand grid, Language grid, 8 featured product spotlights, 10 collection rails, Judge.me reviews |
| `/collections` | Collections Catalog | Active | Master listing of all 35 trading card collections |
| `/collections/:handle` | Collection Detail | Active | Product filter sidebar, sort dropdown, pagination, product grid (24/48 items per page) |
| `/products/:handle` | Product Details Page | Active | Image gallery, variant picker (Condition, Language, Edition), price & compare price, stock status, Judge.me reviews, accordion info |
| `/cart` | Shopping Cart | Active | Cart drawer + full cart page, item count, quantity updater, subtotal calculation, free shipping progress bar |
| `/search` | Search Page | Active | Predictive search, instant results, filters by price and category |
| `/account` | User Account | Active | Login, registration, order history, shipping addresses |

---

### B. Informational & Custom Content Pages
| Path | Page Title | Description & Content Purpose |
| :--- | :--- | :--- |
| `/pages/contact-us` | Contact Us | Customer service inquiries, email form, phone (416-844-5668), email (`premierdigitalbusiness@gmail.com`), Oakville ON address |
| `/pages/sell-your-cards` | Sell Your Cards | Instructions for buying collections/singles, links directly to evaluation Google Form (`https://forms.gle/beubNiAAXvnJmCAM6`) |
| `/pages/ptc-collectibles-rewards` | PTC Rewards | Loyalty points program, discounts, referral incentives |
| `/pages/affiliate` | Affiliate Program | Creator affiliate details, commission structure, partner signup |
| `/pages/collection-bundle` | Collection Bundle | Curated bundle builder for sealed packs and booster boxes |
| `/pages/data-sharing-opt-out` | Data Sharing Opt-Out | CCPA / GDPR privacy compliance opt-out form |

---

### C. Legal & Policy Pages
| Path | Policy Name | Content Summary |
| :--- | :--- | :--- |
| `/policies/refund-policy` | Refund Policy | All sales of trading cards, mystery boxes, and sealed product are final. Defective product guidelines. |
| `/policies/shipping-policy` | Shipping Policy | USA & Canada shipping rates, free shipping over $200 CAD, international shipping rates, free international shipping over $1000 CAD. |
| `/policies/privacy-policy` | Privacy Policy | Personal data collection, Shopify platform processing, cookies, customer rights under Canadian privacy laws (PIPEDA). |
| `/policies/terms-of-service` | Terms of Service | Store usage terms, intellectual property, pricing accuracy, liability disclaimers. |
| `/policies/legal-notice` | Legal Notice | Corporate entity registration, jurisdictional notices, trademark notices (Pokémon, Nintendo, Bandai are trademarks of their respective owners). |

---

### D. Blog & Knowledge Base Pages
| Blog Hub | Article Slug | Title |
| :--- | :--- | :--- |
| `/blogs/pokemon-card-news-support-ptc-collectibles` | `best-pokemon-mystery-boxes-are-they-worth-it` | Best Pokémon Mystery Boxes: Are They Worth It? |
| `/blogs/pokemon-card-news-support-ptc-collectibles` | `how-to-spot-authentic-graded-pokemon-cards` | How to Spot Authentic Graded Pokémon Cards |
| `/blogs/pokemon-card-news-support-ptc-collectibles` | `japanese-vs-english-pokemon-cards-whats-the-difference` | Japanese vs. English Pokémon Cards: What's the Difference? |
| `/blogs/pokemon-card-news-support-ptc-collectibles` | `me05-pitch-black-pokemon-cards-everything-you-need-to-know` | ME05 Pitch Black Pokémon Cards: Everything You Need to Know |
| `/blogs/pokemon-card-news-support-ptc-collectibles` | `where-to-buy-korean-pokemon-cards-in-canada` | Where to Buy Korean Pokémon Cards in Canada |

---

## 2. Header & Top Navigation Structure

### Announcement Bar
The announcement bar displays rotating promotional messages:
1. `🎁5% OFF - CODE "5PERCENT"🎁`
2. `FREE SHIPPING ALL ORDERS $200+ (USA & CANADA)`
3. `We Ship Internationally 🌎`
4. `FREE SHIPPING ORDERS $1000+ (INTERNATIONAL)`
5. `⭐LEAVE A REVIEW, GET FREE HOLO IN YOUR ORDER⭐`
6. `📦20,000+ ORDERS FULFILLED | 4.9 ⭐`

### Header Layout
- **Left**: Mobile menu trigger (hamburger icon) / Desktop Inline Menu
- **Center**: Store Logo (`/images/logos/logo_header.png`)
- **Right**:
  - Currency selector (`CAD $` default with drop-down)
  - Search trigger icon
  - Account icon (`/account`)
  - Cart trigger with counter badge (`/cart` drawer)

### Primary Menu Structure
```
├── Home 🏠 (/)
├── Custom Boxes (/collections/custom-boxes)
├── Sealed Product (/collections/sealed-product)
├── Single Cards (/collections/single-cards)
├── Graded Cards (/collections/graded-pokemon-cards)
├── Pre-Orders (/collections/pre-orders)
├── Pokémon Products
│   ├── Booster Packs (/collections/pokemon-booster-packs)
│   ├── Booster Boxes (/collections/pokemon-booster-boxes)
│   └── Elite Trainer Boxes (/collections/pokemonelitetrainerbox)
├── International TCG
│   ├── Japanese Pokemon TCG (/collections/japanese-pokemon-tcg)
│   ├── Korean Pokemon TCG (/collections/korean-pokemon-cards)
│   └── Chinese Pokemon TCG (/collections/chinese-pokemon-tcg)
├── Other Card Games
│   ├── One Piece TCG (/collections/one-piece-tcg)
│   ├── Yu-Gi-Oh! (/collections/yu-gi-oh-tcg)
│   ├── Dragon Ball TCG (/collections/dragon-ball-tcg)
│   ├── Naruto TCG (/collections/naruto-tcg)
│   ├── Flesh & Blood TCG (/collections/flesh-blood-tcg)
│   ├── Riftbound TCG (/collections/riftbound-tcg)
│   └── Sports Cards (/collections/sports-cards)
├── Collectibles & Hobbies
│   ├── TCG Accessories 💼 (/collections/supplies-premier-trading-cards)
│   ├── Funko POP & Figures 🗿 (/collections/funko-pop)
│   ├── All Video Games (/collections/video-games)
│   ├── All Snacks (/collections/international-snacks)
│   ├── Manga 📕 (/collections/manga)
│   ├── Gundam 🤖 (/collections/gundam)
│   ├── Plushies 🧸 (/collections/plushies)
│   └── Lego 🧱 (/collections/lego)
├── Deals & Quick Links
│   ├── BEST SELLERS 💵 (/collections/best-sellers)
│   ├── NEWEST ARRIVALS ⚡ (/collections/newest-arrivals)
│   ├── ON SALE 🔥 (/collections/on-sale)
│   ├── Sell Your Cards 💰 (https://forms.gle/beubNiAAXvnJmCAM6)
│   ├── LIVESTREAM 🔴 (https://www.whatnot.com/invite/ptccollectibles)
│   ├── Wholesale 🌍 (https://faire.com/direct/ptccollectibles)
│   ├── TCGfolio App 📱 (https://tcgfolioapp.lovable.app)
│   └── Shop ALL 🛒 (/collections)
```

---

## 3. Homepage Section Order (Exact Replica Hierarchy)

1. **Announcement Bar**: Sticky carousel banner with discount code and shipping offers.
2. **Header Bar**: Logo, inline navigation, search, currency, cart drawer.
3. **Hero Slider**: High-resolution banners featuring latest Pokémon sets and promotional announcements.
4. **Collection Carousel: Pokémon Custom Boxes**: Dedicated card sliders for custom box products.
5. **Shop By Brand**: Icon/card grid for Pokémon, One Piece, Yu-Gi-Oh, Dragon Ball, Flesh & Blood, Riftbound, Gundam, Lego.
6. **Shop By Language**: 4-card grid (English, Japanese, Chinese, Korean).
7. **Featured Product Spotlight**: "Pokémon Card GOD Pack! - 10 Ultra Rare OR Full Art Cards" (large display with buy button and gallery).
8. **Featured Collection Grid**: "Pokémon Sealed Product" (4x2 product grid).
9. **Featured Product Spotlight**: "The PTC Mystery Box! - Assorted Pokémon Sealed Product".
10. **Featured Collection Grid**: "Single Cards - Pokémon".
11. **Featured Collection Grid**: "Graded Cards" (PSA, BGS, CGC slabs).
12. **Featured Product Spotlight**: "Pokémon Card GRADED Box!".
13. **Featured Collection Grid**: "Pokémon Booster Packs".
14. **Featured Product Spotlight**: "Pokemon VINTAGE Mystery Pack! (1995-2026 Pokémon TCG)".
15. **Featured Collection Grid**: "One Piece TCG".
16. **Featured Product Spotlight**: "Pokemon Card ULTRA RARE Pack! - Assorted Lot".
17. **Featured Collection Grid**: "Japanese Pokémon TCG".
18. **Featured Product Spotlight**: "Pokemon Card FULL ART Pack! - Assorted Lot".
19. **Featured Collection Grid**: "Chinese Pokémon TCG".
20. **Featured Product Spotlight**: "Pokémon PSA 10 MYSTERY SLAB".
21. **Featured Collection Grid**: "Korean Pokemon TCG".
22. **Featured Product Spotlight**: "Pokemon HOLOGRAPHIC PACK - Assorted Lot".
23. **Featured Collection Grid**: "Custom Pokémon Boxes 🎁".
24. **Social Proof & Reviews**: "Let customers speak for us" (Judge.me 4.9/5 star ratings carousel).
25. **Footer**:
    - **Col 1: Our Mission**: Hobby shop commitment, 100% authenticity guarantee.
    - **Col 2: Freebies**: Leave a review promotion and holo card reward.
    - **Col 3: Quick Links & Policies**: Refund, Shipping, Privacy, Terms, Contact Us.
    - **Col 4: Newsletter**: "Subscribe to our emails for 15% OFF!" with email input form.
    - **Bottom Bar**: Payment badges (Visa, Mastercard, Amex, Apple Pay, Google Pay, Shop Pay, PayPal, Interac) + Copyright Notice.
