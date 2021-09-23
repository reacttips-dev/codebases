import asyncComponent from './asyncComponent';
/**
 * Responsible for code splitting for performance
 * Use with <Route getComponent /> signature
 */

// privacy policy is a lot of static HTML we should keep out of the main build
// export function PrivacyPolicyPage(nextState, cb) {
//   require.ensure([], (require) => {
//     cb(null, require('./components/PrivacyPolicyPage').default);
//   });
// }
// // ditto terms
// export function TermsPage(nextState, cb) {
//   require.ensure([], (require) => {
//     cb(null, require('./components/TermsPage').default);
//   });
// }
// // and DMCA
// export function DMCAPage(nextState, cb) {
//   require.ensure([], (require) => {
//     cb(null, require('./components/DMCAPage').default);
//   });
// }

// dependency on moment (rather big)
export const AuthRouter = asyncComponent('AuthRouter', () =>
  import(/* webpackChunkName: "AuthRouter" */ './components/AuthRouter').then(
    m => m.default
  )
);

export const EpisodeEditorPublishContainer = asyncComponent(
  'EpisodeEditorPublishContainer',
  () =>
    import(
      /* webpackChunkName: "EpisodeEditorPublishContainer" */ './components/EpisodeEditorPublishContainer'
    ).then(m => m.EpisodeEditorPublishContainer)
);

export const EpisodeMetadataEditorContainer = asyncComponent(
  'EpisodeMetadataEditorContainer',
  () =>
    import(
      /* webpackChunkName: "EpisodeMetadataEditorContainer" */ './components/EpisodeMetadataEditorContainer'
    ).then(m => m.EpisodeMetadataEditorContainer)
);

export const ProfileContainer = asyncComponent('ProfileContainer', () =>
  import(
    /* webpackChunkName: "ProfileContainer" */ './components/ProfileContainer'
  ).then(m => m.default)
);

export const ProfileEpisodeContainer = asyncComponent(
  'ProfileEpisodeContainer',
  () =>
    import(
      /* webpackChunkName: "ProfileEpisodeContainer" */ './components/ProfileEpisodeContainer'
    ).then(m => m.default)
);
