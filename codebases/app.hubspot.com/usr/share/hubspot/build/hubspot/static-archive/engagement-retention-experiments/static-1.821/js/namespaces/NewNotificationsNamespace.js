'use es6';

import makeNamespace from 'hublabs-experiments/helpers/makeNamespace';
import DotCounterExperiment from '../experiments/DotCounterExperiment';
import FaviconExperiment from '../experiments/FaviconExperiment';
export default makeNamespace({
  name: 'NewNotificationsNamespace',
  segments: 100,
  setupExperiments: function setupExperiments(addExperiment) {
    addExperiment('FaviconExperiment', FaviconExperiment, 50);
    addExperiment('DotCounterExperiment', DotCounterExperiment, 50);
  }
});