import PropTypes from 'prop-types';

export const PRODUCT_VARIANT = {
    PLUS: 'PLUS',
    STANDARD: 'STANDARD',
};

export const NanodegreeLockedReason = {
    LANGUAGE_UNAVAILABLE: 'language_unavailable',
    EXPIRED_PAID_TRIAL: 'expired_paid_trial',
};

export const NanodegreeLockedReasonType = PropTypes.oneOf(
    _.values(NanodegreeLockedReason)
);

export const FEEDBACK_FORMATS = {
    POPUP: 'popup',
    TODO: 'todo',
    HEADER: 'header',
};

export const FEEDBACK_MODAL_TYPES = {
    // rate nanodegree and give feedback internally
    RATE: 'rate',
    // share feedback externally
    SHARE: 'share_feedback',
};

export const FEEDBACK_VIEW_COUNT_LIMIT = 3;

export const MIN_POSITIVE_ND_RATING = 4;

export const ENROLLMENT_STATES = {
    ENROLLED: 'ENROLLED',
    UNENROLLED: 'UNENROLLED',
    STATIC_ACCESS: 'STATIC_ACCESS',
    PAUSED: 'PAUSED',
    SUSPENDED: 'SUSPENDED',
    GRADUATED: 'GRADUATED',
};