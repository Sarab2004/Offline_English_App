const CSV_PATH = '/data/words.csv';

const validCategories = new Set([
  'control-project',
  'economics',
  'production-planning',
  'or',
  'quality',
]);

const trimValue = (value) => {
  if (typeof value !== 'string') return value ?? '';
  return value.trim();
};

const normalizeRow = (row) => {
  if (!row) return null;

  const id = trimValue(row.id);
  const category = trimValue(row.category);
  const term_en = trimValue(row.term_en);

  if (!id || !category || !term_en || !validCategories.has(category)) {
    return null;
  }

  const definitions_en = [row.def1_en, row.def2_en, row.def3_en]
    .map((definition) => trimValue(definition))
    .filter((definition) => definition);

  const examples = [
    { en: row.ex1_en, fa: row.ex1_fa },
    { en: row.ex2_en, fa: row.ex2_fa },
    { en: row.ex3_en, fa: row.ex3_fa },
  ]
    .map((pair) => ({
      en: trimValue(pair.en),
      fa: trimValue(pair.fa),
    }))
    .filter((pair) => pair.en || pair.fa);

  const posValue = trimValue(row.pos);
  const tagsValue = trimValue(row.tags);

  const normalized = {
    id,
    category,
    term_en,
    definitions_en,
    examples,
  };

  if (posValue) {
    normalized.pos = posValue;
  }

  if (tagsValue) {
    normalized.tags = tagsValue
      .split(',')
      .map((tag) => tag.trim())
      .filter(Boolean);
  }

  return normalized;
};

const normalizeJsonEntry = (entry) => {
  if (!entry) return null;

  const id = trimValue(entry.id);
  const category = trimValue(entry.category);
  const term_en = trimValue(entry.term_en);

  if (!id || !category || !term_en || !validCategories.has(category)) {
    return null;
  }

  const definitions_en = Array.isArray(entry.definitions_en)
    ? entry.definitions_en.map((definition) => trimValue(definition)).filter(Boolean)
    : [];

  const examples = Array.isArray(entry.examples)
    ? entry.examples
        .map((pair) => ({
          en: trimValue(pair?.en),
          fa: trimValue(pair?.fa),
        }))
        .filter((pair) => pair.en || pair.fa)
    : [];

  const normalized = {
    id,
    category,
    term_en,
    definitions_en,
    examples,
  };

  if (entry.pos) {
    const posValue = trimValue(entry.pos);
    if (posValue) {
      normalized.pos = posValue;
    }
  }

  if (entry.tags) {
    const tagsValue = Array.isArray(entry.tags)
      ? entry.tags
          .map((tag) => trimValue(tag))
          .filter(Boolean)
      : trimValue(entry.tags)
          .split(',')
          .map((tag) => tag.trim())
          .filter(Boolean);

    if (tagsValue.length > 0) {
      normalized.tags = tagsValue;
    }
  }

  return normalized;
};

export async function loadWords() {
  try {
    const response = await fetch(CSV_PATH, {
      headers: {
        'Cache-Control': 'no-cache',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch CSV: ${response.status}`);
    }

    const csvText = await response.text();

    if (!csvText.trim()) {
      throw new Error('CSV is empty');
    }

    const PapaModule = await import('papaparse');
    const Papa = PapaModule.default || PapaModule;

    const parsed = Papa.parse(csvText, {
      header: true,
      skipEmptyLines: true,
      transform: (value) => trimValue(value),
    });

    if (parsed.errors?.length) {
      // eslint-disable-next-line no-console
      console.warn('[dataLoader] CSV parse errors:', parsed.errors);
    }

    const normalizedRows = Array.isArray(parsed.data)
      ? parsed.data.map((row) => normalizeRow(row)).filter(Boolean)
      : [];

    if (normalizedRows.length > 0) {
      return normalizedRows;
    }

    throw new Error('No valid rows in CSV');
  } catch (error) {
    // eslint-disable-next-line no-console
    console.info('[dataLoader] Falling back to sample JSON:', error?.message || error);
    const fallbackModule = await import('../data/sampleWords.json');
    const fallbackData = Array.isArray(fallbackModule.default)
      ? fallbackModule.default.map((entry) => normalizeJsonEntry(entry)).filter(Boolean)
      : [];

    return fallbackData;
  }
}

export function groupByCategory(words = []) {
  return words.reduce((accumulator, word) => {
    if (!word || !word.category) return accumulator;

    if (!accumulator[word.category]) {
      accumulator[word.category] = [];
    }

    accumulator[word.category].push(word);
    return accumulator;
  }, {});
}

