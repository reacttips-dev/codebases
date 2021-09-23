const serverRenderingUtils = require('anchor-website-common/helpers/serverRenderingUtils');
const calculatePayoutFee = require('anchor-server-common/utilities/money/calculatePayoutFee');

const APP_INIT = '@@index/APP_INIT';
const SESSION_NAME = 'anchorpw_s';
const ASSETS_PATH = 'https://d12xoj7p9moygp.cloudfront.net/';
const DEFAULT_PODCAST_IMAGE = `${ASSETS_PATH}images/default-podcast-image.png`;
const BUILD_ASSETS_PATH = 'https://d1rx8vrt2hn1hc.cloudfront.net/builds/';

// wrapped version of keymaster (not server-safe)
const assignKey = serverRenderingUtils.windowUndefined()
  ? function () {}
  : require('keymaster');

const LANGUAGES = [
  { label: 'Afrikaans', value: 'af' },
  { label: 'Akan', value: 'ak' },
  { label: 'Albanian', value: 'sq' },
  { label: 'Arabic', value: 'ar' },
  { label: 'Armenian', value: 'hy' },
  { label: 'Azerbaijani', value: 'az' },
  { label: 'Bambara', value: 'bm' },
  { label: 'Basque', value: 'eu' },
  { label: 'Belarusian', value: 'be' },
  { label: 'Bengali', value: 'bn' },
  { label: 'Bokmål, Norwegian', value: 'nb' },
  { label: 'Bosnian', value: 'bs' },
  { label: 'Breton', value: 'br' },
  { label: 'Bulgarian', value: 'bg' },
  { label: 'Burmese', value: 'my' },
  { label: 'Catalan', value: 'ca' },
  { label: 'Central Khmer', value: 'km' },
  { label: 'Chechen', value: 'ce' },
  { label: 'Chinese (Simplified)', value: 'zh-cn' },
  { label: 'Chinese (Traditional)', value: 'zh-tw' },
  { label: 'Cornish', value: 'kw' },
  { label: 'Croatian', value: 'hr' },
  { label: 'Czech', value: 'cs' },
  { label: 'Danish', value: 'da' },
  { label: 'Dutch', value: 'nl' },
  { label: 'Dutch (Belgium)', value: 'nl-be' },
  { label: 'Dutch (Netherlands)', value: 'nl-nl' },
  { label: 'Dzongkha', value: 'dz' },
  { label: 'English', value: 'en' },
  { label: 'English (Australia)', value: 'en-au' },
  { label: 'English (Belize)', value: 'en-bz' },
  { label: 'English (Canada)', value: 'en-ca' },
  { label: 'English (Ireland)', value: 'en-ie' },
  { label: 'English (Jamaica)', value: 'en-jm' },
  { label: 'English (New Zealand)', value: 'en-nz' },
  { label: 'English (Phillipines)', value: 'en-ph' },
  { label: 'English (South Africa)', value: 'en-za' },
  { label: 'English (Trinidad)', value: 'en-tt' },
  { label: 'English (United Kingdom)', value: 'en-gb' },
  { label: 'English (United States)', value: 'en-us' },
  { label: 'English (Zimbabwe)', value: 'en-zw' },
  { label: 'Esperanto', value: 'eo' },
  { label: 'Estonian', value: 'et' },
  { label: 'Ewe', value: 'ee' },
  { label: 'Faeroese', value: 'fo' },
  { label: 'Filipino', value: 'fil' },
  { label: 'Finnish', value: 'fi' },
  { label: 'French', value: 'fr' },
  { label: 'French (Belgium)', value: 'fr-be' },
  { label: 'French (Canada)', value: 'fr-ca' },
  { label: 'French (France)', value: 'fr-fr' },
  { label: 'French (Luxembourg)', value: 'fr-lu' },
  { label: 'French (Monaco)', value: 'fr-mc' },
  { label: 'French (Switzerland)', value: 'fr-ch' },
  { label: 'Fulah', value: 'ff' },
  { label: 'Gaelic', value: 'gd' },
  { label: 'Galician', value: 'gl' },
  { label: 'Ganda', value: 'lg' },
  { label: 'Georgian', value: 'ka' },
  { label: 'German', value: 'de' },
  { label: 'German (Austria)', value: 'de-at' },
  { label: 'German (Germany)', value: 'de-de' },
  { label: 'German (Liechtenstein)', value: 'de-li' },
  { label: 'German (Luxembourg)', value: 'de-lu' },
  { label: 'German (Switzerland)', value: 'de-ch' },
  { label: 'Greek', value: 'el' },
  { label: 'Gujarati', value: 'gu' },
  { label: 'Hausa', value: 'ha' },
  { label: 'Hawaiian', value: 'haw' },
  { label: 'Hebrew', value: 'he' },
  { label: 'Hindi', value: 'hi' },
  { label: 'Hungarian', value: 'hu' },
  { label: 'Icelandic', value: 'is' },
  { label: 'Igbo', value: 'ig' },
  { label: 'Indonesian', value: 'in' },
  { label: 'Inuktitut', value: 'iu' },
  { label: 'Irish', value: 'ga' },
  { label: 'Italian', value: 'it' },
  { label: 'Italian (Italy)', value: 'it-it' },
  { label: 'Italian (Switzerland)', value: 'it-ch' },
  { label: 'Japanese', value: 'ja' },
  { label: 'Kalaallisut', value: 'kl' },
  { label: 'Kannada', value: 'kn' },
  { label: 'Kashmiri', value: 'ks' },
  { label: 'Kazakh', value: 'kk' },
  { label: 'Kikuyu', value: 'ki' },
  { label: 'Kinyarwanda', value: 'rw' },
  { label: 'Kirghiz', value: 'ky' },
  { label: 'Korean', value: 'ko' },
  { label: 'Lao', value: 'lo' },
  { label: 'Latvian', value: 'lv' },
  { label: 'Lingala', value: 'ln' },
  { label: 'Lithuanian', value: 'lt' },
  { label: 'Luba-Katanga', value: 'lu' },
  { label: 'Luxembourgish', value: 'lb' },
  { label: 'Macedonian', value: 'mk' },
  { label: 'Malagasy', value: 'mg' },
  { label: 'Malay', value: 'ms' },
  { label: 'Malayalam', value: 'ml' },
  { label: 'Maltese', value: 'mt' },
  { label: 'Manx', value: 'gv' },
  { label: 'Marathi', value: 'mr' },
  { label: 'Mongolian', value: 'mn' },
  { label: 'Ndebele, North', value: 'nd' },
  { label: 'Ndebele, South', value: 'nr' },
  { label: 'Nepali', value: 'ne' },
  { label: 'Northern Sami', value: 'se' },
  { label: 'Norwegian', value: 'no' },
  { label: 'Norwegian Nynorsk', value: 'nn' },
  { label: 'Oromo', value: 'om' },
  { label: 'Ossetian', value: 'os' },
  { label: 'Panjabi', value: 'pa' },
  { label: 'Persian', value: 'fa' },
  { label: 'Polish', value: 'pl' },
  { label: 'Portuguese', value: 'pt' },
  { label: 'Portuguese (Brazil)', value: 'pt-br' },
  { label: 'Portuguese (Portugal)', value: 'pt-pt' },
  { label: 'Quechua', value: 'qu' },
  { label: 'Romanian', value: 'ro' },
  { label: 'Romanian (Moldova)', value: 'ro-mo' },
  { label: 'Romanian (Romania)', value: 'ro-ro' },
  { label: 'Romansh', value: 'rm' },
  { label: 'Rundi', value: 'rn' },
  { label: 'Russian', value: 'ru' },
  { label: 'Russian (Moldova)', value: 'ru-mo' },
  { label: 'Russian (Russia)', value: 'ru-ru' },
  { label: 'Sango', value: 'sg' },
  { label: 'Serbian', value: 'sr' },
  { label: 'Shona', value: 'sn' },
  { label: 'Sichuan Yi', value: 'ii' },
  { label: 'Sinhala', value: 'si' },
  { label: 'Slovak', value: 'sk' },
  { label: 'Slovenian', value: 'sl' },
  { label: 'Somali', value: 'so' },
  { label: 'Spanish', value: 'es' },
  { label: 'Spanish (Argentina)', value: 'es-ar' },
  { label: 'Spanish (Bolivia)', value: 'es-bo' },
  { label: 'Spanish (Chile)', value: 'es-cl' },
  { label: 'Spanish (Colombia)', value: 'es-co' },
  { label: 'Spanish (Costa Rica)', value: 'es-cr' },
  { label: 'Spanish (Dominican Republic)', value: 'es-do' },
  { label: 'Spanish (Ecuador)', value: 'es-ec' },
  { label: 'Spanish (El Salvador)', value: 'es-sv' },
  { label: 'Spanish (Guatemala)', value: 'es-gt' },
  { label: 'Spanish (Honduras)', value: 'es-hn' },
  { label: 'Spanish (Mexico)', value: 'es-mx' },
  { label: 'Spanish (Nicaragua)', value: 'es-ni' },
  { label: 'Spanish (Panama)', value: 'es-pa' },
  { label: 'Spanish (Paraguay)', value: 'es-py' },
  { label: 'Spanish (Peru)', value: 'es-pe' },
  { label: 'Spanish (Puerto Rico)', value: 'es-pr' },
  { label: 'Spanish (Spain)', value: 'es-es' },
  { label: 'Spanish (Uruguay)', value: 'es-uy' },
  { label: 'Spanish (Venezuela)', value: 'es-ve' },
  { label: 'Swahili', value: 'sw' },
  { label: 'Swedish', value: 'sv' },
  { label: 'Swedish (Finland)', value: 'sv-fi' },
  { label: 'Swedish (Sweden)', value: 'sv-se' },
  { label: 'Tagalog', value: 'tl' },
  { label: 'Tajik', value: 'tg' },
  { label: 'Tamil', value: 'ta' },
  { label: 'Tatar', value: 'tt' },
  { label: 'Telugu', value: 'te' },
  { label: 'Thai', value: 'th' },
  { label: 'Tibetan', value: 'bo' },
  { label: 'Tigrinya', value: 'ti' },
  { label: 'Tonga (Tonga Islands)', value: 'to' },
  { label: 'Turkish', value: 'tr' },
  { label: 'Turkmen', value: 'tk' },
  { label: 'Uighur', value: 'ug' },
  { label: 'Ukrainian', value: 'uk' },
  { label: 'Ukranian', value: 'uk' },
  { label: 'Urdu', value: 'ur' },
  { label: 'Uzbek', value: 'uz' },
  { label: 'Vietnamese', value: 'vi' },
  { label: 'Welsh', value: 'cy' },
  { label: 'Wolof', value: 'wo' },
  { label: 'Yiddish', value: 'yi' },
  { label: 'Yoruba', value: 'yo' },
  { label: 'Zulu', value: 'zu' },
];

