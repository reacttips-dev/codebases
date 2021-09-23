'use es6';

import PortalIdParser from 'PortalIdParser';
export var getBuilderOnboardingCompletedKey = function getBuilderOnboardingCompletedKey() {
  return "Sequences:BuilderOnboardingCompleted:" + PortalIdParser.get();
};