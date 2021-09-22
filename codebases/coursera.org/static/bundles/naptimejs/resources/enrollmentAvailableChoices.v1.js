import _ from 'lodash';
import EnrollmentChoiceTypes from 'bundles/enroll-course/common/EnrollmentChoiceTypes';
import EnrollmentReasonCode from 'bundles/enroll-course/common/EnrollmentReasonCode';
import { requireFields } from 'bundles/naptimejs/util/requireFieldsDecorator';
import { doesChoiceTypeHaveSubmitHandler } from 'bundles/enroll-course/lib/enrollmentChoiceUtils';
import logger from 'js/app/loggerSingleton';
import helpCenter from 'js/lib/coursera.helpcenter'; // eslint-disable-line import/extensions
import { tupleToStringKey, stringKeyToTuple } from 'js/lib/stringKeyTuple';
import _t from 'i18n!nls/naptimejs';
import EnrollmentProductTypes from 'bundles/enroll-course/common/EnrollmentProductTypes';
import NaptimeResource from './NaptimeResource';

const INTL_RESTRICTION_POLICY_URL = 'https://learner.coursera.help/hc/articles/208280116-International-restrictions';
const HELP_CENTER_URL = helpCenter.getNewHelpCenterHome(false);

const ID_TUPLE_LENGTH = 3;
const RAW_PRODUCT_ID_INDEX = 2;
const CATALOG_ENROLLMENT_CHOICE_TYPES = [
  EnrollmentChoiceTypes.SUBSCRIBE_TO_CATALOG,
  EnrollmentChoiceTypes.SUBSCRIBE_TO_CATALOG_TRIAL,
  EnrollmentChoiceTypes.UPGRADE_TO_CATALOG_SUBSCRIPTION,
];
const FREE_ENROLLMENT_CHOICE_TYPES = [
  EnrollmentChoiceTypes.AUDIT_COURSE,
  EnrollmentChoiceTypes.ENROLL_COURSE,
  EnrollmentChoiceTypes.ENROLL_THROUGH_COURSERA_PLUS,
];

class EnrollmentAvailableChoicesV1 extends NaptimeResource {
  static RESOURCE_NAME = 'enrollmentAvailableChoices.v1';

  static getChoices(userId, { courseId, onDemandSpecializationId } = {}, query) {
    let productType;

    if (courseId) {
      productType = EnrollmentProductTypes.VerifiedCertificate;
    } else if (onDemandSpecializationId) {
      productType = EnrollmentProductTypes.Specialization;
    } else {
      throw new Error('Did not find any recognizable product to get type for');
    }

    const choicesId = tupleToStringKey([userId, productType, courseId || onDemandSpecializationId]);
    return this.get(choicesId, query);
  }

  static isCatalogEnrollmentChoiceType(enrollmentChoiceType) {
    return CATALOG_ENROLLMENT_CHOICE_TYPES.includes(enrollmentChoiceType);
  }

  static isFreeEnrollmentChoiceType(enrollmentChoiceType) {
    return FREE_ENROLLMENT_CHOICE_TYPES.includes(enrollmentChoiceType);
  }

  @requireFields('enrollmentChoiceReasonCode')
  get isCapstoneAccessLocked() {
    return this.enrollmentChoiceReasonCode === EnrollmentReasonCode.CAPSTONE_ACCESS_LOCKED;
  }

  @requireFields('enrollmentChoiceReasonCode')
  get isEnrolled() {
    return this.enrollmentChoiceReasonCode === EnrollmentReasonCode.ENROLLED;
  }

  @requireFields('enrollmentChoiceReasonCode')
  get hasEarnedS12nCertificate() {
    return this.enrollmentChoiceReasonCode === EnrollmentReasonCode.EARNED_S12N_CERTIFICATE;
  }

  @requireFields('enrollmentChoices')
  get hasChoice() {
    return !_.isEmpty(this.enrollmentChoices);
  }

  @requireFields('enrollmentChoices')
  get canEnrollThroughS12nSubscriptionFreeTrialAndIsEnrolled() {
    return this.canEnrollThroughS12nSubscriptionFreeTrial && !this.isEnrolled;
  }

