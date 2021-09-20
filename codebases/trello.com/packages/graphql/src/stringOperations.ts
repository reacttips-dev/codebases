export const firstLetterToUpper = (str: string) => {
  return `${str.charAt(0).toUpperCase()}${str.slice(1)}`;
};

export const firstLetterToLower = (str: string) => {
  return `${str.charAt(0).toLowerCase()}${str.slice(1)}`;
};

const SINGULARIZE_MAP: { [str: string]: string } = {
  MessagesDismissed: 'MessageDismissed',
  SavedSearches: 'SavedSearch',
};

export const singularize = (str: string) => {
  if (SINGULARIZE_MAP[str]) {
    return SINGULARIZE_MAP[str];
  }

  return str.endsWith('s') ? str.substr(0, str.length - 1) : str;
};

const PLURALIZE_MAP: { [str: string]: string } = {
  MessageDismissed: 'MessagesDismissed',
  SavedSearch: 'SavedSearches',
};

export const pluralize = (str: string) => {
  if (PLURALIZE_MAP[str]) {
    return PLURALIZE_MAP[str];
  }

  return !str.endsWith('s') ? str + 's' : str;
};
