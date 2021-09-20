import ApiService from './api-service';
import Queries from 'services/_queries';

function createLabQuery(labId) {
    return `query LabQuery {
    lab(id: ${labId}) {
      ${Queries.labFields}
    }
  }`;
}

function createLabMutation({
    labId,
    skillConfidenceRatingAfter,
    skillConfidenceRatingBefore,
    userId,
}) {
    return [
        `
    mutation LabMutation ($input: InputLabResult) {
      putLabResult(input: $input) {
        lab_id
        skill_confidence_rating_after
        skill_confidence_rating_before
      }
    }
    `,
        {
            input: {
                user_id: userId,
                lab_id: labId,
                skill_confidence_rating_after: skillConfidenceRatingAfter,
                skill_confidence_rating_before: skillConfidenceRatingBefore,
            },
        },
    ];
}

export default {
    updateLabResult({
        labId,
        userId,
        skillConfidenceRatingAfter,
        skillConfidenceRatingBefore,
    }) {
        return ApiService.gql(
            ...createLabMutation({
                labId,
                userId,
                skillConfidenceRatingAfter,
                skillConfidenceRatingBefore,
            })
        ).then((mutationResponse) => {
            return {
                ...mutationResponse.data.putLabResult,
            };
        });
    },

    fetch(labId) {
        return ApiService.gql(createLabQuery(labId)).then((response) => {
            return response.data.lab;
        });
    },
};