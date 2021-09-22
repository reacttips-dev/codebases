// The old opencourse/Phoenix course API (opencourse.v1/course) is deprecated.
// Use Naptime resource onDemandCourses.v1 instead of this.

import API from 'bundles/phoenix/lib/apiWrapper';

import constants from 'pages/open-course/common/constants';

export default API(constants.openCourseApi, {
  type: 'rest',
});
