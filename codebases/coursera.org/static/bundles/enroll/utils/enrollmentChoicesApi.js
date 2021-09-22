import Q from 'q';
import URI from 'jsuri';
import { tupleToStringKey } from 'js/lib/stringKeyTuple';
import API from 'js/lib/api';
import UserJSON from 'bundles/user-account/common/user';
import logger from 'js/app/loggerSingleton';

const enrollmentChoiceAPI = API('/api/enrollmentAvailableChoices.v1', {
  type: 'rest',
});

const exported = {
  loadEnrollmentChoices(s12nId, userId) {
    const inputUserId = userId || UserJSON.id;
    if (inputUserId) {
      const uri = new URI(tupleToStringKey([inputUserId, 'Specialization', s12nId]))
        .addQueryParam('fields', 'enrollmentChoices')
        .addQueryParam('includeProgramInvitationCheck', true);
      return Q(enrollmentChoiceAPI.get(uri.toString()));
    } else {
      logger.error('User ID required for enrollment choices');
      return Q.reject('No User ID');
    }
  },
};

export default exported;

export const { loadEnrollmentChoices } = exported;
