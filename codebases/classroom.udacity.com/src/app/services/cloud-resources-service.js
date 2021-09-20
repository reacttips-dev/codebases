import ApiService from 'services/api-service';

export default {
    async launchCloudService({
        serviceId,
        ndId,
        enrollmentId
    }) {
        try {
            return await ApiService.post(
                `${CONFIG.cloudResourcesUrl}/services/${serviceId}/launch`, {
                    nanodegree_id: ndId,
                    enrollment_id: enrollmentId,
                }
            );
        } catch (error) {
            throw error;
        }
    },
};