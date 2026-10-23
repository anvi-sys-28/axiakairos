import React from 'react';

export interface DiamondBackdropProps {
  variant?: 'zone' | 'about' | 'faq';
  className?: string;
}

/**
 * Reusable Decorative Diamond (Rhombus) Backdrop Component
 *
 * Renders flattened rhombus shapes rotated 45deg with soft blur, borders,
 * layered opacity, and gentle staggered floating animation.
 *
 * - `variant="zone"`: 7-diamond layout spanning across Sections A & B (Industries + Domain Nav)
 * - `variant="about"`: Paired diamond layout for the Sticky About Axia Kairos section
 * - `variant="faq"`: 5-diamond layout harmonizing behind the Frequently Asked Questions section
 */
export const DiamondBackdrop: React.FC<DiamondBackdropProps> = ({
  variant = 'zone',
  className = '',
}) => {
  if (variant === 'about') {
    return (
      <div className={`diamond-layer ${className}`} aria-hidden="true">
        <div className="diamond-glow" />
        <span className="diamond-about-1" />
        <span className="diamond-about-2" />
      </div>
    );
  }

  if (variant === 'faq') {
    return (
      <div className={`diamond-layer ${className}`} aria-hidden="true">
        <div className="diamond-glow" />
        <span className="diamond diamond-warm diamond-faq-1" />
        <span className="diamond diamond-cool diamond-faq-2" />
        <span className="diamond diamond-warm diamond-faq-3" />
        <span className="diamond diamond-cool diamond-faq-4" />
        <span className="diamond diamond-warm diamond-faq-5" />
      </div>
    );
  }

  return (
    <div className={`diamond-layer ${className}`} aria-hidden="true">
      <div className="diamond-glow" />
      <span className="diamond diamond-warm d1" />
      <span className="diamond diamond-cool d2" />
      <span className="diamond diamond-warm d3" />
      <span className="diamond diamond-cool d4" />
      <span className="diamond diamond-warm d5" />
      <span className="diamond diamond-cool d6" />
      <span className="diamond diamond-warm d7" />
    </div>
  );
};

export default DiamondBackdrop;
