'use es6';

import makeExperiment from 'hublabs-experiments/helpers/makeExperiment';
export default makeExperiment({
  name: 'DotCounterExperiment',
  setupParams: function setupParams(params, _ref) {
    var choose = _ref.choose;
    params.set('showDot', choose(['true', 'false']));
  },
  useInNamespace: true
});