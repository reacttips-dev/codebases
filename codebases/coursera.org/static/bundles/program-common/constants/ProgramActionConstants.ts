import PropTypes from 'prop-types';
// @ts-ignore TS7016 Untyped import http://go.dkandu.me/strict-ts-migration#TS7016
import ProgramCurriculumProductsV1 from 'bundles/naptimejs/resources/programCurriculumProducts.v1';

export const curriculumProductPropType = PropTypes.instanceOf(ProgramCurriculumProductsV1).isRequired;

export const STATES = {
  AVAILABLE: 'AVAILABLE',
  UNAVAILABLE: 'UNAVAILABLE',
  SELECTED: 'SELECTED',
  ENROLLED: 'ENROLLED',
};

export const ACTION_TYPES = {
  ENROLL: 'ENROLL',
  UNENROLL: 'UNENROLL',
  SELECT: 'SELECT',
  UNSELECT: 'UNSELECT',
  RESUME: 'RESUME',
};

export const ACTIONS = {
  enrollInCourse: 'enrollInCourse',
  unenrollFromCourse: 'unenrollFromCourse',
  selectCourse: 'selectCourse',
  unselectCourse: 'unselectCourse',
  upgradeS12n: 'upgradeS12nEnrollment',
  enrollInS12n: 'enrollInS12n',
  unenrollFromS12n: 'unenrollFromS12n',
  selectS12n: 'selectS12n',
  unselectS12n: 'unselectS12n',
};

export const PRODUCT_TYPE_NAMES = {
  programCourseWithState: 'programCourseWithState',
  programS12nWithState: 'programS12nWithState',
};

// Config what resources we need to refresh after enrollment/select action succeed
export const REFRESH_RESOURCE = {
  programHome: {
    enrollInCourse: [
      'memberships.v1',
      'programCurriculumProducts.v1',
      'programUserCredits.v1',
      'programSearchResults.v1',
      'programCurriculumCollections.v1',
    ],
    unenrollFromCourse: [
      'memberships.v1',
      'programCurriculumProducts.v1',
      'programUserCredits.v1',
      'programSearchResults.v1',
      'programCurriculumCollections.v1',
    ],
    upgradeS12n: [
      'memberships.v1',
      'onDemandSpecializationMemberships.v1',
      'programCurriculumProducts.v1',
      'programUserCredits.v1',
      'programSearchResults.v1',
      'programNuggets.v1',
      'programCurriculumCollections.v1',
    ],
    enrollInS12n: [
      'memberships.v1',
      'onDemandSpecializationMemberships.v1',
      'programCurriculumProducts.v1',
      'programUserCredits.v1',
      'programSearchResults.v1',
      'programCurriculumCollections.v1',
    ],
    unenrollFromS12n: [
      'memberships.v1',
      'onDemandSpecializationMemberships.v1',
      'programCurriculumProducts.v1',
      'programUserCredits.v1',
      'programSearchResults.v1',
      'programCurriculumCollections.v1',
    ],
    selectCourse: ['programCurriculumProducts.v1', 'programUserCredits.v1'],
    unselectCourse: ['programCurriculumProducts.v1', 'programUserCredits.v1'],
    selectS12n: ['programCurriculumProducts.v1', 'programUserCredits.v1'],
    unselectS12n: ['programCurriculumProducts.v1', 'programUserCredits.v1'],
  },
};

export const PRODUCT_TYPES = {
  COURSE: 'course',
  SPECIALIZATION: 's12n',
};
export const PRODUCT_TYPES_SERVER = {
  COURSE: 'COURSE',
  SPECIALIZATION: 'SPECIALIZATION',
};

// Use this to generate product id for querying ProgramCurriculumProducts
export const PRODUCT_ID_INFIX = {
  COURSE: 'VerifiedCertificate',
  S12N: 'Specialization',
};