  @requireFields('enrollmentChoices')
  get canPurchaseSingleCourse() {
    return this._canEnrollThroughChoice(EnrollmentChoiceTypes.PURCHASE_SINGLE_COURSE);
  }

  @requireFields('enrollmentChoices')
  get canEnrollCourseWithFullDiscount() {
    return this._canEnrollThroughChoice(EnrollmentChoiceTypes.ENROLL_COURSE_WITH_FULL_DISCOUNT);
  }

  @requireFields('enrollmentChoices')
  get canBulkPaySpecialization() {
    return (
      this._canEnrollThroughChoice(EnrollmentChoiceTypes.BULKPAY_FULL_SPECIALIZATION) ||
      this._canEnrollThroughChoice(EnrollmentChoiceTypes.BULKPAY_REMAINING_SPECIALIZATION_COURSES)
    );
  }

  @requireFields('enrollmentChoices')
  get canSubscribeToS12n() {
    return this.canEnrollThroughS12nSubscription || this.canEnrollThroughS12nSubscriptionFreeTrial;
  }

  @requireFields('enrollmentChoices')
  get canSubscribeToMultipleS12ns() {
    return this.enrollmentS12nIds.length > 1;
  }

  @requireFields('enrollmentChoices')
  get canEnrollThroughS12nPrepaid() {
    return this._canEnrollThroughChoice(EnrollmentChoiceTypes.ENROLL_THROUGH_S12N_PREPAID);
  }

  @requireFields('enrollmentChoices')
  get canEnrollThroughS12nSubscription() {
    return this._canEnrollThroughChoice(EnrollmentChoiceTypes.ENROLL_THROUGH_S12N_SUBSCRIPTION);
  }

  @requireFields('enrollmentChoices')
  get canAuditCourse() {
    return this._canEnrollThroughChoice(EnrollmentChoiceTypes.AUDIT_COURSE);
  }

  @requireFields('enrollmentChoices')
  get canEnrollThroughS12nSubscriptionFreeTrial() {
    return this._canEnrollThroughChoice(EnrollmentChoiceTypes.ENROLL_THROUGH_S12N_SUBSCRIPTION_TRIAL);
  }

  @requireFields('enrollmentChoices')
  get canEnrollThroughCatalogSubscriptionFreeTrial() {
    return this._canEnrollThroughChoice(EnrollmentChoiceTypes.SUBSCRIBE_TO_CATALOG_TRIAL);
  }

  @requireFields('enrollmentChoices')
  get canEnrollThroughCatalogSubscription() {
    return this._canEnrollThroughChoice(EnrollmentChoiceTypes.SUBSCRIBE_TO_CATALOG);
  }

  @requireFields('enrollmentChoices')
  get canEnrollThroughCatalogSubscriptionUpgrade() {
    return this._canEnrollThroughChoice(EnrollmentChoiceTypes.UPGRADE_TO_CATALOG_SUBSCRIPTION);
  }

  @requireFields('enrollmentChoices')
  get canSubscribeToCourseraPlus() {
    return this._canEnrollThroughChoice(EnrollmentChoiceTypes.SUBSCRIBE_TO_COURSERA_PLUS);
  }

  @requireFields('enrollmentChoices')
  get canEnrollThroughCourseraPlus() {
    return this._canEnrollThroughChoice(EnrollmentChoiceTypes.ENROLL_THROUGH_COURSERA_PLUS);
  }

  @requireFields('enrollmentChoices')
  get canEnrollThroughProgram() {
    return this._canEnrollThroughChoice(EnrollmentChoiceTypes.ENROLL_THROUGH_PROGRAM);
  }

  @requireFields('enrollmentChoices')
  get canEnrollThroughProgramInvitation() {
    return this._canEnrollThroughChoice(EnrollmentChoiceTypes.ENROLL_THROUGH_PROGRAM_INVITATION);
  }

  @requireFields('enrollmentChoices')
  get canEnrollThroughGroup() {
    return this._canEnrollThroughChoice(EnrollmentChoiceTypes.ENROLL_THROUGH_GROUP);
  }

