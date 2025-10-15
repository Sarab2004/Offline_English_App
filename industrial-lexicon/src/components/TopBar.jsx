import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../utils/theme.js';
import './TopBar.css';

const TopBar = ({ title, showBack = false, onBack, showThemeToggle = true, rightSlot }) => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  const handleBack = useCallback(() => {
    if (typeof onBack === 'function') {
      onBack();
      return;
    }

    navigate('/');
  }, [navigate, onBack]);

  return (
    <header className="topbar" role="banner">
      <div className="topbar__inner container">
        {showBack ? (
          <button
            type="button"
            className="topbar__back btn-secondary"
            onClick={handleBack}
            aria-label="بازگشت"
          >
            ‹
          </button>
        ) : (
          <span className="topbar__spacer" aria-hidden="true" />
        )}

        <h1 className="topbar__title text-xl font-semibold">{title}</h1>

        <div className="topbar__actions">
          {rightSlot}
          {showThemeToggle && (
            <button
              type="button"
              className="topbar__theme btn-secondary"
              onClick={toggleTheme}
              aria-label="تغییر تم"
              aria-pressed={theme === 'dark'}
            >
              🌓
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default TopBar;
