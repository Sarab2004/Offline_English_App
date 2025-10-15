import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import TopBar from '../components/TopBar';
import WordCard from '../components/WordCard';
import SearchBar from '../components/SearchBar';
import FilterPills from '../components/FilterPills';
import { loadWords } from '../utils/dataLoader.js';

const categoryTitles = {
  'control-project': 'کنترل پروژه',
  economics: 'اقتصاد',
  'production-planning': 'برنامه‌ریزی تولید',
  or: 'تحقیق در عملیات',
  quality: 'کیفیت و استانداردها',
};

const CategoryPage = () => {
  const { slug } = useParams();
  const resolvedSlug = slug || 'unknown';
  const title = categoryTitles[resolvedSlug] || resolvedSlug;
  const [allWords, setAllWords] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('');

  const searchStorageKey = `ilx:search:${resolvedSlug}`;
  const filterStorageKey = `ilx:filters:${resolvedSlug}`;

  useEffect(() => {
    let isMounted = true;

    const fetchWords = async () => {
      try {
        const words = await loadWords();
        if (isMounted) {
          setAllWords(words);
        }
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('[CategoryPage] Failed to load words:', error);
        if (isMounted) {
          setAllWords([]);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchWords();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const storedSearch = window.localStorage.getItem(searchStorageKey);
    const storedFilter = window.localStorage.getItem(filterStorageKey);

    setSearchQuery(storedSearch || '');
    setActiveFilter(storedFilter || '');
  }, [filterStorageKey, searchStorageKey]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(searchStorageKey, searchQuery);
  }, [searchQuery, searchStorageKey]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(filterStorageKey, activeFilter);
  }, [activeFilter, filterStorageKey]);

  const categoryWords = useMemo(
    () => allWords.filter((word) => word.category === resolvedSlug),
    [allWords, resolvedSlug]
  );

  const posOptions = useMemo(() => {
    const unique = new Map();

    categoryWords.forEach((word) => {
      const pos = word.pos ? word.pos.trim() : '';
      if (!pos) return;
      const key = pos.toLowerCase();
      if (!unique.has(key)) {
        unique.set(key, pos);
      }
    });

    return Array.from(unique.values());
  }, [categoryWords]);

  useEffect(() => {
    if (!activeFilter) return;
    if (posOptions.length === 0) return;

    const exists = posOptions.some(
      (option) => option.toLowerCase() === activeFilter.toLowerCase()
    );

    if (!exists) {
      setActiveFilter('');
    }
  }, [activeFilter, posOptions]);

  const filteredByPos = useMemo(() => {
    if (!activeFilter) return categoryWords;
    const target = activeFilter.toLowerCase();
    return categoryWords.filter((word) => (word.pos || '').toLowerCase() === target);
  }, [activeFilter, categoryWords]);

  const normalizedQuery = useMemo(() => searchQuery.trim(), [searchQuery]);

  const filteredWords = useMemo(() => {
    if (!normalizedQuery) {
      return filteredByPos;
    }

    const query = normalizedQuery.toLowerCase();

    return filteredByPos.filter((word) => {
      const termMatch = word.term_en?.toLowerCase().includes(query);
      const defMatch = Array.isArray(word.definitions_en)
        ? word.definitions_en.some((definition) => definition.toLowerCase().includes(query))
        : false;

      return termMatch || defMatch;
    });
  }, [filteredByPos, normalizedQuery]);

  const wordCountLabel = `${filteredWords.length.toLocaleString('fa-IR')} مورد`;

  return (
    <>
      <TopBar
        title={title}
        showBack
        rightSlot={
          <span className="category-page__count-badge" aria-label={`تعداد واژه‌ها: ${wordCountLabel}`}>
            {wordCountLabel}
          </span>
        }
      />

      <div className="page-shell container">
        <SearchBar value={searchQuery} onChange={setSearchQuery} placeholder="جستجو در واژه‌ها" />

        <FilterPills options={posOptions} value={activeFilter} onChange={setActiveFilter} />

        <header className="page-header category-page__header">
          <p className="page-subtitle text-sm">واژه‌های کلیدی مرتبط با این دسته.</p>
        </header>

        {isLoading ? (
          <div className="category-page__empty card" role="status">
            <p>در حال بارگذاری داده‌ها...</p>
          </div>
        ) : filteredWords.length > 0 ? (
          <section className="category-page__list" aria-label="لیست واژه‌ها">
            {/* در مراحل بعدی این کارت‌ها با داده‌های آفلاین گسترده‌تر جایگزین می‌شوند */}
            {filteredWords.map((word) => (
              <WordCard key={word.id} {...word} highlightQuery={normalizedQuery} />
            ))}
          </section>
        ) : (
          <div className="category-page__empty card" role="status">
            <p>{normalizedQuery || activeFilter ? 'موردی یافت نشد.' : 'هنوز واژه‌ای برای این دسته ثبت نشده.'}</p>
          </div>
        )}
      </div>
    </>
  );
};

export default CategoryPage;
