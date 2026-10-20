import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { dataService } from '../lib/supabase';
import ProductCard from '../components/ProductCard';
import ProductCardSkeleton from '../components/ProductCardSkeleton';
import { Filter, SlidersHorizontal, ChevronRight, X, ArrowUpDown } from 'lucide-react';

export default function CollectionsPage() {
  const { handle } = useParams();
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('q') || '';

  const [collections, setCollections] = useState([]);
  const [currentCollection, setCurrentCollection] = useState(null);
  const [collectionMap, setCollectionMap] = useState({});
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters & Sorting state
  const [sortBy, setSortBy] = useState('featured');
  const [priceMax, setPriceMax] = useState(1000);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const itemsPerPage = 24;

  useEffect(() => {
    window.scrollTo(0, 0);
    setCurrentPage(1);

    Promise.all([
      dataService.getCollections(),
      dataService.getProducts(),
      dataService.getCollectionProductsMap()
    ])
      .then(([cols, prods, colMap]) => {
        setCollections(cols);
        setCollectionMap(colMap || {});

        if (handle && handle !== 'all') {
          const found = cols.find((c) => c.handle === handle);
          setCurrentCollection(
            found || { title: handle.replace(/-/g, ' ').toUpperCase(), handle }
          );
        } else {
          setCurrentCollection(null);
        }

        setProducts(prods);
        setLoading(false);
      })
      .catch(console.error);
  }, [handle]);

  // Lock body scroll when mobile filter is open
  useEffect(() => {
    if (isMobileFilterOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileFilterOpen]);

  // Filter products by collection map, product tags, or search query
  const filteredProducts = useMemo(() => {
    let list = [...products];

    // 1. Search Query filter
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          (p.vendor && p.vendor.toLowerCase().includes(q)) ||
          (p.tags && p.tags.some((t) => t.toLowerCase().includes(q)))
      );
    }
    // 2. Collection filter
    else if (handle && handle !== 'all') {
      const h = handle.toLowerCase();
      const mappedHandles = collectionMap[h] || [];

      if (mappedHandles.length > 0) {
        // Authoritative mapping from Shopify
        const mappedSet = new Set(mappedHandles);
        list = list.filter((p) => mappedSet.has(p.handle) || mappedSet.has(p.id));
      } else {
        // In-memory collections tag or semantic fallback
        list = list.filter((p) => {
          if (p.collections && p.collections.includes(h)) return true;

          const titleLower = p.title.toLowerCase();
          const typeLower = (p.product_type || '').toLowerCase();
          const tagsLower = (p.tags || []).map((t) => t.toLowerCase());

          if (h === 'best-sellers') return true;
          if (h === 'newest-arrivals') return true;
          if (h === 'on-sale')
            return p.variants?.some(
              (v) => v.compare_at_price && parseFloat(v.compare_at_price) > parseFloat(v.price)
            );
          if (h === 'pre-orders') return titleLower.includes('pre-order') || tagsLower.includes('pre-order');
          if (h === 'custom-boxes' || h === 'pokemon-custom-boxes')
            return titleLower.includes('box') || typeLower.includes('box');
          if (h === 'sealed-product')
            return titleLower.includes('booster') || titleLower.includes('box') || titleLower.includes('pack');
          if (h === 'single-cards')
            return titleLower.includes('psa') || typeLower.includes('single') || tagsLower.includes('single');
          if (h === 'graded-pokemon-cards')
            return titleLower.includes('psa') || titleLower.includes('cgc') || titleLower.includes('slab') || titleLower.includes('graded');
          if (h === 'pokemon-booster-boxes') return titleLower.includes('booster box');
          if (h === 'pokemon-booster-packs') return titleLower.includes('booster pack');
          if (h === 'pokemonelitetrainerbox')
            return titleLower.includes('elite trainer') || titleLower.includes('etb');
          if (h === 'japanese-pokemon-tcg')
            return titleLower.includes('japanese') || tagsLower.includes('japanese');
          if (h === 'korean-pokemon-cards')
            return titleLower.includes('korean') || tagsLower.includes('korean');
          if (h === 'chinese-pokemon-tcg')
            return titleLower.includes('chinese') || tagsLower.includes('chinese');
          if (h === 'one-piece-tcg' || h === 'one-piece-tcg-copy')
            return titleLower.includes('one piece') || tagsLower.includes('one piece');
          if (h === 'dragon-ball-tcg')
            return titleLower.includes('dragon ball') || tagsLower.includes('dragon ball');
          if (h === 'yu-gi-oh-tcg')
            return titleLower.includes('yu-gi-oh') || tagsLower.includes('yu-gi-oh');
          if (h === 'sports-cards')
            return titleLower.includes('sports') || typeLower.includes('sports') || tagsLower.includes('sports');
          if (h === 'international-snacks')
            return titleLower.includes('snack') || typeLower.includes('snack') || titleLower.includes('chips') || titleLower.includes('soda');
          if (h === 'board-games') return titleLower.includes('game') || typeLower.includes('board game');
          if (h === 'funko-pop') return titleLower.includes('funko') || titleLower.includes('pop') || titleLower.includes('figure');
          if (h === 'manga') return titleLower.includes('manga');
          if (h === 'gundam') return titleLower.includes('gundam');
          if (h === 'plushies') return titleLower.includes('plush');
          if (h === 'lego') return titleLower.includes('lego');

          return titleLower.includes(h.replace(/-/g, ' '));
        });
      }
    }

    // In-Stock filter
    if (inStockOnly) {
      list = list.filter((p) => p.variants?.some((v) => v.available));
    }

    // Price Max filter (in USD)
    list = list.filter((p) => {
      const price = parseFloat(p.variants?.[0]?.price || p.variants?.[0]?.price_usd || 0);
      return price <= priceMax;
    });

    // Sort
    if (sortBy === 'price-low') {
      list.sort((a, b) => parseFloat(a.variants?.[0]?.price || 0) - parseFloat(b.variants?.[0]?.price || 0));
    } else if (sortBy === 'price-high') {
      list.sort((a, b) => parseFloat(b.variants?.[0]?.price || 0) - parseFloat(a.variants?.[0]?.price || 0));
    } else if (sortBy === 'title-asc') {
      list.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortBy === 'title-desc') {
      list.sort((a, b) => b.title.localeCompare(a.title));
    }

    return list;
  }, [products, handle, searchQuery, collectionMap, inStockOnly, priceMax, sortBy]);

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const displayedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // If user visits /collections without handle, show 35 collections directory
  if (!handle && !searchQuery) {
    return (
      <div className="page-width animate-fade-down" style={{ padding: '2.5rem 1rem 4rem' }}>
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '1.85rem', fontWeight: 800, textTransform: 'uppercase' }}>
            All Collections
          </h1>
          <p style={{ color: '#666', fontSize: '0.9rem' }}>
            Explore all {collections.length} categories and specialty trading card lines.
          </p>
        </div>

        <div className="collections-grid">
          {collections.map((col) => {
            const localImg = `/images/collections/${col.handle}.png`;
            return (
              <Link key={col.id} to={`/collections/${col.handle}`} className="collection-card">
                <div className="collection-card-img-wrapper">
                  <img
                    src={localImg}
                    alt={col.title}
                    loading="lazy"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = col.image?.src || '/images/logos/logo_main.png';
                    }}
                  />
                </div>
                <div className="collection-card-title">
                  {col.title}
                  {col.products_count > 0 && (
                    <span style={{ display: 'block', fontSize: '0.725rem', color: '#888', fontWeight: 400, marginTop: '2px' }}>
                      {col.products_count} Products
                    </span>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="page-width animate-fade-down" style={{ padding: '1.75rem 0.85rem 4rem' }}>
      {/* Breadcrumb */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', color: '#666', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
        <Link to="/" style={{ color: '#121212' }}>Home</Link>
        <ChevronRight size={13} />
        <Link to="/collections" style={{ color: '#121212' }}>Collections</Link>
        <ChevronRight size={13} />
        <span style={{ color: '#e22120', fontWeight: 600 }}>
          {searchQuery ? `Search: "${searchQuery}"` : (currentCollection?.title || 'Catalog')}
        </span>
      </div>

      {/* Title Header */}
      <div style={{ marginBottom: '1.5rem', borderBottom: '1px solid #eee', paddingBottom: '1rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '0.35rem' }}>
          {searchQuery ? `Results for "${searchQuery}"` : (currentCollection?.title || 'Collection')}
        </h1>
        {currentCollection?.description && (
          <div
            style={{ color: '#555', fontSize: '0.875rem', maxWidth: '800px', lineHeight: 1.5 }}
            dangerouslySetInnerHTML={{ __html: currentCollection.description }}
          />
        )}
      </div>

      {/* Desktop Filter Toolbar */}
      <div className="desktop-filter-toolbar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', padding: '0.85rem 1rem', backgroundColor: '#fafafa', border: '1px solid #e5e5e5', marginBottom: '1.75rem' }}>
        {/* Filter controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 700, fontSize: '0.825rem' }}>
            <SlidersHorizontal size={15} />
            <span>FILTERS</span>
          </div>

          <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.825rem', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={inStockOnly}
              onChange={(e) => setInStockOnly(e.target.checked)}
            />
            <span>In stock only</span>
          </label>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.825rem' }}>
            <span>Max:</span>
            <input
              type="range"
              min="10"
              max="2000"
              step="10"
              value={priceMax}
              onChange={(e) => setPriceMax(Number(e.target.value))}
            />
            <span style={{ fontWeight: 700, color: '#e22120' }}>${priceMax} USD</span>
          </div>
        </div>

        {/* Sort and Count */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span style={{ fontSize: '0.825rem', color: '#666' }}>
            <strong>{filteredProducts.length}</strong> products
          </span>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span style={{ fontSize: '0.825rem', color: '#555' }}>Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              style={{ padding: '0.35rem 0.65rem', border: '1px solid #ccc', background: '#fff', fontSize: '0.825rem', cursor: 'pointer' }}
            >
              <option value="featured">Featured</option>
              <option value="price-low">Price, low to high</option>
              <option value="price-high">Price, high to low</option>
              <option value="title-asc">Alphabetically, A-Z</option>
              <option value="title-desc">Alphabetically, Z-A</option>
            </select>
          </div>
        </div>
      </div>

      {/* Mobile Filter & Sort Button Bar */}
      <div className="mobile-filter-bar" style={{ display: 'none', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', background: '#fafafa', border: '1px solid #e0e0e0', marginBottom: '1.25rem' }}>
        <button
          onClick={() => setIsMobileFilterOpen(true)}
          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontWeight: 700, fontSize: '0.85rem', color: '#121212', background: 'none', border: 'none' }}
        >
          <SlidersHorizontal size={16} />
          <span>Filter &amp; Sort</span>
        </button>

        <span style={{ fontSize: '0.8rem', color: '#666' }}>
          <strong>{filteredProducts.length}</strong> products
        </span>
      </div>

      {/* Mobile Filter Bottom Sheet / Modal */}
      {isMobileFilterOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1200 }} onClick={() => setIsMobileFilterOpen(false)}>
          <div
            style={{
              position: 'fixed',
              bottom: 0,
              left: 0,
              right: 0,
              background: '#ffffff',
              borderTopLeftRadius: '12px',
              borderTopRightRadius: '12px',
              padding: '1.5rem',
              maxHeight: '80vh',
              overflowY: 'auto',
              boxShadow: '0 -4px 24px rgba(0,0,0,0.2)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid #eee', paddingBottom: '0.75rem' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0 }}>Filter &amp; Sort</h3>
              <button onClick={() => setIsMobileFilterOpen(false)} style={{ background: 'none', border: 'none', padding: '4px' }}>
                <X size={22} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div>
                <label style={{ display: 'block', fontWeight: 700, fontSize: '0.85rem', marginBottom: '0.5rem' }}>Sort By</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  style={{ width: '100%', padding: '0.65rem', border: '1px solid #ccc', fontSize: '16px' }}
                >
                  <option value="featured">Featured</option>
                  <option value="price-low">Price, low to high</option>
                  <option value="price-high">Price, high to low</option>
                  <option value="title-asc">Alphabetically, A-Z</option>
                  <option value="title-desc">Alphabetically, Z-A</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontWeight: 700, fontSize: '0.85rem', marginBottom: '0.5rem' }}>
                  Max Price: <strong style={{ color: '#e22120' }}>${priceMax} USD</strong>
                </label>
                <input
                  type="range"
                  min="10"
                  max="2000"
                  step="10"
                  value={priceMax}
                  onChange={(e) => setPriceMax(Number(e.target.value))}
                  style={{ width: '100%' }}
                />
              </div>

              <div>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.95rem', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={inStockOnly}
                    onChange={(e) => setInStockOnly(e.target.checked)}
                    style={{ width: '18px', height: '18px' }}
                  />
                  <span>In stock only</span>
                </label>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
                <button
                  onClick={() => {
                    setPriceMax(2000);
                    setInStockOnly(false);
                    setSortBy('featured');
                  }}
                  className="btn btn-outline"
                  style={{ flex: 1 }}
                >
                  Reset
                </button>
                <button
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="btn btn-primary"
                  style={{ flex: 1 }}
                >
                  Apply Filters ({filteredProducts.length})
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Products Grid */}
      {loading ? (
        <div className="product-grid">
          {[...Array(12)].map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      ) : displayedProducts.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem 1rem', background: '#fafafa', border: '1px solid #eee' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem' }}>
            No products match these filters
          </h3>
          <p style={{ color: '#666', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
            Try adjusting your price threshold or clearing filters.
          </p>
          <button
            onClick={() => {
              setPriceMax(2000);
              setInStockOnly(false);
            }}
            className="btn btn-primary btn-sm"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <>
          <div className="product-grid">
            {displayedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div style={{ display: 'flex', justifyContent: 'center', gap: '0.35rem', marginTop: '3rem', flexWrap: 'wrap' }}>
              <button
                disabled={currentPage === 1}
                onClick={() => {
                  setCurrentPage((prev) => Math.max(1, prev - 1));
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="btn btn-outline btn-sm"
                style={{ opacity: currentPage === 1 ? 0.4 : 1 }}
              >
                Prev
              </button>
              {[...Array(totalPages)].map((_, i) => {
                const pageNum = i + 1;
                // On mobile, show subset of page numbers to prevent wrapping
                if (totalPages > 6 && Math.abs(currentPage - pageNum) > 2 && pageNum !== 1 && pageNum !== totalPages) {
                  return null;
                }
                return (
                  <button
                    key={pageNum}
                    onClick={() => {
                      setCurrentPage(pageNum);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className={`btn btn-sm ${currentPage === pageNum ? 'btn-primary' : 'btn-outline'}`}
                    style={{ minWidth: '36px', padding: '0.35rem 0.5rem' }}
                  >
                    {pageNum}
                  </button>
                );
              })}
              <button
                disabled={currentPage === totalPages}
                onClick={() => {
                  setCurrentPage((prev) => Math.min(totalPages, prev + 1));
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="btn btn-outline btn-sm"
                style={{ opacity: currentPage === totalPages ? 0.4 : 1 }}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}

      <style>{`
        @media (max-width: 768px) {
          .desktop-filter-toolbar {
            display: none !important;
          }
          .mobile-filter-bar {
            display: flex !important;
          }
        }
      `}</style>
    </div>
  );
}
