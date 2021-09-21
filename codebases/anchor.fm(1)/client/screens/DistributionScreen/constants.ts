export const PODCAST_URLS_BY_HOST = new Map([
  ['itunes', ['https://itunes.apple.com', 'https://podcasts.apple.com']],
  ['spotify', ['https://open.spotify.com']],
  ['overcast', ['https://overcast.fm']],
  ['pocketCasts', ['https://pca.st', 'https://play.pocketcasts.com']],
  ['stitcher', ['https://stitcher.com']],
  ['radioPublic', ['https://radiopublic.com', 'https://play.radiopublic.com']],
  ['breaker', ['https://breaker.audio']],
  ['castbox', ['https://castbox.fm']],
  ['podBean', ['https://podbean.com']],
  ['tuneIn', ['https://tunein.com']],
  ['iheartRadio', ['https://iheart.com']],
  ['googlePlay', ['https://play.google.com', 'https://playmusic.app.goo.gl']],
  ['googlePodcasts', ['https://podcasts.google.com/feed']],
]);

export const PODCAST_URL_HOSTS = {
  APPLE_PODCASTS: 'itunes',
  GOOGLE_PODCASTS: 'googlePodcasts',
  GOOGLE_PLAY_MUSIC: 'googlePlay',
  OVERCAST: 'overcast',
  POCKETCASTS: 'pocketCasts',
  POD_BEAN: 'podBean',
  RADIO_PUBLIC: 'radioPublic',
  SPOTIFY: 'spotify',
  STITCHER: 'stitcher',
  BREAKER: 'breaker',
  CASTBOX: 'castbox',
  TUNE_IN: 'tuneIn',
};

export const POTENTIAL_PLATFORMS = [
  {
    label: 'Anchor',
    name: 'anchor',
    isReadOnly: true,
  },
  {
    label: 'Apple Podcasts',
    name: PODCAST_URL_HOSTS.APPLE_PODCASTS,
  },
  {
    label: 'Google Podcasts',
    name: PODCAST_URL_HOSTS.GOOGLE_PODCASTS,
  },
  {
    label: 'Spotify',
    name: PODCAST_URL_HOSTS.SPOTIFY,
  },
  {
    label: 'Breaker',
    name: PODCAST_URL_HOSTS.BREAKER,
  },
  {
    label: 'Castbox',
    name: PODCAST_URL_HOSTS.CASTBOX,
  },
  {
    label: 'Google Play Music',
    name: PODCAST_URL_HOSTS.GOOGLE_PLAY_MUSIC,
  },
  {
    label: 'Overcast',
    name: PODCAST_URL_HOSTS.OVERCAST,
  },
  {
    label: 'Pocket Casts',
    name: PODCAST_URL_HOSTS.POCKETCASTS,
  },
  {
    label: 'PodBean',
    name: PODCAST_URL_HOSTS.POD_BEAN,
  },
  {
    label: 'RadioPublic',
    name: PODCAST_URL_HOSTS.RADIO_PUBLIC,
  },
  {
    label: 'Stitcher',
    name: PODCAST_URL_HOSTS.STITCHER,
  },
  {
    label: 'TuneIn',
    name: PODCAST_URL_HOSTS.TUNE_IN,
  },
];

export const HIDE_FROM_AVAILABLE_LISTENING_PLATFORMS = [
  PODCAST_URL_HOSTS.TUNE_IN,
  PODCAST_URL_HOSTS.POD_BEAN,
  PODCAST_URL_HOSTS.GOOGLE_PLAY_MUSIC,
];
export const HIDE_FROM_MANUAL_DISTRIBUTION = [
  PODCAST_URL_HOSTS.STITCHER,
  PODCAST_URL_HOSTS.TUNE_IN,
  PODCAST_URL_HOSTS.POD_BEAN,
  PODCAST_URL_HOSTS.GOOGLE_PLAY_MUSIC,
];
