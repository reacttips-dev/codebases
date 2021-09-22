// REF https://github.com/webedx-spark/infra-services/blob/main/libs/models/src/main/pegasus/org/coursera/enrollment/EnrollmentChoiceType.courier
export const BULKPAY_FULL_SPECIALIZATION = 'BULKPAY_FULL_SPECIALIZATION';

export const BULKPAY_REMAINING_SPECIALIZATION_COURSES = 'BULKPAY_REMAINING_SPECIALIZATION_COURSES';

export const ENROLL_THROUGH_S12N_PREPAID = 'ENROLL_THROUGH_S12N_PREPAID';

export const ENROLL_THROUGH_S12N_SUBSCRIPTION = 'ENROLL_THROUGH_S12N_SUBSCRIPTION';

export const ENROLL_THROUGH_S12N_SUBSCRIPTION_TRIAL = 'ENROLL_THROUGH_S12N_SUBSCRIPTION_TRIAL';

export const PURCHASE_SINGLE_COURSE = 'PURCHASE_SINGLE_COURSE';

export const ENROLL_COURSE = 'ENROLL_COURSE';

export const ENROLL_COURSE_WITH_FULL_DISCOUNT = 'ENROLL_COURSE_WITH_FULL_DISCOUNT';

export const AUDIT_COURSE = 'AUDIT_COURSE';

export const ENROLL_THROUGH_PROGRAM = 'ENROLL_THROUGH_PROGRAM';

export const ENROLL_THROUGH_PROGRAM_INVITATION = 'ENROLL_THROUGH_PROGRAM_INVITATION';

export const ENROLL_THROUGH_GROUP = 'ENROLL_THROUGH_GROUP';

export const SUBSCRIBE_TO_CATALOG = 'SUBSCRIBE_TO_CATALOG';

export const SUBSCRIBE_TO_CATALOG_TRIAL = 'SUBSCRIBE_TO_CATALOG_TRIAL';

export const UPGRADE_TO_CATALOG_SUBSCRIPTION = 'UPGRADE_TO_CATALOG_SUBSCRIPTION';

export const SUBSCRIBE_TO_COURSERA_PLUS = 'SUBSCRIBE_TO_COURSERA_PLUS';

export const ENROLL_THROUGH_COURSERA_PLUS = 'ENROLL_THROUGH_COURSERA_PLUS';

const EnrollmentChoiceTypes = {
  BULKPAY_FULL_SPECIALIZATION,
  BULKPAY_REMAINING_SPECIALIZATION_COURSES,
  ENROLL_THROUGH_S12N_PREPAID,
  ENROLL_THROUGH_S12N_SUBSCRIPTION,
  ENROLL_THROUGH_S12N_SUBSCRIPTION_TRIAL,
  PURCHASE_SINGLE_COURSE,
  ENROLL_COURSE,
  AUDIT_COURSE,
  ENROLL_THROUGH_PROGRAM,
  ENROLL_THROUGH_PROGRAM_INVITATION,
  ENROLL_THROUGH_GROUP,
  SUBSCRIBE_TO_CATALOG,
  SUBSCRIBE_TO_CATALOG_TRIAL,
  UPGRADE_TO_CATALOG_SUBSCRIPTION,
  SUBSCRIBE_TO_COURSERA_PLUS,
  ENROLL_THROUGH_COURSERA_PLUS,
  ENROLL_COURSE_WITH_FULL_DISCOUNT,
} as const;

export type EnrollmentChoiceTypesValues = typeof EnrollmentChoiceTypes[keyof typeof EnrollmentChoiceTypes];

export default EnrollmentChoiceTypes;
