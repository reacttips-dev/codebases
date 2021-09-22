import Q from 'q';
import API from 'bundles/phoenix/lib/apiWrapper';
import constants from 'pages/open-course/common/constants';

const completionApi = API(constants.supplementCompletionApi, { type: 'rest' });
const startApi = API(constants.supplementStartApi, { type: 'rest' });

function updateSupplementProgress({ itemId, courseId, userId, api }: $TSFixMe) {
  const options = {
    data: {
      userId,
      courseId,
      itemId,
    },
  };

  return Q(api.post('', options));
}

const SupplementProgressApiUtils = {
  markComplete(itemId: $TSFixMe, courseId: $TSFixMe, userId: $TSFixMe) {
    return updateSupplementProgress({
      itemId,
      courseId,
      userId,
      api: completionApi,
    });
  },

  markStarted(itemId: $TSFixMe, courseId: $TSFixMe, userId: $TSFixMe) {
    return updateSupplementProgress({
      itemId,
      courseId,
      userId,
      api: startApi,
    });
  },
};

export default SupplementProgressApiUtils;

export const { markComplete, markStarted } = SupplementProgressApiUtils;
