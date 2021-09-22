import _ from 'underscore';
import allPartTypeViewConfigs from './allPartTypeViewConfigs';

export default (partTypeName) => {
  if (!_(allPartTypeViewConfigs).has(partTypeName)) {
    throw new Error('Unrecognized review part type: "' + partTypeName + '"');
  }

  return allPartTypeViewConfigs[partTypeName];
};
