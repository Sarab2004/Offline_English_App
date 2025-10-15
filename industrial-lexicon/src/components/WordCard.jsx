import { useMemo, useState } from 'react';
import { highlightMatch } from '../utils/highlight.js';
import './WordCard.css';

const WordCard = ({ id, term_en, definitions_en = [], examples = [], highlightQuery = '' }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [hasFlipped, setHasFlipped] = useState(false);

  const primaryDefinition = definitions_en[0] || '';

  const backId = useMemo(() => {
    if (id) {
      return `word-card-back-${id}`;
    }

    if (typeof term_en === 'string') {
      const safeTerm = term_en
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, '');
      return `word-card-back-${safeTerm || 'term'}`;
    }

    return 'word-card-back-term';
  }, [id, term_en]);

  const toggleFlip = () => {
    setIsFlipped((prev) => {
      const next = !prev;

      if (next && !hasFlipped) {
        setHasFlipped(true);
      }

      return next;
    });
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      toggleFlip();
    }
  };

  const highlightedTerm = useMemo(
    () => highlightMatch(term_en, highlightQuery),
    [highlightQuery, term_en]
  );

  return (
    <article
      className={`word-card word-card--interactive${isFlipped ? ' is-flipped' : ''}`}
      role="button"
      tabIndex={0}
      aria-expanded={isFlipped}
      aria-controls={hasFlipped ? backId : undefined}
      aria-label={`اصطلاح ${term_en}`}
      onClick={toggleFlip}
      onKeyDown={handleKeyDown}
    >
      <div className="word-card__inner">
        <div className="word-card__face word-card__front" aria-hidden={isFlipped}>
          <span className="word-card__term" dir="ltr">
            {highlightedTerm}
          </span>
          <span className="word-card__divider" aria-hidden="true" />
          {primaryDefinition && (
            <p className="word-card__definition">{primaryDefinition}</p>
          )}
        </div>

        {hasFlipped && (
          <div
            className="word-card__face word-card__back"
            id={backId}
            aria-hidden={!isFlipped}
          >
            <h3 className="word-card__section-title">معانی و مثال‌ها</h3>
            <ul className="word-card__examples">
              {examples.map((example, index) => (
                <li key={index} className="word-card__example-item">
                  <span className="word-card__example-text" dir="ltr">
                    {example.en}
                  </span>
                  <span className="word-card__example-divider" aria-hidden="true" />
                  <span className="word-card__example-translation">{example.fa}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </article>
  );
};

export default WordCard;
