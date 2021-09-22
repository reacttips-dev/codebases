/**
 * Initialize the Fluxible app for course-level ratings.
 * @type {Fluxible}
 */
import { store as BranchesStore } from 'bundles/author-branches/reducers/branches';

import BranchPropertiesStore from 'bundles/author-branches/stores/BranchPropertiesStore';
import CourseRatingStore from 'bundles/content-feedback/stores/CourseRatingStore';
import TeachAppStore from 'bundles/teach-course/stores/TeachAppStore';
import ApplicationStore from 'bundles/ssr/stores/ApplicationStore';
import Fluxible from 'vendor/cnpm/fluxible.v0-4/index';

const CourseRatingApp = new Fluxible();

CourseRatingApp.registerStore(BranchesStore);
CourseRatingApp.registerStore(BranchPropertiesStore);
CourseRatingApp.registerStore(TeachAppStore);
CourseRatingApp.registerStore(CourseRatingStore);
CourseRatingApp.registerStore(ApplicationStore);

export default CourseRatingApp;
