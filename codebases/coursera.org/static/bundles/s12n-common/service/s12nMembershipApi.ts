import API from 'bundles/phoenix/lib/apiWrapper';
import constants from 'bundles/s12n-common/service/constants';

export default API(constants.s12nMembershipsApi, {
  type: 'rest',
});
