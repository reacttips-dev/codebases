/**
 * Naptime course API.
 */

import API from 'bundles/phoenix/lib/apiWrapper';

import constants from 'pages/open-course/common/constants';

const api = API(constants.coursesApi, {
  type: 'rest',
});

export default api;
