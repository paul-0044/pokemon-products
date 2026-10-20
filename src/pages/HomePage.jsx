import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { dataService } from '../lib/supabase';
import ProductCard from '../components/ProductCard';
import ProductCardSkeleton from '../components/ProductCardSkeleton';
import { ShieldCheck, Truck, Star, Award, ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';

const HERO_SLIDES = [
  {
    id: 1,
    image: '/images/banners/hero_banner_1.webp',
    title: 'THE ULTIMATE POKÉMON DESTINATION',
    subtitle: 'Booster Boxes, Mystery Slabs & Japanese Sets In Stock Now',
    link: '/collections/pokemon-booster-boxes',
    btnText: 'Shop Booster Boxes',
    previewLabel: 'Booster Boxes',
    badge: '30TH CELEBRATION'
  },
  {
    id: 2,
    image: '/images/banners/hero_banner_2.webp',
    title: 'NEWEST ARRIVALS & EXCLUSIVES',
    subtitle: 'From PSA 10 Grails to Sealed Vintage Collections',
    link: '/collections/newest-arrivals',
    btnText: 'Explore New Drops',
    previewLabel: 'New Drops',
    badge: 'FRESH DROPS'
  },
  {
    id: 3,
    image: '/images/banners/hero_banner_3.webp',
    title: 'DELTA REIGN SPECIAL EXPANSION',
    subtitle: 'Legendary Delta Species Booster Boxes & Elite Bundles',
    link: '/collections/pokemon-booster-boxes',
    btnText: 'Shop Delta Reign',
    previewLabel: 'Delta Reign',
    badge: 'FEATURED EXPANSION'
  },
  {
    id: 4,
    image: '/images/banners/hero_banner_4.webp',
    title: 'CERTIFIED PSA 10 MYSTERY SLABS',
    subtitle: 'Guaranteed Gem Mint Grails, Japanese Hits & Vintage Charizards',
    link: '/collections/graded-pokemon-cards',
    btnText: 'Discover Mystery Slabs',
    previewLabel: 'PSA 10 Slabs',
    badge: 'GEM MINT 10'
  }
];

const FEATURED_CATEGORIES = [
  { title: 'Custom Boxes', handle: 'custom-boxes', img: '/images/collections/custom-boxes.png' },
  { title: 'Booster Boxes', handle: 'pokemon-booster-boxes', img: '/images/collections/pokemon-booster-boxes.png' },
  { title: 'Booster Packs', handle: 'pokemon-booster-packs', img: '/images/collections/pokemon-booster-packs.png' },
  { title: 'Graded Cards', handle: 'graded-pokemon-cards', img: '/images/collections/graded-pokemon-cards.png' },
  { title: 'Elite Trainer Boxes', handle: 'pokemonelitetrainerbox', img: '/images/collections/pokemonelitetrainerbox.png' },
  { title: 'Japanese Pokémon', handle: 'japanese-pokemon-tcg', img: '/images/collections/japanese-pokemon-tcg.png' },
  { title: 'One Piece TCG', handle: 'one-piece-tcg', img: '/images/collections/one-piece-tcg.png' },
  { title: 'Single Cards', handle: 'single-cards', img: '/images/collections/single-cards.png' },
  { title: 'Sports Cards', handle: 'sports-cards', img: '/images/collections/sports-cards.png' },
  { title: 'Asian Snacks', handle: 'international-snacks', img: '/images/collections/international-snacks.png' },
  { title: 'Dragon Ball TCG', handle: 'dragon-ball-tcg', img: '/images/collections/dragon-ball-tcg.png' },
  { title: 'Pre-Orders', handle: 'pre-orders', img: '/images/collections/pre-orders.png' }
];

export default function HomePage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [bestSellers, setBestSellers] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [boosterBoxes, setBoosterBoxes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    dataService
      .getProducts()
      .then((products) => {
        setBestSellers(products.slice(0, 8));
        setNewArrivals(products.slice(8, 16));
        const boxes = products.filter(
          (p) =>
            p.title.toLowerCase().includes('booster box') ||
            (p.product_type || '').toLowerCase().includes('booster box')
        );
        setBoosterBoxes(boxes.length > 0 ? boxes.slice(0, 8) : products.slice(16, 24));
        setLoading(false);
      })
      .catch(console.error);
  }, []);

  return (
    <div>
      {/* 1. Hero Slideshow Banner */}
      <section className="hero-section" style={{ position: 'relative', width: '100%', overflow: 'hidden', backgroundColor: '#000' }}>
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
          {HERO_SLIDES.map((slide, idx) => (
            <div
              key={idx}
              style={{
                position: idx === currentSlide ? 'relative' : 'absolute',
                inset: 0,
                opacity: idx === currentSlide ? 1 : 0,
                transition: 'opacity 0.7s ease-in-out',
                width: '100%',
                display: idx === currentSlide ? 'block' : 'none'
              }}
            >
              <img
                src={slide.image}
                alt={slide.title}
                className="hero-banner-img"
                style={{
                  width: '100%',
                  objectFit: 'cover',
                  filter: 'brightness(0.85)'
                }}
              />
              <div
                className="hero-caption-container"
                style={{
                  position: 'absolute',
                  inset: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'flex-start',
                  maxWidth: '1300px',
                  margin: '0 auto',
                  left: 0,
                  right: 0
                }}
              >
                <div
                  className="hero-caption-box"
                  style={{
                    background: 'rgba(0, 0, 0, 0.65)',
                    backdropFilter: 'blur(4px)',
                    color: '#fff'
                  }}
                >
                  {slide.badge && (
                    <span
                      className="badge badge-sale"
                      style={{
                        marginBottom: '0.65rem',
                        display: 'inline-block',
                        letterSpacing: '0.08em',
                        fontSize: '0.75rem',
                        fontWeight: 700
                      }}
                    >
                      {slide.badge}
                    </span>
                  )}
                  <h1 className="hero-title">{slide.title}</h1>
                  <p className="hero-subtitle">{slide.subtitle}</p>
                  <Link to={slide.link} className="btn btn-primary" style={{ gap: '0.5rem' }}>
                    <span>{slide.btnText}</span>
                    <ArrowRight size={18} />
                  </Link>
                </div>
              </div>
            </div>
          ))}

          {/* Slider controls */}
          <button
            onClick={() => setCurrentSlide((prev) => (prev === 0 ? HERO_SLIDES.length - 1 : prev - 1))}
            className="hero-nav-arrow hero-nav-prev"
            aria-label="Previous slide"
          >
            <ChevronLeft size={20} color="#121212" />
          </button>
          <button
            onClick={() => setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length)}
            className="hero-nav-arrow hero-nav-next"
            aria-label="Next slide"
          >
            <ChevronRight size={20} color="#121212" />
          </button>

          {/* Slide Previews Navigation Bar ("let it match like the previews with all on it") */}
          <div
            className="hero-previews-bar"
            style={{
              position: 'absolute',
              bottom: '16px',
              left: '50%',
              transform: 'translateX(-50%)',
              display: 'flex',
              gap: '8px',
              zIndex: 10,
              background: 'rgba(0, 0, 0, 0.65)',
              backdropFilter: 'blur(8px)',
              padding: '6px 12px',
              borderRadius: '30px',
              border: '1px solid rgba(255, 255, 255, 0.18)',
              maxWidth: '92%',
              overflowX: 'auto'
            }}
          >
            {HERO_SLIDES.map((slide, idx) => (
              <button
                key={slide.id}
                onClick={() => setCurrentSlide(idx)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '6px 14px',
                  background: idx === currentSlide ? '#e22120' : 'rgba(255, 255, 255, 0.08)',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '20px',
                  cursor: 'pointer',
                  fontSize: '0.75rem',
                  fontWeight: idx === currentSlide ? 700 : 500,
                  transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                  whiteSpace: 'nowrap'
                }}
                aria-label={`Preview slide ${idx + 1}: ${slide.previewLabel}`}
              >
                <span
                  style={{
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    backgroundColor: idx === currentSlide ? '#ffffff' : 'rgba(255,255,255,0.4)'
                  }}
                />
                <span>{slide.previewLabel}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 2. Value Proposition Trust Bar */}
      <section style={{ backgroundColor: '#f4f4f4', borderBottom: '1px solid #e0e0e0', padding: '1.25rem 0' }}>
        <div className="page-width">
          <div className="value-props-grid">
            <div className="value-prop-item">
              <ShieldCheck size={26} color="#e22120" style={{ flexShrink: 0 }} />
              <div>
                <h4 style={{ fontSize: '0.85rem', fontWeight: 700, margin: 0 }}>100% AUTHENTIC GUARANTEED</h4>
                <p style={{ fontSize: '0.725rem', color: '#666', margin: 0 }}>Factory sealed from official distributors</p>
              </div>
            </div>

            <div className="value-prop-item">
              <Truck size={26} color="#e22120" style={{ flexShrink: 0 }} />
              <div>
                <h4 style={{ fontSize: '0.85rem', fontWeight: 700, margin: 0 }}>FREE SHIPPING OVER $150 USD</h4>
                <p style={{ fontSize: '0.725rem', color: '#666', margin: 0 }}>Tracked dispatch across USA &amp; Canada</p>
              </div>
            </div>

            <div className="value-prop-item">
              <Star size={26} color="#ee8328" style={{ flexShrink: 0 }} />
              <div>
                <h4 style={{ fontSize: '0.85rem', fontWeight: 700, margin: 0 }}>20,000+ ORDERS FULFILLED</h4>
                <p style={{ fontSize: '0.725rem', color: '#666', margin: 0 }}>Rated 4.9 / 5 by collectors worldwide</p>
              </div>
            </div>

            <div className="value-prop-item">
              <Award size={26} color="#e22120" style={{ flexShrink: 0 }} />
              <div>
                <h4 style={{ fontSize: '0.85rem', fontWeight: 700, margin: 0 }}>REWARDS &amp; FREE HOLOS</h4>
                <p style={{ fontSize: '0.725rem', color: '#666', margin: 0 }}>Leave a review, get free holo in order</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Featured Categories Collection Grid */}
      <section style={{ padding: '2.5rem 0' }}>
        <div className="page-width">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '1.25rem' }}>
            <div>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Shop by Collection
              </h2>
              <p style={{ color: '#666', fontSize: '0.85rem' }}>
                Explore Pokémon, One Piece, and collectible card sets.
              </p>
            </div>
            <Link to="/collections" style={{ fontSize: '0.85rem', fontWeight: 700, color: '#e22120', whiteSpace: 'nowrap' }}>
              All Collections →
            </Link>
          </div>

          <div className="collections-grid">
            {FEATURED_CATEGORIES.map((cat, idx) => (
              <Link key={idx} to={`/collections/${cat.handle}`} className="collection-card">
                <div className="collection-card-img-wrapper">
                  <img
                    src={cat.img}
                    alt={cat.title}
                    loading="lazy"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/images/logos/logo_main.png';
                    }}
                  />
                </div>
                <div className="collection-card-title">{cat.title}</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Best Sellers Section */}
      <section style={{ padding: '2.5rem 0', backgroundColor: '#fcfcfc', borderTop: '1px solid #f0f0f0' }}>
        <div className="page-width">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.5rem' }}>
            <div>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, textTransform: 'uppercase' }}>
                Best Sellers
              </h2>
              <p style={{ color: '#666', fontSize: '0.85rem' }}>
                Top-rated and most requested collector products right now.
              </p>
            </div>
            <Link to="/collections/best-sellers" className="btn btn-outline btn-sm">
              See All
            </Link>
          </div>

          <div className="product-grid">
            {loading
              ? [...Array(8)].map((_, i) => <ProductCardSkeleton key={i} />)
              : bestSellers.map((product) => <ProductCard key={product.id} product={product} />)}
          </div>
        </div>
      </section>

      {/* 5. Spotlight Promotional Banner */}
      <section style={{ backgroundColor: '#121212', color: '#ffffff', padding: '3rem 0', margin: '1.5rem 0' }}>
        <div className="page-width">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem', alignItems: 'center' }}>
            <div>
              <span className="badge badge-sale" style={{ marginBottom: '0.75rem' }}>
                HOT PROMOTION
              </span>
              <h2 style={{ fontSize: '1.85rem', fontWeight: 800, lineHeight: 1.2, marginBottom: '0.75rem' }}>
                POKÉMON 30TH CELEBRATIONS &amp; PSA 10 SLABS
              </h2>
              <p style={{ fontSize: '0.925rem', color: '#ccc', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                Expand your collection with guaranteed authentic mystery slabs, Japanese promos, and factory-sealed boxes. Every slab is graded by PSA or CGC with verified barcode.
              </p>
              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                <Link to="/collections/graded-pokemon-cards" className="btn btn-primary btn-sm">
                  Shop Graded Slabs
                </Link>
                <Link to="/collections/custom-boxes" className="btn btn-outline btn-sm" style={{ color: '#fff', borderColor: '#fff' }}>
                  Mystery Boxes
                </Link>
              </div>
            </div>

            <div style={{ textAlign: 'center' }}>
              <img
                src="/images/banners/hero_banner_1.webp"
                alt="Promo Spotlight"
                style={{ borderRadius: '2px', maxWidth: '100%', maxHeight: '300px', objectFit: 'cover', margin: '0 auto', border: '1px solid #333' }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* 6. Newest Arrivals Section */}
      <section style={{ padding: '2.5rem 0' }}>
        <div className="page-width">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.5rem' }}>
            <div>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, textTransform: 'uppercase' }}>
                Newest Arrivals
              </h2>
              <p style={{ color: '#666', fontSize: '0.85rem' }}>
                Fresh restocks and newly released sets just added to the store.
              </p>
            </div>
            <Link to="/collections/newest-arrivals" className="btn btn-outline btn-sm">
              View All
            </Link>
          </div>

          <div className="product-grid">
            {loading
              ? [...Array(8)].map((_, i) => <ProductCardSkeleton key={i} />)
              : newArrivals.map((product) => <ProductCard key={product.id} product={product} />)}
          </div>
        </div>
      </section>

      {/* 7. Pokémon Booster Boxes Section */}
      <section style={{ padding: '2.5rem 0', backgroundColor: '#fcfcfc', borderTop: '1px solid #f0f0f0' }}>
        <div className="page-width">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.5rem' }}>
            <div>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, textTransform: 'uppercase' }}>
                Booster Boxes
              </h2>
              <p style={{ color: '#666', fontSize: '0.85rem' }}>
                Factory sealed booster boxes in English, Japanese, and Chinese.
              </p>
            </div>
            <Link to="/collections/pokemon-booster-boxes" className="btn btn-outline btn-sm">
              Shop Boxes
            </Link>
          </div>

          <div className="product-grid">
            {loading
              ? [...Array(8)].map((_, i) => <ProductCardSkeleton key={i} />)
              : boosterBoxes.map((product) => <ProductCard key={product.id} product={product} />)}
          </div>
        </div>
      </section>

      {/* 8. Judge.me Customer Reviews Section */}
      <section style={{ padding: '3rem 0', backgroundColor: '#edf5f5', borderTop: '1px solid #d8e5e5' }}>
        <div className="page-width">
          <div style={{ textAlign: 'center', maxWidth: '650px', margin: '0 auto 2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '3px', marginBottom: '0.4rem' }}>
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={20} fill="#ee8328" color="#ee8328" />
              ))}
            </div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, margin: '0 0 0.4rem' }}>
              Loved by 20,000+ Collectors
            </h2>
            <p style={{ color: '#555', fontSize: '0.85rem' }}>
              Real feedback from collectors who trust PTC Collectibles for sealed product integrity.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
            {[
              {
                name: 'Alex M.',
                title: 'Cleanest sealed box packaging I have seen',
                text: 'Ordered 2 Japanese booster boxes. Double bubble-wrapped, corner protectors included, arrived in mint condition with verified factory seal. 10/10.',
                date: '2 days ago'
              },
              {
                name: 'David S.',
                title: 'Pulled a Charizard SAR!',
                text: 'Fast shipping to the US. Was a bit hesitant at first, but the packs were 100% untampered and I pulled the chase card on pack 14!',
                date: '1 week ago'
              },
              {
                name: 'Samantha K.',
                title: 'PSA 10 Mystery Slab was legit',
                text: 'Received a beautiful PSA 10 Umbreon slab. Free shipping threshold is great, will definitely be ordering my holiday gifts here.',
                date: '2 weeks ago'
              }
            ].map((rev, i) => (
              <div
                key={i}
                style={{
                  backgroundColor: '#ffffff',
                  padding: '1.25rem',
                  border: '1px solid #d0dede',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <div style={{ display: 'flex', gap: '2px' }}>
                      {[...Array(5)].map((_, starIdx) => (
                        <Star key={starIdx} size={13} fill="#ee8328" color="#ee8328" />
                      ))}
                    </div>
                    <span style={{ fontSize: '0.725rem', color: '#888' }}>{rev.date}</span>
                  </div>

                  <h4 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '0.4rem', color: '#121212' }}>
                    &ldquo;{rev.title}&rdquo;
                  </h4>
                  <p style={{ fontSize: '0.8rem', color: '#555', lineHeight: 1.5, marginBottom: '0.75rem' }}>
                    {rev.text}
                  </p>
                </div>

                <div style={{ borderTop: '1px solid #f0f0f0', paddingTop: '0.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.775rem', fontWeight: 700, color: '#121212' }}>
                    {rev.name} <span style={{ color: '#0d8a43', fontWeight: 600 }}>Verified Buyer</span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Responsive Inline CSS overrides */}
      <style>{`
        .hero-banner-img {
          height: 480px;
        }
        .hero-caption-container {
          padding: 2rem;
        }
        .hero-caption-box {
          max-width: 600px;
          padding: 2rem;
        }
        .hero-title {
          font-size: 2.2rem;
          font-weight: 800;
          text-transform: uppercase;
          margin-bottom: 0.75rem;
          line-height: 1.15;
        }
        .hero-subtitle {
          font-size: 1.05rem;
          margin-bottom: 1.5rem;
          color: #e0e0e0;
        }
        .hero-nav-arrow {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          background: rgba(255,255,255,0.85);
          border: none;
          padding: 0.5rem;
          border-radius: 50%;
          cursor: pointer;
          z-index: 10;
        }
        .hero-nav-prev { left: 0.75rem; }
        .hero-nav-next { right: 0.75rem; }

        .value-props-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1.25rem;
        }
        .value-prop-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          text-align: left;
        }

        @media (max-width: 992px) {
          .value-props-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 1rem;
          }
        }

        @media (max-width: 768px) {
          .hero-banner-img {
            height: 340px;
          }
          .hero-caption-container {
            padding: 1rem;
          }
          .hero-caption-box {
            padding: 1.25rem;
            max-width: 100%;
          }
          .hero-title {
            font-size: 1.35rem;
            margin-bottom: 0.4rem;
          }
          .hero-subtitle {
            font-size: 0.825rem;
            margin-bottom: 1rem;
          }
          .value-props-grid {
            grid-template-columns: 1fr;
            gap: 0.85rem;
          }
        }
      `}</style>
    </div>
  );
}
