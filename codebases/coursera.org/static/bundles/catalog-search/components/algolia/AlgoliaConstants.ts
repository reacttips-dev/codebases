import _t from 'i18n!nls/catalog-search';

export const INDEX_TYPE_ORDER_EXPERIMENT_PARAMETER_NAME = 'algoliaIndexTypeOrder';
export const INDEX_TYPE_TO_NAME_EXPERIMENT_PARAMETER_NAME = 'algoliaIndexTypeToIndexNameMap';

export const SUGGESTION_INDEX_TYPE = 'suggestions' as const;
export const PROJECT_INDEX_TYPE = 'projects' as const;
export const DEGREE_INDEX_TYPE = 'degrees' as const;
export const LEARNING_PATH_INDEX_TYPE = 'learning_paths' as const; // TODO: Switch to the real-world index for learning plans
export const ALL_PRODUCTS_INDEX_TYPE = 'all' as const;
export const COURSE_INDEX_TYPE = 'courses' as const;
export const COURSES_AND_SPECIALIZATIONS_INDEX_TYPE = 'products' as const;
export const ENTERPRISE_COURSES_AND_SPECIALIZATIONS_INDEX_TYPE = 'enterprise_products' as const;
export const C4CB_COURSES_AND_PROJECTS_INDEX_TYPE = 'enterprise_courses' as const;
export const SPECIALIZATION_INDEX_TYPE = 'specializations' as const;

export const SEARCH_PAGE_ORDERED_INDICES = [ALL_PRODUCTS_INDEX_TYPE, PROJECT_INDEX_TYPE, DEGREE_INDEX_TYPE];

export const getIndexTypeToPrettyName = (indexType: $TSFixMe) => {
  switch (indexType) {
    case SUGGESTION_INDEX_TYPE:
      return _t('Popular Searches');
    case LEARNING_PATH_INDEX_TYPE: // TODO: move to end of case statement. this is only here to keep from other names being used in the test-tab.
      return _t('Career Learning Paths');
    case DEGREE_INDEX_TYPE:
      return _t('Degrees & Certificates');
    case PROJECT_INDEX_TYPE:
      return _t('Guided Projects');
    case COURSES_AND_SPECIALIZATIONS_INDEX_TYPE:
      return _t('Courses & Specializations');
    case ENTERPRISE_COURSES_AND_SPECIALIZATIONS_INDEX_TYPE:
      return _t('Courses & Specializations');
    case ALL_PRODUCTS_INDEX_TYPE:
      return _t('All');
    case COURSE_INDEX_TYPE:
      return _t('Courses');
    case SPECIALIZATION_INDEX_TYPE:
      return _t('Specializations');
    default:
      return _t('All');
  }
};

export const INDEX_TYPE_TO_PRETTY_NAME = {
  [SUGGESTION_INDEX_TYPE]: 'Popular Searches',
  [DEGREE_INDEX_TYPE]: 'Degrees & Certificates',
  [PROJECT_INDEX_TYPE]: 'Projects',
  [COURSES_AND_SPECIALIZATIONS_INDEX_TYPE]: 'Courses & Specializations',
  [ENTERPRISE_COURSES_AND_SPECIALIZATIONS_INDEX_TYPE]: 'Courses & Specializations',
  [ALL_PRODUCTS_INDEX_TYPE]: 'All',
  [COURSE_INDEX_TYPE]: 'Courses',
  [SPECIALIZATION_INDEX_TYPE]: 'Specializations',
  [LEARNING_PATH_INDEX_TYPE]: 'Career Learning Paths',
} as const;

export const INDEX_TYPE_TO_COUNT_TO_SHOW = {
  [SUGGESTION_INDEX_TYPE]: 7,
  [ALL_PRODUCTS_INDEX_TYPE]: 15,
  [PROJECT_INDEX_TYPE]: 4,
  [DEGREE_INDEX_TYPE]: 4,
  [COURSE_INDEX_TYPE]: 5,
  [SPECIALIZATION_INDEX_TYPE]: 5,
  [LEARNING_PATH_INDEX_TYPE]: 5,
} as const;

export const ARIA_CONTENT_DEBOUNCE_DURATION_MS = 1000;
export const DEBOUNCE_DURATION_MS = 400;
// Match urls in the form of:
// * /courses
// * /search
// * /programs/{programName}
// * /logged-in-home
// * /
export const ROUTES_TO_SYNC_REGEXP = /^(\/courses\/?|\/search\/?|\/logged-in-home\/?|\/?|\/programs\/.+)/;

