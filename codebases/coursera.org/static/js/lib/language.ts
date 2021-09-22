import _ from 'underscore';
import user from 'js/lib/user';
import Multitracker from 'js/app/multitrackerSingleton';
import rtlCssJS from 'rtl-css-js';
import epic from 'bundles/epic/client';

// load common translator so we can get the locale
// of the current RequireJS context
// @see http://requirejs.org/docs/api.html#multiversion
import _t from 'i18n!nls/page';

function languageTagToName(): Record<string, string> {
  return {
    ab: _t('Abkhaz'),
    aa: _t('Afar'),
    af: _t('Afrikaans'),
    ak: _t('Akan'),
    sq: _t('Albanian'),
    am: _t('Amharic'),
    ar: _t('Arabic'),
    an: _t('Aragonese'),
    hy: _t('Armenian'),
    as: _t('Assamese'),
    av: _t('Avaric'),
    ae: _t('Avestan'),
    ay: _t('Aymara'),
    az: _t('Azerbaijani'),
    bm: _t('Bambara'),
    ba: _t('Bashkir'),
    eu: _t('Basque'),
    be: _t('Belarusian'),
    bn: _t('Bengali'),
    bh: _t('Bihari'),
    bi: _t('Bislama'),
    bs: _t('Bosnian'),
    br: _t('Breton'),
    bg: _t('Bulgarian'),
    my: _t('Burmese'),
    ca: _t('Catalan'),
    ch: _t('Chamorro'),
    ce: _t('Chechen'),
    ny: _t('Chichewa'),
    zh: _t('Chinese'),
    'zh-CN': _t('Chinese (Simplified)'),
    'zh-TW': _t('Chinese (Traditional)'),
    cv: _t('Chuvash'),
    kw: _t('Cornish'),
    co: _t('Corsican'),
    cr: _t('Cree'),
    hr: _t('Croatian'),
    cs: _t('Czech'),
    da: _t('Danish'),
    dv: _t('Divehi'),
    nl: _t('Dutch'),
    dz: _t('Dzongkha'),
    en: _t('English'),
    eo: _t('Esperanto'),
    et: _t('Estonian'),
    ee: _t('Ewe'),
    fo: _t('Faroese'),
    fj: _t('Fijian'),
    fi: _t('Finnish'),
    fr: _t('French'),
    ff: _t('Fula'),
    gl: _t('Galician'),
    ka: _t('Georgian'),
    de: _t('German'),
    el: _t('Greek'),
    gn: _t('Guaraní'),
    gu: _t('Gujarati'),
    ht: _t('Haitian'),
    ha: _t('Hausa'),
    he: _t('Hebrew'),
    hz: _t('Herero'),
    hi: _t('Hindi'),
    ho: _t('Hiri Motu'),
    hu: _t('Hungarian'),
    ia: _t('Interlingua'),
    id: _t('Indonesian'),
    ie: _t('Interlingue'),
    ga: _t('Irish'),
    ig: _t('Igbo'),
    ik: _t('Inupiaq'),
    io: _t('Ido'),
    is: _t('Icelandic'),
    it: _t('Italian'),
    iu: _t('Inuktitut'),
    ja: _t('Japanese'),
    jv: _t('Javanese'),
    kl: _t('Kalaallisut'),
    kn: _t('Kannada'),
    kr: _t('Kanuri'),
    ks: _t('Kashmiri'),
    kk: _t('Kazakh'),
    km: _t('Khmer'),
    ki: _t('Kikuyu'),
    rw: _t('Kinyarwanda'),
    ky: _t('Kyrgyz'),
    kv: _t('Komi'),
    kg: _t('Kongo'),
    ko: _t('Korean'),
    ku: _t('Kurdish'),
    kj: _t('Kwanyama'),
    la: _t('Latin'),
    lb: _t('Luxembourgish'),
    lg: _t('Ganda'),
    li: _t('Limburgish'),
    ln: _t('Lingala'),
    lo: _t('Lao'),
    lt: _t('Lithuanian'),
    lu: _t('Luba-Katanga'),
    lv: _t('Latvian'),
    gv: _t('Manx'),
    mk: _t('Macedonian (FYROM)'),
    mg: _t('Malagasy'),
    ms: _t('Malay'),
    ml: _t('Malayalam'),
    mt: _t('Maltese'),
    mi: _t('Māori'),
    mr: _t('Marathi'),
    mh: _t('Marshallese'),
    mn: _t('Mongolian'),
    na: _t('Nauru'),
    nv: _t('Navajo'),
    nb: _t('Norwegian Bokmål'),
    nd: _t('North Ndebele'),
    ne: _t('Nepali'),
    ng: _t('Ndonga'),
    nn: _t('Norwegian Nynorsk'),
    no: _t('Norwegian'),
    ii: _t('Nuosu'),
    nr: _t('South Ndebele'),
    oc: _t('Occitan'),
    oj: _t('Ojibwe'),
    cu: _t('Old Church Slavonic'),
    om: _t('Oromo'),
    or: _t('Oriya'),
    os: _t('Ossetian'),
    pa: _t('Panjabi'),
    pi: _t('Pāli'),
    fa: _t('Persian'),
    pl: _t('Polish'),
    ps: _t('Pashto'),
    pt: _t('Portuguese (Brazilian)'),
    'pt-BR': _t('Portuguese (Brazilian)'),
    'pt-PT': _t('Portuguese (European)'),
    qu: _t('Quechua'),
    rm: _t('Romansh'),
    rn: _t('Kirundi'),
    ro: _t('Romanian'),
    ru: _t('Russian'),
    sa: _t('Sanskrit'),
    sc: _t('Sardinian'),
    sd: _t('Sindhi'),
    se: _t('Northern Sami'),
    sm: _t('Samoan'),
    sg: _t('Sango'),
    sr: _t('Serbian'),
    gd: _t('Gaelic'),
    sn: _t('Shona'),
    si: _t('Sinhala'),
    sk: _t('Slovak'),
    sl: _t('Slovene'),
    so: _t('Somali'),
    st: _t('Southern Sotho'),
    es: _t('Spanish'),
    su: _t('Sundanese'),
    sw: _t('Swahili'),
    ss: _t('Swati'),
    sv: _t('Swedish'),
    ta: _t('Tamil'),
    te: _t('Telugu'),
    tg: _t('Tajik'),
    th: _t('Thai'),
    ti: _t('Tigrinya'),
    bo: _t('Tibetan'),
    tk: _t('Turkmen'),
    tl: _t('Tagalog'),
    tn: _t('Tswana'),
    to: _t('Tonga'),
    tr: _t('Turkish'),
    ts: _t('Tsonga'),
    tt: _t('Tatar'),
    tw: _t('Twi'),
    ty: _t('Tahitian'),
    ug: _t('Uighur'),
    uk: _t('Ukrainian'),
    ur: _t('Urdu'),
    uz: _t('Uzbek'),
    ve: _t('Venda'),
    vi: _t('Vietnamese'),
    vo: _t('Volapük'),
    wa: _t('Walloon'),
    cy: _t('Welsh'),
    wo: _t('Wolof'),
    fy: _t('Western Frisian'),
    xh: _t('Xhosa'),
    yi: _t('Yiddish'),
    yo: _t('Yoruba'),
    za: _t('Zhuang'),
    zu: _t('Zulu'),
  };
}