  @requireFields('enrollmentChoices')
  get canFreeEnrollOnlyIntoCourse() {
    return this.enrollmentChoices.length === 1 && this._canEnrollThroughChoice(EnrollmentChoiceTypes.ENROLL_COURSE);
  }

  @requireFields('enrollmentChoices')
  get canSubscribeToCatalog() {
    return (
      _.intersection(_.map(this.enrollmentChoices, 'enrollmentChoiceType'), CATALOG_ENROLLMENT_CHOICE_TYPES).length > 0
    );
  }

  @requireFields('enrollmentChoices')
  get isCatalogSubscriptionStandaloneCourse() {
    return this.canSubscribeToCatalog && this._canEnrollThroughChoice(EnrollmentChoiceTypes.PURCHASE_SINGLE_COURSE);
  }

  @requireFields('enrollmentChoices')
  get hasFreeEnrollOptionIntoCourse() {
    return this._canEnrollThroughChoice(EnrollmentChoiceTypes.ENROLL_COURSE);
  }

  @requireFields('id')
  get productType() {
    const idTuple = stringKeyToTuple(this.id);
    return !_.isEmpty(idTuple) && idTuple.length > 1 ? idTuple[1] : null;
  }

  @requireFields('enrollmentChoices')
  get s12nSubscriptionEnrollmentChoices() {
    return _.filter(
      this.enrollmentChoices,
      (choice) =>
        choice.enrollmentChoiceType === EnrollmentChoiceTypes.ENROLL_THROUGH_S12N_SUBSCRIPTION ||
        choice.enrollmentChoiceType === EnrollmentChoiceTypes.ENROLL_THROUGH_S12N_SUBSCRIPTION_TRIAL
    );
  }

  _canEnrollThroughChoice(enrollmentChoiceType) {
    return _.includes(_.map(this.enrollmentChoices, 'enrollmentChoiceType'), enrollmentChoiceType);
  }

  getS12nSubscriptionEnrollmentData(s12nId) {
    return this.s12nSubscriptionEnrollmentChoices.find(
      ({ enrollmentChoiceData }) => enrollmentChoiceData.definition.s12Ids.includes(s12nId) // BE has typo for "s12Ids" prop
    );
  }

  getCanEnrollThroughS12nSubscription(enrollmentData) {
    return enrollmentData.enrollmentChoiceType === EnrollmentChoiceTypes.ENROLL_THROUGH_S12N_SUBSCRIPTION;
  }

  getCanEnrollThroughS12nSubscriptionFreeTrial(enrollmentData) {
    return enrollmentData.enrollmentChoiceType === EnrollmentChoiceTypes.ENROLL_THROUGH_S12N_SUBSCRIPTION_TRIAL;
  }

  getS12nPrepaidEnrollmentData() {
    return this.enrollmentChoices.find(
      (choice) => choice.enrollmentChoiceType === EnrollmentChoiceTypes.ENROLL_THROUGH_S12N_PREPAID
    );
  }

  // Needed for Mix and Match case where multiple s12n enrollment choices are returned
  // This removes either the FT or non-FT option that's mixed from other s12nIds
  getChoiceTypesForS12n(s12nId) {
    const { ENROLL_THROUGH_S12N_SUBSCRIPTION, ENROLL_THROUGH_S12N_SUBSCRIPTION_TRIAL } = EnrollmentChoiceTypes;

    if (this.canSubscribeToMultipleS12ns) {
      const s12nEnrollmentData = this.getS12nSubscriptionEnrollmentData(s12nId);
      const canEnrollThroughFT = this.getCanEnrollThroughS12nSubscriptionFreeTrial(s12nEnrollmentData);
      const removedChoice = canEnrollThroughFT
        ? ENROLL_THROUGH_S12N_SUBSCRIPTION
        : ENROLL_THROUGH_S12N_SUBSCRIPTION_TRIAL;
      return this.choiceTypes.filter((choiceType) => choiceType !== removedChoice);
    }

    return this.choiceTypes;
  }

