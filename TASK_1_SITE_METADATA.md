# Task 1: Site Metadata, SEO, Branding & Global Configurations

**Target Website**: [https://ptccollectibles.com](https://ptccollectibles.com)  
**Shopify Internal Domain**: `premier-trading-cards.myshopify.com`  
**Store Name**: PTC Collectibles (Premier Trading Cards)  
**Extraction Date**: 2026-10-19  

---

## 1. Core SEO & Meta Tags

| Attribute | Extracted Value |
| :--- | :--- |
| **Title** | `PTC Collectibles \| Pokémon Cards, Collectibles, & Video Games` |
| **Meta Description** | `PTC Collectibles is your go-to online hobby shop, offering a wide selection of high-quality collectible products from top brands such as Pokémon, Yu-Gi-Oh, Magic: The Gathering, Nintendo, and many more. Whether you're a seasoned collector or just getting started, we have everything you need!` |
| **Canonical URL** | `https://ptccollectibles.com/` |
| **Charset** | `utf-8` |
| **Viewport** | `width=device-width,initial-scale=1` |
| **Favicon** | `https://ptccollectibles.com/cdn/shop/files/ChatGPT_Image_Jun_27_2026_11_16_17_PM_6c3514b9-5acb-4a10-bab7-857036ffc977.png?crop=center&height=32&v=1788580180&width=32` |
| **Theme Color** | Default / `#ffffff` |

---

## 2. OpenGraph & Social Cards

### OpenGraph (Facebook / WhatsApp / Discord / LinkedIn)
```html
<meta property="og:site_name" content="PTC Collectibles">
<meta property="og:url" content="https://ptccollectibles.com/">
<meta property="og:title" content="PTC Collectibles | Pokémon Cards, Collectibles, & Video Games">
<meta property="og:type" content="website">
<meta property="og:description" content="PTC Collectibles is your go-to online hobby shop, offering a wide selection of high-quality collectible products from top brands such as Pokémon, Yu-Gi-Oh, Magic: The Gathering, Nintendo, and many more. Whether you're a seasoned collector or just getting started, we have everything you need!">
<meta property="og:image" content="http://ptccollectibles.com/cdn/shop/files/PTC_Logo_7.png?height=628&pad_color=ffffff&v=1720235845&width=1200">
<meta property="og:image:secure_url" content="https://ptccollectibles.com/cdn/shop/files/PTC_Logo_7.png?height=628&pad_color=ffffff&v=1720235845&width=1200">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="628">
```

### Twitter Cards
```html
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="PTC Collectibles | Pokémon Cards, Collectibles, & Video Games">
<meta name="twitter:description" content="PTC Collectibles is your go-to online hobby shop, offering a wide selection of high-quality collectible products from top brands such as Pokémon, Yu-Gi-Oh, Magic: The Gathering, Nintendo, and many more. Whether you're a seasoned collector or just getting started, we have everything you need!">
```

---

## 3. Structured Data (Schema.org / JSON-LD)

### A. Organization Schema
```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": "https://ptccollectibles.com/#organization",
  "name": "Premier Trading Cards",
  "url": "https://ptccollectibles.com",
  "logo": "https://cdn.shopify.com/s/files/1/0532/0792/4897/files/PTC_Logo_8-min.png?v=1792178022",
  "description": "PTC Collectibles is your go-to online hobby shop, offering a wide selection of high-quality collectible products from top brands such as Pokémon, Yu-Gi-Oh, Magic: The Gathering, Nintendo, and many more. Whether you're a seasoned collector or just getting started, we have everything you need!",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "2072 Westmount Drive",
    "addressLocality": "Oakville",
    "addressRegion": "Ontario",
    "postalCode": "L6M 3P2",
    "addressCountry": "CA"
  },
  "sameAs": [
    "https://premiertradingcards.com",
    "https://www.tiktok.com/@premiertradingcards.com",
    "https://www.youtube.com/@PremierTradingCards",
    "https://www.instagram.com/premiertradingcards"
  ]
}
```

### B. WholesaleStore / Physical Entity Schema
```json
{
  "@context": "https://schema.org",
  "@type": "WholesaleStore",
  "@id": "https://ptccollectibles.com#wholesalestore",
  "name": "PTC Collectibles",
  "url": "https://ptccollectibles.com",
  "telephone": "4168445668",
  "contactPoint": {
    "@type": "ContactPoint",
    "contactType": "customer support",
    "telephone": "4168445668",
    "email": "premierdigitalbusiness@gmail.com"
  },
  "image": "https://cdn.shopify.com/s/files/1/0532/0792/4897/files/PTC_Logo_8-min.png?v=1792178022",
  "openingHoursSpecification": {
    "@type": "OpeningHoursSpecification",
    "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
    "opens": "00:00",
    "closes": "23:59"
  }
}
```

### C. WebSite Search Action Schema
```json
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": "https://ptccollectibles.com#website",
  "name": "PTC Collectibles",
  "alternateName": ["PTC", "PTCCollectibles"],
  "url": "https://ptccollectibles.com",
  "sameAs": [
    "https://www.facebook.com/PTCCollectibles",
    "https://pinterest.com/ptccollectibles",
    "https://www.instagram.com/ptccollectibles",
    "https://www.tiktok.com/@ptccollectibles"
  ],
  "potentialAction": {
    "@type": "SearchAction",
    "target": "https://ptccollectibles.com/search?q={query}",
    "query-input": "required name=query"
  }
}
```

---

## 4. Theme & Design System Tokens

The live site runs **Shopify Dawn 16.1.0** (`2026 PTC THEME - 16.1.0`). Below are the exact CSS design tokens extracted from the live site stylesheet:

### Typography
- **Primary Body Font**: `Assistant, sans-serif` (Weights: `400`, `700`)
- **Heading Font**: `Assistant, sans-serif` (Weights: `400`, `700`)
- **Font Scale**: Body `1.0`, Heading `1.0`

### Color Schemes & CSS Variables
```css
:root,
.color-background-1 {
  --color-background: 255, 255, 255;
  --gradient-background: #ffffff;
  --color-foreground: 18, 18, 18;
  --color-background-contrast: 191, 191, 191;
  --color-shadow: 18, 18, 18;
  --color-button: 18, 18, 18;
  --color-button-text: 255, 255, 255;
  --color-secondary-button: 255, 255, 255;
  --color-secondary-button-text: 18, 18, 18;
  --color-link: 18, 18, 18;
  --color-badge-foreground: 18, 18, 18;
  --color-badge-background: 255, 255, 255;
  --color-badge-border: 18, 18, 18;
}

.color-background-2 {
  --color-background: 243, 243, 243;
  --gradient-background: #f3f3f3;
  --color-foreground: 18, 18, 18;
  --color-button: 18, 18, 18;
  --color-button-text: 243, 243, 243;
}

.color-inverse {
  --color-background: 18, 18, 18;
  --gradient-background: #121212;
  --color-foreground: 255, 255, 255;
  --color-button: 255, 255, 255;
  --color-button-text: 18, 18, 18;
}

.color-accent-2 {
  --color-background: 226, 33, 32; /* PTC Signature Red #E22120 */
  --gradient-background: #e22120;
  --color-foreground: 255, 255, 255;
  --color-button: 255, 255, 255;
  --color-button-text: 226, 33, 32;
}

:root {
  --page-width: 130rem; /* 1300px max container */
  --page-width-margin: 0rem;
  --product-card-image-padding: 0.0rem;
  --product-card-corner-radius: 0.0rem;
  --product-card-text-alignment: left;
  --product-card-shadow-opacity: 0.1;
}
```

---

## 5. Multi-Currency & Locale Settings

- **Original Store Currency**: `CAD` (Canadian Dollar)
- **Replicated Site Base Currency**: **`USD` ($)** (All prices, product cards, detail pages, and checkout cart converted and displayed in USD)
- **Active Locales**:
  - `en` (Default English)
  - `en-us` (US English)
  - `fr` (French)
- **Currency Switcher**: Defaults to `USD ($)`, with support for CAD, EUR, GBP, AUD, JPY.

---

## 6. Integrations & 3rd-Party Scripts Detected

1. **Reviews**: Judge.me (`jdgmSettings`, ratings, stars `#ee8328`, customer reviews widget)
2. **Email & SMS Marketing**: Klaviyo (`https://static.klaviyo.com/onsite/js/XbuPus/klaviyo.js`)
3. **SEO & Speed**: SearchPie (`sb-meta-tags`, `Secomapp-Store`, `tinyseo-seo-speed`)
4. **Payments**: Apple Pay, Shop Pay, PayPal V4, Google Pay, Interac, Visa, Mastercard, Amex
5. **Livestream & App Links**: Whatnot (`whatnot.com/invite/ptccollectibles`), Faire Wholesale (`faire.com/direct/ptccollectibles`), TCGfolio App (`tcgfolioapp.lovable.app`)
