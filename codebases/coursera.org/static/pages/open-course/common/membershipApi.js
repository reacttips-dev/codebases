import API from 'bundles/phoenix/lib/apiWrapper';
import constants from 'pages/open-course/common/constants';

export default API(constants.openCourseMembershipApi, {
  type: 'rest',
});
