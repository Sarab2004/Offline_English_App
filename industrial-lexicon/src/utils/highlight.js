import { createElement, Fragment } from 'react';

const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

export function highlightMatch(text, query) {
  if (text === undefined || text === null) {
    return '';
  }

  const source = String(text);

  if (!query) {
    return source;
  }

  const trimmedQuery = query.trim();

  if (!trimmedQuery) {
    return source;
  }

  const pattern = new RegExp(`(${escapeRegExp(trimmedQuery)})`, 'gi');
  const parts = source.split(pattern);

  if (parts.length === 1) {
    return source;
  }

  return parts.map((part, index) => {
    if (part === '') {
      return createElement(Fragment, { key: index });
    }

    if (index % 2 === 1) {
      return createElement(
        'mark',
        { key: index, className: 'highlight-mark' },
        part
      );
    }

    return createElement(Fragment, { key: index }, part);
  });
}

