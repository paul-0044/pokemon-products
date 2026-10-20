import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { dataService } from '../lib/supabase';
import { useCart } from '../context/CartContext';
import { useCurrency } from '../context/CurrencyContext';
import ProductCard from '../components/ProductCard';
import ProductReviews from '../components/ProductReviews';
import {
  Star,
  ShieldCheck,
  Truck,
  RotateCcw,
  CheckCircle,
  Share2,
  ChevronRight,
  ShoppingCart,
  Zap
} from 'lucide-react';

export default function ProductDetailPage() {
  const { handle } = useParams();
  const navigate = useNavigate();
  const { addToCart, openCart } = useCart();
  const { formatPrice, formatRaw } = useCurrency();

  const [product, setProduct] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [activeImage, setActiveImage] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    setLoading(true);

    dataService
      .getProductByHandle(handle)
      .then(async (prod) => {
        if (!prod) {
          setLoading(false);
          return;
        }
        setProduct(prod);
        const initialVariant = prod.variants?.[0] || null;
        setSelectedVariant(initialVariant);
        setActiveImage(prod.images?.[0]?.src || '/images/logos/logo_main.png');
        setQuantity(1);

        // Fetch related products
        const allProds = await dataService.getProducts();
        const related = allProds
          .filter((p) => p.id !== prod.id && (p.vendor === prod.vendor || p.product_type === prod.product_type))
          .slice(0, 4);
        setRelatedProducts(related.length > 0 ? related : allProds.slice(0, 4));
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [handle]);

  if (loading) {
    return (
      <div className="page-width" style={{ padding: '6rem 1rem', textAlign: 'center' }}>
        <p style={{ color: '#666', fontSize: '1.1rem' }}>Loading product details...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="page-width" style={{ padding: '6rem 1rem', textAlign: 'center' }}>
        <h2 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '1rem' }}>Product Not Found</h2>
        <p style={{ color: '#666', marginBottom: '2rem' }}>
          The product you are looking for does not exist or may have been moved.
        </p>
        <Link to="/collections" className="btn btn-primary">
          Browse All Collections
        </Link>
      </div>
    );
  }

  const price = parseFloat(selectedVariant?.price || selectedVariant?.price_usd || 0);
  const compareAtPrice = selectedVariant?.compare_at_price ? parseFloat(selectedVariant.compare_at_price) : null;
  const isOnSale = compareAtPrice && compareAtPrice > price;
  const savings = isOnSale ? (compareAtPrice - price).toFixed(2) : null;

  const handleAddToCart = () => {
    addToCart(product, selectedVariant, quantity);
  };

  const handleBuyNow = () => {
    addToCart(product, selectedVariant, quantity);
    openCart();
  };

  return (
    <div className="page-width animate-fade-down" style={{ padding: '1.5rem 0.85rem 4rem' }}>
      {/* Breadcrumbs */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', color: '#666', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <Link to="/" style={{ color: '#121212' }}>Home</Link>
        <ChevronRight size={13} />
        <Link to="/collections" style={{ color: '#121212' }}>Collections</Link>
        <ChevronRight size={13} />
        <span style={{ color: '#e22120', fontWeight: 600, maxWidth: '240px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {product.title}
        </span>
      </div>

      {/* Main Product Layout */}
      <div className="pdp-main-grid">
        {/* Left: Product Media Gallery */}
        <div>
          {/* Main Hero Image */}
          <div className="pdp-image-container">
            {isOnSale && (
              <span className="badge badge-sale" style={{ position: 'absolute', top: '1rem', left: '1rem' }}>
                Save ${savings} USD
              </span>
            )}
            <img
              src={activeImage}
              alt={product.title}
              style={{ maxHeight: '420px', maxWidth: '100%', objectFit: 'contain' }}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = '/images/logos/logo_main.png';
              }}
            />
          </div>

          {/* Thumbnails Row */}
          {product.images && product.images.length > 1 && (
            <div style={{ display: 'flex', gap: '0.75rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(img.src)}
                  style={{
                    width: '74px',
                    height: '74px',
                    padding: '4px',
                    backgroundColor: '#fafafa',
                    border: activeImage === img.src ? '2px solid #e22120' : '1px solid #ddd',
                    cursor: 'pointer',
                    borderRadius: 0,
                    flexShrink: 0
                  }}
                >
                  <img
                    src={img.src}
                    alt={`${product.title} thumbnail ${i + 1}`}
                    style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Product Buy Box & Details */}
        <div>
          <div style={{ fontSize: '0.825rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#666', marginBottom: '0.4rem', fontWeight: 700 }}>
            {product.vendor || 'PTC Collectibles'}
          </div>

          <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: '#121212', marginBottom: '0.75rem', lineHeight: 1.25 }}>
            {product.title}
          </h1>

          {/* Star review header */}
          <a
            href="#customer-reviews"
            onClick={(e) => {
              e.preventDefault();
              document.getElementById('customer-reviews')?.scrollIntoView({ behavior: 'smooth' });
            }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              marginBottom: '1.25rem',
              textDecoration: 'none',
              cursor: 'pointer'
            }}
            title="Click to view verified collector reviews"
          >
            <div style={{ display: 'flex', gap: '2px' }}>
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={16} fill="#ee8328" color="#ee8328" />
              ))}
            </div>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#121212' }}>5.0 / 5.0</span>
            <span style={{ fontSize: '0.85rem', color: '#666', textDecoration: 'underline' }}>(Verified Collector Reviews)</span>
          </a>

          {/* Pricing Box */}
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '1rem', marginBottom: '1.5rem', paddingBottom: '1.25rem', borderBottom: '1px solid #eee' }}>
            <span style={{ fontSize: '1.85rem', fontWeight: 800, color: isOnSale ? '#e22120' : '#121212' }}>
              {formatPrice(selectedVariant?.price, selectedVariant?.price_cad)}
            </span>
            {isOnSale && (
              <span style={{ fontSize: '1.2rem', color: '#888', textDecoration: 'line-through' }}>
                {formatPrice(selectedVariant?.compare_at_price, selectedVariant?.compare_at_price_cad)}
              </span>
            )}
            <span style={{ fontSize: '0.8rem', color: '#666' }}>Tax included.</span>
          </div>

          {/* Variant Selector */}
          {product.variants && product.variants.length > 1 && (
            <div style={{ marginBottom: '1.75rem' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                Option: <span style={{ fontWeight: 400 }}>{selectedVariant?.title}</span>
              </label>
              <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
                {product.variants.map((v) => (
                  <button
                    key={v.id}
                    onClick={() => {
                      setSelectedVariant(v);
                      if (v.featured_image?.src) setActiveImage(v.featured_image.src);
                    }}
                    style={{
                      padding: '0.6rem 1.25rem',
                      fontSize: '0.85rem',
                      fontWeight: 600,
                      borderRadius: '40px',
                      border: selectedVariant?.id === v.id ? '2px solid #121212' : '1px solid #ccc',
                      backgroundColor: selectedVariant?.id === v.id ? '#121212' : '#ffffff',
                      color: selectedVariant?.id === v.id ? '#ffffff' : '#121212',
                      cursor: 'pointer'
                    }}
                  >
                    {v.title}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Availability Status */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', color: '#0d8a43', fontSize: '0.875rem', fontWeight: 600 }}>
            <CheckCircle size={18} />
            <span>In stock, ready to dispatch from Toronto hub</span>
          </div>

          {/* Quantity & CTA Buttons */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', marginBottom: '2rem' }}>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', border: '1px solid #121212', height: '48px' }}>
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  style={{ padding: '0 1rem', fontSize: '1.1rem', background: 'none', border: 'none' }}
                >
                  -
                </button>
                <span style={{ padding: '0 0.85rem', fontWeight: 700, fontSize: '0.95rem' }}>{quantity}</span>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  style={{ padding: '0 1rem', fontSize: '1.1rem', background: 'none', border: 'none' }}
                >
                  +
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                className="btn btn-outline"
                style={{ flex: 1, height: '48px', gap: '0.5rem', fontSize: '0.95rem' }}
              >
                <ShoppingCart size={18} />
                <span>Add to Cart</span>
              </button>
            </div>

            <button
              onClick={handleBuyNow}
              className="btn btn-primary btn-full"
              style={{ height: '48px', gap: '0.5rem', fontSize: '1rem' }}
            >
              <Zap size={18} />
              <span>Buy It Now</span>
            </button>
          </div>

          {/* Trust Guarantees Box */}
          <div style={{ backgroundColor: '#f9fafb', border: '1px solid #e5e5e5', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.85rem' }}>
              <Truck size={20} color="#e22120" />
              <span>
                <strong>Free Tracked Shipping</strong> on orders over $150 USD
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.85rem' }}>
              <ShieldCheck size={20} color="#e22120" />
              <span>
                <strong>100% Authentic &amp; Sealed:</strong> We source strictly through verified distributors.
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.85rem' }}>
              <RotateCcw size={20} color="#e22120" />
              <span>
                <strong>30-Day Return Policy:</strong> Unopened, sealed condition eligibility.
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs: Description, Shipping & Authenticity Policy */}
      <div style={{ borderTop: '1px solid #eee', paddingTop: '2.5rem', marginBottom: '4rem' }}>
        <div style={{ display: 'flex', gap: '1.5rem', borderBottom: '1px solid #ddd', marginBottom: '1.5rem', overflowX: 'auto', scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch' }}>
          {[
            { id: 'description', label: 'Product Description' },
            { id: 'shipping', label: 'Shipping & Delivery' },
            { id: 'authenticity', label: 'Authenticity Guarantee' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                paddingBottom: '0.75rem',
                fontSize: '0.95rem',
                fontWeight: 700,
                color: activeTab === tab.id ? '#e22120' : '#666',
                borderBottom: activeTab === tab.id ? '2px solid #e22120' : '2px solid transparent',
                background: 'none',
                borderTop: 'none',
                borderLeft: 'none',
                borderRight: 'none',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                flexShrink: 0
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div>
          {activeTab === 'description' && (
            <div
              style={{ color: '#444', lineHeight: 1.7, fontSize: '0.95rem' }}
              dangerouslySetInnerHTML={{ __html: product.body_html || '<p>No description provided.</p>' }}
            />
          )}

          {activeTab === 'shipping' && (
            <div style={{ color: '#444', lineHeight: 1.7, fontSize: '0.95rem' }}>
              <p style={{ marginBottom: '1rem' }}>
                All orders are packaged with premium protective wrap and sturdy cardboard to prevent denting or corner damage.
              </p>
              <ul style={{ paddingLeft: '1.25rem', marginBottom: '1rem' }}>
                <li><strong>USA &amp; Canada:</strong> 3 to 12 business days with full tracking number.</li>
                <li><strong>Pre-Orders:</strong> Dispatched immediately upon official manufacturer release date.</li>
                <li><strong>International:</strong> Free shipping threshold applies to international orders over $1,000 USD.</li>
              </ul>
            </div>
          )}

          {activeTab === 'authenticity' && (
            <div style={{ color: '#444', lineHeight: 1.7, fontSize: '0.95rem' }}>
              <p style={{ marginBottom: '1rem' }}>
                At <strong>PTC Collectibles</strong>, card authenticity and pack integrity are our top priority. We do not weigh, map, reseal, or tamper with any booster packs or boxes.
              </p>
              <p>
                Every graded card (PSA, CGC, BGS) has a verified certification barcode accessible on the respective grading company database. If any product is proven non-authentic, a full 100% refund is guaranteed.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Verified Customer Reviews (No Profile Pictures) */}
      <ProductReviews product={product} />

      {/* Related Products Carousel */}
      {relatedProducts.length > 0 && (
        <section style={{ borderTop: '1px solid #eee', paddingTop: '3rem' }}>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '1.75rem' }}>
            You May Also Like
          </h2>
          <div className="product-grid">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
      {/* Mobile Sticky Bottom Add to Cart Bar */}
      <div className="mobile-sticky-cta">
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#121212', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {product.title}
          </div>
          <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#e22120' }}>
            {formatPrice(selectedVariant?.price, selectedVariant?.price_cad)}
          </div>
        </div>
        <button
          onClick={handleAddToCart}
          className="btn btn-primary"
          style={{ padding: '0.6rem 1.2rem', fontSize: '0.85rem', gap: '0.4rem', whiteSpace: 'nowrap' }}
        >
          <ShoppingCart size={16} />
          <span>Add to Cart</span>
        </button>
      </div>
    </div>
  );
}
