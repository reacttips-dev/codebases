import ApiService from './api-service';

function createCompletionHistoryQuery(nanodegreeId) {
    return [
        `
      query fetchConceptCompletionHistory($id: Int) {
        nanodegree(id: $id) {
          id
          key,
          parts(filter_by_enrollment_service_model: true) {
            modules {
              lessons {
                concepts {
                  user_state {
                    completed_at
                    last_viewed_at
                  }
                }
              }
            }
          }
        }
      }
    `,
        {
            id: nanodegreeId
        },
    ];
}

export default {
    fetchCompletionHistory(nanodegreeId) {
        return ApiService.gql(...createCompletionHistoryQuery(nanodegreeId)).then(
            (response) => response.data.nanodegree
        );
    },
};