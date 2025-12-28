// src/components/Common.tsx
import React, { useMemo, useState } from 'react';
import { BANNED_IMAGE_URLS } from '../constants';
import { FaChevronLeft, FaChevronRight, FaSearch, FaChevronUp, FaCheck } from 'react-icons/fa';

// ModeratedImage
export function ModeratedImage({ src, alt, className, ...rest }: { src: string | undefined, alt: string | undefined, className?: string, [key: string]: any }) {
    if (!src || BANNED_IMAGE_URLS.includes(src)) {
        const domain = src ? new URL(src).hostname : 'cdn.modrinth.com';
        return (
            <div className={`moderated-image-placeholder ${className || ''}`}>
                <p>Изображение с {domain} заблокировано по требованию РКН</p>
            </div>
        );
    }
    return <img src={src} alt={alt} className={className} {...rest} />;
}

// ProjectIcon
export function function ProjectIcon({ projectType }: { projectType: string }) {
  switch (projectType) {
    case 'mods':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2">
          <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16" />
          <path d="M3.29 7 12 12l8.71-5M12 22V12" />
        </svg>
      );
    case 'resourcepacks':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2">
          <path d="M18.37 2.63 14 7l-1.59-1.59a2 2 0 0 0-2.82 0L8 7l9 9 1.59-1.59a2 2 0 0 0 0-2.82L17 10l4.37-4.37a2.12 2.12 0 1 0-3-3" />
          <path d="M9 8c-2 3-4 3.5-7 4l8 10c2-1 6-5 6-7M14.5 17.5 4.5 15" />
        </svg>
      );
    case 'datapacks':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"> 
          <path d="M8 3H7a2 2 0 0 0-2 2v5a2 2 0 0 1-2 2 2 2 0 0 1 2 2v5c0 1.1.9 2 2 2h1M16 21h1a2 2 0 0 0 2-2v-5c0-1.1.9-2 2-2a2 2 0 0 1-2-2V5a2 2 0 0 0-2-2h-1" />
        </svg>
      );
    case 'shaders':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2">
          <path d="M14 15a2 2 0 0 0-2-2 2 2 0 0 0-2 2M2.5 13 5 7c.7-1.3 1.4-2 3-2M21.5 13 19 7c-.7-1.3-1.5-2-3-2" />
          <circle cx="18" cy="15" r="4"></circle>
          <circle cx="6" cy="15" r="4"></circle>
        </svg>
      );
    case 'modpacks':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2">
          <path d="M12 22v-9M15.17 2.21a1.67 1.67 0 0 1 1.63 0L21 4.57a1.93 1.93 0 0 1 0 3.36L8.82 14.79a1.66 1.66 0 0 1-1.64 0L3 12.43a1.93 1.93 0 0 1 0-3.36z" />
          <path d="M20 13v3.87a2.06 2.06 0 0 1-1.11 1.83l-6 3.08a1.93 1.93 0 0 1-1.78 0l-6-3.08A2.06 2.06 0 0 1 4 16.87V13" />
          <path d="M21 12.43a1.93 1.93 0 0 0 0-3.36L8.83 2.2a1.64 1.64 0 0 0-1.63 0L3 4.57a1.93 1.93 0 0 0 0 3.36l12.18 6.86a1.64 1.64 0 0 0 1.63 0z" />
        </svg>
      );
    case 'plugins':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2">
          <path d="M12 22v-5M9 8V2M15 8V2M18 8v5a4 4 0 0 1-4 4h-4a4 4 0 0 1-4-4V8Z" />
        </svg>
      );
    default:
      return null;
  }
}

