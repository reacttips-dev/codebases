/**
 * Initialize the Fluxible app for Item-level Feedback.
 * @type {Fluxible}
 */
import CourseStore from 'bundles/ondemand/stores/CourseStore';

import ItemFeedbackStore from 'bundles/content-feedback/stores/ItemFeedbackStore';
import ProgrammingGradingProblemsStore from 'bundles/content-feedback/stores/ProgrammingGradingProblemsStore';
// @ts-ignore ts-migrate(7016) FIXME: Could not find a declaration file for module 'js/l... Remove this comment to see the full error message
import setupFluxibleApp from 'js/lib/setupFluxibleApp';

export default (fluxibleContext: $TSFixMe) => {
  return setupFluxibleApp(fluxibleContext, (itemFeedbackApp: $TSFixMe) => {
    itemFeedbackApp.registerStore(CourseStore);

    itemFeedbackApp.registerStore(ItemFeedbackStore);
    itemFeedbackApp.registerStore(ProgrammingGradingProblemsStore);

    return fluxibleContext;
  });
};
