import SemanticTypes from '../../constants/semantic-types';

const enrollmentVersion = (enrollment) => {
    return _.get(enrollment, 'rootNode.version', '');
};

export const getEnrollmentRecord = (state, key) => {
    return _.get(state.enrollments, key, {});
};

export const getEnrollmentType = (state, key) => {
    const record = getEnrollmentRecord(state, key);
    return _.get(record, 'rootNode.semantic_type');
};

export const isEnrollmentForPart = (state, key) => {
    const type = getEnrollmentType(state, key);
    return type === SemanticTypes.PART;
};

export const getEnrollmentVersion = (state, key) => {
    const enrollment = _.get(state.enrollments, key);
    return enrollmentVersion(enrollment);
};

export const getEnrollmentState = (state, key) => {
    const enrollment = getEnrollmentRecord(state, key);
    return _.get(enrollment, 'state', null);
};