/**
 * NOTE: below is a list of language tags we currently support as languages for courses
 * see https://github.com/webedx-spark/infra-services/blob/main/libs/models/src/main/scala/org/coursera/languagecode/LanguageCode.scala
 * See TRANSCRIPTION_VENDOR_LANG_CODES for fully supported locales (we have vendor transcription for these)
 */
export const courseLanguageTags: string[] = [
  'af',
  'am',
  'ar',
  'az',
  'bg',
  'bn',
  'bs',
  'ca',
  'cs',
  'da',
  'de',
  'el',
  'es',
  'et',
  'eu',
  'en',
  'fa',
  'fi',
  'fr',
  'he',
  'hi',
  'hr',
  'hu',
  'hy',
  'id',
  'it',
  'ja',
  'jv',
  'ka',
  'kk',
  'km',
  'kn',
  'ko',
  'lt',
  'lv',
  'mk',
  'mn',
  'mr',
  'ms',
  'my',
  'ne',
  'nl',
  'no',
  'pl',
  'ps',
  'pt-BR',
  'pt-PT',
  'ro',
  'ru',
  'rw',
  'sk',
  'sl',
  'sq',
  'sr',
  'st',
  'sv',
  'sw',
  'ta',
  'te',
  'th',
  'tl',
  'tr',
  'tn',
  'uk',
  'ur',
  'uz',
  'vi',
  'xh',
  'yo',
  'zh-CN',
  'zh-TW',
  'zu',
];

