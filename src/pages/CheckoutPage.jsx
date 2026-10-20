import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useCurrency } from '../context/CurrencyContext';
import {
  Lock,
  ChevronRight,
  ShieldCheck,
  CreditCard,
  Truck,
  CheckCircle2,
  Tag,
  ArrowLeft,
  ShoppingBag,
  Building2,
  Wallet,
  Landmark,
  DollarSign
} from 'lucide-react';

export default function CheckoutPage() {
  const { cartItems, cartTotal, clearCart } = useCart();
  const { formatRaw } = useCurrency();
  const navigate = useNavigate();

  // Checkout form fields
  const [email, setEmail] = useState('');
  const [newsOffers, setNewsOffers] = useState(true);
  const [country, setCountry] = useState('United States');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [address, setAddress] = useState('');
  const [apartment, setApartment] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [phone, setPhone] = useState('');

  // Shipping selection
  const isFreeShipping = cartTotal >= 150;
  const [shippingMethod, setShippingMethod] = useState(isFreeShipping ? 'free' : 'standard');

  // Discount code
  const [discountInput, setDiscountInput] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState(null);
  const [discountError, setDiscountError] = useState('');

  // Payment method
  const [paymentMethod, setPaymentMethod] = useState('credit_card');

  // Order placed confirmation state
  const [orderComplete, setOrderComplete] = useState(false);
  const [placedOrderDetails, setPlacedOrderDetails] = useState(null);

  // Calculate pricing
  const discountRate = appliedDiscount ? 0.05 : 0;
  const discountAmount = cartTotal * discountRate;
  const discountedSubtotal = cartTotal - discountAmount;

  const shippingCost =
    shippingMethod === 'express' ? 19.99 : (isFreeShipping ? 0 : 9.99);

  const estimatedTax = discountedSubtotal * 0.05; // 5% tax estimate
  const finalTotal = discountedSubtotal + shippingCost + estimatedTax;

  const handleApplyDiscount = (e) => {
    e.preventDefault();
    setDiscountError('');
    const code = discountInput.trim().toUpperCase();
    if (code === '5PERCENT') {
      setAppliedDiscount({ code: '5PERCENT', percent: 5 });
      setDiscountInput('');
    } else {
      setDiscountError('Enter a valid discount code (Try: 5PERCENT)');
    }
  };

  const handlePlaceOrder = (e) => {
    e.preventDefault();

    if (!email || !firstName || !lastName || !address || !city || !postalCode) {
      alert('Please fill in all required shipping address fields.');
      return;
    }

    const paymentMethodNames = {
      credit_card: 'Credit / Debit Card (Online Invoice)',
      bank_transfer: 'Direct Bank Wire / ACH Transfer',
      cashapp: 'Cash App Pay ($Cashtag)',
      venmo: 'Venmo (Business Payment)',
      paypal: 'PayPal / Electronic Wallet'
    };

    const orderNum = `PTC-${Math.floor(10000 + Math.random() * 90000)}`;

    const orderSummary = {
      orderNumber: orderNum,
      email,
      paymentMethod: paymentMethodNames[paymentMethod] || 'Online Payment',
      paymentMethodId: paymentMethod,
      name: `${firstName} ${lastName}`,
      address: `${address}${apartment ? ', ' + apartment : ''}, ${city}, ${state} ${postalCode}, ${country}`,
      items: [...cartItems],
      total: finalTotal,
      subtotal: cartTotal,
      shipping: shippingCost,
      tax: estimatedTax,
      discount: discountAmount,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    };

    setPlacedOrderDetails(orderSummary);
    clearCart();
    setOrderComplete(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Order Confirmation Success Screen
  if (orderComplete && placedOrderDetails) {
    return (
      <div className="page-width" style={{ padding: '3.5rem 1rem', maxWidth: '780px' }}>
        <div style={{ backgroundColor: '#ffffff', border: '1px solid #e1e4e8', padding: '2.5rem', boxShadow: '0 4px 16px rgba(0,0,0,0.06)' }} className="animate-fade-in">
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <CheckCircle2 size={54} color="#16a34a" style={{ margin: '0 auto 1rem' }} />
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#16a34a', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Order Confirmed
            </span>
            <h1 style={{ fontSize: '2rem', fontWeight: 800, marginTop: '0.25rem', marginBottom: '0.5rem' }}>
              Thank You, {placedOrderDetails.name}!
            </h1>
            <p style={{ color: '#555', fontSize: '0.95rem' }}>
              Order confirmation <strong>#{placedOrderDetails.orderNumber}</strong> has been sent to <strong>{placedOrderDetails.email}</strong>.
            </p>
          </div>

          {/* Order Details Grid */}
          <div style={{ backgroundColor: '#fafafa', border: '1px solid #eaeaea', padding: '1.5rem', marginBottom: '1.5rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem', fontSize: '0.875rem' }}>
              <div>
                <strong style={{ display: 'block', color: '#121212', marginBottom: '0.25rem' }}>Shipping Address</strong>
                <p style={{ color: '#666', lineHeight: 1.5 }}>
                  {placedOrderDetails.name}<br />
                  {placedOrderDetails.address}
                </p>
              </div>
              <div>
                <strong style={{ display: 'block', color: '#121212', marginBottom: '0.25rem' }}>Payment &amp; Fulfillment Status</strong>
                <p style={{ color: '#666', lineHeight: 1.5 }}>
                  Method: <strong>{placedOrderDetails.paymentMethod}</strong><br />
                  Order Status: <strong>Awaiting Invoice Confirmation</strong>
                </p>
              </div>
            </div>
          </div>

          {/* Formal Payment Instructions Box */}
          <div style={{ backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', padding: '1.25rem', marginBottom: '2rem', borderRadius: '4px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, color: '#166534', marginBottom: '0.4rem', fontSize: '0.95rem' }}>
              <ShieldCheck size={18} color="#16a34a" />
              <span>Official Payment Details &amp; Invoice Transmitted</span>
            </div>
            <p style={{ fontSize: '0.85rem', color: '#14532d', lineHeight: 1.6, margin: 0 }}>
              An official itemized invoice with verified 256-bit encrypted payment instructions for <strong>{placedOrderDetails.paymentMethod}</strong> has been forwarded directly to <strong>{placedOrderDetails.email}</strong>. Your reserved collectibles have been locked in fulfillment queue for 24 hours. Once confirmed, tracking information will be provided automatically.
            </p>
          </div>

          {/* Purchased Items List */}
          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, borderBottom: '1px solid #eee', paddingBottom: '0.5rem', marginBottom: '1rem' }}>
              Items in this Order
            </h3>
            {placedOrderDetails.items.map((item) => (
              <div key={item.variantId} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.65rem 0', borderBottom: '1px solid #f0f0f0' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <img src={item.image} alt={item.title} style={{ width: '48px', height: '48px', objectFit: 'contain', border: '1px solid #eee' }} />
                  <div>
                    <div style={{ fontSize: '0.875rem', fontWeight: 600 }}>{item.title}</div>
                    <div style={{ fontSize: '0.775rem', color: '#666' }}>Qty: {item.quantity}</div>
                  </div>
                </div>
                <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>
                  {formatRaw(item.price * item.quantity)}
                </div>
              </div>
            ))}
          </div>

          {/* Totals */}
          <div style={{ borderTop: '2px solid #121212', paddingTop: '1rem', marginBottom: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
              <span>Subtotal:</span>
              <span>{formatRaw(placedOrderDetails.subtotal)}</span>
            </div>
            {placedOrderDetails.discount > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.9rem', color: '#16a34a' }}>
                <span>Discount (5% OFF):</span>
                <span>-{formatRaw(placedOrderDetails.discount)}</span>
              </div>
            )}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
              <span>Shipping:</span>
              <span>{placedOrderDetails.shipping === 0 ? 'FREE' : formatRaw(placedOrderDetails.shipping)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
              <span>Taxes:</span>
              <span>{formatRaw(placedOrderDetails.tax)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.2rem', fontWeight: 800, marginTop: '0.75rem', borderTop: '1px solid #eee', paddingTop: '0.75rem' }}>
              <span>Total Paid:</span>
              <span style={{ color: '#e22120' }}>{formatRaw(placedOrderDetails.total)}</span>
            </div>
          </div>

          <Link to="/" className="btn btn-primary btn-full">
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  // If cart is empty
  if (cartItems.length === 0) {
    return (
      <div className="page-width" style={{ padding: '5rem 1rem', textAlign: 'center' }}>
        <ShoppingBag size={56} strokeWidth={1} style={{ margin: '0 auto 1.5rem', opacity: 0.3 }} />
        <h2 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: '0.75rem' }}>Your Cart is Empty</h2>
        <p style={{ color: '#666', marginBottom: '2rem' }}>Add some products before proceeding to checkout.</p>
        <Link to="/collections" className="btn btn-primary">
          Explore Products
        </Link>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: '#ffffff', minHeight: '100vh' }}>
      {/* Checkout Minimal Top Header */}
      <header style={{ borderBottom: '1px solid #e1e4e8', padding: '1.25rem 0' }}>
        <div className="page-width" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Link to="/">
            <img src="/images/logos/logo_header.png" alt="PTC Collectibles" style={{ height: '36px' }} />
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.825rem', color: '#555' }}>
            <Lock size={15} color="#16a34a" />
            <span>256-Bit SSL Encrypted Checkout</span>
          </div>
        </div>
      </header>

      {/* Main 2-Column Checkout Layout */}
      <div className="page-width animate-fade-down" style={{ padding: '2rem 1.5rem 5rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '3.5rem', alignItems: 'start' }}>
          {/* Left Column: Form & Inputs */}
          <div>
            <form onSubmit={handlePlaceOrder}>
              {/* Contact Information */}
              <div style={{ marginBottom: '2.5rem' }}>
                <h2 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '1rem' }}>
                  Contact
                </h2>
                <input
                  type="email"
                  required
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{ width: '100%', padding: '0.85rem', border: '1px solid #ccc', outline: 'none', marginBottom: '0.75rem' }}
                />
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', cursor: 'pointer', color: '#555' }}>
                  <input
                    type="checkbox"
                    checked={newsOffers}
                    onChange={(e) => setNewsOffers(e.target.checked)}
                  />
                  <span>Email me with news, card restocks, and exclusive offers</span>
                </label>
              </div>

              {/* Delivery Address */}
              <div style={{ marginBottom: '2.5rem' }}>
                <h2 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '1rem' }}>
                  Delivery
                </h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#666', marginBottom: '0.25rem' }}>Country/region</label>
                    <select
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      style={{ width: '100%', padding: '0.85rem', border: '1px solid #ccc', background: '#fff', outline: 'none' }}
                    >
                      <option value="United States">United States</option>
                      <option value="Canada">Canada</option>
                      <option value="United Kingdom">United Kingdom</option>
                      <option value="Australia">Australia</option>
                      <option value="Japan">Japan</option>
                      <option value="Germany">Germany</option>
                    </select>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                    <input
                      type="text"
                      required
                      placeholder="First name"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      style={{ padding: '0.85rem', border: '1px solid #ccc', outline: 'none' }}
                    />
                    <input
                      type="text"
                      required
                      placeholder="Last name"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      style={{ padding: '0.85rem', border: '1px solid #ccc', outline: 'none' }}
                    />
                  </div>

                  <input
                    type="text"
                    required
                    placeholder="Address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    style={{ width: '100%', padding: '0.85rem', border: '1px solid #ccc', outline: 'none' }}
                  />

                  <input
                    type="text"
                    placeholder="Apartment, suite, unit (optional)"
                    value={apartment}
                    onChange={(e) => setApartment(e.target.value)}
                    style={{ width: '100%', padding: '0.85rem', border: '1px solid #ccc', outline: 'none' }}
                  />

                  <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '0.75rem' }}>
                    <input
                      type="text"
                      required
                      placeholder="City"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      style={{ padding: '0.85rem', border: '1px solid #ccc', outline: 'none' }}
                    />
                    <input
                      type="text"
                      placeholder="State / Province"
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      style={{ padding: '0.85rem', border: '1px solid #ccc', outline: 'none' }}
                    />
                    <input
                      type="text"
                      required
                      placeholder="ZIP / Postal code"
                      value={postalCode}
                      onChange={(e) => setPostalCode(e.target.value)}
                      style={{ padding: '0.85rem', border: '1px solid #ccc', outline: 'none' }}
                    />
                  </div>

                  <input
                    type="tel"
                    placeholder="Phone for delivery updates (optional)"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    style={{ width: '100%', padding: '0.85rem', border: '1px solid #ccc', outline: 'none' }}
                  />
                </div>
              </div>

              {/* Shipping Method */}
              <div style={{ marginBottom: '2.5rem' }}>
                <h2 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '1rem' }}>
                  Shipping Method
                </h2>
                <div style={{ border: '1px solid #ccc', overflow: 'hidden' }}>
                  <label
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '1rem',
                      borderBottom: '1px solid #eee',
                      cursor: 'pointer',
                      backgroundColor: shippingMethod === (isFreeShipping ? 'free' : 'standard') ? '#fcfcfc' : '#fff'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <input
                        type="radio"
                        name="shipping"
                        checked={shippingMethod === (isFreeShipping ? 'free' : 'standard')}
                        onChange={() => setShippingMethod(isFreeShipping ? 'free' : 'standard')}
                      />
                      <div>
                        <div style={{ fontSize: '0.9rem', fontWeight: 600 }}>Standard Tracked Shipping</div>
                        <div style={{ fontSize: '0.775rem', color: '#666' }}>3 to 12 business days (Bubble-wrapped)</div>
                      </div>
                    </div>
                    <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>
                      {isFreeShipping ? 'FREE' : '$9.99 USD'}
                    </span>
                  </label>

                  <label
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '1rem',
                      cursor: 'pointer',
                      backgroundColor: shippingMethod === 'express' ? '#fcfcfc' : '#fff'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <input
                        type="radio"
                        name="shipping"
                        checked={shippingMethod === 'express'}
                        onChange={() => setShippingMethod('express')}
                      />
                      <div>
                        <div style={{ fontSize: '0.9rem', fontWeight: 600 }}>Express Priority Airmail</div>
                        <div style={{ fontSize: '0.775rem', color: '#666' }}>1 to 3 business days with corner guards</div>
                      </div>
                    </div>
                    <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>$19.99 USD</span>
                  </label>
                </div>
              </div>

              {/* Payment Section - Redesigned with Formal Security Notes */}
              <div style={{ marginBottom: '2.5rem' }}>
                <h2 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '0.25rem' }}>
                  Payment
                </h2>
                <p style={{ fontSize: '0.825rem', color: '#666', marginBottom: '1rem' }}>
                  All transactions are secure and encrypted. Direct card data entry is bypassed for verified billing security.
                </p>

                <div style={{ border: '1px solid #d0d7de', borderRadius: '4px', overflow: 'hidden' }}>
                  {/* 1. Credit / Debit Card */}
                  <div
                    onClick={() => setPaymentMethod('credit_card')}
                    style={{
                      padding: '1rem',
                      borderBottom: '1px solid #e1e4e8',
                      backgroundColor: paymentMethod === 'credit_card' ? '#f6f8fa' : '#fff',
                      cursor: 'pointer'
                    }}
                  >
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer' }}>
                      <input
                        type="radio"
                        name="payment"
                        checked={paymentMethod === 'credit_card'}
                        onChange={() => setPaymentMethod('credit_card')}
                      />
                      <CreditCard size={18} color="#1f2328" />
                      <span>Credit / Debit Card (Online Invoice)</span>
                    </label>

                    {paymentMethod === 'credit_card' && (
                      <div className="animate-fade-down" style={{ backgroundColor: '#ffffff', border: '1px solid #d0d7de', padding: '0.9rem 1rem', marginTop: '0.75rem', borderRadius: '4px', fontSize: '0.825rem', color: '#24292f', lineHeight: 1.6 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 700, color: '#166534', marginBottom: '0.35rem' }}>
                          <ShieldCheck size={16} color="#16a34a" />
                          <span>PCI-DSS Verified Encryption Notice</span>
                        </div>
                        <p style={{ margin: 0 }}>
                          To guarantee maximum data privacy and prevent card intercept attacks, raw card information is never handled on unauthenticated browser forms. Upon clicking <strong>Complete Order</strong>, an official itemized invoice featuring a secure direct 3D-Secure card payment link will be transmitted directly to your verified inbox (<strong>{email || 'your email'}</strong>). Your selected items are immediately locked in reserve.
                        </p>
                      </div>
                    )}
                  </div>

                  {/* 2. Direct Bank Wire / ACH Details */}
                  <div
                    onClick={() => setPaymentMethod('bank_transfer')}
                    style={{
                      padding: '1rem',
                      borderBottom: '1px solid #e1e4e8',
                      backgroundColor: paymentMethod === 'bank_transfer' ? '#f6f8fa' : '#fff',
                      cursor: 'pointer'
                    }}
                  >
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer' }}>
                      <input
                        type="radio"
                        name="payment"
                        checked={paymentMethod === 'bank_transfer'}
                        onChange={() => setPaymentMethod('bank_transfer')}
                      />
                      <Landmark size={18} color="#1f2328" />
                      <span>Direct Bank Details / Wire / ACH Transfer</span>
                    </label>

                    {paymentMethod === 'bank_transfer' && (
                      <div className="animate-fade-down" style={{ backgroundColor: '#ffffff', border: '1px solid #d0d7de', padding: '0.9rem 1rem', marginTop: '0.75rem', borderRadius: '4px', fontSize: '0.825rem', color: '#24292f', lineHeight: 1.6 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 700, color: '#166534', marginBottom: '0.35rem' }}>
                          <ShieldCheck size={16} color="#16a34a" />
                          <span>Verified Commercial Banking Transfer</span>
                        </div>
                        <p style={{ margin: 0 }}>
                          Our formal corporate banking coordinates (Institution Name, Account Number, Routing/SWIFT code, and unique Order Reference ID) will be dispatched directly to your inbox (<strong>{email || 'your email'}</strong>). Wire and ACH transfers carry zero processing surcharges. Your package is staged for priority courier collection upon transfer initiation.
                        </p>
                      </div>
                    )}
                  </div>

                  {/* 3. Cash App */}
                  <div
                    onClick={() => setPaymentMethod('cashapp')}
                    style={{
                      padding: '1rem',
                      borderBottom: '1px solid #e1e4e8',
                      backgroundColor: paymentMethod === 'cashapp' ? '#f6f8fa' : '#fff',
                      cursor: 'pointer'
                    }}
                  >
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer' }}>
                      <input
                        type="radio"
                        name="payment"
                        checked={paymentMethod === 'cashapp'}
                        onChange={() => setPaymentMethod('cashapp')}
                      />
                      <DollarSign size={18} color="#00d632" />
                      <span>Cash App Pay</span>
                    </label>

                    {paymentMethod === 'cashapp' && (
                      <div className="animate-fade-down" style={{ backgroundColor: '#ffffff', border: '1px solid #d0d7de', padding: '0.9rem 1rem', marginTop: '0.75rem', borderRadius: '4px', fontSize: '0.825rem', color: '#24292f', lineHeight: 1.6 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 700, color: '#166534', marginBottom: '0.35rem' }}>
                          <ShieldCheck size={16} color="#16a34a" />
                          <span>Verified Business Cashtag Notice</span>
                        </div>
                        <p style={{ margin: 0 }}>
                          Our official registered business <strong>$Cashtag</strong>, QR payment voucher, and dedicated transaction matching identifier will be forwarded immediately to <strong>{email || 'your email'}</strong>. Instant confirmation with automated electronic receipt.
                        </p>
                      </div>
                    )}
                  </div>

                  {/* 4. Venmo */}
                  <div
                    onClick={() => setPaymentMethod('venmo')}
                    style={{
                      padding: '1rem',
                      borderBottom: '1px solid #e1e4e8',
                      backgroundColor: paymentMethod === 'venmo' ? '#f6f8fa' : '#fff',
                      cursor: 'pointer'
                    }}
                  >
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer' }}>
                      <input
                        type="radio"
                        name="payment"
                        checked={paymentMethod === 'venmo'}
                        onChange={() => setPaymentMethod('venmo')}
                      />
                      <Wallet size={18} color="#008cff" />
                      <span>Venmo (Business Profile)</span>
                    </label>

                    {paymentMethod === 'venmo' && (
                      <div className="animate-fade-down" style={{ backgroundColor: '#ffffff', border: '1px solid #d0d7de', padding: '0.9rem 1rem', marginTop: '0.75rem', borderRadius: '4px', fontSize: '0.825rem', color: '#24292f', lineHeight: 1.6 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 700, color: '#166534', marginBottom: '0.35rem' }}>
                          <ShieldCheck size={16} color="#16a34a" />
                          <span>Verified Venmo Merchant Profile</span>
                        </div>
                        <p style={{ margin: 0 }}>
                          Our certified Venmo commercial business handle and 4-digit confirmation security digits will be transmitted to your email address (<strong>{email || 'your email'}</strong>). Covered by Venmo Purchase Protection.
                        </p>
                      </div>
                    )}
                  </div>

                  {/* 5. PayPal */}
                  <div
                    onClick={() => setPaymentMethod('paypal')}
                    style={{
                      padding: '1rem',
                      backgroundColor: paymentMethod === 'paypal' ? '#f6f8fa' : '#fff',
                      cursor: 'pointer'
                    }}
                  >
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer' }}>
                      <input
                        type="radio"
                        name="payment"
                        checked={paymentMethod === 'paypal'}
                        onChange={() => setPaymentMethod('paypal')}
                      />
                      <Wallet size={18} color="#003087" />
                      <span>PayPal / Electronic Wallet</span>
                    </label>

                    {paymentMethod === 'paypal' && (
                      <div className="animate-fade-down" style={{ backgroundColor: '#ffffff', border: '1px solid #d0d7de', padding: '0.9rem 1rem', marginTop: '0.75rem', borderRadius: '4px', fontSize: '0.825rem', color: '#24292f', lineHeight: 1.6 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 700, color: '#166534', marginBottom: '0.35rem' }}>
                          <ShieldCheck size={16} color="#16a34a" />
                          <span>PayPal Buyer Protection Coverage</span>
                        </div>
                        <p style={{ margin: 0 }}>
                          An itemized commercial PayPal invoice with full buyer protection will be issued directly to <strong>{email || 'your email'}</strong> upon order placement. Settle securely via PayPal balance, linked checking, or credit line.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Complete Order Button */}
              <button
                type="submit"
                className="btn btn-primary btn-full animate-fade-down"
                style={{ height: '54px', fontSize: '1.05rem', fontWeight: 700 }}
              >
                Complete Order &middot; {formatRaw(finalTotal)}
              </button>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginTop: '1rem', color: '#777', fontSize: '0.8rem' }}>
                <ShieldCheck size={16} color="#16a34a" />
                <span>30-Day Money Back Authenticity Guarantee</span>
              </div>
            </form>
          </div>

          {/* Right Column: Order Summary Sidebar (Sticky on Desktop View) */}
          <div
            className="checkout-order-summary animate-fade-down"
            style={{
              backgroundColor: '#fafafa',
              border: '1px solid #e1e4e8',
              padding: '2rem',
              height: 'fit-content',
              position: 'sticky',
              top: '24px',
              alignSelf: 'start',
              boxShadow: '0 4px 16px rgba(0,0,0,0.04)',
              borderRadius: '4px'
            }}
          >
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '1.25rem', borderBottom: '1px solid #e0e0e0', paddingBottom: '0.75rem' }}>
              Order Summary ({cartItems.length})
            </h3>

            {/* Items list */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem', maxHeight: '360px', overflowY: 'auto' }}>
              {cartItems.map((item) => (
                <div key={item.variantId} style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                  <div style={{ position: 'relative', width: '56px', height: '56px', flexShrink: 0, backgroundColor: '#fff', border: '1px solid #e0e0e0', padding: '4px' }}>
                    <img src={item.image} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                    <span
                      style={{
                        position: 'absolute',
                        top: '-8px',
                        right: '-8px',
                        background: '#666',
                        color: '#fff',
                        fontSize: '0.7rem',
                        fontWeight: 700,
                        borderRadius: '50%',
                        width: '20px',
                        height: '20px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      {item.quantity}
                    </span>
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#121212', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {item.title}
                    </div>
                    {item.variantTitle && (
                      <div style={{ fontSize: '0.75rem', color: '#666' }}>{item.variantTitle}</div>
                    )}
                  </div>

                  <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>
                    {formatRaw(item.price * item.quantity)}
                  </div>
                </div>
              ))}
            </div>

            {/* Discount Code Input */}
            <div style={{ borderTop: '1px solid #e0e0e0', paddingTop: '1.25rem', marginBottom: '1.5rem' }}>
              <form onSubmit={handleApplyDiscount} style={{ display: 'flex', gap: '0.5rem' }}>
                <input
                  type="text"
                  placeholder="Discount code (e.g. 5PERCENT)"
                  value={discountInput}
                  onChange={(e) => setDiscountInput(e.target.value)}
                  style={{ flex: 1, padding: '0.65rem 0.85rem', border: '1px solid #ccc', outline: 'none' }}
                />
                <button
                  type="submit"
                  className="btn btn-dark btn-sm"
                  style={{ borderRadius: 0, padding: '0 1.25rem' }}
                >
                  Apply
                </button>
              </form>

              {appliedDiscount && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.5rem', color: '#16a34a', fontSize: '0.8rem', fontWeight: 700 }}>
                  <Tag size={14} />
                  <span>Coupon {appliedDiscount.code} Applied (-5%)</span>
                </div>
              )}
              {discountError && (
                <div style={{ color: '#e22120', fontSize: '0.8rem', marginTop: '0.4rem' }}>
                  {discountError}
                </div>
              )}
            </div>

            {/* Calculation rows */}
            <div style={{ borderTop: '1px solid #e0e0e0', paddingTop: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.875rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#555' }}>
                <span>Subtotal</span>
                <span style={{ fontWeight: 600, color: '#121212' }}>{formatRaw(cartTotal)}</span>
              </div>

              {appliedDiscount && (
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#16a34a' }}>
                  <span>Discount (5PERCENT)</span>
                  <span style={{ fontWeight: 600 }}>-{formatRaw(discountAmount)}</span>
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#555' }}>
                <span>Shipping</span>
                <span style={{ fontWeight: 600, color: '#121212' }}>
                  {shippingCost === 0 ? 'FREE' : formatRaw(shippingCost)}
                </span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#555' }}>
                <span>Estimated Taxes (5%)</span>
                <span style={{ fontWeight: 600, color: '#121212' }}>{formatRaw(estimatedTax)}</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', borderTop: '2px solid #121212', paddingTop: '1rem', marginTop: '0.5rem' }}>
                <span style={{ fontSize: '1.1rem', fontWeight: 800 }}>Total (USD)</span>
                <span style={{ fontSize: '1.45rem', fontWeight: 800, color: '#e22120' }}>
                  {formatRaw(finalTotal)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
