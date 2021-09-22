import CatalogCollection from 'bundles/catalogP/models/catalogCollection';
// @ts-ignore ts-migrate(7016) FIXME: Could not find a declaration file for module 'page... Remove this comment to see the full error message
import CourseProgress from 'pages/open-course/common/models/courseProgress';

const CourseProgressCollection = CatalogCollection.extend({
  model: CourseProgress,
  resourceName: 'onDemandCoursesProgress.v1',
});

export default CourseProgressCollection;
