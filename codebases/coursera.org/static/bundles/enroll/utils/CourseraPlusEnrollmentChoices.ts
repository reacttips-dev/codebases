/* eslint-disable @typescript-eslint/no-non-null-assertion */
import {
  EnrollmentAvailableChoicesV1NaptimeResource,
  EnrollmentAvailableChoicesV1,
  EnrollmentChoiceDataENROLL_THROUGH_COURSERA_PLUS as EnrollThroughCourseraPlusData,
  EnrollmentChoiceDataSUBSCRIBE_TO_COURSERA_PLUS as SubscribeToCourseraPlusData,
  EnrollmentChoiceData,
  BillingCycle,
} from 'bundles/naptimejs/resources/__generated__/EnrollmentAvailableChoicesV1';

export type CourseraPlusSubscriptionPlan = {
  productItemId: string;
  productType: string;
  billingCycle: BillingCycle;
  numberOfTrialDays: number;
  hasExhaustedFreeTrial: boolean;
};

class CourseraPlusEnrollmentChoices extends EnrollmentAvailableChoicesV1NaptimeResource {
  static RESOURCE_NAME = 'enrollmentAvailableChoices.v1' as const;

  _enrollThroughCourseraPlusData: EnrollThroughCourseraPlusData | undefined;

  _subscribeToCourseraPlusData: SubscribeToCourseraPlusData | undefined;

  constructor(params: EnrollmentAvailableChoicesV1) {
    super(params);

    this._enrollThroughCourseraPlusData = this.findEnrollmentData<EnrollThroughCourseraPlusData>(
      'ENROLL_THROUGH_COURSERA_PLUS'
    );

    this._subscribeToCourseraPlusData = this.findEnrollmentData<SubscribeToCourseraPlusData>(
      'SUBSCRIBE_TO_COURSERA_PLUS'
    );
  }

  findEnrollmentData<R extends EnrollmentChoiceData>(choiceType: R['typeName']): R | undefined {
    const enrollmentChoiceData = this.enrollmentChoices.find((choice) => choice.enrollmentChoiceType === choiceType)
      ?.enrollmentChoiceData;
    return enrollmentChoiceData as R | undefined;
  }

  get canSubscribeToCourseraPlus() {
    return !!this._subscribeToCourseraPlusData;
  }

  get canEnrollThroughCourseraPlus() {
    return !!this._enrollThroughCourseraPlusData;
  }

  /**
   * A valid subscription plan if the user is eligible
   */
  get courseraPlusSubscriptionPlan(): CourseraPlusSubscriptionPlan | undefined {
    const courseraPlusPermutationToDisplay = this._subscribeToCourseraPlusData?.definition.enrollmentChoiceData
      .courseraPlusPermutationToDisplay;
    if (!this._subscribeToCourseraPlusData || !courseraPlusPermutationToDisplay) {
      return undefined;
    }

    const { hasExhaustedFreeTrial } = this._subscribeToCourseraPlusData.definition.enrollmentChoiceData;
    // TODO(htran): add support for `PrepaidProductProperties` once BE is ready
    const productProperties =
      courseraPlusPermutationToDisplay.properties?.['org.coursera.product.SubscriptionProductProperties'];

    return {
      productItemId: courseraPlusPermutationToDisplay.productItemId,
      productType: courseraPlusPermutationToDisplay.productType,
      billingCycle: productProperties?.billingCycle ?? '',
      numberOfTrialDays: productProperties?.numberOfTrialDays ?? 0,
      hasExhaustedFreeTrial: hasExhaustedFreeTrial!,
    };
  }
}

export default CourseraPlusEnrollmentChoices;
