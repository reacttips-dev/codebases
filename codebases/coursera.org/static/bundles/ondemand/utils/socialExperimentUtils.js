import _ from 'lodash';
import epic from 'bundles/epic/client';

/* eslint-disable import/prefer-default-export */
export const isForumsBlacklisted = function (courseId) {
  if (!courseId) {
    throw new Error('isForumsBlacklisted requires a courseId argument');
  }
  return _.includes(epic.get('featureBlacklist', 'discussions'), courseId);
};
