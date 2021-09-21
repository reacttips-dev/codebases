import Promise from 'bluebird';
import queryString from 'query-string';
import { ADJUST_URL } from 'helpers/constants';
import { fetchPermissions, getCurrentUser } from './user';
import { getMetadataFromParams } from './utils';
import {
  checkForVanityUrl,
  getReferralCodeFromCallInvite,
  redirectLegacyStationPageToVanityUrl,
  redirectToPath,
  redirectToUrl,
  openInAppRedirect,
  saveReferralIp,
  setCanonicalEpisodePathAndGetReferralCodeForEpisode,
  storeCampaign,
} from './referralRedirect';
import { windowUndefined } from '../helpers/serverRenderingUtils';
import withOnEnter from './withOnEnter';
import { withVanityHeader } from './withVanityHeader';
import withBlockingOnEnter from './withBlockingOnEnter';
import AppContainer from './components/AppContainer';
import { HomePage } from './screens/HomePage';
import { FeaturesScreen } from './screens/FeaturesScreen';
import AMPHowToPage from './components/AMPHowToPage';
import CallJoinContainer from './components/CallJoinContainer';
import RecordOnMobileContainer from './components/RecordOnMobileContainer';
import RedirectingInterstitial from './components/RedirectingInterstitial';
import ResetPasswordContainer from './components/ResetPasswordContainer';
import { SupportersCancelScreenContainer } from './screens/SupportersCancelScreen';
import SignupPageContainer from './components/SignupPageContainer';
// TODO: re-enable as async code bundles\
import {
  ImportScreen,
  ImportScreenScrolledToForm,
} from './screens/ImportScreen';
import {
  ImportAlreadyLoggedInContainer,
  ImportCreateAccountContainer,
  ImportLoginContainer,
} from './components/ImportOnboardingContainer';
import { NewEpisodeRedirectScreen } from './screens/NewEpisodeRedirectScreen';
import {
  AuthRouter,
  ProfileContainer,
  ProfileEpisodeContainer,
} from './asyncRouteComponents';
import { TermsScreen } from './screens/TermsScreen';
import { SponsorshipsPageScreenContainer } from './screens/SponsorshipsPageScreen';
import { QuicksilverAppScreenContainer } from './screens/QuicksilverAppScreen';
import LoginPageContainer from './components/LoginPageContainer';
import NotFoundContainer from './screens/NotFoundScreen/NotFoundContainer';
import { EmbedNotFound } from './components/Profile/components/NotFound';
import { VerifyUserEmailScreen } from './screens/VerifyUserEmailScreen';
import { AnchorAPI } from './modules/AnchorAPI';
import { WordpressScreen } from './screens/WordpressScreen';
import { PaywallsCancelSubscription } from './screens/PaywallsCancelSubscription';
import { PaywallsSubscriptionError } from './screens/PaywallsSubscriptionError';
import { PaywallsSubscriptionDisabled } from './screens/PaywallsSubscriptionDisabled';
import { AdsByAnchorScreen } from './screens/AdsByAnchorScreen';
import { ENABLE_ADS_BY_ANCHOR_PAGE } from './screens/AdsByAnchorScreen/constants';

// Wrap routes with HOCs to account for redirects
// 'Exact' routes prevents multiple matches from child routes,
// but otherwise need to arrange by most specific first
// (see https://www.npmjs.com/package/react-router-config#renderroutesroutes-extraprops--)

const adsByAnchorRoute = ENABLE_ADS_BY_ANCHOR_PAGE
  ? [{ path: '/ads-by-anchor', component: AdsByAnchorScreen }]
  : [];

