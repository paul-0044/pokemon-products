import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { dataService } from '../lib/supabase';
import { ChevronRight, Mail, Phone, MapPin, Send, CheckCircle2, Star, Gift, Truck } from 'lucide-react';

export default function CustomPage() {
  const { slug } = useParams();
  const [pageData, setPageData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Form states for contact-us
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' });
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    setLoading(true);
    setIsSubmitted(false);

    dataService
      .getPageBySlug(slug)
      .then((p) => {
        setPageData(p);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [slug]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitted(true);
  };

  const getPageTitle = () => {
    if (slug === 'contact-us') return 'Contact Us';
    if (slug === 'sell-your-cards') return 'Sell Your Cards';
    if (slug === 'ptc-collectibles-rewards') return 'PTC Collectibles Rewards';
    if (slug === 'affiliate') return 'Affiliate Marketing Program';
    if (slug === 'data-sharing-opt-out') return 'Data Sharing Opt-Out';
    return pageData?.title || 'Information';
  };

  return (
    <div className="page-width" style={{ padding: '2.5rem 1.5rem 5rem', maxWidth: '960px' }}>
      {/* Breadcrumb */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.825rem', color: '#666', marginBottom: '2rem' }}>
        <Link to="/" style={{ color: '#121212' }}>Home</Link>
        <ChevronRight size={14} />
        <span style={{ color: '#e22120', fontWeight: 600 }}>{getPageTitle()}</span>
      </div>

      <div style={{ marginBottom: '2.5rem', borderBottom: '1px solid #eee', paddingBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '2.4rem', fontWeight: 800, textTransform: 'uppercase' }}>
          {getPageTitle()}
        </h1>
      </div>

      {/* Contact Us Form Page */}
      {slug === 'contact-us' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '3rem' }}>
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem' }}>
              We&apos;d Love to Hear From You
            </h3>
            <p style={{ color: '#555', lineHeight: 1.6, marginBottom: '2rem' }}>
              Have questions about order tracking, grading submissions, or product authenticity? Send us a message and our customer care team will reply within 24 hours.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#333' }}>
                <Mail size={20} color="#e22120" />
                <span><strong>Email:</strong> premierdigitalbusiness@gmail.com</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#333' }}>
                <MapPin size={20} color="#e22120" />
                <span><strong>Location:</strong> Toronto, Ontario, Canada</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#333' }}>
                <Phone size={20} color="#e22120" />
                <span><strong>Support Hours:</strong> Mon - Sat: 9:00 AM - 6:00 PM EST</span>
              </div>
            </div>
          </div>

          <div>
            {isSubmitted ? (
              <div style={{ backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', padding: '2rem', textAlign: 'center' }}>
                <CheckCircle2 size={40} color="#16a34a" style={{ margin: '0 auto 1rem' }} />
                <h4 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#166534', marginBottom: '0.5rem' }}>
                  Message Sent Successfully!
                </h4>
                <p style={{ color: '#15803d', fontSize: '0.9rem' }}>
                  Thank you for reaching out. We will get back to your email ({formData.email}) shortly.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.35rem' }}>Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    style={{ width: '100%', padding: '0.75rem', border: '1px solid #ccc', outline: 'none' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.35rem' }}>Email</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    style={{ width: '100%', padding: '0.75rem', border: '1px solid #ccc', outline: 'none' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.35rem' }}>Phone Number (Optional)</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    style={{ width: '100%', padding: '0.75rem', border: '1px solid #ccc', outline: 'none' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.35rem' }}>Comment or Question</label>
                  <textarea
                    rows={5}
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    style={{ width: '100%', padding: '0.75rem', border: '1px solid #ccc', outline: 'none' }}
                  />
                </div>
                <button type="submit" className="btn btn-primary" style={{ gap: '0.5rem', alignSelf: 'flex-start' }}>
                  <Send size={16} />
                  <span>Send Message</span>
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Sell Your Cards Page */}
      {slug === 'sell-your-cards' && (
        <div style={{ lineHeight: 1.7, color: '#333' }}>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '1rem' }}>
            Turn Your Cards Into Cash
          </h2>
          <p style={{ marginBottom: '1.5rem' }}>
            At PTC Collectibles, we buy sealed booster boxes, vintage collection binders, and graded PSA/CGC slabs! Whether you have single high-value cards or whole collections to liquidate, we provide competitive payouts.
          </p>
          <div style={{ background: '#f8f8f8', padding: '1.5rem', border: '1px solid #eee', marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.75rem' }}>How It Works:</h3>
            <ol style={{ paddingLeft: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <li><strong>Submit Your List:</strong> Email detailed photos and card lists to <a href="mailto:premierdigitalbusiness@gmail.com" style={{ color: '#e22120' }}>premierdigitalbusiness@gmail.com</a>.</li>
              <li><strong>Receive Offer:</strong> We review condition and market pricing and extend an offer within 2 business days.</li>
              <li><strong>Ship &amp; Get Paid:</strong> Ship with insured tracking or drop off. Payment is sent immediately upon receipt.</li>
            </ol>
          </div>
        </div>
      )}

      {/* Rewards Page */}
      {slug === 'ptc-collectibles-rewards' && (
        <div style={{ lineHeight: 1.7, color: '#333' }}>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '1rem' }}>
            PTC VIP Rewards Club
          </h2>
          <p style={{ marginBottom: '1.5rem' }}>
            Earn points on every purchase, unlock exclusive holos, and enjoy early access to high-demand booster box releases!
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem', margin: '2rem 0' }}>
            <div style={{ border: '1px solid #eee', padding: '1.5rem', textAlign: 'center' }}>
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '0.75rem' }}>
                <Star size={28} color="#e22120" />
              </div>
              <h4 style={{ fontWeight: 700, marginBottom: '0.5rem' }}>Leave a Review</h4>
              <p style={{ fontSize: '0.85rem', color: '#666' }}>Receive a free certified Holo in your next package!</p>
            </div>
            <div style={{ border: '1px solid #eee', padding: '1.5rem', textAlign: 'center' }}>
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '0.75rem' }}>
                <Gift size={28} color="#e22120" />
              </div>
              <h4 style={{ fontWeight: 700, marginBottom: '0.5rem' }}>5% Off First Order</h4>
              <p style={{ fontSize: '0.85rem', color: '#666' }}>Use discount code <strong>5PERCENT</strong> at checkout.</p>
            </div>
            <div style={{ border: '1px solid #eee', padding: '1.5rem', textAlign: 'center' }}>
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '0.75rem' }}>
                <Truck size={28} color="#e22120" />
              </div>
              <h4 style={{ fontWeight: 700, marginBottom: '0.5rem' }}>Free Shipping Threshold</h4>
              <p style={{ fontSize: '0.85rem', color: '#666' }}>Automatically unlocked on all orders over $150 USD.</p>
            </div>
          </div>
        </div>
      )}

      {/* Affiliate Program */}
      {slug === 'affiliate' && (
        <div style={{ lineHeight: 1.7, color: '#333' }}>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '1rem' }}>
            10% Commission Affiliate Program
          </h2>
          <p style={{ marginBottom: '1.5rem' }}>
            Are you a Pokémon YouTuber, TikTok creator, streamer, or community builder? Partner with PTC Collectibles to earn 10% cash commission on every sale referred through your custom links and discount codes.
          </p>
          <div style={{ background: '#fcfcfc', border: '1px solid #eee', padding: '2rem', textAlign: 'center' }}>
            <p style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1rem' }}>
              Ready to apply? Contact our creator team at:
            </p>
            <a href="mailto:premierdigitalbusiness@gmail.com" className="btn btn-primary">
              Apply via Email
            </a>
          </div>
        </div>
      )}

      {/* Fallback generic text */}
      {!['contact-us', 'sell-your-cards', 'ptc-collectibles-rewards', 'affiliate'].includes(slug) && (
        <div style={{ lineHeight: 1.7, color: '#333' }}>
          <p>Please contact us for more information about {getPageTitle()}.</p>
        </div>
      )}
    </div>
  );
}
