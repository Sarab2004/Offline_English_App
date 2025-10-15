import TopBar from '../components/TopBar';
import CategoryCard from '../components/CategoryCard';

const categories = [
  { title: 'کنترل پروژه', slug: 'control-project' },
  { title: 'اقتصاد', slug: 'economics' },
  { title: 'برنامه‌ریزی تولید', slug: 'production-planning' },
  { title: 'تحقیق در عملیات', slug: 'or' },
  { title: 'کیفیت و استانداردها', slug: 'quality' },
];

const HomePage = () => {
  return (
    <>
      <TopBar title="واژگان صنعتی" />
      <div className="page-shell container">
        <header className="page-header">
          <h2 className="page-title">دسته‌بندی‌های اصلی</h2>
          <p className="page-subtitle text-sm">
            مجموعه‌ای از دسته‌بندی‌های کلیدی برای یادگیری واژه‌های تخصصی صنعت.
          </p>
        </header>

        <section className="category-grid" aria-label="دسته‌بندی‌ها">
          {/* در مراحل بعدی این فهرست به داده‌های واقعی متصل می‌شود */}
          {categories.map((category) => (
            <CategoryCard key={category.slug} {...category} />
          ))}
        </section>
      </div>
    </>
  );
};

export default HomePage;