export function getRoutesWithStore(store, baseUrl = '') {
  const routes = [
    {
      path: '/getonspotify',
      component: QuicksilverAppScreenContainer,
      routes: [
        {
          path: '/br',
          component: QuicksilverAppScreenContainer,
          exact: 'true',
        },
      ],
    },
    {
      path: '/embed/404',
      component: EmbedNotFound,
      exact: true,
    },
    {
      component: withOnEnter(storeCampaign(store), AppContainer),
      routes: [
        ...adsByAnchorRoute,
        {
          path: '/',
          component: withOnEnter(
            redirectPublicPathToAuthedPath(store, '/dashboard'),
            HomePage
          ),
          exact: true,
        },
        {
          path: '/wordpressdotcom',
          component: withOnEnter(
            redirectPublicPathToAuthedPath(store, '/dashboard/episodes'),
            WordpressScreen
          ),
          exact: true,
        },
        {
          path: '/verify_email',
          component: VerifyUserEmailScreen,
        },
        {
          path: '/how-to-start-a-podcast',
          component: AMPHowToPage,
          exact: true,
        },
        {
          path: '/features',
          component: FeaturesScreen,
          exact: true,
        },
        {
          path: '/about',
          component: redirectRoute(store, '/'),
          exact: true,
        },
        {
          path: '/404',
          component: NotFoundContainer,
          exact: true,
        },
        {
          path: '/activity',
          canonicalPath: '/',
          component: HomePage,
          exact: true,
        },
        {
          path: '/jobs',
          component: withOnEnter(
            redirectToUrl(
              store,
              'https://spotifyjobs.com/jobs?q=Podcaster%20Mission'
            ),
            RedirectingInterstitial
          ),
          exact: true,
        },
        /* START Vanity Redirects 10/30/19 @sward */
        /* END Vanity Redirects 10/30/19 @sward */
        {
          path: '/app',
          component: withOnEnter(
            redirectToUrl(store, 'https://smarturl.it/anchor-tw'),
            RedirectingInterstitial
          ),
          exact: true,
        },
        {
          path: '/create-new-episode',
          component: NewEpisodeRedirectScreen,
          exact: true,
        },
        {
          path: '/spotifyfree',
          component: withOnEnter(
            redirectToUrl(store, 'https://smarturl.it/anchor-tw'),
            RedirectingInterstitial
          ),
          exact: true,
        },
        {
          canonicalPath: '/',
          path: '/audiobank/:audioId/:media',
          component: HomePage,
          exact: true,
        },
        // TODO: deprecate
        {
          path: '/beta',
          component: redirectRoute(store, '/signup'),
          exact: true,
        },
        // TODO: deprecate
        {
          path: '/betacode',
          component: redirectRoute(store, '/signup'),
          exact: true,
        },
        {
          path: '/canvas',
          canonicalPath: '/',
          component: HomePage,
          exact: true,
        },
        {
          path: '/clip',
          component: redirectRoute(store, '/dashboard'),
          exact: true,
        },
        {
          path: '/clips',
          component: redirectRoute(store, '/dashboard'),
          exact: true,
        },
        {
          path: '/clipper',
          component: redirectRoute(store, '/dashboard'),
          exact: true,
        },
        {
          path: '/clockwise',
          canonicalPath: '/',
          component: HomePage,
          exact: true,
        },
        {
          path: '/connected',
          canonicalPath: '/',
          component: HomePage,
          exact: true,
        },
        {
          path: '/createaccount',
          component: redirectRoute(store, '/dashboard'),
          exact: true,
        },
        {
          path: '/creation/record',
          canonicalPath: '/',
          component: RecordOnMobileContainer,
          exact: true,
        },
        {
          path: '/creation/:tab',
          canonicalPath: '/',
          component: HomePage,
          exact: true,
        },
        {
          path: '/creation/:tab/:id',
          canonicalPath: '/',
          component: HomePage,
          exact: true,
        },
        // Auth Dashboard routes
        {
          path: '/dashboard',
          component: withOnEnter(
            redirectAuthPathToPublicPath(store, baseUrl),
            AuthRouter
          ),
        },
        {
          path: '/transcriptions/:audioId',
          component: withOnEnter(
            redirectAuthPathToPublicPath(store, baseUrl),
            AuthRouter
          ),
          exact: true,
        },
        {
          path: '/discover',
          canonicalPath: '/',
          component: HomePage,
          exact: true,
        },
        {
          path: '/dmca',
          component: TermsScreen,
          exact: true,
        },
        {
          path: '/download',
          canonicalPath: '/',
          component: HomePage,
          exact: true,
        },
        {
          path: '/e/:stationId',
          component: EmbedNotFound,
          exact: true,
        },
        // deprecating /emailcampaign as Mailchimp is no longer being used
        {
          path: '/emailcampaign',
          component: redirectRoute(store, '/'),
          exact: true,
        },
        {
          path: '/grouping/:id',
          canonicalPath: '/',
          component: HomePage,
          exact: true,
        },
        // deprecating listen
        {
          path: '/listen',
          component: redirectRoute(store, '/'),
          exact: true,
        },
        {
          path: '/login',
          exact: true,
          component: LoginPageContainer,
        },
        {
          path: '/mac',
          canonicalPath: '/',
          component: HomePage,
          exact: true,
        },
        {
          path: '/me',
          component: withOnEnter(
            openInAppRedirect(store),
            RedirectingInterstitial
          ),
          exact: true,
        },
        {
          path: '/me/settings',
          component: withOnEnter(
            redirectPublicPathToAuthedPath(store, '/dashboard/podcast/edit'),
            HomePage
          ),
          exact: true,
        },
        {
          path: '/me/:tab',
          canonicalPath: '/',
          component: HomePage,
          exact: true,
        },
        {
          path: '/onboarding',
          component: redirectRoute(store, '/signup'),
          exact: true,
          // Onboarding routes
        },
        {
          path: '/onboarding/rss',
          component: redirectRoute(store, '/switch'),
          exact: true,
        },
        {
          path: '/onboarding/*',
          component: redirectRoute(store, '/signup'),
          exact: true,
        },
        {
          path: '/podcast',
          component: withOnEnter(
            redirectToUrl(store, 'https://smarturl.it/anchorpodcasts'),
            RedirectingInterstitial
          ),
          exact: true,
        },
        {
          path: '/start',
          component: withOnEnter(
            redirectToUrl(store, 'https://smarturl.it/anchorpodcasts'),
            RedirectingInterstitial
          ),
          exact: true,
        },
        {
          path: '/getstarted',
          component: withOnEnter(
            redirectToUrl(store, `${ADJUST_URL}/u7znuj4`),
            RedirectingInterstitial
          ),
          exact: true,
        },
        {
          path: '/skillshare',
          component: withOnEnter(
            redirectToUrl(store, 'https://smarturl.it/anchorpodcasts'),
            RedirectingInterstitial
          ),
          exact: true,
        },
        {
          path: '/s4ahome',
          component: withOnEnter(
            redirectToUrl(store, 'https://smarturl.it/anchorpodcasts'),
            RedirectingInterstitial
          ),
          exact: true,
        },
        {
          path: '/ashley-graham',
          component: withOnEnter(
            redirectToUrl(store, '/prettybigdealpod'),
            RedirectingInterstitial
          ),
          exact: true,
        },
        {
          path: '/ashleygraham',
          component: withOnEnter(
            redirectToUrl(store, '/prettybigdealpod'),
            RedirectingInterstitial
          ),
          exact: true,
        },
        {
          path: '/switch',
          component: ImportScreen,
          exact: true,
        },
        {
          path: '/switch/form',
          component: ImportScreenScrolledToForm,
          exact: true,
        },
        /* start international redirects 7/18/19 */
        // /anchor_br handled through /getonspotify load balancer rule / separate bundle
        {
          path: '/anchor_in',
          component: withOnEnter(
            redirectToUrl(store, 'https://smarturl.it/anchorpodcasts'),
            RedirectingInterstitial
          ),
          exact: true,
        },
        {
          path: '/anchor_id',
          component: withOnEnter(
            redirectToUrl(store, 'https://smarturl.it/anchorpodcasts'),
            RedirectingInterstitial
          ),
          exact: true,
        },
        {
          path: '/musicandtalk',
          component: withOnEnter(
            redirectToUrl(
              store,
              `${ADJUST_URL}/4pmkh4d?redirect=https%3A%2F%2Fanchor.fm%2Fapp`
            ),
            RedirectingInterstitial
          ),
          exact: true,
        },
        {
          path: '/musicplustalk',
          component: withOnEnter(
            redirectToUrl(
              store,
              `${ADJUST_URL}/e7664tz?redirect=https%3A%2F%2Fanchor.fm%2Fapp`
            ),
            RedirectingInterstitial
          ),
          exact: true,
        },
        /* end marketing redirects 2/28/21 */
        {
          path: '/switch/signup',
          component: withOnEnter(
            redirectPublicPathToAuthedPath(store, '/switch/import'),
            ImportCreateAccountContainer
          ),
          exact: true,
        },
        {
          path: '/switch/login',
          component: withOnEnter(
            redirectPublicPathToAuthedPath(store, '/switch/import'),
            ImportLoginContainer
          ),
          exact: true,
        },
        {
          path: '/switch/import',
          component: ImportAlreadyLoggedInContainer,
          exact: true,
        },
        {
          path: '/podcastlab',
          component: withOnEnter(
            redirectToUrl(store, 'https://lab.anchor.fm'),
            RedirectingInterstitial
          ),
          exact: true,
        },
        {
          path: '/startyourpodcast',
          component: withOnEnter(
            redirectToUrl(store, `${ADJUST_URL}/gx4937i`),
            RedirectingInterstitial
          ),
          exact: true,
        },
        {
          path: '/createnow',
          component: withOnEnter(
            redirectToUrl(store, `${ADJUST_URL}/np2ww2w`),
            RedirectingInterstitial
          ),
          exact: true,
        },
        {
          path: '/comeceseupodcast',
          component: withOnEnter(
            redirectToUrl(store, `${ADJUST_URL}/8bp2trg`),
            RedirectingInterstitial
          ),
          exact: true,
        },
        {
          path: '/comenzar',
          component: withOnEnter(
            redirectToUrl(store, `${ADJUST_URL}/iq8xxv2`),
            RedirectingInterstitial
          ),
          exact: true,
        },
        {
          path: '/mulai',
          component: withOnEnter(
            redirectToUrl(store, `${ADJUST_URL}/a0sd7nu`),
            RedirectingInterstitial
          ),
          exact: true,
        },
        {
          path: '/showswithmusic',
          component: withOnEnter(
            redirectToUrl(store, 'https://blog.anchor.fm/music'),
            RedirectingInterstitial
          ),
          exact: true,
        },
        {
          path: '/podcastsubscriptions',
          component: withOnEnter(
            redirectToUrl(store, 'https://blog.anchor.fm/paid-subscriptions'),
            RedirectingInterstitial
          ),
          exact: true,
        },
        {
          path: '/podcastnow',
          component: withOnEnter(
            redirectToUrl(store, `${ADJUST_URL}/d7zecdg`),
            RedirectingInterstitial
          ),
          exact: true,
        },
        {
          path: '/magsimula',
          component: withOnEnter(
            redirectToUrl(store, `${ADJUST_URL}/j4q6kvu`),
            RedirectingInterstitial
          ),
          exact: true,
        },
        {
          path: '/freepodcast',
          component: withOnEnter(
            redirectToUrl(store, `${ADJUST_URL}/42so5up`),
            RedirectingInterstitial
          ),
          exact: true,
        },
        {
          path: '/loslegen',
          component: withOnEnter(
            redirectToUrl(store, `${ADJUST_URL}/xnrua77`),
            RedirectingInterstitial
          ),
          exact: true,
        },
        {
          path: '/inizia',
          component: withOnEnter(
            redirectToUrl(store, `${ADJUST_URL}/j0ezzgi`),
            RedirectingInterstitial
          ),
          exact: true,
        },
        {
          path: '/démarrer',
          component: withOnEnter(
            redirectToUrl(store, `${ADJUST_URL}/dw1y564`),
            RedirectingInterstitial
          ),
          exact: true,
        },
        {
          path: '/demarrer',
          component: withOnEnter(
            redirectToUrl(store, `${ADJUST_URL}/dw1y564`),
            RedirectingInterstitial
          ),
          exact: true,
        },
        {
          path: '/privacy',
          component: TermsScreen,
          exact: true,
        },
        {
          path: '/r/*',
          component: redirectRoute(store, '/'),
          exact: true,
        },
        {
          path: '/r',
          component: redirectRoute(store, '/'),
          exact: true,
        },
        {
          path: '/reset/:code',
          component: ResetPasswordContainer,
          exact: true,
        },
        {
          path: '/rr/:episodeId',
          component: NotFoundContainer,
          exact: true,
        },
        {
          path: '/signup',
          component: withOnEnter(
            redirectPublicPathToAuthedPath(store, '/dashboard'),
            SignupPageContainer
          ),
        },
        {
          path: '/auth/apple/mobileweb/result',
          component: withOnEnter(
            openInAppRedirect(store),
            RedirectingInterstitial
          ),
          exact: true,
        },
        {
          path: '/stripe/connected',
          component: withOnEnter(
            openInAppRedirect(store),
            RedirectingInterstitial
          ),
          exact: true,
        },
        {
          path: '/stripe/connectionfailed',
          component: withOnEnter(
            openInAppRedirect(store),
            RedirectingInterstitial
          ),
          exact: true,
        },
        {
          path: '/podcastimport',
          component: redirectRoute(store, '/switch'),
        },
        {
          path: '/s/:stationId',
          component: withBlockingOnEnter(
            redirectLegacyStationPageToVanityUrl(store, baseUrl),
            RedirectingInterstitial
          ),
          exact: true,
        },
        {
          path: '/tos',
          component: TermsScreen,
          exact: true,
        },
        {
          path: '/tos/monetization',
          component: redirectRoute(store, '/tos'),
          exact: true,
        },
        {
          path: '/sponsorships',
          component: SponsorshipsPageScreenContainer,
          exact: true,
        },
        {
          path: '/u/:userId',
          canonicalPath: '/',
          component: HomePage,
          exact: true,
        },
        {
          path: '/upgrade',
          canonicalPath: '/',
          component: HomePage,
          exact: true,
        },
        {
          path: '/videos/:id',
          canonicalPath: '/',
          component: HomePage,
          exact: true,
        },
        {
          path: '/', // index route
          component: HomePage,
          exact: true,
        },
        {
          path: '/:vanitySlug/call/:callJoinCode', // index route
          component: withOnEnter(
            getReferralCodeFromCallInvite(store, baseUrl),
            CallJoinContainer
          ),
          exact: true,
        },
        {
          path: '/:vanitySlug/call', // index route
          component: redirectRoute(store, '/'),
          exact: true,
        },
        {
          path: '/:vanityName/r',
          component: redirectRoute(store, '/'),
          exact: true,
        },
        // note hyphen must be included to differentiate from 2.0 episode URLs
        // but params parsing is not smart enough to get last hyphen; we re-join these segments
        // and parse with our own code
        {
          path:
            '/:vanitySlug/episodes/:episodeHashBeforeHyphen-:episodeHashAfterHyphen/:audioCaptionAndAudioIdHash',
          component: withOnEnter(
            setCanonicalPathToEpisodeAndSetReferralCodeWithStore(store),
            withVanityHeader(ProfileEpisodeContainer)
          ),
          exact: true,
        },
        {
          path:
            '/:vanitySlug/episodes/:episodeHashBeforeHyphen-:episodeHashAfterHyphen',
          component: withOnEnter(
            setReferralCodeForEpisodeWithStore(store, baseUrl),
            withVanityHeader(ProfileEpisodeContainer)
          ),
          exact: true,
        },
        {
          path:
            '/:vanitySlug/embed/episodes/:episodeHashBeforeHyphen-:episodeHashAfterHyphen/:audioCaptionAndAudioIdHash',
          component: withOnEnter(
            setCanonicalPathToEpisodeAndSetReferralCodeWithStore(
              store,
              baseUrl
            ),
            ProfileEpisodeContainer
          ),
          exact: true,
        },
        {
          path:
            '/:vanitySlug/embed/episodes/:episodeHashBeforeHyphen-:episodeHashAfterHyphen',
          component: ProfileEpisodeContainer,
          exact: true,
        },
        {
          path: '/:vanitySlug/episodes/:episodeId/embed',
          component: EmbedNotFound,
          exact: true,
        },
        {
          path: '/:vanitySlug/episodes/:episodeId',
          component: withOnEnter(
            setCanonicalEpisodePathAndGetReferralCodeForEpisode(store),
            NotFoundContainer
          ),
          exact: true,
        },
        {
          path: '/:vanitySlug/embed',
          component: withBlockingOnEnter(
            checkForVanityUrl(store, baseUrl),
            ProfileContainer
          ),
          exact: true,
        },
        {
          path: '/:vanitySlug/support',
          component: withBlockingOnEnter(
            checkForVanityUrl(store, baseUrl),
            withVanityHeader(ProfileContainer)
          ),
          exact: true,
        },
        {
          path: '/:vanitySlug/support/cancel',
          component: withBlockingOnEnter(
            checkForVanityUrl(store, baseUrl),
            SupportersCancelScreenContainer
          ),
          exact: true,
        },
        {
          path: '/:vanitySlug/subscribe',
          component: withBlockingOnEnter(
            checkForVanityUrl(store, baseUrl),
            withVanityHeader(ProfileContainer)
          ),
          exact: true,
        },
        {
          path: '/:vanitySlug/subscribe/cancel',
          component: PaywallsCancelSubscription,
          exact: true,
        },
        {
          path: '/:vanitySlug/subscribe/error',
          component: PaywallsSubscriptionError,
          exact: true,
        },
        {
          path: '/:vanitySlug/subscribe/disabled',
          component: PaywallsSubscriptionDisabled,
          exact: true,
        },
        {
          path: '/:vanitySlug/message*',
          component: withBlockingOnEnter(
            checkForVanityUrl(store, baseUrl),
            withVanityHeader(ProfileContainer)
          ),
          exact: true,
        },
        {
          path: '/*',
          component: withBlockingOnEnter(
            checkForVanityUrl(store, baseUrl),
            withVanityHeader(ProfileContainer)
          ),
          exact: true,
        },
      ],
    },
  ];
  return routes;
}

