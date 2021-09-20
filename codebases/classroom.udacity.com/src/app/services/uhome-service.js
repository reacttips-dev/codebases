import {
    Api
} from '@udacity/ureact-connect';
import ApiService from './api-service';

const uconnectProgressQuery = `
query UconnectProgressQuery ($degreeId: String) {
  user {
    nanodegrees (key: $degreeId) {
      parts(filter_by_enrollment_service_model: true) {
        modules {
          lessons {
            aggregated_state {
              completion_amount
            }
            key
            title
            project {
              key
              title
              project_state {
                submissions {
                  result
                  status
                  created_at
                  id
                }
              }
            }
          }
        }
      }
    }
  }
}`;

const uconnectEnrollmentQuery = `
query UconnectEnrollment {
  me {
    session {
      id
      degree {
        id
      }
    }
  }
}
`;

export default {
    fetchConnectEnrollment() {
        const api = new Api({
            apiUrl: CONFIG.uhomeApiUrl,
        });
        return api
            .gql({
                query: uconnectEnrollmentQuery,
            })
            .then((response) => {
                return _.get(response, 'data.me.session');
            });
    },
    fetchConnectNdProgress(degreeId) {
        return ApiService.gql(uconnectProgressQuery, {
            degreeId
        }).then(
            (response) => {
                return _.get(response, 'data.user.nanodegrees[0]');
            }
        );
    },
};