// --- Pagination ---
export function Pagination({ currentPage, totalPages, onPageChange }: { currentPage: number, totalPages: number, onPageChange: (page: number) => void }) {
  const pages = useMemo(() => {
    const pageNumbers: (number | string)[] = [];
    const maxVisiblePages = 5; 
    
    if (totalPages <= maxVisiblePages + 2) { 
        for (let i = 1; i <= totalPages; i++) pageNumbers.push(i);
    } else {
        pageNumbers.push(1);
        let startPage = Math.max(2, currentPage + 1 - Math.floor(maxVisiblePages / 2));
        let endPage = Math.min(totalPages - 1, currentPage + 1 + Math.floor(maxVisiblePages / 2));
        if (currentPage + 1 < maxVisiblePages) {
            startPage = 2;
            endPage = maxVisiblePages;
        } else if (currentPage + 1 > totalPages - maxVisiblePages + 1) {
            startPage = totalPages - maxVisiblePages + 1;
            endPage = totalPages - 1;
        }
        if (startPage > 2) pageNumbers.push('...');
        for (let i = startPage; i <= endPage; i++) pageNumbers.push(i);
        if (endPage < totalPages - 1) pageNumbers.push('...');
        pageNumbers.push(totalPages);
    }
    return pageNumbers;
  }, [currentPage, totalPages]);

  if (totalPages <= 1) return null;

  return (
    <div className="pagination">
      <button 
        className="page-number control"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 0}
      >
        <FaChevronLeft />
      </button>
      {pages.map((page, index) => 
        typeof page === 'number' ? (
          <button
            key={`${page}-${index}`}
            className={`page-number ${currentPage + 1 === page ? 'active' : ''}`}
            onClick={() => onPageChange(page - 1)}
          >
            {page}
          </button>
        ) : (
          <span key={`ellipsis-${index}`} className="page-number ellipsis">...</span>
        )
      )}
      <button 
        className="page-number control"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage + 1 === totalPages}
      >
        <FaChevronRight />
      </button>
    </div>
  );
}

// --- CustomSelector ---
export const CustomSelector = ({ label, icon, options, selected, onChange, searchable = false, searchPlaceholder = 'Search...', disabled = false, showAllToggle }: { label: string, icon: React.ReactNode, options: string[], selected: string, onChange: (v: string) => void, searchable?: boolean, searchPlaceholder?: string, disabled?: boolean, showAllToggle?: { checked: boolean, onChange: (c: boolean) => void } }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const filteredOptions = searchable ? options.filter(opt => opt.toLowerCase().includes(searchTerm.toLowerCase())) : options;

    // Открываем селектор версий по умолчанию
    useEffect(() => {
        if (label === "Game version") {
            setIsOpen(true);
        }
    }, [label]);

    return (
        <div className="custom-select-container">
            <button className={`custom-select-button ${isOpen ? 'open' : ''} ${disabled ? 'disabled' : ''}`} onClick={() => !disabled && setIsOpen(!isOpen)}>
                <span>{icon} {label}: {selected || 'Select...'}</span>
                {!disabled && <FaChevronUp className={`chevron ${isOpen ? 'open' : ''}`} />}
            </button>
            <div className={`custom-select-dropdown ${isOpen && !disabled ? 'open' : ''}`}>
                <div className="dropdown-content-wrapper">
                    {searchable && (
                        <div className="dropdown-search-box">
                            <FaSearch />
                            <input type="text" placeholder={searchPlaceholder} value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
                        </div>
                    )}
                    <div className="options-list">
                        {filteredOptions.map(opt => (
                            <button key={opt} className={`option-button ${selected === opt ? 'selected' : ''}`}
                                onClick={() => {
                                    onChange(opt);
                                    if (label === "Game version") setIsOpen(false); // Сворачиваем только селектор версий
                                }}>
                                {opt} {selected === opt && <FaCheck />}
                            </button>
                        ))}
                    </div>
                    {showAllToggle && (
                        <div className="dropdown-footer">
                            <label className="show-all-toggle">
                                <input 
                                    type="checkbox" 
                                    className="custom-checkbox-input" 
                                    checked={showAllToggle.checked} 
                                    onChange={e => showAllToggle.onChange(e.target.checked)} 
                                />
                                <span className="custom-checkbox-visual"><FaCheck /></span>
                                <span className="checkbox-label-text">Show all versions</span>
                            </label>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