function redirectAuthPathToPublicPath(
  store,
  baseUrl = '',
  requiredPermission,
  publicPath = '/login'
) {
  // eslint-disable-next-line consistent-return
  return ({ history, location }) => {
    const {
      user: { permissions, user },
    } = store.getState();
    if (!user) {
      // This second user check is primarily for hot module reloading.
      // If we don't have this getCurrentUser() check, you'll be redirected
      // to the login screen after webpack dev server hot reloads, even if
      // you're technically still logged in. This is because we previously
      // would only do a check to see if the user object is not null in our
      // redux store (if statement above) when rendering signed in routes.
      (windowUndefined() ? Promise.resolve({}) : getCurrentUser()).then(
        response => {
          if (!response.user) {
            const query = {
              return_to: `${location.pathname}${location.search}`,
            };
            history.replace({
              pathname: publicPath,
              search: queryString.stringify(query),
            });
          }
        }
      );
    }
    if (requiredPermission) {
      if (!permissions) {
        // note - this does happen server-side
        // do not always check for permissions since very few routes actually require them
        return store.dispatch(fetchPermissions(baseUrl)).then(() => {
          const {
            user: { permissions: userPermissions },
          } = store.getState();
          redirectBasedOnPermission(userPermissions);
        });
      }
      redirectBasedOnPermission(permissions);
    }

    function redirectBasedOnPermission(redirectPermissions) {
      if (!redirectPermissions[requiredPermission]) {
        // authenticated, but lack access to this page
        history.replace({ pathname: '/404' });
      }
    }
  };
}

