import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Check } from 'lucide-react';
import { useCurrency } from '../context/CurrencyContext';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const { currency, setCurrency } = useCurrency();

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setIsSubscribed(true);
      setEmail('');
    }
  };

  return (
    <footer className="site-footer">
      <div className="page-width">
        <div className="footer-grid">
          {/* Column 1: Newsletter */}
          <div>
            <h3 className="footer-heading">Subscribe to our emails</h3>
            <p style={{ fontSize: '0.85rem', color: '#b0b0b0', marginBottom: '1.25rem', lineHeight: 1.5 }}>
              Be the first to know about new Pokémon drops, restocks, exclusive pre-orders, and secret discount codes!
            </p>

            {isSubscribed ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#4ade80', fontSize: '0.85rem' }}>
                <Check size={18} />
                <span>Thanks for subscribing! Check your inbox soon.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} style={{ display: 'flex', maxWidth: '360px' }}>
                <input
                  type="email"
                  required
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{
                    flex: 1,
                    padding: '0.75rem 1rem',
                    background: '#222',
                    border: '1px solid #444',
                    color: '#fff',
                    borderRadius: 0,
                    outline: 'none'
                  }}
                />
                <button
                  type="submit"
                  style={{
                    backgroundColor: '#e22120',
                    color: '#fff',
                    border: 'none',
                    padding: '0 1.25rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                  aria-label="Submit newsletter"
                >
                  <ArrowRight size={18} />
                </button>
              </form>
            )}

            {/* Social links */}
            <div style={{ display: 'flex', gap: '1rem', marginTop: '1.75rem' }}>
              <a href="https://www.facebook.com/PTCCollectibles/" target="_blank" rel="noreferrer" style={{ color: '#fff', fontSize: '0.85rem', fontWeight: 600 }}>Facebook</a>
              <a href="https://www.instagram.com/ptccollectibles/" target="_blank" rel="noreferrer" style={{ color: '#fff', fontSize: '0.85rem', fontWeight: 600 }}>Instagram</a>
              <a href="https://www.youtube.com/@PTCCollectibles" target="_blank" rel="noreferrer" style={{ color: '#fff', fontSize: '0.85rem', fontWeight: 600 }}>YouTube</a>
              <a href="https://www.tiktok.com/@ptccollectibles" target="_blank" rel="noreferrer" style={{ color: '#fff', fontSize: '0.85rem', fontWeight: 600 }}>TikTok</a>
              <a href="https://pinterest.com/ptccollectibles/" target="_blank" rel="noreferrer" style={{ color: '#fff', fontSize: '0.85rem', fontWeight: 600 }}>Pinterest</a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="footer-heading">Shop Collections</h3>
            <ul className="footer-links">
              <li><Link to="/collections/pokemontcg">Pokémon TCG</Link></li>
              <li><Link to="/collections/pokemon-booster-boxes">Booster Boxes</Link></li>
              <li><Link to="/collections/pokemonelitetrainerbox">Elite Trainer Boxes (ETB)</Link></li>
              <li><Link to="/collections/graded-pokemon-cards">PSA Graded Slabs</Link></li>
              <li><Link to="/collections/one-piece-tcg">One Piece TCG</Link></li>
              <li><Link to="/collections/sports-cards">Sports Cards</Link></li>
              <li><Link to="/collections/custom-boxes">Custom Mystery Boxes</Link></li>
              <li><Link to="/collections/international-snacks">Japanese &amp; Asian Snacks</Link></li>
            </ul>
          </div>

          {/* Column 3: Customer Care & Info */}
          <div>
            <h3 className="footer-heading">Customer Care</h3>
            <ul className="footer-links">
              <li><Link to="/pages/contact-us">Contact Us</Link></li>
              <li><Link to="/pages/sell-your-cards">Sell Your Cards</Link></li>
              <li><Link to="/pages/ptc-collectibles-rewards">Rewards Program</Link></li>
              <li><Link to="/pages/affiliate">Affiliate Marketing</Link></li>
              <li><a href="https://www.whatnot.com/invite/ptccollectibles" target="_blank" rel="noreferrer">Whatnot Livestream</a></li>
              <li><a href="https://faire.com/direct/ptccollectibles" target="_blank" rel="noreferrer">Wholesale Inquiries</a></li>
              <li><Link to="/collections/best-sellers">Best Sellers</Link></li>
              <li><Link to="/collections/newest-arrivals">Newest Arrivals</Link></li>
            </ul>
          </div>

          {/* Column 4: Policies */}
          <div>
            <h3 className="footer-heading">Legal &amp; Policies</h3>
            <ul className="footer-links">
              <li><Link to="/policies/refund-policy">Refund &amp; Return Policy</Link></li>
              <li><Link to="/policies/shipping-policy">Shipping Policy</Link></li>
              <li><Link to="/policies/privacy-policy">Privacy Policy</Link></li>
              <li><Link to="/policies/terms-of-service">Terms of Service</Link></li>
              <li><Link to="/policies/legal-notice">Legal Notice / EU Rights</Link></li>
              <li><Link to="/pages/data-sharing-opt-out">Data Sharing Opt-Out</Link></li>
            </ul>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="footer-bottom">
          <div>
            <div style={{ marginBottom: '0.5rem' }}>
              &copy; {new Date().getFullYear()}, PTC Collectibles. Powered by Shopify replica.
            </div>
            <div style={{ fontSize: '0.75rem', color: '#777' }}>
              Authentic &amp; Sealed Pokémon Products Guaranteed.
            </div>
          </div>

          {/* Payment Badges - Real Images */}
          <div className="payment-icons" style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', alignItems: 'center' }}>
            <img src="/images/badges/amex.png" alt="American Express" style={{ height: '24px', width: 'auto', borderRadius: '3px', border: '1px solid #333' }} />
            <img src="/images/badges/apple-pay.png" alt="Apple Pay" style={{ height: '24px', width: 'auto', borderRadius: '3px', border: '1px solid #333' }} />
            <img src="/images/badges/bizum.png" alt="Bizum" style={{ height: '24px', width: 'auto', borderRadius: '3px', border: '1px solid #333' }} />
            <img src="/images/badges/diners-club.png" alt="Diners Club" style={{ height: '24px', width: 'auto', borderRadius: '3px', border: '1px solid #333' }} />
            <img src="/images/badges/discover.png" alt="Discover" style={{ height: '24px', width: 'auto', borderRadius: '3px', border: '1px solid #333' }} />
            <img src="/images/badges/google-pay.png" alt="Google Pay" style={{ height: '24px', width: 'auto', borderRadius: '3px', border: '1px solid #333' }} />
            <img src="/images/badges/mastercard.png" alt="Mastercard" style={{ height: '24px', width: 'auto', borderRadius: '3px', border: '1px solid #333' }} />
            <img src="/images/badges/mb-way.png" alt="MB WAY" style={{ height: '24px', width: 'auto', borderRadius: '3px', border: '1px solid #333' }} />
            <img src="/images/badges/multibanco.png" alt="Multibanco" style={{ height: '24px', width: 'auto', borderRadius: '3px', border: '1px solid #333' }} />
            <img src="/images/badges/shop-pay.png" alt="Shop Pay" style={{ height: '24px', width: 'auto', borderRadius: '3px', border: '1px solid #333' }} />
            <img src="/images/badges/visa.png" alt="Visa" style={{ height: '24px', width: 'auto', borderRadius: '3px', border: '1px solid #333' }} />
          </div>

          {/* Region selector */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.75rem', color: '#aaa' }}>Currency:</span>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              style={{
                background: '#1a1a1a',
                color: '#fff',
                border: '1px solid #444',
                padding: '0.3rem 0.6rem',
                fontSize: '0.75rem',
                cursor: 'pointer'
              }}
            >
              <option value="USD">USD ($)</option>
              <option value="CAD">CAD ($)</option>
            </select>
          </div>
        </div>
      </div>
    </footer>
  );
}
