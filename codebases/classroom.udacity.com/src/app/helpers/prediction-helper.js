const PredictionHelper = {
    /**
     * Returns an object containing the:
     * - score
     * - type of score (currently only probability of retaining)
     * - day count before renewal
     * - fullModel (full GRC prediction).
     * If a valid GRC model does not exist then returns an object  containing
     * the default score and null for other values.
     */
    getGrcModel: (predictions, defaultScore) => {
        const defaultModel = {
            score: defaultScore,
            type: null,
            day: null,
            fullModel: null,
        };

        if (!predictions) {
            return defaultModel;
        }

        const grcPrediction = predictions.find((p) => p.model === 'GRC');
        if (!grcPrediction || !grcPrediction.values) {
            return defaultModel;
        }

        // day_X means the prediction for student behavior X days before renewal.
        // Predictions are most accurate the closer the student is to renewal,
        // and are only populated once the student passes that time threshold before
        // renewal. Use the lowest day_X that exists, as it is the most accurate
        // prediction for that student.
        if (grcPrediction.values.day_7) {
            return {
                score: grcPrediction.values.day_7.r,
                type: 'r',
                day: 7,
                fullModel: grcPrediction,
            };
        }
        if (grcPrediction.values.day_14) {
            return {
                score: grcPrediction.values.day_14.r,
                type: 'r',
                day: 14,
                fullModel: grcPrediction,
            };
        }
        if (grcPrediction.values.day_21) {
            return {
                score: grcPrediction.values.day_21.r,
                day: 21,
                type: 'r',
                fullModel: grcPrediction,
            };
        }

        return defaultModel;
    },
};

export default PredictionHelper;