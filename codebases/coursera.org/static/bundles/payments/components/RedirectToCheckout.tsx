/**
 * Creates cart, redirects to the checkout page for it and handles possible errors.
 * Note: currently can run into some UI problems because of authentication
 * when using this component from Backbone.
 */
import PropTypes from 'prop-types';
import React from 'react';
import { compose } from 'recompose';
import Naptime from 'bundles/naptimejs';
import Modal from 'bundles/phoenix/components/Modal';
import user from 'js/lib/user';
// @ts-ignore TS7016 Untyped import http://go.dkandu.me/strict-ts-migration#TS7016
import { choiceTypeToHandleSubmitPromise as catalogChoiceTypeToHandleSubmitPromise } from 'bundles/enroll/utils/catalogSubscriptionUtils';
import { ApiError } from 'bundles/enroll/utils/errorUtils';
import {
  choiceTypeToHandleSubmitPromise,
  submitEnrollmentPromise,
  /* @ts-ignore ts-migrate(7016) FIXME: Untyped import */
} from 'bundles/enroll-course/lib/enrollmentChoiceUtils';
import { EnrollmentChoiceTypesValues } from 'bundles/enroll-course/common/EnrollmentChoiceTypes';
import CoursesV1 from 'bundles/naptimejs/resources/courses.v1';
// @ts-ignore TS7016 Untyped import http://go.dkandu.me/strict-ts-migration#TS7016
import CourseEnrollmentConfirmation from 'bundles/enroll-course/components/CourseEnrollmentConfirmation';
import PromotionEligibilitiesV1 from 'bundles/naptimejs/resources/promotionEligibilities.v1';
// @ts-ignore TS7016 Untyped import http://go.dkandu.me/strict-ts-migration#TS7016
import CatalogSubscriptionEligibilityType from 'bundles/payments/common/CatalogSubscriptionEligibilityType';
import withPromotionInfo from 'bundles/promotions/components/withPromotionInfo';
import { FormattedHTMLMessage } from 'js/lib/coursera.react-intl';
import redirect from 'js/lib/coursera.redirect';
import _t from 'i18n!nls/payments';
import 'css!./__styles__/RedirectToCheckout';

type EligibilityType = keyof typeof CatalogSubscriptionEligibilityType;

type InputProps = {
  courseId?: string;
  s12nId?: string;
  productSkuId?: string;
  showModal?: boolean;
  shouldOpenFinaid?: boolean;
  onCloseModal?: () => void;
  onError?: (error?: ApiError) => void;
  additionalQueryParams?: { [key: string]: string | boolean } | {};
  enrollmentChoice?: EnrollmentChoiceTypesValues | null;
  catalogSubscriptionEligibilityType?: EligibilityType;
  shouldShowCourseEnrollmentConfirmation?: boolean;
};

type PropsFromNaptime = {
  course?: CoursesV1;
};

type PropsFromPromotionInfo = {
  promotionEligibilities?: PromotionEligibilitiesV1;
};

type Props = InputProps & PropsFromNaptime & PropsFromPromotionInfo;

type State = {
  couldNotCreateCart: boolean;
  shouldShowCourseEnrollmentConfirmation: boolean;
};

class RedirectToCheckout extends React.Component<Props, State> {
  static contextTypes = {
    router: PropTypes.object.isRequired,
  };

  static defaultProps = {
    showModal: true,
    shouldOpenFinaid: false,
  };

  state = {
    couldNotCreateCart: false,
    shouldShowCourseEnrollmentConfirmation: false,
  };

