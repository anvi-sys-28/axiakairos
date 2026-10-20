import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import type { CardItem } from './types';

interface ServiceCardRowProps {
  cards: CardItem[];
  onCardClick?: () => void;
}

const FALLBACK_IMAGES = [
  '/assets/case-studies/cloud-modernization-retail.png',
  '/assets/case-studies/sap-s4hana-migration-bfsi.png',
  '/assets/case-studies/manufacturing-automation-sap-btp.png',
  '/assets/case-studies/data-modernization-manufacturing.png',
  '/assets/case-studies/cloud-modernization-telecom.png',
  '/assets/case-studies/healthcare-data-integration-sap-btp.png',
];

export const ServiceCardRow: React.FC<ServiceCardRowProps> = ({ cards, onCardClick }) => {
  return (
    <div className="w-full my-3">
      <div
        className="flex gap-3 overflow-x-auto pb-2 scroll-smooth snap-x snap-mandatory scrollbar-thin scrollbar-thumb-slate-200"
        tabIndex={0}
        aria-label="Recommended services and case studies"
      >
        {cards.map((card, idx) => (
          <CardItemComponent
            key={`${card.slug}-${idx}`}
            card={card}
            index={idx}
            onClick={onCardClick}
          />
        ))}
      </div>
    </div>
  );
};

const CardItemComponent: React.FC<{ card: CardItem; index: number; onClick?: () => void }> = ({
  card,
  index,
  onClick,
}) => {
  const [imgError, setImgError] = useState(false);

  const fallbackImage = FALLBACK_IMAGES[index % FALLBACK_IMAGES.length];
  const displayImage = !imgError && card.image ? card.image : fallbackImage;

  return (
    <Link
      to={card.url}
      onClick={onClick}
      className="snap-start shrink-0 w-[240px] sm:w-[260px] rounded-2xl border border-slate-200/90 bg-white shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-200 flex flex-col justify-between overflow-hidden group select-none text-left"
    >
      <div>
        {/* 16:10 Photo Header */}
        <div className="w-full aspect-[16/10] bg-slate-100 overflow-hidden relative">
          <img
            src={displayImage}
            alt={card.title}
            onError={() => setImgError(true)}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        </div>

        {/* Title, Subtitle, and Right Arrow Button */}
        <div className="p-3.5 flex items-start justify-between gap-2.5">
          <div className="min-w-0 flex-1 space-y-0.5">
            <h4 className="font-sans text-sm font-bold text-slate-900 group-hover:text-blue-900 transition-colors line-clamp-1 leading-snug">
              {card.title}
            </h4>
            <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed font-normal">
              {card.subtitle}
            </p>
          </div>

          <div className="w-7 h-7 rounded-full border border-slate-300 shrink-0 flex items-center justify-center text-slate-600 group-hover:border-slate-800 group-hover:text-slate-900 transition-colors mt-0.5">
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </div>
      </div>
    </Link>
  );
};

