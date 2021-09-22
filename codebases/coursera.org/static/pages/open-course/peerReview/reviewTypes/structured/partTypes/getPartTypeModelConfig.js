import _ from 'underscore';
import allPartTypeModelConfigs from './allPartTypeModelConfigs';

export default (partTypeName) => {
  if (!_(allPartTypeModelConfigs).has(partTypeName)) {
    throw new Error('Unrecognized review part type: "' + partTypeName + '"');
  }

  return allPartTypeModelConfigs[partTypeName];
};