// English, followed by translated languages in alphabetical order
export const supportedLanguageSubdomains: string[] = ['en', 'de', 'es', 'fr', 'ja', 'ko', 'pt', 'ru', 'zh', 'zh-tw'];

export const localeToRegionalHomePage: Record<string, string> = {
  'en-in': '/in',
};

export const localesWithHomePages = ['en-in'];

// special umbrella locales ar_AR, es_LA. Push arabic and spanish locales into these ones.
const facebookSpecialCases: Record<string, string> = {
  ar: 'ar_AR',
  es: 'es_LA',
};

const cmsSupportedLanguageSubdomains: Record<string, string> = {
  ...supportedLanguageSubdomains.reduce((acc, cur) => {
    acc[cur] = cur;
    return acc;
  }, {} as Record<string, string>),
  en: 'en-US',
  de: 'de-DE',
  fr: 'fr-FR',
  'zh-tw': 'zh-Hant-TW',
  zh: 'zh-Hans',
};

/**
 * Convert a language code to the IETF language tag
 *
 * @param  {String} code any language code or accept-language encoding
 * @return String user's language code per IETF spec, e.g. en-US
 */
export function toIetfLanguageTag(code: string): string {
  const normalizeLanguageCode = (code || '').replace(/_/g, '-').split(/[;=,]/)[0];
  return normalizeLanguageCode.toLowerCase().replace(/(-[a-z]{1,}$)/, function (match) {
    return match.toUpperCase();
  });
}

/**
 * Get user's [IETF Language Tag](http://en.wikipedia.org/wiki/IETF_language_tag)
 * for the current user from RequireJS
 *
 * @return String user's language code per IETF spec, e.g. en-US
 */
export function getIetfLanguageTag(): string {
  try {
    return toIetfLanguageTag(_t.getLocale());
  } catch (e) {
    // in case of error, default to English and emit tracking event
    Multitracker.push(['user.language.error', { error: e }]);
    return 'en-US';
  }
}

/**
 * Shorten language codes to only contain the 2 character language codes
 * @param  {String} languageTag language tag
 * @return {String}      2 character language code (ISO-631)
 */
export function toLanguageCode(languageTag: string): string {
  return toIetfLanguageTag(languageTag).split('-')[0];
}

/**
 * Get user's language code (ISO-631) from the IETF language co
 * @return {String} User's ISO-631 language code
 */
export function getLanguageCode(): string {
  return toLanguageCode(getIetfLanguageTag());
}

/**
 * Moment requires language codes to be lowercase
 * @return {String} user's language code in IETF in lowercase as required by moment
 */
export function getMomentLanguage(): string {
  const lowerCaseIetfLanguage = getIetfLanguageTag().toLowerCase();
  switch (lowerCaseIetfLanguage) {
    case 'zh-tw':
      return 'zh-tw';
    default:
      return lowerCaseIetfLanguage.split('-')[0];
  }
}

/**
 * Get the locale string from the language name. E.g. en_US, zh_CN... etc
 * Intended for use with facebook integration localization.
 * As per https://developers.facebook.com/docs/internationalization, the Arabic and Spanish
 * localizations had to be coded as a special case, as facebook uses a non-standard "umbrella
 * locale" for those.
 *
 * @return {String}      locale name
 */
export function getFacebookLocaleString(): string {
  const localeString = getIetfLanguageTag().replace('-', '_');
  const localeLang = localeString.split('_')[0];
  return facebookSpecialCases[localeLang] || localeString;
}

/**
 * Get the locale string from the language name, e.g. en, es, etc.
 * This is primarily intended for use with our current CMS Contentful's APIs as its API takes in particular locale-region combinations.
 *
 * If given a locale that is not supported by Contentful or Coursera, we default to the English locale.
 */