  @requireFields('enrollmentChoiceReasonCode', 'enrollmentChoices', 'id')
  get isEligibleForVCFinaid() {
    const isIneligibleReasonCode = _.includes(
      [
        EnrollmentReasonCode.CAPSTONE_ACCESS_LOCKED,
        EnrollmentReasonCode.PURCHASED_SINGLE_COURSE,
        EnrollmentReasonCode.SPECIALIZATION_BULK_PAID,
        EnrollmentReasonCode.REGION_BLOCKED,
      ],
      this.enrollmentChoiceReasonCode
    );

    if (isIneligibleReasonCode || this.isCatalogSubscribed) {
      return false;
    }

    return (
      this.canPurchaseSingleCourse ||
      this.canEnrollThroughS12nSubscription ||
      this.canEnrollThroughS12nSubscriptionFreeTrial ||
      this.canSubscribeToCatalog ||
      this.canEnrollThroughS12nPrepaid
    );
  }

  @requireFields('enrollmentChoiceReasonCode')
  get humanReadableReasonCode() {
    switch (this.enrollmentChoiceReasonCode) {
      case EnrollmentReasonCode.ENROLLED:
        return _t('You are already enrolled');
      case EnrollmentReasonCode.PURCHASED_SINGLE_COURSE:
        return _t('You already purchased the course');
      case EnrollmentReasonCode.CAPSTONE_ACCESS_LOCKED:
        return _t(
          `You must first complete previous courses in the Specialization
          to be able to take the Capstone project`
        );
      case EnrollmentReasonCode.SPECIALIZATION_BULK_PAID:
        return _t('You already purchased the Specialization');
      case EnrollmentReasonCode.SPECIALIZATION_SUBSCRIBED:
        return _t('You are already subscribed to the Specialization');
      case EnrollmentReasonCode.REGION_BLOCKED:
        return _t(
          `We apologize for the inconvenience. This offering is currently unavailable in your region.
          You can find more information about the policy at #{policyUrl}`,
          { policyUrl: INTL_RESTRICTION_POLICY_URL }
        );
      case EnrollmentReasonCode.NO_AVAILABLE_SESSION:
        return _t('There are no sessions available right now.');
      case EnrollmentReasonCode.SPECIALIZATION_UPGRADE_REQUIRED:
        return _t(
          `You are currently enrolled in an old version of the specialization.
          Upgrade the specialization to continue with your purchase.`
        );
      default:
        return _t(
          `We could not find any enrollment option for you at this time.
          For more information, please visit our help center (#{helpCenterUrl})`,
          { helpCenterUrl: HELP_CENTER_URL }
        );
    }
  }

  @requireFields('enrollmentChoices')
  get prepaidEnrollmentS12nIds() {
    if (this.canEnrollThroughS12nPrepaid) {
      return this.enrollmentChoices
        .filter((choice) => choice.enrollmentChoiceType === EnrollmentChoiceTypes.ENROLL_THROUGH_S12N_PREPAID)
        .reduce((allIds, enrollmentChoice) => {
          // BE has typo for "s12Ids" prop
          const s12nIds = enrollmentChoice?.enrollmentChoiceData?.definition?.s12Ids ?? [];
          return allIds.concat(s12nIds);
        }, []);
    }
    return [];
  }

  @requireFields('enrollmentChoices')
  get enrollmentS12nIds() {
    return _.uniq([...this.prepaidEnrollmentS12nIds, ...this.subscriptionEnrollmentS12nIds]);
  }

  @requireFields('enrollmentChoices')
  get allS12nSubscriptionEnrollmentChoiceDataDefinition() {
    if (this.canEnrollThroughS12nSubscription || this.canEnrollThroughS12nSubscriptionFreeTrial) {
      return _.compact(
        _.map(
          this.s12nSubscriptionEnrollmentChoices,
          (s12nSubscriptionEnrollmentChoice) =>
            s12nSubscriptionEnrollmentChoice &&
            s12nSubscriptionEnrollmentChoice.enrollmentChoiceData &&
            s12nSubscriptionEnrollmentChoice.enrollmentChoiceData.definition
        )
      );
    }
    return [];
  }

