import { MD_SCREEN_MIN } from 'modules/Styleguide';

export const ENABLE_ADS_BY_ANCHOR_PAGE = false;
export const SCREEN_BREAKPOINTS = {
  SMALL_DESKTOP: 1120,
  TABLET: MD_SCREEN_MIN,
  MOBILE: 480,
};
export const PODCAST_AD_DEFINITIONS = [
  {
    term: 'SAI',
    definition:
      'Streaming Ad Insertion (SAI) is the podcast ad technology that powers Spotify Podcast Ads delivered on-platform. SAI delivers the most rigorous and transparent reporting available in podcasting including confirmed ad impressions, audience insights, and creative performance.',
  },
  {
    term: 'DAI',
    definition:
      'Dynamic Ad Insertion (DAI) is a legacy ad technology that launched in 2013. With DAI, ads are served through an ad server and are inserted upon receipt of a podcast file request. Spotify leverages DAI to serve our ads off- platform on non-Spotify podcast platforms like Apple Podcasts, Overcast, and Stitcher.',
  },
  {
    term: 'SPAN',
    definition:
      'The Spotify Audience Network is Spotify’s proprietary audio advertising marketplace in which advertisers of all sizes will be able to connect with listeners consuming a broad range of content. These include Spotify’s Originals & Exclusives, podcasts via Megaphone and Anchor, and ad-supported music.',
  },
  {
    term: 'CPM',
    definition:
      'Cost per mille, a term used to denote the cost per 1000 impressions to the advertiser. This does not include the revenue share a platform may take.',
  },
  {
    term: 'RPM',
    definition:
      'Revenue per mille, a term used to denote the earnings per 1000  impressions to the creator.',
  },
];