  componentDidMount() {
    const {
      shouldOpenFinaid,
      courseId,
      additionalQueryParams = {},
      enrollmentChoice,
      catalogSubscriptionEligibilityType,
      onError,
      s12nId,
      productSkuId,
      course,
      shouldShowCourseEnrollmentConfirmation,
      promotionEligibilities,
    } = this.props;

    if (user.isAuthenticatedUser() && (enrollmentChoice || catalogSubscriptionEligibilityType)) {
      let handleSubmitPromise;
      let promiseRequest;

      // Should only apply promo for checkout cart creation, not finaid
      const promoCode =
        !shouldOpenFinaid && promotionEligibilities && promotionEligibilities.isEligible
          ? promotionEligibilities.promoCodeId
          : null;

      if (catalogSubscriptionEligibilityType) {
        handleSubmitPromise = catalogChoiceTypeToHandleSubmitPromise[catalogSubscriptionEligibilityType];
        promiseRequest = { productSkuId };
      } else {
        handleSubmitPromise = choiceTypeToHandleSubmitPromise[enrollmentChoice];

        const data: Record<string, string> = {};
        if (s12nId) {
          data.s12nId = s12nId;
        }

        promiseRequest = {
          productSkuId,
          courseId,
          data,
        };
      }

      submitEnrollmentPromise({
        handleSubmitPromise,
        options: promiseRequest,
        promoCode,
        additionalParams: additionalQueryParams,
        isFinaid: shouldOpenFinaid,
      })
        .then((promiseData: $TSFixMe /* TODO: type submitEnrollmentPromise*/) => {
          // Will redirect to checkout if a cart was created
          if (!promiseData.didEnroll) {
            return;
          }

          if (shouldShowCourseEnrollmentConfirmation) {
            this.setState(() => ({ shouldShowCourseEnrollmentConfirmation }));
          } else if (course) {
            redirect.setLocation(`/learn/${course.slug}/home/welcome`);
          } else {
            redirect.refresh();
          }
        })
        .catch((err?: ApiError) => {
          // Error completing enrollment - propagate up or display an error
          if (onError) {
            onError(err);
          } else {
            this.setState(() => ({ couldNotCreateCart: true }));
          }

          if (!err?.responseJSON) {
            throw err;
          }
        });
    } else if (!user.isAuthenticatedUser()) {
      const { router } = this.context;
      router.replace({
        pathname: router.location.pathname,
        query: { ...router.location.query, ...{ authMode: 'login' } },
      });
    }
  }

  renderErrorMessage(): JSX.Element {
    return (
      <FormattedHTMLMessage
        message={_t(
          `Sorry, looks like an error occurred.
        Please <a href="https://learner.coursera.help/hc/requests/new",
        target="_blank">contact Coursera to sign up for a Certificate</a>.`
        )}
      />
    );
  }

  renderErrorModal(): JSX.Element {
    const { onCloseModal } = this.props;

    return (
      <Modal handleClose={onCloseModal} modalName="Error creating cart">
        <div className="styleguide container">
          <span className="body-1-text">{this.renderErrorMessage()}</span>
        </div>
      </Modal>
    );
  }

  renderConfirmationModal(): JSX.Element | null {
    const { onCloseModal, course } = this.props;

    if (!course) {
      return null;
    }

    return (
      <Modal handleClose={onCloseModal} modalName="Course Enrollment Confirmation">
        <div className="align-horizontal-center">
          <h1 className="headline-4-text">{course.name}</h1>
        </div>
        <CourseEnrollmentConfirmation courseId={course.id} />
      </Modal>
    );
  }

  render() {
    const { course, showModal } = this.props;
    const { shouldShowCourseEnrollmentConfirmation, couldNotCreateCart } = this.state;

    return (
      <div className="rc-RedirectToCheckout">
        {shouldShowCourseEnrollmentConfirmation && course && this.renderConfirmationModal()}
        {couldNotCreateCart && (showModal ? this.renderErrorModal() : this.renderErrorMessage())}
      </div>
    );
  }
}

export default compose<Props, InputProps>(
  Naptime.createContainer<InputProps & PropsFromNaptime, InputProps>(({ courseId }) => ({
    ...(courseId
      ? {
          course: CoursesV1.get(courseId, {
            fields: ['name'],
            params: {
              showHidden: true,
            },
          }),
        }
      : {}),
  })),
  withPromotionInfo()
)(RedirectToCheckout);