export const getLanguageNameFromCode = (languageCodeAndCountryFromBrowserNavigator: $TSFixMe) => {
  // This map has been copied from static/js/lib/language.js & I have made modifications based on how the language is in Algolia.
  // TODO (Cheetahs): Come up with a solution for cases such as Portuguese & Chinese that have multiple types of it in the language data
  // e.g: Chinese (Traditional), Chinese (China), Portuguese (Brazil), Portuguese, etc. For now we are making the simplification to map
  // to the one that yields the most results.

  // We can get the language code separately from the country that is suffixed by "-"
  // example: setting multiple countries with the same language yields
  // > navigator.languages
  // > ["en-US", "en", "zh", "zh-HK", "zh-CN", "zh-TW", "pt", "pt-BR", "pt-PT", "es", "es-AR", "es-CL", "es-CO", "el", "la", "es-419"]

  const languageCode = languageCodeAndCountryFromBrowserNavigator.split('-')[0];

  const countryCodeToLanguageMap = {
    ab: 'Abkhaz',
    aa: 'Afar',
    af: 'Afrikaans',
    ak: 'Akan',
    sq: 'Albanian',
    am: 'Amharic',
    ar: 'Arabic',
    an: 'Aragonese',
    hy: 'Armenian',
    as: 'Assamese',
    av: 'Avaric',
    ae: 'Avestan',
    ay: 'Aymara',
    az: 'Azerbaijani',
    bm: 'Bambara',
    ba: 'Bashkir',
    eu: 'Basque',
    be: 'Belarusian',
    bn: 'Bengali',
    bh: 'Bihari',
    bi: 'Bislama',
    bs: 'Bosnian',
    br: 'Breton',
    bg: 'Bulgarian',
    my: 'Burmese',
    ca: 'Catalan',
    ch: 'Chamorro',
    ce: 'Chechen',
    ny: 'Chichewa',
    zh: 'Chinese (China)',
    cv: 'Chuvash',
    kw: 'Cornish',
    co: 'Corsican',
    cr: 'Cree',
    hr: 'Croatian',
    cs: 'Czech',
    da: 'Danish',
    dv: 'Divehi',
    nl: 'Dutch',
    dz: 'Dzongkha',
    en: 'English',
    eo: 'Esperanto',
    et: 'Estonian',
    ee: 'Ewe',
    fo: 'Faroese',
    fj: 'Fijian',
    fi: 'Finnish',
    fr: 'French',
    ff: 'Fula',
    gl: 'Galician',
    ka: 'Georgian',
    de: 'German',
    el: 'Greek',
    gn: 'Guaraní',
    gu: 'Gujarati',
    ht: 'Haitian',
    ha: 'Hausa',
    he: 'Hebrew',
    hz: 'Herero',
    hi: 'Hindi',
    ho: 'Hiri Motu',
    hu: 'Hungarian',
    ia: 'Interlingua',
    id: 'Indonesian',
    ie: 'Interlingue',
    ga: 'Irish',
    ig: 'Igbo',
    ik: 'Inupiaq',
    io: 'Ido',
    is: 'Icelandic',
    it: 'Italian',
    iu: 'Inuktitut',
    ja: 'Japanese',
    jv: 'Javanese',
    kl: 'Kalaallisut',
    kn: 'Kannada',
    kr: 'Kanuri',
    ks: 'Kashmiri',
    kk: 'Kazakh',
    km: 'Khmer',
    ki: 'Kikuyu',
    rw: 'Kinyarwanda',
    ky: 'Kyrgyz',
    kv: 'Komi',
    kg: 'Kongo',
    ko: 'Korean',
    ku: 'Kurdish',
    kj: 'Kwanyama',
    la: 'Latin',
    lb: 'Luxembourgish',
    lg: 'Ganda',
    li: 'Limburgish',
    ln: 'Lingala',
    lo: 'Lao',
    lt: 'Lithuanian',
    lu: 'Luba-Katanga',
    lv: 'Latvian',
    gv: 'Manx',
    mk: 'Macedonian (FYROM)',
    mg: 'Malagasy',
    ms: 'Malay',
    ml: 'Malayalam',
    mt: 'Maltese',
    mi: 'Māori',
    mr: 'Marathi',
    mh: 'Marshallese',
    mn: 'Mongolian',
    na: 'Nauru',
    nv: 'Navajo',
    nb: 'Norwegian Bokmål',
    nd: 'North Ndebele',
    ne: 'Nepali',
    ng: 'Ndonga',
    nn: 'Norwegian Nynorsk',
    no: 'Norwegian',
    ii: 'Nuosu',
    nr: 'South Ndebele',
    oc: 'Occitan',
    oj: 'Ojibwe',
    cu: 'Old Church Slavonic',
    om: 'Oromo',
    or: 'Oriya',
    os: 'Ossetian',
    pa: 'Panjabi',
    pi: 'Pāli',
    fa: 'Persian',
    pl: 'Polish',
    ps: 'Pashto',
    pt: 'Portuguese (Brazil)',
    qu: 'Quechua',
    rm: 'Romansh',
    rn: 'Kirundi',
    ro: 'Romanian',
    ru: 'Russian',
    sa: 'Sanskrit',
    sc: 'Sardinian',
    sd: 'Sindhi',
    se: 'Northern Sami',
    sm: 'Samoan',
    sg: 'Sango',
    sr: 'Serbian',
    gd: 'Gaelic',
    sn: 'Shona',
    si: 'Sinhala',
    sk: 'Slovak',
    sl: 'Slovene',
    so: 'Somali',
    st: 'Southern Sotho',
    es: 'Spanish',
    su: 'Sundanese',
    sw: 'Swahili',
    ss: 'Swati',
    sv: 'Swedish',
    ta: 'Tamil',
    te: 'Telugu',
    tg: 'Tajik',
    th: 'Thai',
    ti: 'Tigrinya',
    bo: 'Tibetan',
    tk: 'Turkmen',
    tl: 'Tagalog',
    tn: 'Tswana',
    to: 'Tonga',
    tr: 'Turkish',
    ts: 'Tsonga',
    tt: 'Tatar',
    tw: 'Twi',
    ty: 'Tahitian',
    ug: 'Uighur',
    uk: 'Ukrainian',
    ur: 'Urdu',
    uz: 'Uzbek',
    ve: 'Venda',
    vi: 'Vietnamese',
    vo: 'Volapük',
    wa: 'Walloon',
    cy: 'Welsh',
    wo: 'Wolof',
    fy: 'Western Frisian',
    xh: 'Xhosa',
    yi: 'Yiddish',
    yo: 'Yoruba',
    za: 'Zhuang',
    zu: 'Zulu',
  };
  // @ts-ignore ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
  return countryCodeToLanguageMap[languageCode];
};