export function getCmsLocaleString(): string {
  const languageCode = getLanguageCode();
  return cmsSupportedLanguageSubdomains[languageCode] || cmsSupportedLanguageSubdomains.en;
}

/**
 * Get the language name corresponding to a language code
 * For more specific language codes in with more components such as zh-tw,
 * this function will attempt to look up the code in decreasing order of
 * specificity, meaning chopping off components from the end 1 at a time,
 * until it either finds a name mapping and returns it, or returns the code
 * itself if there's no mapping
 * @param  {String} code language code
 * @return {String}      language name
 */
export function languageCodeToName(code: string): string {
  const languageCode = toIetfLanguageTag(code);
  const components = languageCode.split('-');
  const languageTagToNameObject = languageTagToName();
  let language;
  const languageMappingExists = components.some((c, i) => {
    const codeToTest = components.slice(0, components.length - i).join('-');
    language = languageTagToNameObject[toIetfLanguageTag(codeToTest)];
    return !!language;
  });

  return languageMappingExists && language != null ? language : code;
}

/**
 * Translate a csv containing language codes to a hash of code => language
 * @param  {String} csv csv of language codes
 * @return {Object}     hash of code => language
 */
export function languageCodeCSVtoLanguages(csv?: string): Record<string, string> {
  const subtitlesLangs = (csv || '').split(/,\s*/g).filter(Boolean);
  return _.reduce(
    subtitlesLangs,
    (memo, code) => {
      const modifiedMemo = memo;
      modifiedMemo[code] = languageCodeToName(code);
      return modifiedMemo;
    },
    {} as Record<string, string>
  );
}

/**
 * Detect if a language code is a right to left language
 * @param  {String}  language language code
 * @return {Boolean}          whether the language is right to left
 */
export function isRightToLeft(language: string): boolean {
  const rightToLeftLanguages = ['ar', 'he'];
  return _(rightToLeftLanguages).contains(toLanguageCode(language));
}

export function langDir(language: string): 'ltr' | 'rtl' {
  return isRightToLeft(language) ? 'rtl' : 'ltr';
}

/**
 * Detect if the user is using a right to left language
 * @return {Boolean} whether the user's language is right to left
 */
export function isUserRightToLeft(): boolean {
  return isRightToLeft(getIetfLanguageTag());
}

