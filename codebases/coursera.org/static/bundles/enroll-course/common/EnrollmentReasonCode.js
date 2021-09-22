import keysToConstants from 'js/lib/keysToConstants';

// REF https://github.com/webedx-spark/infra-services/blob/main/libs/models/src/main/pegasus/org/coursera/enrollment/EnrollmentChoiceReasonCode.courier
const exported = keysToConstants([
  'ENROLLED',
  'PURCHASED_SINGLE_COURSE',
  'CAPSTONE_ACCESS_LOCKED',
  'SPECIALIZATION_BULK_PAID',
  'SPECIALIZATION_SUBSCRIBED',
  'REGION_BLOCKED',
  'NO_AVAILABLE_SESSION',
  'SPECIALIZATION_UPGRADE_REQUIRED',
  'CATALOG_SUBSCRIBED',
  'EARNED_S12N_CERTIFICATE',
]);

export const {
  ENROLLED,
  PURCHASED_SINGLE_COURSE,
  CAPSTONE_ACCESS_LOCKED,
  SPECIALIZATION_BULK_PAID,
  SPECIALIZATION_SUBSCRIBED,
  REGION_BLOCKED,
  NO_AVAILABLE_SESSION,
  SPECIALIZATION_UPGRADE_REQUIRED,
  CATALOG_SUBSCRIBED,
  EARNED_S12N_CERTIFICATE,
} = exported;

export default exported;
