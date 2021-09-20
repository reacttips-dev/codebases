import FlexSearch from 'flexsearch';

// a slightly modified version of FlexSearch's native "simple" encoder
// but re-done to not break on non-roman characters
// https://github.com/nextapps-de/flexsearch#flexsearch.encoder
export const encoder = (s: string) =>
  s
    .trim()
    .toLocaleLowerCase()
    .replace(/[àáâãäå]/g, 'a')
    .replace(/[èéêë]/g, 'e')
    .replace(/[ìíîï]/g, 'i')
    .replace(/[òóôõöő]/g, 'o')
    .replace(/[ùúûüű]/g, 'u')
    .replace(/[ýŷÿ]/g, 'y')
    .replace(/ñ/g, 'n')
    .replace(/[çc]/g, 'k')
    .replace(/ß/g, 's')
    .replace(/ & /g, ' and ')
    .replace(/[-_/\\]/g, ' ')
    .replace(/[,.?#!@~$%^*()+='"<>[\]{}:;]/g, '')
    .replace(/\s+/g, ' ');

// a very trimmed down version of FlexSearch's native english stemmer
// removed as many as I felt comfortable removing
// stemming is weird with partial searches since stemming truncates text
// in the both the query and index which is why if you have a stemming
// rule of ing -> '' as might seem reasonable
// then searching for 'voti' will not return 'Voting' since that will have
// been stemmed down to 'vot' and no longer match :(
export const stemming = {
  izer: 'ize',
  ance: '',
  ence: '',
  ness: '',
  able: '',
  ible: '',
  ment: '',
  ful: '',
  ent: '',
  ism: '',
  ed: '',
  s: '',
};

export const getNameIndex = () =>
  FlexSearch.create({
    encode: encoder,
    split: /\s+/,
    stemmer: stemming,
    tokenize: 'full',
  });

export const getIndex = () =>
  FlexSearch.create({
    encode: encoder,
    split: /\s+/,
    stemmer: stemming,
    tokenize: 'full',
  });

export const SearchUtils = {
  getNameIndex,
  getIndex,
  encoder,
  stemming,
};
