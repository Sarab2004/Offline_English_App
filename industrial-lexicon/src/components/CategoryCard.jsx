import { Link } from 'react-router-dom';

const CategoryCard = ({ title, slug }) => {
  return (
    <Link
      to={`/c/${slug}`}
      className="category-card"
      aria-label={`نمایش دسته ${title}`}
    >
      <div className="category-card__content">
        <span className="category-card__title">{title}</span>
        <span className="category-card__icon" aria-hidden="true">
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M14.7 5.3a1 1 0 1 0-1.4 1.4L16.58 10H5a1 1 0 1 0 0 2h11.58l-3.29 3.3a1 1 0 1 0 1.41 1.4l5-5a1 1 0 0 0 0-1.4l-5-5Z"
              fill="currentColor"
            />
          </svg>
        </span>
      </div>
    </Link>
  );
};

export default CategoryCard;