  @requireFields('enrollmentChoices')
  get s12nSubscriptionEnrollmentChoiceDataDefinition() {
    return this.allS12nSubscriptionEnrollmentChoiceDataDefinition[0] || null;
  }

  @requireFields('enrollmentChoices')
  get subscriptionEnrollmentS12nIds() {
    return this.allS12nSubscriptionEnrollmentChoiceDataDefinition.reduce(
      (allIds, { s12Ids }) => allIds.concat(s12Ids),
      [] // BE has typo for "s12Ids" prop
    );
  }

  @requireFields('enrollmentChoices')
  get availableS12nSubscriptions() {
    const { s12nSubscriptionEnrollmentChoiceDataDefinition } = this;
    if (s12nSubscriptionEnrollmentChoiceDataDefinition) {
      return s12nSubscriptionEnrollmentChoiceDataDefinition.availableSubscriptions;
    }
    return null;
  }

  @requireFields('enrollmentChoices')
  get availableCatalogSubscriptions() {
    if (this.canSubscribeToCatalog) {
      const catalogEnrollmentChoices = _.filter(this.enrollmentChoices, (choice) =>
        EnrollmentAvailableChoicesV1.isCatalogEnrollmentChoiceType(choice.enrollmentChoiceType)
      )[0];
      return (
        catalogEnrollmentChoices &&
        catalogEnrollmentChoices.enrollmentChoiceData &&
        catalogEnrollmentChoices.enrollmentChoiceData.definition &&
        catalogEnrollmentChoices.enrollmentChoiceData.definition.availableSubscriptions
      );
    }
    return null;
  }

  @requireFields('enrollmentChoiceReasonCode')
  get didPurchase() {
    return (
      this.enrollmentChoiceReasonCode === EnrollmentReasonCode.PURCHASED_SINGLE_COURSE ||
      this.enrollmentChoiceReasonCode === EnrollmentReasonCode.SPECIALIZATION_BULK_PAID ||
      this.enrollmentChoiceReasonCode === EnrollmentReasonCode.SPECIALIZATION_SUBSCRIBED
    );
  }

  @requireFields('enrollmentChoiceReasonCode')
  get isSpecializationUpgradeRequired() {
    return this.enrollmentChoiceReasonCode === EnrollmentReasonCode.SPECIALIZATION_UPGRADE_REQUIRED;
  }

  @requireFields('enrollmentChoiceReasonCode')
  get isCatalogSubscribed() {
    return this.enrollmentChoiceReasonCode === EnrollmentReasonCode.CATALOG_SUBSCRIBED;
  }

  @requireFields('enrollmentChoiceReasonCode')
  get isSpecializationSubscribed() {
    return this.enrollmentChoiceReasonCode === EnrollmentReasonCode.SPECIALIZATION_SUBSCRIBED;
  }

  @requireFields('enrollmentChoices')
  get choiceTypes() {
    const choiceTypes = _.map(this.enrollmentChoices, 'enrollmentChoiceType').filter((choiceType) => {
      if (doesChoiceTypeHaveSubmitHandler(choiceType)) {
        return true;
      } else {
        logger.error(`Unrecognized enrollment choice type ${choiceType}`);
        return false;
      }
    });

    const catalogSubIndex = _.findIndex(choiceTypes, (choiceType) =>
      _.includes(CATALOG_ENROLLMENT_CHOICE_TYPES, choiceType)
    );
    const singleCourseIndex = _.indexOf(choiceTypes, EnrollmentChoiceTypes.PURCHASE_SINGLE_COURSE);

    // FE must display Purchase Single Course before Catalog Subscription enrollment choice.
    if (catalogSubIndex !== -1 && singleCourseIndex !== -1 && singleCourseIndex > catalogSubIndex) {
      choiceTypes.splice(singleCourseIndex, 0, choiceTypes.splice(catalogSubIndex, 1)[0]);
    }

    return choiceTypes;
  }
}

export default EnrollmentAvailableChoicesV1;
