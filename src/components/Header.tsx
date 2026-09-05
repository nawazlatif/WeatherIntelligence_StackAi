import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Search,
  CloudSun,
  Loader2,
  RotateCw,
  MapPin,
  Compass,
  CornerDownLeft,
} from 'lucide-react';
import { UnitSystem, GeocodingResult } from '../types';
import { getCityAutofillSuggestions } from '../services/openMeteo';

interface HeaderProps {
  currentCity: string;
  onSearch: (city: string) => void;
  onSelectLocation?: (location: GeocodingResult) => void;
  isLoading: boolean;
  units: UnitSystem;
  onToggleUnits: () => void;
  onRefresh: () => void;
}

const POPULAR_CITIES = ['London', 'Tokyo', 'New York', 'Paris', 'Sydney', 'Dubai'];

export const Header: React.FC<HeaderProps> = ({
  currentCity,
  onSearch,
  onSelectLocation,
  isLoading,
  units,
  onToggleUnits,
  onRefresh,
}) => {
  const [searchInput, setSearchInput] = useState(currentCity);
  const [suggestions, setSuggestions] = useState<GeocodingResult[]>([]);
  const [isFetchingSuggestions, setIsFetchingSuggestions] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const latestQueryRef = useRef<string>('');

  // Keep input synced with current city when prop changes
  useEffect(() => {
    setSearchInput(currentCity);
  }, [currentCity]);

  // Click outside to close autofill recommendations
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Debounced autofill search
  useEffect(() => {
    const trimmed = searchInput.trim();
    latestQueryRef.current = trimmed;

    if (trimmed.length < 2) {
      setSuggestions([]);
      setIsFetchingSuggestions(false);
      setIsOpen(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsFetchingSuggestions(true);
      try {
        const results = await getCityAutofillSuggestions(trimmed, 8);
        // Only update if the query hasn't changed while request was in-flight
        if (latestQueryRef.current === trimmed) {
          setSuggestions(results);
          setIsOpen(true);
          setSelectedIndex(-1);
        }
      } catch (err) {
        console.error('Failed to load autofill suggestions:', err);
      } finally {
        if (latestQueryRef.current === trimmed) {
          setIsFetchingSuggestions(false);
        }
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [searchInput]);

  const handleSelectSuggestion = useCallback(
    (item: GeocodingResult) => {
      const display = item.admin1
        ? `${item.name}, ${item.admin1}`
        : item.name;

      setSearchInput(display);
      setIsOpen(false);
      setSuggestions([]);

      if (onSelectLocation) {
        onSelectLocation(item);
      } else {
        onSearch(display);
      }
    },
    [onSelectLocation, onSearch]
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedIndex >= 0 && suggestions[selectedIndex]) {
      handleSelectSuggestion(suggestions[selectedIndex]);
      return;
    }

    const trimmed = searchInput.trim();
    if (trimmed) {
      setIsOpen(false);
      onSearch(trimmed);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen || suggestions.length === 0) {
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) =>
        prev < suggestions.length - 1 ? prev + 1 : 0
      );
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) =>
        prev > 0 ? prev - 1 : suggestions.length - 1
      );
    } else if (e.key === 'Enter') {
      if (selectedIndex >= 0 && suggestions[selectedIndex]) {
        e.preventDefault();
        handleSelectSuggestion(suggestions[selectedIndex]);
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  const getLocationTypeLabel = (item: GeocodingResult) => {
    if (item.feature_code === 'PPLX') return 'Neighborhood';
    if (item.feature_code === 'PPLC') return 'Capital';
    if (item.feature_code === 'PPLA' || item.feature_code === 'PPLA2') return 'City';
    if (item.country_code) return item.country_code.toUpperCase();
    return 'Location';
  };

  return (
    <header
      id="app-header"
      className="bg-slate-950/90 backdrop-blur-md border-b border-slate-800/80 sticky top-0 z-40 shadow-lg"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
        {/* Top row: Brand & Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-cyan-500 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(6,182,212,0.4)] text-slate-950 shrink-0">
              <CloudSun className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-white leading-tight">
                Weather<span className="text-cyan-400 font-light ml-1">Intelligence</span>
              </h1>
              <p className="text-xs text-slate-400 font-medium hidden sm:block">
                Precision meteorological metrics & planning engine
              </p>
            </div>
          </div>

          {/* Unit Toggle & Refresh */}
          <div className="flex items-center gap-2.5 self-end sm:self-auto">
            <div className="inline-flex rounded-full border border-slate-800 p-1 bg-slate-900">
              <button
                type="button"
                id="unit-toggle-metric"
                onClick={units !== 'metric' ? onToggleUnits : undefined}
                className={`px-3 py-1 text-xs font-semibold rounded-full transition-all ${
                  units === 'metric'
                    ? 'bg-cyan-500 text-slate-950 shadow-[0_0_12px_rgba(6,182,212,0.4)]'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                °C (km/h)
              </button>
              <button
                type="button"
                id="unit-toggle-imperial"
                onClick={units !== 'imperial' ? onToggleUnits : undefined}
                className={`px-3 py-1 text-xs font-semibold rounded-full transition-all ${
                  units === 'imperial'
                    ? 'bg-cyan-500 text-slate-950 shadow-[0_0_12px_rgba(6,182,212,0.4)]'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                °F (mph)
              </button>
            </div>

            <button
              type="button"
              id="refresh-button"
              onClick={onRefresh}
              disabled={isLoading}
              title="Refresh weather data"
              className="p-2 text-slate-400 hover:text-cyan-400 hover:bg-slate-900 rounded-full border border-slate-800 transition-colors disabled:opacity-50"
            >
              <RotateCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-cyan-400' : ''}`} />
            </button>
          </div>
        </div>

        {/* Search Bar with Autofill Recommendations */}
        <div ref={containerRef} className="relative w-full">
          <form onSubmit={handleSubmit} className="relative w-full">
            <div className="relative flex items-center group">
              <Search className="absolute left-4 w-4 h-4 text-slate-500 group-focus-within:text-cyan-400 transition-colors pointer-events-none" />
              <input
                ref={inputRef}
                id="city-search-input"
                type="text"
                value={searchInput}
                onChange={(e) => {
                  setSearchInput(e.target.value);
                  if (!isOpen && e.target.value.trim().length >= 2) {
                    setIsOpen(true);
                  }
                }}
                onFocus={() => {
                  if (suggestions.length > 0 && searchInput.trim().length >= 2) {
                    setIsOpen(true);
                  }
                }}
                onKeyDown={handleKeyDown}
                placeholder="Search city, neighborhood, or borough (e.g. Brooklyn, Greenwich, Tokyo)..."
                disabled={isLoading}
                autoComplete="off"
                aria-autocomplete="list"
                aria-expanded={isOpen}
                className="w-full bg-slate-900 border border-slate-800 rounded-full py-2.5 px-5 pl-11 pr-28 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/50 transition-all shadow-inner disabled:opacity-60"
              />

              {/* Status indicator / loader */}
              <div className="absolute right-24 flex items-center">
                {isFetchingSuggestions && (
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-cyan-400 mr-2" />
                )}
              </div>

              <button
                type="submit"
                id="city-search-submit"
                disabled={isLoading || !searchInput.trim()}
                className="absolute right-2 top-1.5 px-3.5 py-1 bg-slate-800 hover:bg-cyan-500 hover:text-slate-950 text-slate-300 rounded-full text-xs font-semibold tracking-wider transition-colors flex items-center gap-1.5 border border-slate-700/50 disabled:opacity-50 uppercase"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>SEARCH</span>
                  </>
                ) : (
                  <span>SEARCH</span>
                )}
              </button>
            </div>
          </form>

          {/* Autofill Recommendations Dropdown */}
          {isOpen && (
            <div
              id="autofill-recommendations-dropdown"
              className="absolute left-0 right-0 top-full mt-2 bg-slate-900/95 backdrop-blur-xl border border-slate-800 rounded-2xl shadow-2xl overflow-hidden py-1.5 z-50 animate-in fade-in slide-in-from-top-1 duration-150"
            >
              <div className="px-3.5 py-1.5 flex items-center justify-between text-[11px] font-semibold tracking-wider uppercase text-slate-400 border-b border-slate-800/80 mb-1">
                <div className="flex items-center gap-1.5 text-cyan-400">
                  <Compass className="w-3.5 h-3.5" />
                  <span>Location Recommendations</span>
                </div>
                <span className="text-[10px] text-slate-500 hidden sm:inline">
                  Use ↑ ↓ to navigate, ↵ to select
                </span>
              </div>

              {suggestions.length > 0 ? (
                <ul className="max-h-72 overflow-y-auto divide-y divide-slate-800/40">
                  {suggestions.map((item, index) => {
                    const isSelected = index === selectedIndex;
                    const locationType = getLocationTypeLabel(item);
                    const regionText = [item.admin1, item.country]
                      .filter(Boolean)
                      .join(', ');

                    return (
                      <li key={`${item.id}-${index}`}>
                        <button
                          type="button"
                          id={`autofill-option-${item.id}`}
                          onClick={() => handleSelectSuggestion(item)}
                          onMouseEnter={() => setSelectedIndex(index)}
                          className={`w-full text-left px-3.5 py-2.5 flex items-center justify-between gap-3 transition-colors ${
                            isSelected
                              ? 'bg-cyan-500/15 text-cyan-100'
                              : 'hover:bg-slate-800/60 text-slate-200'
                          }`}
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div
                              className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                                isSelected
                                  ? 'bg-cyan-500/20 text-cyan-300'
                                  : 'bg-slate-800 text-slate-400'
                              }`}
                            >
                              <MapPin className="w-4 h-4" />
                            </div>
                            <div className="min-w-0">
                              <p className="text-sm font-semibold truncate leading-tight">
                                {item.name}
                              </p>
                              <p className="text-xs text-slate-400 truncate leading-tight mt-0.5">
                                {regionText || 'Coordinates available'}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-full border tracking-wide uppercase ${
                                item.feature_code === 'PPLX'
                                  ? 'bg-purple-500/10 text-purple-300 border-purple-500/30'
                                  : item.feature_code === 'PPLC'
                                  ? 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                                  : 'bg-slate-800 text-slate-400 border-slate-700/60'
                              }`}
                            >
                              {locationType}
                            </span>
                            {isSelected && (
                              <CornerDownLeft className="w-3.5 h-3.5 text-cyan-400" />
                            )}
                          </div>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              ) : isFetchingSuggestions ? (
                <div className="px-4 py-6 text-center text-xs text-slate-400 flex items-center justify-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin text-cyan-400" />
                  <span>Locating matching places...</span>
                </div>
              ) : (
                <div className="px-4 py-5 text-center text-xs text-slate-400">
                  No matching cities or neighborhoods found for{' '}
                  <span className="text-cyan-300 font-semibold">"{searchInput}"</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Popular City Pills */}
        <div className="flex items-center gap-2 mt-2.5 overflow-x-auto pb-1 no-scrollbar text-xs">
          <span className="text-slate-500 shrink-0 font-medium text-[11px] uppercase tracking-wider">
            Quick Select:
          </span>
          {POPULAR_CITIES.map((city) => (
            <button
              key={city}
              id={`popular-city-${city.toLowerCase().replace(' ', '-')}`}
              type="button"
              onClick={() => {
                setSearchInput(city);
                setIsOpen(false);
                onSearch(city);
              }}
              disabled={isLoading}
              className="px-3 py-1 rounded-full bg-slate-900/90 hover:bg-slate-800 text-slate-400 hover:text-cyan-300 border border-slate-800/80 hover:border-cyan-500/40 transition-all shrink-0 text-xs disabled:opacity-50"
            >
              {city}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
};
