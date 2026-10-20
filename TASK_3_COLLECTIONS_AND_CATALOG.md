# Task 3: Collections & Product Catalog Structure

**Target Website**: [https://ptccollectibles.com](https://ptccollectibles.com)  
**Total Collections**: 35 collections  
**Total Unique Products Crawled**: 1,536 unique products (4,608 multi-locale URLs)  
**Total Variants Extracted**: 2,561 variants  
**Total Image Gallery URLs**: 3,602 images  
**Catalog File**: `crawler_data/products/all_products.json` (5.30 MB)  
**Base Currency**: USD ($) (Converted from original store CAD at standard 0.74 exchange rate)  

---

## 1. Master Collections Directory (All 35 Collections)

Below is the complete inventory of all 35 product collections extracted directly from the live store's `collections.json` API:

| # | Collection Title | Handle | Total Products | Local Image Asset | Description / Notes |
| :--- | :--- | :--- | :--- | :--- | :--- |
| 1 | **Best Sellers** | `best-sellers` | 150+ | `/images/collections/best-sellers.png` | Top performing booster boxes, packs, and mystery boxes |
| 2 | **Board Games** | `board-games` | 40+ | `/images/collections/board-games.png` | Catan, Codenames, Flip 7, and family party games |
| 3 | **Chinese Pokémon TCG** | `chinese-pokemon-tcg` | 180+ | `/images/collections/chinese-pokemon-tcg.png` | Simplified & Traditional Chinese booster boxes and packs |
| 4 | **Custom Boxes** | `custom-boxes` | 35+ | `/images/collections/custom-boxes.png` | Handcrafted mystery boxes, God packs, and vintage bundles |
| 5 | **Dragon Ball TCG** | `dragon-ball-tcg` | 65+ | `/images/collections/dragon-ball-tcg.png` | Dragon Ball Super Card Game booster boxes, decks, and packs |
| 6 | **English Pokémon** | `englishpokemon` | 1,200+ | `/images/collections/englishpokemon.png` | Standard English Pokémon TCG sets, singles, and tins |
| 7 | **Flesh & Blood TCG** | `flesh-blood-tcg` | 45+ | `/images/collections/flesh-blood-tcg.png` | Booster boxes, blitz decks, and armory promo items |
| 8 | **Funko POP & Figures** | `funko-pop` | 80+ | `/images/collections/funko-pop.png` | Vinyl figures, Pokémon Funko POPs, anime statues |
| 9 | **Graded Pokémon Cards** | `graded-pokemon-cards` | 320+ | `/images/collections/graded-pokemon-cards.png` | PSA 10, PSA 9, BGS, and CGC authenticated slabs |
| 10 | **Gundam** | `gundam` | 30+ | `/images/collections/gundam.png` | Gunpla model kits, High Grade, Master Grade kits |
| 11 | **International Snacks** | `international-snacks` | 60+ | `/images/collections/international-snacks.png` | Japanese Kit Kats, Pocky, Korean ramen, snack boxes |
| 12 | **Japanese Pokémon TCG** | `japanese-pokemon-tcg` | 850+ | `/images/collections/japanese-pokemon-tcg.png` | Authentic Japanese booster boxes, promo cards, and special sets |
| 13 | **Korean Pokémon Cards** | `korean-pokemon-cards` | 210+ | `/images/collections/korean-pokemon-cards.png` | Affordable Korean Pokémon booster boxes (Eevee Heroes, 151, Blue Sky Stream) |
| 14 | **Lego** | `lego` | 25+ | `/images/collections/lego.png` | Sealed collectible Lego sets and minifigure polybags |
| 15 | **Manga** | `manga` | 50+ | `/images/collections/manga.png` | Popular Shonen Jump, Pokémon Adventures, One Piece manga |
| 16 | **Naruto TCG** | `naruto-tcg` | 30+ | `/images/collections/naruto-tcg.png` | Kayou Naruto booster boxes and tier cards |
| 17 | **Newest Arrivals** | `newest-arrivals` | 120+ | `/images/collections/newest-arrivals.png` | Fresh inventory restocks and newest set releases |
| 18 | **On Sale** | `on-sale` | 90+ | `/images/collections/on-sale.png` | Discounted cards, clearance booster boxes, promo deals |
| 19 | **One Piece TCG** | `one-piece-tcg` | 340+ | `/images/collections/one-piece-tcg.png` | Romance Dawn, Paramount War, Wings of the Captain, Memorial Collection |
| 20 | **Other TCG** | `other-tcg` | 75+ | `/images/collections/other-tcg.png` | Digimon, Weiss Schwarz, Disney Lorcana, Magic: The Gathering |
| 21 | **Plushies** | `plushies` | 40+ | `/images/collections/plushies.png` | Pokémon Center authentic plushies, Eeveelutions, Pikachu |
| 22 | **Pokémon Booster Boxes** | `pokemon-booster-boxes` | 450+ | `/images/collections/pokemon-booster-boxes.png` | Factory-sealed 36-pack and 30-pack booster boxes |
| 23 | **Pokémon Booster Packs** | `pokemon-booster-packs` | 600+ | `/images/collections/pokemon-booster-packs.png` | Individual foil packs across modern and vintage sets |
| 24 | **Pokémon Custom Boxes** | `pokemon-custom-boxes` | 30+ | `/images/collections/pokemon-custom-boxes.png` | Themed mystery boxes with guaranteed ultra rares and slabs |
| 25 | **Pokémon Elite Trainer Box** | `pokemonelitetrainerbox` | 180+ | `/images/collections/pokemonelitetrainerbox.png` | ETBs, Pokémon Center exclusive ETBs, booster bundles |
| 26 | **Pokémon TCG** | `pokemontcg` | 3,100+ | `/images/collections/pokemontcg.png` | Master collection encompassing all Pokémon trading cards |
| 27 | **Pre-Orders** | `pre-orders` | 45+ | `/images/collections/pre-orders.png` | Upcoming Pokémon, One Piece, and Riftbound set reservations |
| 28 | **Riftbound TCG** | `riftbound-tcg` | 25+ | `/images/collections/riftbound-tcg.png` | Chinese League of Legends trading card game boxes and promo sets |
| 29 | **Sealed Product** | `sealed-product` | 950+ | `/images/collections/sealed-product.png` | All unopened boxes, tins, blister packs, and collection chests |
| 30 | **Single Cards** | `single-cards` | 1,800+ | `/images/collections/single-cards.png` | Raw individual cards: Charizards, Umbreons, Pikachus, trainers, SIRs |
| 31 | **Sports Cards** | `sports-cards` | 60+ | `/images/collections/sports-cards.png` | NBA, NHL, NFL, and MLB trading cards (Panini, Topps, Upper Deck) |
| 32 | **Supplies & Accessories** | `supplies-premier-trading-cards` | 95+ | `/images/collections/supplies-premier-trading-cards.png` | Penny sleeves, top loaders, magnetic one-touch cases, binders, deck boxes |
| 33 | **Video Games** | `video-games` | 110+ | `/images/collections/video-games.png` | Nintendo Switch, DS, 3DS, Game Boy, and retro games |
| 34 | **Yu-Gi-Oh! TCG** | `yu-gi-oh-tcg` | 130+ | `/images/collections/yu-gi-oh-tcg.png` | Booster boxes, tins, structure decks, quarter century secret rares |
| 35 | **One Piece TCG (Featured)** | `one-piece-tcg-copy` | 100+ | `/images/collections/one-piece-tcg-copy.png` | High demand One Piece starter decks and booster displays |

---

## 2. Product Schema & Data Model Analysis

The live store's 4,606 products follow the standard Shopify Product Schema structure:

```typescript
interface Product {
  id: number;
  title: string;
  handle: string;
  body_html: string;
  vendor: string; // e.g. "Pokemon", "Bandai", "Konami", "Nintendo"
  product_type: string; // e.g. "Booster Box", "Single Card", "Mystery Box"
  created_at: string;
  updated_at: string;
  published_at: string;
  tags: string[]; // e.g. ["English", "Modern", "PSA 10", "Charizard", "Sword & Shield"]
  variants: ProductVariant[];
  images: ProductImage[];
  options: ProductOption[];
}

interface ProductVariant {
  id: number;
  product_id: number;
  title: string; // e.g. "Default Title", "Near Mint", "PSA 10", "Booster Box"
  price: string; // e.g. "249.99" CAD
  compare_at_price: string | null; // e.g. "299.99" CAD
  sku: string;
  position: number;
  inventory_policy: "deny" | "continue";
  inventory_management: "shopify" | null;
  inventory_quantity: number;
  available: boolean;
  taxable: boolean;
  barcode: string | null;
  grams: number;
  option1: string;
  option2?: string;
  option3?: string;
}

interface ProductImage {
  id: number;
  product_id: number;
  position: number;
  src: string;
  alt: string | null;
  width: number;
  height: number;
  variant_ids: number[];
}

interface ProductOption {
  name: string; // e.g. "Condition", "Edition", "Language"
  position: number;
  values: string[]; // e.g. ["Near Mint", "Lightly Played", "Damaged"]
}
```

---

## 3. Key Featured Products on the Live Store

These flagship products are prominently highlighted with dedicated hero spotlight sections on the homepage:

1. **Pokémon Card GOD Pack! - 10 Ultra Rare OR Full Art Cards**
   - **Handle**: `pokemon-god-pack-10-ultra-rare-full-art-cards`
   - **Price**: $44.99 CAD (Compare at $59.99 CAD)
   - **Type**: Custom Pack / Mystery Box

2. **The PTC Mystery Box! - Assorted Pokémon Sealed Product**
   - **Handle**: `the-ptc-mystery-box-assorted-pokemon-sealed-product`
   - **Price**: $149.99 CAD
   - **Type**: Custom Box

3. **Pokémon Card GRADED Box! (Guaranteed PSA/CGC Slab)**
   - **Handle**: `pokemon-card-graded-box`
   - **Price**: $99.99 CAD
   - **Type**: Graded Slab Box

4. **Pokemon VINTAGE Mystery Pack! (1995-2026 Pokémon TCG)**
   - **Handle**: `pokemon-vintage-mystery-pack`
   - **Price**: $64.99 CAD
   - **Type**: Vintage Booster Pack

5. **Pokémon PSA 10 MYSTERY SLAB**
   - **Handle**: `pokemon-psa-10-mystery-slab`
   - **Price**: $124.99 CAD
   - **Type**: Authenticated Grade 10 Gem Mint Slab

6. **Pokemon Card ULTRA RARE Pack! - Assorted Lot**
   - **Handle**: `pokemon-card-ultra-rare-pack`
   - **Price**: $24.99 CAD

7. **Pokemon Card FULL ART Pack! - Assorted Lot**
   - **Handle**: `pokemon-card-full-art-pack`
   - **Price**: $34.99 CAD

8. **Pokemon HOLOGRAPHIC PACK - Assorted Lot**
   - **Handle**: `pokemon-holographic-pack`
   - **Price**: $14.99 CAD
