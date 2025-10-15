import { useEffect, useState } from 'react';
import './SearchBar.css';

const DEBOUNCE_DELAY = 300;

const SearchBar = ({ value = '', onChange, placeholder = 'جستجو' }) => {
  const [inputValue, setInputValue] = useState(value);

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  useEffect(() => {
    const handler = setTimeout(() => {
      if (typeof onChange === 'function') {
        onChange(inputValue);
      }
    }, DEBOUNCE_DELAY);

    return () => {
      clearTimeout(handler);
    };
  }, [inputValue, onChange]);

  return (
    <div className="search-bar">
      <input
        type="search"
        className="search-bar__input"
        value={inputValue}
        onChange={(event) => setInputValue(event.target.value)}
        placeholder={placeholder}
        aria-label="جستجو در واژه‌ها"
        dir="ltr"
      />
    </div>
  );
};

export default SearchBar;

