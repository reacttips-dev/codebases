import ApiService from './api-service';

export default {
    cancelProjectSubmission(submissionId) {
        return ApiService.post(
            `${CONFIG.reviewsApiUrl}/v1/submissions/${submissionId}/cancel`
        );
    },

    isProjectReviewer() {
        return ApiService.get(`${CONFIG.reviewsApiUrl}/v1/me/certifications`)
            .then((data) => !_.isEmpty(data))
            .catch(() => false);
    },

    fetchDemeritedSubmissions(userID) {
        return ApiService.get(
            `${CONFIG.reviewsApiUrl}/v1/users/by_udacity_key/${userID}/submissions?is_demerit=true&enrollment_is_enterprise=false&has_plagiarism_case=false`
        ).catch(() => []);
    },

    createPlagiarismCase(submissionID) {
        return ApiService.post(
            `${CONFIG.reviewsApiUrl}/v1/submissions/${submissionID}/create_plagiarism_case`
        );
    },
};