const getLanguagesSortedByLabel = (showEnglishFirst = false) => {
  const languagesWithoutEnglish = LANGUAGES.filter(
    language => language.value !== 'en'
  );
  const languagesToSort = showEnglishFirst
    ? languagesWithoutEnglish
    : LANGUAGES;

  const sortedLanguages = languagesToSort.sort((a, b) => {
    // Sort by label
    const textA = a.label.toUpperCase();
    const textB = b.label.toUpperCase();
    if (textA < textB) {
      return -1;
    }
    if (textA > textB) {
      return 1;
    }
    return 0;
  });

  const sortedLanguagesWithEnglishFirst = [
    { label: 'English', value: 'en' },
  ].concat(sortedLanguages);

  return showEnglishFirst ? sortedLanguagesWithEnglishFirst : sortedLanguages;
};

module.exports = Object.assign({}, serverRenderingUtils, {
  isIOS: serverRenderingUtils.isIOS,
  APP_INIT,
  appStoreLink,
  assignKey,
  doHideGetAppButton,
  ASSETS_PATH,
  BUILD_ASSETS_PATH,
  DEFAULT_PODCAST_IMAGE,
  getBaseUrl,
  getBlobUrlCreator,
  getDateWithoutHours,
  getEpisodeImage,
  getPodcastImage,
  isEmbedPath,
  isRWFPath,
  isPodcastDashboardPath,
  calculatePayoutFee,
  SESSION_NAME,
  playStoreLink,
  getLanguagesSortedByLabel,
  LANGUAGES,
  PODCAST_EPISODE_AUDIO_TYPES: {
    MOBILE_RECORDING: 'mobileRecording',
    // may be difficult to track in database (3.0 easier, or we add a special 'origin' for these files)
    UPLOAD: 'upload',
    INTERVIEW: 'interview',
    CALL_IN: 'callIn',
    INTERLUDE: 'interlude',
    LIBRARY: 'library',
  },
  PODCAST_IMPORT_ORIGIN: 'podcasts:import',
  PODCAST_IMPORT_STATUS: {
    FAILED: 'failed',
    IN_PROGRESS: 'inProgress',
    FINISHED: 'finished',
  },
  PROCESSOR_AUTH_OUTCOMES: {
    USER_HAS_NO_EMAIL: 'noEmail',
    STATION_HAS_MUSIC_IN_EPISODES: 'musicInEpisodes',
    STATION_HAS_IMPORTED_AND_NOT_REDIRECTED: 'notRedirected',
  },
  PODCAST_CATEGORIES: [
    {
      title: 'Arts',
      children: [
        'Design',
        'Fashion & Beauty',
        'Food',
        'Literature',
        'Performing Arts',
        'Visual Arts',
      ],
    },
    {
      title: 'Business',
      children: [
        'Business News',
        'Careers',
        'Investing',
        'Management & Marketing',
        'Shopping',
      ],
    },
    {
      title: 'Comedy',
      children: [],
    },
    {
      title: 'Education',
      children: [
        'Educational Technology',
        'Higher Education',
        'K-12',
        'Language Courses',
        'Training',
      ],
    },
    {
      title: 'Games & Hobbies',
      children: [
        'Automotive',
        'Aviation',
        'Hobbies',
        'Other Games',
        'Video Games',
      ],
    },
    {
      title: 'Government & Organizations',
      children: ['Local', 'National', 'Non-Profit', 'Regional'],
    },
    {
      title: 'Health',
      children: [
        'Alternative Health',
        'Fitness & Nutrition',
        'Self-Help',
        'Sexuality',
      ],
    },
    {
      title: 'Kids & Family',
      children: [],
    },
    {
      title: 'Music',
      children: [],
    },
    {
      title: 'News & Politics',
      children: [],
    },
    {
      title: 'Religion & Spirituality',
      children: [
        'Buddhism',
        'Christianity',
        'Hinduism',
        'Islam',
        'Judaism',
        'Other',
        'Spirituality',
      ],
    },
    {
      title: 'Science & Medicine',
      children: ['Medicine', 'Natural Sciences', 'Social Sciences'],
    },
    {
      title: 'Society & Culture',
      children: [
        'History',
        'Personal Journals',
        'Philosophy',
        'Places & Travel',
      ],
    },
    {
      title: 'Sports & Recreation',
      children: ['Amateur', 'College & High School', 'Outdoor', 'Professional'],
    },
    {
      title: 'Technology',
      children: ['Gadgets', 'Tech News', 'Podcasting', 'Software How-To'],
    },
    {
      title: 'TV & Film',
      children: [],
    },
  ],
  getFeedUrl,
});

