import './FilterPills.css';

const FilterPills = ({ options = [], value = '', onChange }) => {
  if (!options.length) {
    return null;
  }

  const handleSelect = (option) => {
    if (typeof onChange !== 'function') return;

    if (value === option) {
      onChange('');
    } else {
      onChange(option);
    }
  };

  return (
    <div className="filter-pills" role="group" aria-label="فیلتر بر اساس نقش دستوری">
      {options.map((option) => (
        <button
          key={option}
          type="button"
          className={`filter-pill${value === option ? ' is-active' : ''}`}
          onClick={() => handleSelect(option)}
          aria-pressed={value === option}
          dir="ltr"
        >
          {option}
        </button>
      ))}
    </div>
  );
};

export default FilterPills;