// e.g. finishing onboarding, become authenticated, go somewhere within dashboard
function redirectPublicPathToAuthedPath(store, authedPath = '/dashboard') {
  return ({ history }) => {
    const {
      user: { user },
    } = store.getState();
    if (user) {
      if (authedPath === '/dashboard' && !windowUndefined()) {
        AnchorAPI.fetchCurrentUserPodcastNetwork().then(response => {
          const { networkRole } = response;
          if (networkRole === 'admin') {
            history.replace({ pathname: '/dashboard/network' });
          } else {
            history.replace({ pathname: authedPath });
          }
        });
      } else {
        history.replace({ pathname: authedPath });
      }
    }
  };
}

function setCanonicalPathToEpisodeAndSetReferralCodeWithStore(store, baseUrl) {
  return props => {
    setCanonicalPathToEpisode(props);
    setReferralCodeForEpisode(props, store, baseUrl);
  };
}

function setReferralCodeForEpisodeWithStore(store, baseUrl) {
  return props => {
    setReferralCodeForEpisode(props, store, baseUrl);
  };
}

function redirectRoute(store, path) {
  return withOnEnter(redirectToPath(store, path), RedirectingInterstitial);
}

function setCanonicalPathToEpisode({ route, location }) {
  const splitPath = location.pathname.split('/');
  splitPath.pop();
  // eslint-disable-next-line no-param-reassign
  route.canonicalPath = splitPath.join('/');
}

function setReferralCodeForEpisode(
  { location, match: { params } },
  store,
  baseUrl
) {
  const metadata = getMetadataFromParams(params);
  const { episodeIdHash } = metadata;
  saveReferralIp(baseUrl, {
    location,
    episodeId: episodeIdHash,
  });
}