// this character map is written this way because uglify strips out quotes
// around keys in object literals. This causes problems in IE9 because it
// doesn't recognize raw latin unicode characters as keys
const RAW_LATIN_MAP: Record<string, string> = {
  A: 'Á Ă Ắ Ặ Ằ Ẳ Ẵ Ǎ Â Ấ Ậ Ầ Ẩ Ẫ Ä Ǟ Ȧ Ǡ Ạ Ȁ À Ả Ȃ Ā Ą Å Ǻ Ḁ Ⱥ Ã Ɐ ᴀ',
  AA: 'Ꜳ',
  AE: 'Æ Ǽ Ǣ ᴁ',
  AO: 'Ꜵ',
  AU: 'Ꜷ',
  AV: 'Ꜹ Ꜻ',
  AY: 'Ꜽ',
  B: 'Ḃ Ḅ Ɓ Ḇ Ƀ Ƃ ʙ ᴃ',
  C: 'Ć Č Ç Ḉ Ĉ Ċ Ƈ Ȼ Ꜿ ᴄ',
  D: 'Ď Ḑ Ḓ Ḋ Ḍ Ɗ Ḏ ǲ ǅ Đ Ƌ Ꝺ ᴅ',
  DZ: 'Ǳ Ǆ',
  E: 'É Ĕ Ě Ȩ Ḝ Ê Ế Ệ Ề Ể Ễ Ḙ Ë Ė Ẹ Ȅ È Ẻ Ȇ Ē Ḗ Ḕ Ę Ɇ Ẽ Ḛ Ɛ Ǝ ᴇ ⱻ',
  ET: 'Ꝫ',
  F: 'Ḟ Ƒ Ꝼ ꜰ',
  G: 'Ǵ Ğ Ǧ Ģ Ĝ Ġ Ɠ Ḡ Ǥ Ᵹ ɢ ʛ',
  H: 'Ḫ Ȟ Ḩ Ĥ Ⱨ Ḧ Ḣ Ḥ Ħ ʜ',
  I: 'Í Ĭ Ǐ Î Ï Ḯ İ Ị Ȉ Ì Ỉ Ȋ Ī Į Ɨ Ĩ Ḭ ɪ',
  R: 'Ꞃ Ŕ Ř Ŗ Ṙ Ṛ Ṝ Ȑ Ȓ Ṟ Ɍ Ɽ ʁ ʀ ᴙ ᴚ',
  S: 'Ꞅ Ś Ṥ Š Ṧ Ş Ŝ Ș Ṡ Ṣ Ṩ ꜱ',
  T: 'Ꞇ Ť Ţ Ṱ Ț Ⱦ Ṫ Ṭ Ƭ Ṯ Ʈ Ŧ ᴛ',
  IS: 'Ꝭ',
  J: 'Ĵ Ɉ ᴊ',
  K: 'Ḱ Ǩ Ķ Ⱪ Ꝃ Ḳ Ƙ Ḵ Ꝁ Ꝅ ᴋ',
  L: 'Ĺ Ƚ Ľ Ļ Ḽ Ḷ Ḹ Ⱡ Ꝉ Ḻ Ŀ Ɫ ǈ Ł Ꞁ ʟ ᴌ',
  LJ: 'Ǉ',
  M: 'Ḿ Ṁ Ṃ Ɱ Ɯ ᴍ',
  N: 'Ń Ň Ņ Ṋ Ṅ Ṇ Ǹ Ɲ Ṉ Ƞ ǋ Ñ ɴ ᴎ',
  NJ: 'Ǌ',
  O: 'Ó Ŏ Ǒ Ô Ố Ộ Ồ Ổ Ỗ Ö Ȫ Ȯ Ȱ Ọ Ő Ȍ Ò Ỏ Ơ Ớ Ợ Ờ Ở Ỡ Ȏ Ꝋ Ꝍ Ō Ṓ Ṑ Ɵ Ǫ Ǭ Ø Ǿ Õ Ṍ Ṏ Ȭ Ɔ ᴏ ᴐ',
  OI: 'Ƣ',
  OO: 'Ꝏ',
  OU: 'Ȣ ᴕ',
  P: 'Ṕ Ṗ Ꝓ Ƥ Ꝕ Ᵽ Ꝑ ᴘ',
  Q: 'Ꝙ Ꝗ',
  V: 'Ʌ Ꝟ Ṿ Ʋ Ṽ ᴠ',
  TZ: 'Ꜩ',
  U: 'Ú Ŭ Ǔ Û Ṷ Ü Ǘ Ǚ Ǜ Ǖ Ṳ Ụ Ű Ȕ Ù Ủ Ư Ứ Ự Ừ Ử Ữ Ȗ Ū Ṻ Ų Ů Ũ Ṹ Ṵ ᴜ',
  VY: 'Ꝡ',
  W: 'Ẃ Ŵ Ẅ Ẇ Ẉ Ẁ Ⱳ ᴡ',
  X: 'Ẍ Ẋ',
  Y: 'Ý Ŷ Ÿ Ẏ Ỵ Ỳ Ƴ Ỷ Ỿ Ȳ Ɏ Ỹ ʏ',
  Z: 'Ź Ž Ẑ Ⱬ Ż Ẓ Ȥ Ẕ Ƶ ᴢ',
  IJ: 'Ĳ',
  OE: 'Œ ɶ',
  a: 'á ă ắ ặ ằ ẳ ẵ ǎ â ấ ậ ầ ẩ ẫ ä ǟ ȧ ǡ ạ ȁ à ả ȃ ā ą ᶏ ẚ å ǻ ḁ ⱥ ã ɐ ₐ',
  aa: 'ꜳ',
  ae: 'æ ǽ ǣ ᴂ',
  ao: 'ꜵ',
  au: 'ꜷ',
  av: 'ꜹ ꜻ',
  ay: 'ꜽ',
  b: 'ḃ ḅ ɓ ḇ ᵬ ᶀ ƀ ƃ',
  o: 'ɵ ó ŏ ǒ ô ố ộ ồ ổ ỗ ö ȫ ȯ ȱ ọ ő ȍ ò ỏ ơ ớ ợ ờ ở ỡ ȏ ꝋ ꝍ ⱺ ō ṓ ṑ ǫ ǭ ø ǿ õ ṍ ṏ ȭ ɔ ᶗ ᴑ ᴓ ₒ',
  c: 'ć č ç ḉ ĉ ɕ ċ ƈ ȼ ↄ ꜿ',
  d: 'ď ḑ ḓ ȡ ḋ ḍ ɗ ᶑ ḏ ᵭ ᶁ đ ɖ ƌ ꝺ',
  i: 'ı í ĭ ǐ î ï ḯ ị ȉ ì ỉ ȋ ī į ᶖ ɨ ĩ ḭ ᴉ ᵢ',
  j: 'ȷ ɟ ʄ ǰ ĵ ʝ ɉ ⱼ',
  dz: 'ǳ ǆ',
  e: 'é ĕ ě ȩ ḝ ê ế ệ ề ể ễ ḙ ë ė ẹ ȅ è ẻ ȇ ē ḗ ḕ ⱸ ę ᶒ ɇ ẽ ḛ ɛ ᶓ ɘ ǝ ₑ',
  et: 'ꝫ',
  f: 'ḟ ƒ ᵮ ᶂ ꝼ',
  g: 'ǵ ğ ǧ ģ ĝ ġ ɠ ḡ ᶃ ǥ ᵹ ɡ ᵷ',
  h: 'ḫ ȟ ḩ ĥ ⱨ ḧ ḣ ḥ ɦ ẖ ħ ɥ ʮ ʯ',
  hv: 'ƕ',
  r: 'ꞃ ŕ ř ŗ ṙ ṛ ṝ ȑ ɾ ᵳ ȓ ṟ ɼ ᵲ ᶉ ɍ ɽ ɿ ɹ ɻ ɺ ⱹ ᵣ',
  s: 'ꞅ ſ ẜ ẛ ẝ ś ṥ š ṧ ş ŝ ș ṡ ṣ ṩ ʂ ᵴ ᶊ ȿ',
  t: 'ꞇ ť ţ ṱ ț ȶ ẗ ⱦ ṫ ṭ ƭ ṯ ᵵ ƫ ʈ ŧ ʇ',
  is: 'ꝭ',
  k: 'ḱ ǩ ķ ⱪ ꝃ ḳ ƙ ḵ ᶄ ꝁ ꝅ ʞ',
  l: 'ĺ ƚ ɬ ľ ļ ḽ ȴ ḷ ḹ ⱡ ꝉ ḻ ŀ ɫ ᶅ ɭ ł ꞁ',
  lj: 'ǉ',
  m: 'ḿ ṁ ṃ ɱ ᵯ ᶆ ɯ ɰ',
  n: 'ń ň ņ ṋ ȵ ṅ ṇ ǹ ɲ ṉ ƞ ᵰ ᶇ ɳ ñ',
  nj: 'ǌ',
  oi: 'ƣ',
  oo: 'ꝏ',
  ou: 'ȣ',
  p: 'ṕ ṗ ꝓ ƥ ᵱ ᶈ ꝕ ᵽ ꝑ',
  q: 'ꝙ ʠ ɋ ꝗ',
  u: 'ᴝ ú ŭ ǔ û ṷ ü ǘ ǚ ǜ ǖ ṳ ụ ű ȕ ù ủ ư ứ ự ừ ử ữ ȗ ū ṻ ų ᶙ ů ũ ṹ ṵ ᵤ',
  th: 'ᵺ',
  oe: 'ᴔ œ',
  v: 'ʌ ⱴ ꝟ ṿ ʋ ᶌ ⱱ ṽ ᵥ',
  w: 'ʍ ẃ ŵ ẅ ẇ ẉ ẁ ⱳ ẘ',
  y: 'ʎ ý ŷ ÿ ẏ ỵ ỳ ƴ ỷ ỿ ȳ ẙ ɏ ỹ',
  tz: 'ꜩ',
  ue: 'ᵫ',
  um: 'ꝸ',
  vy: 'ꝡ',
  x: 'ẍ ẋ ᶍ ₓ',
  z: 'ź ž ẑ ʑ ⱬ ż ẓ ȥ ẕ ᵶ ᶎ ʐ ƶ ɀ',
  ff: 'ﬀ',
  ffi: 'ﬃ',
  ffl: 'ﬄ',
  fi: 'ﬁ',
  fl: 'ﬂ',
  ij: 'ĳ',
  st: 'ﬆ',
};

