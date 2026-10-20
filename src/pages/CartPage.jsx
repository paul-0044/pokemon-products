import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useCurrency } from '../context/CurrencyContext';
import { Trash2, ShoppingBag, ArrowRight, ShieldCheck } from 'lucide-react';

export default function CartPage() {
  const navigate = useNavigate();
  const {
    cartItems,
    removeFromCart,
    updateQuantity,
    cartTotal,
    cartCount,
    freeShippingRemaining,
    freeShippingProgress
  } = useCart();
  const { formatRaw } = useCurrency();

  return (
    <div className="page-width animate-fade-down" style={{ padding: '2rem 1rem 5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '2rem', borderBottom: '1px solid #eee', paddingBottom: '1rem' }}>
        <h1 style={{ fontSize: '2.2rem', fontWeight: 800, textTransform: 'uppercase' }}>
          Your Cart
        </h1>
        <Link to="/collections" style={{ fontSize: '0.9rem', color: '#e22120', fontWeight: 600 }}>
          Continue Shopping →
        </Link>
      </div>

      {cartItems.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '5rem 1rem', background: '#fafafa', border: '1px solid #eee' }}>
          <ShoppingBag size={56} strokeWidth={1} style={{ margin: '0 auto 1.5rem', opacity: 0.4 }} />
          <h2 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '0.75rem' }}>
            Your cart is currently empty.
          </h2>
          <p style={{ color: '#666', marginBottom: '2rem' }}>
            Explore our collection of booster boxes, single cards, and collectibles.
          </p>
          <Link to="/collections" className="btn btn-primary">
            Start Shopping
          </Link>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
          {/* Left: Items list */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Free shipping bar */}
            <div style={{ padding: '1rem', background: '#f5faf9', border: '1px solid #d4eae7', borderRadius: '4px' }}>
              <div style={{ fontSize: '0.9rem', textAlign: 'center', marginBottom: '0.5rem' }}>
                {freeShippingRemaining > 0 ? (
                  <span>
                    Add <strong>{formatRaw(freeShippingRemaining)}</strong> more to get{' '}
                    <strong style={{ color: '#e22120' }}>FREE SHIPPING!</strong>
                  </span>
                ) : (
                  <span style={{ color: '#0d8a43', fontWeight: 700 }}>
                    You have unlocked FREE SHIPPING!
                  </span>
                )}
              </div>
              <div className="free-shipping-progress">
                <div className="free-shipping-fill" style={{ width: `${freeShippingProgress}%` }} />
              </div>
            </div>

            {/* Table of items */}
            <div style={{ border: '1px solid #eee' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', padding: '0.75rem 1rem', background: '#fafafa', borderBottom: '1px solid #eee', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: '#666' }}>
                <span>Product</span>
                <span style={{ textAlign: 'center' }}>Quantity</span>
                <span style={{ textAlign: 'right' }}>Total</span>
              </div>

              {cartItems.map((item) => (
                <div
                  key={item.variantId}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '2fr 1fr 1fr',
                    padding: '1.25rem 1rem',
                    borderBottom: '1px solid #f0f0f0',
                    alignItems: 'center'
                  }}
                >
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <img
                      src={item.image}
                      alt={item.title}
                      style={{ width: '64px', height: '64px', objectFit: 'contain', border: '1px solid #eee', padding: '4px' }}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = '/images/logos/logo_main.png';
                      }}
                    />
                    <div>
                      <Link to={`/products/${item.handle}`} style={{ fontWeight: 600, fontSize: '0.9rem', color: '#121212' }}>
                        {item.title}
                      </Link>
                      {item.variantTitle && (
                        <div style={{ fontSize: '0.8rem', color: '#666' }}>{item.variantTitle}</div>
                      )}
                      <div style={{ fontSize: '0.85rem', color: '#e22120', fontWeight: 700 }}>
                        {formatRaw(item.price)}
                      </div>
                      <button
                        onClick={() => removeFromCart(item.variantId)}
                        style={{ background: 'none', border: 'none', color: '#999', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.2rem', marginTop: '0.3rem', cursor: 'pointer' }}
                      >
                        <Trash2 size={12} />
                        <span>Remove</span>
                      </button>
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <div style={{ display: 'inline-flex', border: '1px solid #ccc' }}>
                      <button
                        onClick={() => updateQuantity(item.variantId, -1)}
                        style={{ padding: '0.3rem 0.6rem', background: 'none', border: 'none', cursor: 'pointer' }}
                      >
                        -
                      </button>
                      <span style={{ padding: '0.3rem 0.6rem', fontWeight: 600, fontSize: '0.85rem' }}>
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.variantId, 1)}
                        style={{ padding: '0.3rem 0.6rem', background: 'none', border: 'none', cursor: 'pointer' }}
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div style={{ textAlign: 'right', fontWeight: 700, fontSize: '1rem', color: '#121212' }}>
                    {formatRaw(item.price * item.quantity)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Summary Order Box */}
          <div>
            <div style={{ backgroundColor: '#fafafa', border: '1px solid #e5e5e5', padding: '2rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '1.5rem', borderBottom: '1px solid #ddd', paddingBottom: '0.75rem' }}>
                Order Summary
              </h3>

              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', fontSize: '0.95rem' }}>
                <span style={{ color: '#666' }}>Subtotal ({cartCount} items)</span>
                <span style={{ fontWeight: 700 }}>{formatRaw(cartTotal)}</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', fontSize: '0.95rem' }}>
                <span style={{ color: '#666' }}>Shipping</span>
                <span style={{ color: freeShippingRemaining === 0 ? '#0d8a43' : '#121212', fontWeight: 600 }}>
                  {freeShippingRemaining === 0 ? 'FREE' : 'Calculated at checkout'}
                </span>
              </div>

              <div style={{ borderTop: '1px solid #ddd', paddingTop: '1.25rem', marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <span style={{ fontSize: '1.15rem', fontWeight: 800 }}>Estimated Total</span>
                <span style={{ fontSize: '1.5rem', fontWeight: 800, color: '#e22120' }}>
                  {formatRaw(cartTotal)}
                </span>
              </div>

              <button
                onClick={() => navigate('/checkout')}
                className="btn btn-primary btn-full"
                style={{ height: '52px', fontSize: '1.05rem', gap: '0.5rem' }}
              >
                <span>Check Out</span>
                <ArrowRight size={20} />
              </button>

              <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.8rem', color: '#888', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}>
                <ShieldCheck size={16} color="#0d8a43" />
                <span>256-Bit SSL Encrypted Checkout</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
