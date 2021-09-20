import LabStatus from 'constants/lab-status';

export default {
    isPassed(lab) {
        return _.get(lab, 'result.state') === LabStatus.PASSED;
    },

    reviewCompleted(lab) {
        return Boolean(_.get(lab, 'result.skill_confidence_rating_after'));
    },

    areAllCompleted(labs) {
        return _.every(labs, (lab) => this.reviewCompleted(lab));
    },
};