function isEmbedPath(path = '') {
  return (
    path &&
    (path.indexOf('/e/') === 0 ||
      path.match(/\/embed$/) ||
      path.match(/\/embed\/episodes\//))
  );
}

function isRWFPath(path = '') {
  return path && Boolean(path.match(/\/call\//));
}

function isPodcastDashboardPath(path = '') {
  return path.indexOf('/dashboard') === 0;
}

function doHideGetAppButton(path = '') {
  const { parseUserAgent, windowUndefined } = serverRenderingUtils;
  if (windowUndefined()) {
    return false;
  }
  const { mobile } = parseUserAgent();
  if (mobile) {
    // episodes pages, as they have a high get the app button
    if (path.indexOf('/rr/') === 0) {
      return true;
    }
    // call join invitations (VOIP)
    if (path.indexOf('/call/') !== -1) {
      return true;
    }
    return false;
  }
  return false;
}

function getBaseUrl() {
  if (process.env.BASE_URL) {
    return process.env.BASE_URL;
  }
  // old way
  return {
    local: `http://localhost:${process.env.PORT || 8012}`,
    development: 'https://v2websitedev2.anchor.fm',
    staging: 'https://anchor.fm',
    production: 'https://anchor.fm',
  }[ENVIRONMENT || 'local'];
}

function getFeedUrl(encodedStationId) {
  return `https://anchor.fm/s/${encodedStationId}/podcast/rss`;
}

function getDateWithoutHours(date) {
  const dateWithoutHours = new Date(date);
  dateWithoutHours.setHours(0);
  dateWithoutHours.setMinutes(0);
  dateWithoutHours.setSeconds(0);
  dateWithoutHours.setMilliseconds(0);
  return dateWithoutHours;
}

function getBlobUrlCreator() {
  if (serverRenderingUtils.windowUndefined()) {
    return null;
  }
  const blob = window.URL || window.webkitURL;
  return blob || null;
}

// https://s3-us-west-2.amazonaws.com/anchor-generated-image-bank/production/podcast_uploaded400/1890044/1890044-1559660713392-d254bee27e32.jpg
// https://d3t3ozftmdmh3i.cloudfront.net/production/podcast_uploaded400/1890044/1890044-1559660713392-d254bee27e32.jpg
function replaceGeneratedImageBankUrlWithCdn(url) {
  return (
    url &&
    url.replace(
      's3-us-west-2.amazonaws.com/anchor-generated-image-bank',
      'd3t3ozftmdmh3i.cloudfront.net'
    )
  );
}

function getPodcastImage({ podcastMetadata = {}, creator = {} }) {
  const podcastImage =
    podcastMetadata.podcastImage ||
    podcastMetadata.podcastImage400 ||
    creator.imageUrl;

  if (podcastImage) {
    return replaceGeneratedImageBankUrlWithCdn(podcastImage);
  }

  return DEFAULT_PODCAST_IMAGE;
}

function getEpisodeImage({ episode = {}, podcastMetadata = {}, creator = {} }) {
  const episodeImage =
    episode.episodeImage || podcastMetadata.podcastImage || creator.imageUrl;

  if (episodeImage) {
    return replaceGeneratedImageBankUrlWithCdn(episodeImage);
  }

  return DEFAULT_PODCAST_IMAGE;
}

function appStoreLink(campaign = 'WebsiteTracking') {
  return `https://itunes.apple.com/app/apple-store/id1056182234?pt=118017867&ct=${campaign}&mt=8`;
}

function playStoreLink(config = {}) {
  const sourceAndCampaign = config.campaign
    ? encodeURIComponent(config.campaign)
    : encodeURIComponent('Anchor Home');
  let referrerParam = `utm_source=${sourceAndCampaign}&utm_medium=cpc&utm_campaign=${sourceAndCampaign}&anid=admob`;
  if (config.callJoinCode) {
    referrerParam = `${referrerParam}&call_join_code=${config.callJoinCode}`;
  }
  if (config.referralCode) {
    referrerParam = `${referrerParam}&referral_code=${config.referralCode}`;
  }
  return `https://play.google.com/store/apps/details?id=fm.anchor.android&referrer=${encodeURIComponent(
    referrerParam
  )}`;
}
