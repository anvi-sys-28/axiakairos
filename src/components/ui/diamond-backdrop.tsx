import React from 'react';

export interface DiamondBackdropProps {
  variant?: 'zone' | 'about';
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

  return (
    <div className={`diamond-layer ${className}`} aria-hidden="true">
      <div className="diamond-glow" />
      <span className="diamond d1" />
      <span className="diamond d2" />
      <span className="diamond d3" />
      <span className="diamond d4" />
      <span className="diamond d5" />
      <span className="diamond d6" />
      <span className="diamond d7" />
    </div>
  );
};

export default DiamondBackdrop;