// transform RAW_LATIN_MAP into a 1:1 latin => ascii character map
const LATIN_MAP: Record<string, string> = _.chain(RAW_LATIN_MAP)
  // convert to a list 1:1 character pairs
  .map(function (value, key) {
    return _.map(value.split(' '), function (v) {
      return [v, key];
    });
  })
  .flatten(true)
  .object()
  .value();

export function latinizeText(string: string): string {
  return string.replace(/[^A-Za-z0-9[] ]/g, function (a) {
    return LATIN_MAP[a] || a;
  });
}

export function getMobileBadgeLanguageCode(): string {
  const mobileBadgeLanguageCodes = ['en', 'de', 'es', 'fr', 'ja', 'ko', 'pt-br', 'ru', 'zh-cn', 'zh-tw', 'ar'];

  const languageTagLower = getIetfLanguageTag().toLowerCase();
  if (_(mobileBadgeLanguageCodes).contains(languageTagLower)) {
    return languageTagLower;
  }

  const languageCode = getLanguageCode();
  if (languageCode === 'pt') {
    return 'pt-br';
  } else if (languageCode === 'es') {
    return 'es';
  } else if (languageCode === 'ar') {
    return 'ar';
  } else if (languageCode === 'zh') {
    return 'zh-cn';
  } else {
    return 'en';
  }
}

