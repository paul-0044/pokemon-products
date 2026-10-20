import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useCurrency } from '../context/CurrencyContext';
import { dataService } from '../lib/supabase';
import {
  Search,
  ShoppingBag,
  User,
  X,
  ChevronDown,
  ChevronRight,
  Menu
} from 'lucide-react';

export default function Header() {
  const { cartCount, openCart } = useCart();
  const { formatPrice, currency, setCurrency } = useCurrency();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [allProducts, setAllProducts] = useState([]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [expandedMobileCategory, setExpandedMobileCategory] = useState(null);

  const searchContainerRef = useRef(null);
  const mobileSearchInputRef = useRef(null);

  useEffect(() => {
    dataService.getProducts().then(setAllProducts).catch(console.error);
  }, []);

  // Filter search live with 180ms debounce (SOP Section 6.6)
  useEffect(() => {
    if (!searchQuery.trim() || allProducts.length === 0) {
      setSearchResults([]);
      setShowSearchResults(false);
      return;
    }

    const timer = setTimeout(() => {
      const q = searchQuery.toLowerCase();
      const matches = allProducts
        .filter(
          (p) =>
            p.title.toLowerCase().includes(q) ||
            (p.vendor && p.vendor.toLowerCase().includes(q)) ||
            (p.tags && p.tags.some((t) => t.toLowerCase().includes(q)))
        )
        .slice(0, 6);

      setSearchResults(matches);
      setShowSearchResults(true);
    }, 180);

    return () => clearTimeout(timer);
  }, [searchQuery, allProducts]);

  // Click outside listener for desktop search popup
  useEffect(() => {
    function handleClickOutside(event) {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
        setShowSearchResults(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Focus mobile input when toggled
  useEffect(() => {
    if (isMobileSearchOpen && mobileSearchInputRef.current) {
      mobileSearchInputRef.current.focus();
    }
  }, [isMobileSearchOpen]);

  // Prevent background scroll when mobile drawer is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setShowSearchResults(false);
      setIsMobileSearchOpen(false);
      navigate(`/collections/all?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const navCategories = [
    { label: 'Home', to: '/' },
    {
      label: 'Pokémon',
      to: '/collections/pokemontcg',
      children: [
        { label: 'All Pokémon Cards', to: '/collections/pokemontcg' },
        { label: 'Booster Boxes', to: '/collections/pokemon-booster-boxes' },
        { label: 'Booster Packs', to: '/collections/pokemon-booster-packs' },
        { label: 'Elite Trainer Boxes', to: '/collections/pokemonelitetrainerbox' },
        { label: 'Single Cards', to: '/collections/single-cards' },
        { label: 'Graded Cards (PSA/CGC)', to: '/collections/graded-pokemon-cards' },
        { label: 'Japanese Pokémon TCG', to: '/collections/japanese-pokemon-tcg' },
        { label: 'Korean Pokémon TCG', to: '/collections/korean-pokemon-cards' },
        { label: 'Chinese Pokémon TCG', to: '/collections/chinese-pokemon-tcg' }
      ]
    },
    { label: 'Custom Boxes', to: '/collections/custom-boxes' },
    { label: 'Sealed Product', to: '/collections/sealed-product' },
    { label: 'One Piece TCG', to: '/collections/one-piece-tcg' },
    { label: 'Sports Cards', to: '/collections/sports-cards' },
    { label: 'Yu-Gi-Oh!', to: '/collections/yu-gi-oh-tcg' },
    { label: 'Dragon Ball', to: '/collections/dragon-ball-tcg' },
    { label: 'TCG Accessories', to: '/collections/supplies-premier-trading-cards' },
    { label: 'All Snacks', to: '/collections/international-snacks' },
    { label: 'Best Sellers', to: '/collections/best-sellers' },
    { label: 'Newest Arrivals', to: '/collections/newest-arrivals' },
    { label: 'On Sale', to: '/collections/on-sale' },
    { label: 'Sell Your Cards', to: '/pages/sell-your-cards' }
  ];

  return (
    <header className="site-header">
      <div className="page-width">
        <div className="header-top">
          {/* Mobile hamburger menu toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            style={{
              background: 'none',
              border: 'none',
              padding: '0.4rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              color: '#121212'
            }}
            className="mobile-only-btn"
            aria-label="Open mobile navigation menu"
          >
            <Menu size={24} />
          </button>

          {/* Logo */}
          <Link to="/" className="header-logo" style={{ display: 'flex', alignItems: 'center' }}>
            <img
              src="/images/logos/logo_header.png"
              alt="PTC Collectibles"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = '/images/logos/logo_main.png';
              }}
            />
          </Link>

          {/* Desktop Search Bar */}
          <div className="header-search" ref={searchContainerRef}>
            <form onSubmit={handleSearchSubmit} style={{ position: 'relative' }}>
              <Search className="search-icon" size={18} />
              <input
                type="text"
                placeholder="Search Pokemon cards, booster boxes, slabs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => {
                  if (searchResults.length > 0) setShowSearchResults(true);
                }}
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  style={{
                    position: 'absolute',
                    right: '10px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: '#888'
                  }}
                >
                  <X size={16} />
                </button>
              )}
            </form>

            {/* Desktop Instant search dropdown */}
            {showSearchResults && searchResults.length > 0 && (
              <div
                className="animate-fade-down"
                style={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  right: 0,
                  backgroundColor: '#ffffff',
                  border: '1px solid #ddd',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                  zIndex: 200,
                  marginTop: '4px'
                }}
              >
                <div style={{ padding: '0.6rem 1rem', background: '#f5f5f5', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: '#666' }}>
                  Products ({searchResults.length})
                </div>
                {searchResults.map((product) => {
                  const variant = product.variants?.[0] || {};
                  const img = product.images?.[0]?.src || '/images/logos/logo_main.png';
                  return (
                    <Link
                      key={product.id}
                      to={`/products/${product.handle}`}
                      onClick={() => setShowSearchResults(false)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        padding: '0.65rem 1rem',
                        borderBottom: '1px solid #f0f0f0',
                        color: '#121212'
                      }}
                    >
                      <img
                        src={img}
                        alt={product.title}
                        style={{ width: '42px', height: '42px', objectFit: 'contain' }}
                      />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: '0.85rem', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {product.title}
                        </div>
                        <div style={{ fontSize: '0.8rem', color: '#e22120', fontWeight: 700 }}>
                          {formatPrice(variant.price, variant.price_cad)}
                        </div>
                      </div>
                    </Link>
                  );
                })}
                <div style={{ padding: '0.75rem', textAlign: 'center', background: '#fafafa' }}>
                  <button
                    onClick={handleSearchSubmit}
                    style={{ fontSize: '0.825rem', fontWeight: 700, color: '#e22120', background: 'none', border: 'none' }}
                  >
                    View all results for &quot;{searchQuery}&quot; →
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Action Icons */}
          <div className="header-actions">
            {/* Mobile Search Toggle Icon */}
            <button
              onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)}
              className="header-action-btn mobile-search-toggle"
              aria-label="Toggle search"
            >
              <Search size={22} />
            </button>

            {/* Desktop Help */}
            <Link to="/pages/contact-us" className="header-action-btn desktop-help-btn" title="Customer Support">
              <User size={22} />
              <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Help</span>
            </Link>

            {/* Cart Button */}
            <button
              onClick={openCart}
              className="header-action-btn"
              aria-label="View Cart"
              style={{ background: 'none', border: 'none', cursor: 'pointer' }}
            >
              <ShoppingBag size={22} />
              <span className="cart-text-desktop" style={{ fontSize: '0.85rem', fontWeight: 600 }}>Cart</span>
              {cartCount > 0 && <span className="cart-count-badge">{cartCount}</span>}
            </button>
          </div>
        </div>

        {/* Mobile Expandable Search Bar */}
        {isMobileSearchOpen && (
          <div className="animate-fade-down" style={{ padding: '0.5rem 0 0.85rem', borderTop: '1px solid #f0f0f0' }}>
            <form onSubmit={handleSearchSubmit} style={{ position: 'relative' }}>
              <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#888' }} />
              <input
                ref={mobileSearchInputRef}
                type="text"
                placeholder="Search cards, booster boxes, slabs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem 2.5rem 0.75rem 2.6rem',
                  border: '1px solid #ccc',
                  outline: 'none',
                  fontSize: '16px'
                }}
              />
              <button
                type="button"
                onClick={() => setIsMobileSearchOpen(false)}
                style={{
                  position: 'absolute',
                  right: '10px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  padding: '4px'
                }}
              >
                <X size={18} />
              </button>
            </form>

            {/* Mobile Search Results */}
            {searchResults.length > 0 && (
              <div className="animate-fade-down" style={{ marginTop: '6px', background: '#fff', border: '1px solid #ddd', maxHeight: '300px', overflowY: 'auto' }}>
                {searchResults.map((product) => {
                  const variant = product.variants?.[0] || {};
                  return (
                    <Link
                      key={product.id}
                      to={`/products/${product.handle}`}
                      onClick={() => {
                        setIsMobileSearchOpen(false);
                        setSearchQuery('');
                      }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        padding: '0.6rem 0.75rem',
                        borderBottom: '1px solid #eee'
                      }}
                    >
                      <img
                        src={product.images?.[0]?.src || '/images/logos/logo_main.png'}
                        alt={product.title}
                        style={{ width: '36px', height: '36px', objectFit: 'contain' }}
                      />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: '0.85rem', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {product.title}
                        </div>
                        <div style={{ fontSize: '0.8rem', color: '#e22120', fontWeight: 700 }}>
                          {formatPrice(variant.price, variant.price_cad)}
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Desktop Navigation */}
        <nav className="nav-bar">
          <ul className="nav-menu">
            {navCategories.map((cat, idx) => (
              <li key={idx} className="nav-item">
                <Link to={cat.to} className="nav-link">
                  <span>{cat.label}</span>
                  {cat.children && <ChevronDown size={14} style={{ opacity: 0.7 }} />}
                </Link>

                {cat.children && (
                  <ul className="dropdown-menu">
                    {cat.children.map((sub, sIdx) => (
                      <li key={sIdx} className="dropdown-item">
                        <Link to={sub.to}>{sub.label}</Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Mobile Slide-In Navigation Drawer */}
      <div
        className={`drawer-backdrop ${isMobileMenuOpen ? 'open' : ''}`}
        onClick={() => setIsMobileMenuOpen(false)}
        style={{ zIndex: 1100 }}
      />
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '85%',
          maxWidth: '340px',
          height: '100%',
          backgroundColor: '#ffffff',
          boxShadow: '4px 0 24px rgba(0, 0, 0, 0.25)',
          zIndex: 1101,
          display: 'flex',
          flexDirection: 'column',
          transform: isMobileMenuOpen ? 'translateX(0)' : 'translateX(-100%)',
          transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
          overflowY: 'auto',
          WebkitOverflowScrolling: 'touch'
        }}
      >
        {/* Mobile Drawer Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.25rem 1rem', borderBottom: '1px solid #eee' }}>
          <img
            src="/images/logos/logo_header.png"
            alt="PTC Collectibles"
            style={{ height: '32px', width: 'auto' }}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = '/images/logos/logo_main.png';
            }}
          />
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            style={{ background: 'none', border: 'none', padding: '0.4rem', cursor: 'pointer' }}
            aria-label="Close menu"
          >
            <X size={22} />
          </button>
        </div>

        {/* Mobile Navigation List */}
        <div style={{ flex: 1, padding: '1rem 0', overflowY: 'auto' }}>
          <ul style={{ listStyle: 'none' }}>
            {navCategories.map((cat, idx) => {
              const isExpanded = expandedMobileCategory === idx;
              return (
                <li key={idx} style={{ borderBottom: '1px solid #f4f4f4' }}>
                  {cat.children ? (
                    <div>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '0.85rem 1.25rem',
                          cursor: 'pointer'
                        }}
                        onClick={() => setExpandedMobileCategory(isExpanded ? null : idx)}
                      >
                        <span style={{ fontWeight: 700, fontSize: '0.95rem', color: '#121212' }}>
                          {cat.label}
                        </span>
                        <ChevronDown
                          size={18}
                          style={{
                            transform: isExpanded ? 'rotate(180deg)' : 'none',
                            transition: 'transform 0.2s ease',
                            color: '#666'
                          }}
                        />
                      </div>

                      {/* Accordion children */}
                      {isExpanded && (
                        <div style={{ backgroundColor: '#fcfcfc', borderTop: '1px solid #eee' }}>
                          {cat.children.map((sub, sIdx) => (
                            <Link
                              key={sIdx}
                              to={sub.to}
                              onClick={() => setIsMobileMenuOpen(false)}
                              style={{
                                display: 'block',
                                padding: '0.75rem 1.75rem',
                                fontSize: '0.9rem',
                                color: '#444',
                                borderBottom: '1px solid #f0f0f0'
                              }}
                            >
                              {sub.label}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <Link
                      to={cat.to}
                      onClick={() => setIsMobileMenuOpen(false)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '0.85rem 1.25rem',
                        fontWeight: 700,
                        fontSize: '0.95rem',
                        color: '#121212'
                      }}
                    >
                      <span>{cat.label}</span>
                      <ChevronRight size={16} color="#aaa" />
                    </Link>
                  )}
                </li>
              );
            })}
          </ul>

          {/* Quick links in mobile drawer */}
          <div style={{ padding: '1.5rem 1.25rem', borderTop: '1px solid #eee', marginTop: '1rem' }}>
            <div style={{ fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', color: '#888', marginBottom: '0.75rem' }}>
              Customer Support
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.9rem' }}>
              <Link to="/pages/contact-us" onClick={() => setIsMobileMenuOpen(false)}>Contact Support</Link>
              <Link to="/pages/ptc-collectibles-rewards" onClick={() => setIsMobileMenuOpen(false)}>VIP Rewards</Link>
              <Link to="/policies/shipping-policy" onClick={() => setIsMobileMenuOpen(false)}>Shipping Policy</Link>
            </div>
          </div>
        </div>

        {/* Mobile Drawer Footer with Currency Switcher */}
        <div style={{ padding: '1.25rem', borderTop: '1px solid #eee', backgroundColor: '#fafafa' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#444' }}>Currency:</span>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              style={{
                padding: '0.4rem 0.75rem',
                border: '1px solid #ccc',
                background: '#fff',
                fontWeight: 600,
                fontSize: '0.85rem'
              }}
            >
              <option value="USD">USD ($)</option>
              <option value="CAD">CAD ($)</option>
            </select>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .desktop-help-btn {
            display: none !important;
          }
          .cart-text-desktop {
            display: none !important;
          }
        }
        @media (min-width: 769px) {
          .mobile-only-btn {
            display: none !important;
          }
          .mobile-search-toggle {
            display: none !important;
          }
        }
      `}</style>
    </header>
  );
}
