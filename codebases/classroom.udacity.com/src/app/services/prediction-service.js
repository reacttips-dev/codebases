import ApiService from 'services/api-service';

const PredictionService = {
    fetchPredictions() {
        return ApiService.get(`${CONFIG.predictionsApiUrl}/v1/predictions`).then(
            (response) => response.data
        );
    },
};

export default PredictionService;