/*
 * mapping taken from libs/models/src/main/scala/org/coursera/languagecode/TranscriptionVendorLanguageCode.scala
 * with manual mapping of vendor's codes back to ours (via languageCodeToTranscriptionVendorCodeMapping)
 */

const TRANSCRIPTION_VENDOR_LANG_CODES = [
  'ar',
  'zh-tw',
  'zh-cn',
  'cs',
  'da',
  'nl',
  'en',
  'fr',
  'fi',
  'de',
  'el',
  'he',
  'hi',
  'id',
  'it',
  'ja',
  'ko',
  'no',
  'pl',
  'pt-br',
  'ru',
  'es',
  'sk',
  'sv',
  'th',
  'tr',
  'vi',
];

/**
 * whether the language is supported for automatic transcription by our vendors
 * @param {string} langCode
 */
export const isFullySupportedLocale = (langCode: string): boolean =>
  TRANSCRIPTION_VENDOR_LANG_CODES.includes(langCode.toLowerCase());

/**
 * get current user's locale setting when available, default to `en`
 */
export const getUserLanguageCode = (): string => {
  const userLocale = user.get().locale;

  // we don't support the region for English here
  if (!userLocale || userLocale === 'en_US') {
    return 'en';
  }

  // e.g. zh_TW, pt_BR which we do support region here
  return userLocale.replace('_', '-');
};

// make style support rtl if language is rtl
// otherwise, there's no change
export const rtlStyle = <T extends {}>(styles: T, locale: string = _t.getLocale()): T => {
  if (isRightToLeft(locale)) {
    return rtlCssJS(styles);
  } else {
    // There's no need to change anything
    return styles;
  }
};

export const getLanguageDirection = (): 'rtl' | 'ltr' => {
  return isUserRightToLeft() ? 'rtl' : 'ltr';
};

export function isRenderingRightToLeft(): boolean {
  return Boolean(epic.get('RightToLeftLanguageSupport', 'RTLBuildEnabled') && isUserRightToLeft());
}

// a map of translated support page locales
export const supportPageLocale = {
  ar: 'ar',
};

export default {
  languageCodeCSVtoLanguages,
  languageCodeToName,
  latinizeText,
  isRightToLeft,
  courseLanguageTags,
  getIetfLanguageTag,
  getLanguageCode,
  getMomentLanguage,
  getFacebookLocaleString,
  getCmsLocaleString,
  toIetfLanguageTag,
  toLanguageCode,
  getMobileBadgeLanguageCode,
  supportedLanguageSubdomains,
  localeToRegionalHomePage,
  localesWithHomePages,
  isFullySupportedLocale,
  rtlStyle,
  getUserLanguageCode,
  getLanguageDirection,
  supportPageLocale,
};
