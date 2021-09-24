'use es6';

import makeExperiment from 'hublabs-experiments/helpers/makeExperiment';
export default makeExperiment({
  name: 'FaviconExperiment',
  setupParams: function setupParams(params, _ref) {
    var choose = _ref.choose;
    params.set('newNotificationsFavicon', choose(['true', 'false']));
  },
  useInNamespace: true
});