'use es6';

var isExpired = function isExpired(removedAt) {
  var now = Date.now();
  return removedAt && removedAt < now;
};

export var buildTrialState = function buildTrialState(createdAt, endsAt, removedAt, id) {
  return {
    inTrial: !isExpired(removedAt) ? {
      createdTs: createdAt,
      expiresTs: endsAt
    } : null,
    hasTrialed: isExpired(removedAt) ? {
      lastTrialStarted: createdAt,
      lastTrialExpired: removedAt
    } : null,
    id: id
  };
};