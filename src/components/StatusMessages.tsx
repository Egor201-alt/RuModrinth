import { useState, useEffect } from 'react';
import { FaExclamationTriangle, FaSyncAlt } from 'react-icons/fa';
const LOGO_SRC = 'RuModrinth_logo.png'; 

export function ModernLoader({ showText = true }: { showText?: boolean }) {
  const [isLongLoading, setIsLongLoading] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLongLoading(true);
    }, 15000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="modern-loader-container">
      <div className="loader-visuals">
        <div className="spinner-ring"></div>
        <img src={LOGO_SRC} alt="Loading..." className="loader-logo-pulse" 
             onError={(e) => e.currentTarget.style.display = 'none'} /> 
      </div>
      
      {showText && (
        <div className="loader-text-content">
          <h3 className="loading-title">Загрузка данных...</h3>
          <div className={`long-loading-message ${isLongLoading ? 'visible' : ''}`}>
            <FaSyncAlt className="spin-slow" />
            <span>API перегружен.<br/>Пожалуйста, подождите еще немного...</span>
          </div>
        </div>
      )}
    </div>
  );
}

export function ErrorDisplay({ message, onRetry }: { message: string, onRetry?: () => void }) {
  return (
    <div className="error-display-card">
      <div className="error-icon-wrapper">
        <FaExclamationTriangle />
      </div>
      <div className="error-content">
        <h4>Упс! Произошла ошибка</h4>
        <p>{message}</p>
        {message.includes('Failed to fetch') && (
            <small>Возможно, проблема с соединением или CORS. Попробуйте обновить страницу.</small>
        )}
      </div>
      {onRetry && (
        <button onClick={onRetry} className="retry-button">
          Попробовать снова
        </button>
      )}
    </div>
  );
}
