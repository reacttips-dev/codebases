const productTypeObject = {
  CATALOG_SUBSCRIPTION: 'CatalogSubscription',
  SPARK_COURSE_SHELL: 'SparkCourseShell',
  SPARK_SPECIALIZATION: 'SparkSpecialization',
  SPARK_VERIFIED_CERTIFICATE: 'SparkVerifiedCertificate',
  SPECIALIZATION: 'Specialization',
  SPECIALIZATION_PREPAID: 'SpecializationPrepaid',
  SPECIALIZATION_SUBSCRIPTION: 'SpecializationSubscription',
  VERIFIED_CERTIFICATE: 'VerifiedCertificate',
  ENTERPRISE_CONTRACT: 'EnterpriseContract',
  INTEREST_DEPOSIT: 'InterestDeposit',
  CREDENTIAL_TRACK_SUBSCRIPTION: 'CredentialTrackSubscription',
  CREDENTIAL_TRACK_SUBSCRIPTION_V2: 'CredentialTrackSubscriptionV2',
  COURSERA_PLUS_SUBSCRIPTION: 'CourseraPlusSubscription',
} as const;

export default productTypeObject;

export const {
  CATALOG_SUBSCRIPTION,
  SPARK_COURSE_SHELL,
  SPARK_SPECIALIZATION,
  SPARK_VERIFIED_CERTIFICATE,
  SPECIALIZATION,
  SPECIALIZATION_PREPAID,
  SPECIALIZATION_SUBSCRIPTION,
  VERIFIED_CERTIFICATE,
  ENTERPRISE_CONTRACT,
  INTEREST_DEPOSIT,
  CREDENTIAL_TRACK_SUBSCRIPTION,
  COURSERA_PLUS_SUBSCRIPTION,
  CREDENTIAL_TRACK_SUBSCRIPTION_V2,
} = productTypeObject;

export type ProductType = typeof productTypeObject[keyof typeof productTypeObject];
