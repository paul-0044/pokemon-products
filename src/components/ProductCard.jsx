import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useCurrency } from '../context/CurrencyContext';
import { Star, ShoppingCart } from 'lucide-react';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const { formatPrice } = useCurrency();

  if (!product) return null;

  const variant = product.variants?.[0] || {};
  const price = parseFloat(variant.price || variant.price_usd || 0);
  const compareAtPrice = variant.compare_at_price ? parseFloat(variant.compare_at_price) : null;
  const isOnSale = compareAtPrice && compareAtPrice > price;

  // Image resolution fallback
  const imageSrc =
    product.images?.[0]?.src ||
    variant.featured_image?.src ||
    '/images/logos/logo_main.png';

  const isPreOrder =
    product.title.toLowerCase().includes('pre-order') ||
    product.tags?.some((t) => t.toLowerCase().includes('pre-order'));

  const handleQuickAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, variant, 1);
  };

  return (
    <div className="product-card animate-fade-down">
      <Link to={`/products/${product.handle}`} style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        {/* Media Container */}
        <div className="product-card-media">
          {isOnSale && (
            <div className="product-card-badge">
              <span className="badge badge-sale">Sale</span>
            </div>
          )}
          {!isOnSale && isPreOrder && (
            <div className="product-card-badge">
              <span className="badge badge-preorder">Pre-Order</span>
            </div>
          )}

          <img
            src={imageSrc}
            alt={product.title}
            loading="lazy"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = '/images/logos/logo_main.png';
            }}
          />
        </div>

        {/* Content */}
        <div className="product-card-content">
          <div className="product-card-vendor">{product.vendor || 'PTC Collectibles'}</div>
          
          <h3 className="product-card-title" title={product.title}>
            {product.title}
          </h3>

          {/* Reviews Star Preview */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '3px', marginBottom: '0.5rem' }}>
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={12} fill="#ee8328" color="#ee8328" />
            ))}
            <span style={{ fontSize: '0.75rem', color: '#666', marginLeft: '4px' }}>
              (5.0)
            </span>
          </div>

          {/* Pricing Row */}
          <div className="product-card-price-row">
            <span className={`price-regular ${isOnSale ? 'on-sale' : ''}`}>
              {formatPrice(variant.price, variant.price_cad)}
            </span>
            {isOnSale && compareAtPrice && (
              <span className="price-compare">
                {formatPrice(variant.compare_at_price, variant.compare_at_price_cad)}
              </span>
            )}
          </div>
        </div>
      </Link>

      {/* Quick Add Button */}
      <div style={{ padding: '0 1rem 1rem' }}>
        <button
          onClick={handleQuickAdd}
          className="btn btn-outline btn-sm btn-full"
          style={{ gap: '0.4rem', border: '1px solid #121212' }}
        >
          <ShoppingCart size={14} />
          <span>Quick Add</span>
        </button>
      </div>
    </div>
  );
}
