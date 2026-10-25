import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ArrowRight, X, Sparkles, Layers, FileText, Compass, ExternalLink } from 'lucide-react';
import { searchSite, popularSearchItems, type SearchItem, type SearchCategory } from '../data/searchIndex';

interface SearchBarProps {
  placeholder?: string;
  onSearch?: (query: string) => void;
  className?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  placeholder = "Search for a service...",
  onSearch,
  className = ""
}) => {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);
  const navigate = useNavigate();

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  // Compute suggestions based on query
  const suggestions = useMemo(() => {
    if (!query.trim()) {
      return popularSearchItems;
    }
    return searchSite(query, 6);
  }, [query]);

  // Reset selected index when query or suggestions change
  useEffect(() => {
    setSelectedIndex(-1);
  }, [query]);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Scroll active item into view
  useEffect(() => {
    if (selectedIndex >= 0 && listRef.current) {
      const activeElement = listRef.current.children[selectedIndex] as HTMLElement;
      if (activeElement) {
        activeElement.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [selectedIndex]);

  const handleSelect = useCallback((item: SearchItem) => {
    setIsOpen(false);
    setQuery(item.title);
    if (onSearch) {
      onSearch(item.title);
    }
    navigate(item.url);
  }, [navigate, onSearch]);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (selectedIndex >= 0 && suggestions[selectedIndex]) {
      handleSelect(suggestions[selectedIndex]);
      return;
    }

    const trimmed = query.trim();
    if (!trimmed) {
      navigate('/services');
      return;
    }

    if (suggestions.length > 0) {
      // Navigate to top best match
      handleSelect(suggestions[0]);
    } else {
      // Fallback: Navigate to /services with query param
      setIsOpen(false);
      if (onSearch) onSearch(trimmed);
      navigate(`/services?q=${encodeURIComponent(trimmed)}`);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen) {
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        setIsOpen(true);
        e.preventDefault();
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : 0));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : suggestions.length - 1));
        break;
      case 'Enter':
        e.preventDefault();
        handleSubmit();
        break;
      case 'Escape':
        e.preventDefault();
        setIsOpen(false);
        break;
    }
  };

  const getCategoryBadge = (category: SearchCategory) => {
    switch (category) {
      case 'service':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wider font-semibold bg-blue-50 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 border border-blue-200/60 dark:border-blue-700/50 shrink-0">
            <Layers className="w-2.5 h-2.5" />
            Service
          </span>
        );
      case 'case_study':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wider font-semibold bg-emerald-50 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-700/50 shrink-0">
            <FileText className="w-2.5 h-2.5" />
            Case Study
          </span>
        );
      case 'blog':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wider font-semibold bg-purple-50 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 border border-purple-200/60 dark:border-purple-700/50 shrink-0">
            Blog
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wider font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 shrink-0">
            <Compass className="w-2.5 h-2.5" />
            Page
          </span>
        );
    }
  };

  return (
    <div ref={containerRef} className={`relative w-full max-w-[555px] ${isOpen ? 'z-50' : 'z-20'} ${className}`}>
      {/* Search Input Pill Form */}
      <form 
        onSubmit={handleSubmit}
        role="search"
        aria-label="Service search"
        className="relative flex items-center w-full h-[54px] sm:h-[60px] bg-white/95 dark:bg-[#0d1624]/95 backdrop-blur-md rounded-full shadow-[0_12px_36px_rgba(0,0,0,0.08)] dark:shadow-[0_12px_36px_rgba(0,0,0,0.4)] border border-slate-200/80 dark:border-white/15 transition-all duration-300 focus-within:shadow-[0_14px_44px_rgba(0,0,0,0.16)] focus-within:border-blue-400 dark:focus-within:border-[#8FB2F2]"
      >
        <label htmlFor="service-search-input" className="sr-only">
          Search for a service
        </label>

        {/* Left Search Icon */}
        <div className="pl-4 sm:pl-6 pr-2 sm:pr-3 flex items-center pointer-events-none text-slate-400 dark:text-slate-400 shrink-0">
          <Search className="h-4 sm:h-5 w-4 sm:w-5 stroke-[2.2]" aria-hidden="true" />
        </div>

        {/* Input Field */}
        <input
          ref={inputRef}
          id="service-search-input"
          type="text"
          role="combobox"
          aria-expanded={isOpen}
          aria-autocomplete="list"
          aria-controls="search-suggestions-dropdown"
          value={query}
          onFocus={() => setIsOpen(true)}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="w-full bg-transparent text-[14px] sm:text-[15.5px] text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-400 font-normal focus:outline-none pr-2 min-w-0"
          autoComplete="off"
        />

        {/* Clear Button (when text exists) */}
        {query && (
          <button
            type="button"
            onClick={() => {
              setQuery("");
              inputRef.current?.focus();
            }}
            aria-label="Clear search query"
            className="p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/10 transition-colors mr-1"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}

        {/* Thin Vertical Divider (Desktop/tablet only) */}
        <div className="hidden sm:block h-7 w-[1px] bg-slate-200 dark:bg-white/20 shrink-0 mx-1 sm:mx-1.5" aria-hidden="true" />

        {/* Circular Navy Submit / Go Button */}
        <button
          type="submit"
          aria-label="Submit search"
          title="Search services"
          className="w-[40px] h-[40px] sm:w-[48px] sm:h-[48px] rounded-full bg-[#071325] dark:bg-[#1e293b] hover:bg-[#0c1c36] dark:hover:bg-[#334155] text-white shrink-0 mr-1.5 flex items-center justify-center active:scale-95 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#071325] dark:focus-visible:ring-slate-300 group shadow-sm border border-transparent dark:border-white/15 cursor-pointer"
        >
          <ArrowRight className="h-4 sm:h-4.5 w-4 sm:w-4.5 transition-transform duration-200 group-hover:translate-x-0.5" aria-hidden="true" />
        </button>
      </form>

      {/* Autocomplete Suggestions Dropdown */}
      {isOpen && (
        <div 
          id="search-suggestions-dropdown"
          className="absolute left-0 right-0 top-[calc(100%+8px)] z-50 bg-white/95 dark:bg-[#0c1626]/95 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.18)] dark:shadow-[0_25px_70px_rgba(0,0,0,0.65)] border border-slate-200/90 dark:border-white/15 overflow-hidden py-2 text-left animate-in fade-in zoom-in-95 duration-150 select-none"
        >
          {/* Header Label */}
          <div className="px-5 py-2 text-[11px] font-mono uppercase tracking-wider text-slate-400 dark:text-slate-400 border-b border-slate-100 dark:border-white/10 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3 h-3 text-blue-600 dark:text-[#8FB2F2]" />
              {query.trim() ? 'Matching Services & Insights' : 'Popular Services'}
            </span>
            <span className="text-[10px] text-slate-400 dark:text-slate-400 font-mono">
              ↑↓ navigate · enter select
            </span>
          </div>

          {/* Suggestions List */}
          {suggestions.length > 0 ? (
            <ul ref={listRef} role="listbox" className="max-h-[340px] overflow-y-auto py-1 divide-y divide-slate-100/70 dark:divide-white/5 scrollbar-thin scrollbar-thumb-slate-200">
              {suggestions.map((item, idx) => {
                const isSelected = idx === selectedIndex;
                return (
                  <li
                    key={item.id}
                    role="option"
                    aria-selected={isSelected}
                    onClick={() => handleSelect(item)}
                    onMouseEnter={() => setSelectedIndex(idx)}
                    className={`px-5 py-3 flex items-center justify-between gap-3 cursor-pointer transition-colors duration-150 ${
                      isSelected
                        ? 'bg-blue-50/90 dark:bg-white/10 text-blue-900 dark:text-white'
                        : 'hover:bg-slate-50 dark:hover:bg-white/5 text-slate-800 dark:text-slate-100'
                    }`}
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-[14px] sm:text-[14.5px] font-semibold tracking-tight truncate">
                          {item.title}
                        </span>
                        {getCategoryBadge(item.category)}
                      </div>
                      <p className="text-[12px] text-slate-500 dark:text-slate-400 truncate font-normal">
                        {item.subtitle}
                      </p>
                    </div>

                    <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                      isSelected
                        ? 'bg-[#071325] text-white dark:bg-white dark:text-[#071325]'
                        : 'text-slate-400 dark:text-slate-500'
                    }`}>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  </li>
                );
              })}
            </ul>
          ) : (
            <div className="px-5 py-6 text-center text-slate-500 dark:text-slate-400 space-y-2">
              <p className="text-sm">
                No direct matches found for <strong className="text-slate-800 dark:text-white font-semibold">"{query}"</strong>
              </p>
              <div className="pt-2 flex items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsOpen(false);
                    navigate(`/services?q=${encodeURIComponent(query.trim())}`);
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-[#071325] dark:bg-white text-white dark:text-[#071325] hover:opacity-90 transition-opacity"
                >
                  <span>Explore All Services</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
              </div>
            </div>
          )}

          {/* Footer Strip */}
          <div className="px-5 pt-2 pb-1 border-t border-slate-100 dark:border-white/10 flex items-center justify-between text-[11px] font-mono text-slate-400 dark:text-slate-400">
            <span>Press Enter to visit</span>
            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                navigate('/services');
              }}
              className="hover:text-blue-600 dark:hover:text-white transition-colors underline"
            >
              Browse all 12 services
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
