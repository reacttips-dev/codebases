import loadable from 'react-loadable';

const AsyncSurveyModal = loadable({
  loader: () => import('./survey-modal' /* webpackChunkName: "survey-modal" */),
  loading: () => null,
});
export default AsyncSurveyModal;
