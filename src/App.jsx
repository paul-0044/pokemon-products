import React, { lazy, Suspense, useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { CurrencyProvider } from './context/CurrencyContext';

import AnnouncementBar from './components/AnnouncementBar';
import Header from './components/Header';
import Footer from './components/Footer';
import CartDrawer from './components/CartDrawer';
import { ArrowUp } from 'lucide-react';

// SOP Phase 2: Route-level code splitting using React.lazy
const HomePage = lazy(() => import('./pages/HomePage'));
const CollectionsPage = lazy(() => import('./pages/CollectionsPage'));
const ProductDetailPage = lazy(() => import('./pages/ProductDetailPage'));
const CartPage = lazy(() => import('./pages/CartPage'));
const CustomPage = lazy(() => import('./pages/CustomPage'));
const PolicyPage = lazy(() => import('./pages/PolicyPage'));
const CheckoutPage = lazy(() => import('./pages/CheckoutPage'));

// Lightweight, non-blocking fallback
function PageFallback() {
  return (
    <div className="page-width animate-fade-down" style={{ padding: '4rem 1rem', minHeight: '60vh' }}>
      <div className="skeleton-box" style={{ width: '40%', height: '32px', marginBottom: '1.5rem' }} />
      <div className="skeleton-box" style={{ width: '70%', height: '18px', marginBottom: '2.5rem' }} />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
        {[...Array(6)].map((_, i) => (
          <div key={i} className="skeleton-box" style={{ width: '100%', height: '240px' }} />
        ))}
      </div>
    </div>
  );
}

// Back to Top Button
function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!visible) return null;

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className="animate-fade-down"
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        backgroundColor: '#121212',
        color: '#ffffff',
        border: 'none',
        borderRadius: '50%',
        width: '44px',
        height: '44px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 4px 14px rgba(0,0,0,0.25)',
        cursor: 'pointer',
        zIndex: 90
      }}
      aria-label="Scroll back to top"
    >
      <ArrowUp size={20} />
    </button>
  );
}

// Global Animated Routes with Fade-Down on every page transition
function AnimatedRoutes() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [location.pathname]);

  return (
    <div key={location.pathname} className="animate-fade-down" style={{ width: '100%' }}>
      <Suspense fallback={<PageFallback />}>
        <Routes location={location}>
          <Route path="/" element={<HomePage />} />
          <Route path="/collections" element={<CollectionsPage />} />
          <Route path="/collections/:handle" element={<CollectionsPage />} />
          <Route path="/products/:handle" element={<ProductDetailPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/pages/:slug" element={<CustomPage />} />
          <Route path="/policies/:slug" element={<PolicyPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </div>
  );
}

export default function App() {
  return (
    <CurrencyProvider>
      <CartProvider>
        <Router>
          <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            {/* Top Announcement Bar */}
            <AnnouncementBar />

            {/* Sticky Navigation Header */}
            <Header />

            {/* Slide-out Cart Drawer */}
            <CartDrawer />

            {/* Global Animated Page Container */}
            <main style={{ flex: 1 }}>
              <AnimatedRoutes />
            </main>

            {/* Floating Back to Top Button */}
            <BackToTop />

            {/* Site Footer */}
            <Footer />
          </div>
        </Router>
      </CartProvider>
    </CurrencyProvider>
  );
}
