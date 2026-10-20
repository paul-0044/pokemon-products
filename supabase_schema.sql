-- ============================================================================
-- PTC COLLECTIBLES - SUPABASE POSTGRESQL SCHEMA
-- ============================================================================

-- 1. COLLECTIONS TABLE
CREATE TABLE IF NOT EXISTS collections (
  id BIGINT PRIMARY KEY,
  title TEXT NOT NULL,
  handle TEXT UNIQUE NOT NULL,
  description TEXT,
  image_url TEXT,
  products_count INTEGER DEFAULT 0,
  published_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. PRODUCTS TABLE
CREATE TABLE IF NOT EXISTS products (
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
CREATE TABLE IF NOT EXISTS product_variants (
  id BIGINT PRIMARY KEY,
  product_id BIGINT REFERENCES products(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  price NUMERIC(10, 2) NOT NULL,
  price_usd NUMERIC(10, 2) NOT NULL,
  price_cad NUMERIC(10, 2),
  compare_at_price NUMERIC(10, 2),
  compare_at_price_usd NUMERIC(10, 2),
  compare_at_price_cad NUMERIC(10, 2),
  sku TEXT,
  available BOOLEAN DEFAULT true,
  position INTEGER DEFAULT 1,
  grams INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. PRODUCT IMAGES TABLE
CREATE TABLE IF NOT EXISTS product_images (
  id BIGINT PRIMARY KEY,
  product_id BIGINT REFERENCES products(id) ON DELETE CASCADE,
  src TEXT NOT NULL,
  position INTEGER DEFAULT 1,
  width INTEGER,
  height INTEGER,
  created_at TIMESTAMPTZ
);

-- 5. PAGES TABLE
CREATE TABLE IF NOT EXISTS pages (
  id SERIAL PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  h1 TEXT,
  meta_description TEXT,
  body_html TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. POLICIES TABLE
CREATE TABLE IF NOT EXISTS policies (
  id SERIAL PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  h1 TEXT,
  content_html TEXT NOT NULL,
  content_text TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. REVIEWS TABLE (Judge.me Parity)
CREATE TABLE IF NOT EXISTS reviews (
  id SERIAL PRIMARY KEY,
  product_id BIGINT REFERENCES products(id) ON DELETE CASCADE,
  reviewer_name TEXT NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  title TEXT,
  body TEXT NOT NULL,
  verified_buyer BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Enable Row Level Security (RLS) & Read Policies for Public
ALTER TABLE collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE policies ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public Read Collections" ON collections FOR SELECT USING (true);
CREATE POLICY "Public Read Products" ON products FOR SELECT USING (true);
CREATE POLICY "Public Read Product Variants" ON product_variants FOR SELECT USING (true);
CREATE POLICY "Public Read Product Images" ON product_images FOR SELECT USING (true);
CREATE POLICY "Public Read Pages" ON pages FOR SELECT USING (true);
CREATE POLICY "Public Read Policies" ON policies FOR SELECT USING (true);
CREATE POLICY "Public Read Reviews" ON reviews FOR SELECT USING (true);
