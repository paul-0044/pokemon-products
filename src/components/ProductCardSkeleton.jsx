import React from 'react';

export default function ProductCardSkeleton() {
  return (
    <div className="product-card skeleton-card animate-fade-down" style={{ pointerEvents: 'none' }}>
      {/* 1:1 Media Container Skeleton */}
      <div className="product-card-media" style={{ backgroundColor: '#f0f0f0' }}>
        <div className="skeleton-box" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} />
      </div>

      {/* Content Skeleton */}
      <div className="product-card-content" style={{ gap: '0.5rem' }}>
        {/* Vendor */}
        <div className="skeleton-box" style={{ width: '40%', height: '12px' }} />
        
        {/* Title (2 lines) */}
        <div className="skeleton-box" style={{ width: '90%', height: '16px' }} />
        <div className="skeleton-box" style={{ width: '65%', height: '16px', marginBottom: '0.5rem' }} />

        {/* Rating stars placeholder */}
        <div className="skeleton-box" style={{ width: '30%', height: '12px', marginBottom: '0.5rem' }} />

        {/* Price Row */}
        <div className="skeleton-box" style={{ width: '50%', height: '22px', marginTop: 'auto' }} />
      </div>

      {/* Button placeholder */}
      <div style={{ padding: '0 1rem 1rem' }}>
        <div className="skeleton-box" style={{ width: '100%', height: '36px' }} />
      </div>
    </div>
  );
}
