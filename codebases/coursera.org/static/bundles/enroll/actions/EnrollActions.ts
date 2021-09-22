import Uri from 'jsuri';

import EnrollmentChoiceTypes from 'bundles/enroll-course/common/EnrollmentChoiceTypes';
import {
  choiceTypeToHandleSubmitPromise,
  submitEnrollmentPromise,
  /* @ts-ignore ts-migrate(7016) FIXME: Untyped import */
} from 'bundles/enroll-course/lib/enrollmentChoiceUtils';

import redirect from 'js/lib/coursera.redirect';
import path from 'js/lib/path';

const LEARN_PATH = '/learn';
const HOME_PATH = 'home';
const PROFILE_COMPLETION_PATH = '/profile-completion';
const COURSE_SLUG = 'courseSlug';

export const enrollForFree = ({
  slug,
  courseId,
  isOnboardingEnrollmentFlowActive,
  onFail,
  onSuccess,
}: {
  slug: string;
  courseId: string;
  isOnboardingEnrollmentFlowActive?: boolean;
  onFail?: Function;
  onSuccess?: Function;
}) => {
  const onboardingPath = new Uri(PROFILE_COMPLETION_PATH).addQueryParam(COURSE_SLUG, slug).toString();
  const courseHomePath = path.join(LEARN_PATH, slug, HOME_PATH);
  const redirectUrl = isOnboardingEnrollmentFlowActive ? onboardingPath : courseHomePath;
  const enrollForFreePromise = choiceTypeToHandleSubmitPromise[EnrollmentChoiceTypes.ENROLL_COURSE];

  return enrollForFreePromise({ courseId })
    .then(() => {
      if (onSuccess) {
        onSuccess();
      } else {
        redirect.setLocation(redirectUrl);
      }
    }, onFail)
    .done();
};

export const enrollInSubscription = ({
  s12nSubProductId,
  onFail,
  courseId,
  promoCode,
  skipWelcomeEmail,
  additionalParams,
}: {
  s12nSubProductId?: string;
  courseId?: string | null;
  promoCode?: string | null;
  skipWelcomeEmail?: boolean;
  onFail?: Function;
  additionalParams?: object;
}) => {
  const createS12nCartPromise = choiceTypeToHandleSubmitPromise[EnrollmentChoiceTypes.ENROLL_THROUGH_S12N_SUBSCRIPTION];
  const options = { productSkuId: s12nSubProductId, courseId, skipWelcomeEmail };

  return submitEnrollmentPromise({
    handleSubmitPromise: createS12nCartPromise,
    options,
    promoCode,
    additionalParams,
  }).catch(onFail);
};
export const enrollInCredentialTrack = ({
  credentialTrackProductId,
  productType,
  promoCode,
  onFail,
}: {
  credentialTrackProductId: string;
  productType: string;
  promoCode?: string;
  onFail?: Function;
}) => {
  const createCredentialTrackSubscriptionCartPromise =
    // @ts-expect-error TODO: ENROLL_THROUGH_CREDENTIALTRACK_SUBSCRIPTION does not exist in EnrollmentChoiceTypes
    choiceTypeToHandleSubmitPromise[EnrollmentChoiceTypes.ENROLL_THROUGH_CREDENTIALTRACK_SUBSCRIPTION];
  const options = { credentialTrackProductId, productType };
  return submitEnrollmentPromise({
    handleSubmitPromise: createCredentialTrackSubscriptionCartPromise,
    options,
    promoCode,
  }).catch(onFail);
};
