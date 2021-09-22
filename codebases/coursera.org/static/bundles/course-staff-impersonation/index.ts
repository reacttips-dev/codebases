/*
    course-staff-impersonation

    External components for course staff impersonation.

    Public API for this module.
*/

export type { ActAsLearnerSessionProps } from './components/withPartnerLearnerImpersonationSessionData';
export type { PartnerLearnerImpersonationSession } from './utils/types';

export { default as ActAsLearnerButton } from './components/ActAsLearnerButton';
export { default as LearnerImpersonationBanner } from './components/LearnerImpersonationBanner';
export { default as withPartnerLearnerImpersonationSessionData } from './components/withPartnerLearnerImpersonationSessionData';
