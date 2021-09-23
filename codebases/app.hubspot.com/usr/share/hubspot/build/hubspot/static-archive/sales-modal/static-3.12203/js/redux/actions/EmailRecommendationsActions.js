'use es6';

import { fetchRecommendations } from 'sales-modal/api/EmailRecommendationsApi';
import getRecommendationData from 'sales-modal/utils/enrollModal/getRecommendationData';
import getAbsoluteTime from 'sales-modal/utils/enrollModal/getAbsoluteTime';
export var fetchSendTimeRecommendations = function fetchSendTimeRecommendations(sequenceEnrollment, contactEmail) {
  var data = getRecommendationData({
    sequenceEnrollment: sequenceEnrollment,
    getAbsoluteTime: getAbsoluteTime
  });
  var query = {
    fromEmail: sequenceEnrollment.get('fromAddress'),
    toEmail: contactEmail,
    sequenceId: sequenceEnrollment.get('id')
  };
  return fetchRecommendations({
    data: data,
    query: query
  });
};