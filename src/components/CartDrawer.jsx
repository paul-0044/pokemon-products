import React from 'react';
import { useCart } from '../context/CartContext';
import { useCurrency } from '../context/CurrencyContext';
import { X, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export default function CartDrawer() {
  const navigate = useNavigate();
  const {
    cartItems,
    isCartOpen,
    closeCart,
    removeFromCart,
    updateQuantity,
    cartTotal,
    cartCount,
    freeShippingRemaining,
    freeShippingProgress
  } = useCart();

  const { formatRaw } = useCurrency();

  return (
    <>
      {/* Backdrop */}
      <div
        className={`drawer-backdrop ${isCartOpen ? 'open' : ''}`}
        onClick={closeCart}
      />

      {/* Drawer */}
      <div className={`cart-drawer ${isCartOpen ? 'open' : ''}`}>
        {/* Header */}
        <div className="drawer-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <ShoppingBag size={20} color="#e22120" />
            <h2 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0 }}>
              Your Cart ({cartCount})
            </h2>
          </div>
          <button
            onClick={closeCart}
            style={{ background: 'none', border: 'none', padding: '0.4rem', cursor: 'pointer' }}
            aria-label="Close cart"
          >
            <X size={20} />
          </button>
        </div>

        {/* Free Shipping Tracker */}
        <div style={{ padding: '0.75rem 1.25rem', backgroundColor: '#fcfcfc', borderBottom: '1px solid #eee' }}>
          <div style={{ fontSize: '0.825rem', textAlign: 'center', color: '#333' }}>
            {freeShippingRemaining > 0 ? (
              <span>
                Spend <strong>{formatRaw(freeShippingRemaining)}</strong> more to get{' '}
                <strong style={{ color: '#e22120' }}>FREE SHIPPING!</strong>
              </span>
            ) : (
              <span style={{ color: '#0d8a43', fontWeight: 700 }}>
                You have unlocked FREE SHIPPING!
              </span>
            )}
          </div>
          <div className="free-shipping-progress">
            <div
              className="free-shipping-fill"
              style={{ width: `${freeShippingProgress}%` }}
            />
          </div>
        </div>

        {/* Body */}
        <div className="drawer-body">
          {cartItems.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '4rem 1rem', color: '#666' }}>
              <ShoppingBag size={48} strokeWidth={1} style={{ margin: '0 auto 1rem', opacity: 0.4 }} />
              <p style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '0.5rem', color: '#121212' }}>
                Your cart is empty
              </p>
              <p style={{ fontSize: '0.85rem', marginBottom: '1.5rem' }}>
                Explore thousands of Pokémon cards, booster boxes, and slabs!
              </p>
              <button
                onClick={closeCart}
                className="btn btn-primary"
                style={{ fontSize: '0.85rem' }}
              >
                Start Shopping
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {cartItems.map((item) => (
                <div
                  key={item.variantId}
                  style={{
                    display: 'flex',
                    gap: '1rem',
                    paddingBottom: '1rem',
                    borderBottom: '1px solid #f0f0f0'
                  }}
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    style={{
                      width: '70px',
                      height: '70px',
                      objectFit: 'contain',
                      backgroundColor: '#fafafa',
                      border: '1px solid #eee',
                      padding: '4px'
                    }}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/images/logos/logo_main.png';
                    }}
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <Link
                      to={`/products/${item.handle}`}
                      onClick={closeCart}
                      style={{
                        fontSize: '0.875rem',
                        fontWeight: 600,
                        color: '#121212',
                        display: 'block',
                        lineHeight: 1.3,
                        marginBottom: '0.25rem'
                      }}
                    >
                      {item.title}
                    </Link>

                    {item.variantTitle && (
                      <span style={{ fontSize: '0.75rem', color: '#666', display: 'block', marginBottom: '0.4rem' }}>
                        {item.variantTitle}
                      </span>
                    )}

                    <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#e22120', marginBottom: '0.5rem' }}>
                      {formatRaw(item.price)}
                    </div>

                    {/* Quantity controls */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          border: '1px solid #ccc',
                          background: '#fff'
                        }}
                      >
                        <button
                          onClick={() => updateQuantity(item.variantId, -1)}
                          style={{ padding: '0.25rem 0.6rem', fontSize: '0.9rem', border: 'none', background: 'none' }}
                        >
                          -
                        </button>
                        <span style={{ padding: '0 0.5rem', fontSize: '0.85rem', fontWeight: 600 }}>
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.variantId, 1)}
                          style={{ padding: '0.25rem 0.6rem', fontSize: '0.9rem', border: 'none', background: 'none' }}
                        >
                          +
                        </button>
                      </div>

                      <button
                        onClick={() => removeFromCart(item.variantId)}
                        style={{ background: 'none', border: 'none', color: '#999', cursor: 'pointer', padding: '0.2rem' }}
                        title="Remove"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {cartItems.length > 0 && (
          <div className="drawer-footer">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.95rem', fontWeight: 600, color: '#333' }}>Subtotal</span>
              <span style={{ fontSize: '1.15rem', fontWeight: 800, color: '#121212' }}>
                {formatRaw(cartTotal)}
              </span>
            </div>
            <p style={{ fontSize: '0.75rem', color: '#777', marginBottom: '1rem' }}>
              Taxes and shipping calculated at checkout.
            </p>

            <button
              onClick={() => {
                closeCart();
                navigate('/checkout');
              }}
              className="btn btn-primary btn-full"
              style={{ gap: '0.5rem', marginBottom: '0.5rem' }}
            >
              <span>Check Out</span>
              <ArrowRight size={16} />
            </button>

            <button
              onClick={closeCart}
              className="btn btn-outline btn-full btn-sm"
              style={{ border: 'none' }}
            >
              Continue Shopping
            </button>
          </div>
        )}
      </div>
    </>
  );
}
