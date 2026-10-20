import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { dataService } from '../lib/supabase';
import { ChevronRight } from 'lucide-react';

export default function PolicyPage() {
  const { slug } = useParams();
  const [policy, setPolicy] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    setLoading(true);
    dataService
      .getPolicyBySlug(slug)
      .then((p) => {
        setPolicy(p);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [slug]);

  if (loading) {
    return (
      <div className="page-width" style={{ padding: '6rem 1rem', textAlign: 'center', color: '#666' }}>
        Loading policy...
      </div>
    );
  }

  if (!policy) {
    return (
      <div className="page-width" style={{ padding: '6rem 1rem', textAlign: 'center' }}>
        <h2 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '1rem' }}>Policy Not Found</h2>
        <Link to="/" className="btn btn-primary">Return to Home</Link>
      </div>
    );
  }

  return (
    <div className="page-width animate-fade-down" style={{ padding: '2rem 1rem 5rem', maxWidth: '900px' }}>
      {/* Breadcrumb */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.825rem', color: '#666', marginBottom: '2rem' }}>
        <Link to="/" style={{ color: '#121212' }}>Home</Link>
        <ChevronRight size={14} />
        <span style={{ color: '#e22120', fontWeight: 600 }}>{policy.h1 || policy.title}</span>
      </div>

      <div style={{ marginBottom: '2.5rem', borderBottom: '1px solid #eee', paddingBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '2.4rem', fontWeight: 800, textTransform: 'uppercase' }}>
          {policy.h1 || policy.title}
        </h1>
      </div>

      <div
        style={{
          lineHeight: 1.8,
          fontSize: '1rem',
          color: '#333'
        }}
        dangerouslySetInnerHTML={{ __html: policy.content_html || `<p>${policy.content_text}</p>` }}
      />
    </div>
  );
}
