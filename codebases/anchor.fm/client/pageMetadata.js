/**
 * When sharing a station/segment, we need to make sure certain metadata
 * are sent from the metadata to the page HTML (server-side reactRouterMiddleware.js)
 */
import { setPageTitle } from '../helpers/serverRenderingUtils';
import { METADATA as HOW_TO_PAGE_METADATA } from './components/AMPHowToPage/constants';

export const RECEIVE_PAGE_METADATA = '@@pageMetadata/RECEIVE_PAGE_METADATA';
export const UPDATE_GOOGLE_BREADCRUMBS_STRUCTURED_DATA =
  '@@pageMetadata/UPDATE_GOOGLE_BREADCRUMBS_STRUCTURED_DATA';

const TITLE_SUFFIXES = {
  DEFAULT: ` | Anchor - The easiest way to make a podcast`,
  HOMEPAGE: ` | Anchor`,
  HOW_TO_START_A_PODCAST_PAGE: ` | Anchor`,
  PROFILE_PAGE: ` • A podcast on Anchor`,
};

const KEYWORDS = [
  'podcast hosting',
  'free podcast hosting',
  'make a podcast',
  'making a podcast',
  'create a podcast',
  'creating a podcast',
  'podcast sponsorships',
  'sponsor a podcast',
  'free',
  'audio',
  'recording',
  'audio clip',
  'anchor',
  'podcasts',
  'voice',
  'microphone',
  'podcast',
  'podcast creation',
  'record',
  'conversation',
  'discussion',
  'talk',
  'talking',
  'radio',
  'public radio',
  'npr',
  'startup',
  'talk radio',
];

const initialState = {
  title: 'Anchor - The easiest way to make a podcast',
  description:
    'Create, distribute, host, and monetize your podcast, 100% free.',
  keywords: KEYWORDS.join(','),
  image:
    'https://d12xoj7p9moygp.cloudfront.net/images/social/opengraph-anchorfm.png',
  imageWidth: 1200,
  imageHeight: 630,
  twitterImage:
    'https://d12xoj7p9moygp.cloudfront.net/images/social/opengraph-twitter-anchorfm.png',
  twitterCard: 'summary_large_image',
  facebookType: 'website',
  oEmbedTitle: '',
  oEmbedUrl: '',
  rssFeedTitle: '',
  rssFeedUrl: '',
  campaign: undefined,
  googleBreadcrumbsStructuredData: [],
};

// reducer

// TODO: Add payload to make it consistent with the current way we're structuring
//       our reducers
export default function reducer(state = initialState, action) {
  switch (action.type) {
    case RECEIVE_PAGE_METADATA: {
      // TODO: metadata => meta middleware.js Flux Standard Action format
      const { metadata } = action;
      // prune any falsy
      Object.keys(metadata).forEach(k => {
        if (!metadata[k]) {
          delete metadata[k];
        }
      });

      // TODO: this needs to be cleaned-up. Instead of intercepting, we should
      //       set the title correctly from the entry point of the router. So
      //       we'd pass the router the correct title, with the suffix.
      if (metadata.title) {
        if (TITLE_SUFFIXES.DEFAULT.indexOf(metadata.title) !== -1) {
          // If homepage -- special case for home route which is the same as suffix
          metadata.title = TITLE_SUFFIXES.DEFAULT;
        } else if (metadata.isVoiceMessagePage) {
          metadata.title = metadata.title;
        } else if (metadata.isProfilePage) {
          // If podcast profile
          metadata.title = metadata.title + TITLE_SUFFIXES.PROFILE_PAGE;
        } else if (HOW_TO_PAGE_METADATA.TITLE.indexOf(metadata.title) !== -1) {
          // If 'how to start a podcast page
          metadata.title =
            metadata.title + TITLE_SUFFIXES.HOW_TO_START_A_PODCAST_PAGE;
        } else {
          metadata.title = metadata.title + TITLE_SUFFIXES.DEFAULT;
        }
        // special case for 'How to start a podcast' route where we do
        //   not want to include tagline
        setPageTitle(metadata.title);
      }
      // TODO: bad practice: side effect in reducer, but not sure any other best place to do this
      return {
        ...state,
        ...metadata,
      };
    }
    case UPDATE_GOOGLE_BREADCRUMBS_STRUCTURED_DATA: {
      const newState = {
        ...state,
        googleBreadcrumbsStructuredData:
          action.payload.googleBreadcrumbsStructuredData,
      };
      return newState;
    }
    default:
      return state;
  }
}

// action creators

export function receivePageMetadata(metadata) {
  return {
    type: RECEIVE_PAGE_METADATA,
    metadata,
  };
}

export function updateGoogleBreadcrumbsStructuredData(
  googleBreadcrumbsStructuredData
) {
  return {
    type: UPDATE_GOOGLE_BREADCRUMBS_STRUCTURED_DATA,
    payload: {
      googleBreadcrumbsStructuredData,
    },
  };
}
