import ApiService from './api-service';
import AuthenticationService from 'services/authentication-service';
import {
    i18n
} from 'services/localization-service';

function gql({
    query,
    variables
}) {
    return ApiService.gql(
        query,
        variables,
        i18n.getLocale(),
        `${CONFIG.admissionsApiUrl}/graphql`
    );
}

const applicationQuery = `
  query {
    applicationsWithCohortAndDegree(applicant_id: "${AuthenticationService.getCurrentUserId()}") {
      id
      degree_id
      cohort_id
      status
      payment_url
      decision_group {
        url
        currency
        price
      }
      cohort {
        id
        type
        close_at
        start_at
        notify_at
      }
      degree {
        id
        title
      }
    }
  }
`;

export default {
    fetchApplications() {
        return gql({
                query: applicationQuery,
            })
            .then((response) => response.data.applicationsWithCohortAndDegree)
            .catch(() => []);
    },
};