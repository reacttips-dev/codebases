import classNames from 'classnames';
import Naptime from 'bundles/naptimejs';
import React from 'react';
import PropTypes from 'prop-types';
import CoursesV1 from 'bundles/naptimejs/resources/courses.v1';
import OnDemandSpecializationsV1 from 'bundles/naptimejs/resources/onDemandSpecializations.v1';
import Modal from 'bundles/phoenix/components/Modal';
import { stringKeyToTuple } from 'js/lib/stringKeyTuple';
import logger from 'js/app/loggerSingleton';
import { FormattedMessage } from 'js/lib/coursera.react-intl';
// @ts-ignore TS7016 Untyped import http://go.dkandu.me/strict-ts-migration#TS7016
import EnrollmentAvailableChoicesV1 from 'bundles/naptimejs/resources/enrollmentAvailableChoices.v1';
import CatalogSubscriptionsValueProps from 'bundles/enroll/components/subscriptions/catalogSubscription/CatalogSubscriptionsValueProps';
import TrackedButton from 'bundles/page/components/TrackedButton';
import CatalogSubscriptionsEnrollmentState from 'bundles/enroll/components/catalog-subs-hoc/CatalogSubscriptionsEnrollmentState';
import RedirectToCheckout from 'bundles/payments/components/RedirectToCheckout';
// @ts-ignore TS7016 Untyped import http://go.dkandu.me/strict-ts-migration#TS7016
import { choiceTypeToHandleSubmitPromise } from 'bundles/enroll-course/lib/enrollmentChoiceUtils';
import withCatalogSubscriptions from 'bundles/enroll/components/catalog-subs-hoc/withCatalogSubscriptions';
import { freeTrial } from 'bundles/payments/common/constants';
import {
  EnrollmentChoiceTypesValues,
  SUBSCRIBE_TO_CATALOG_TRIAL,
  SUBSCRIBE_TO_CATALOG,
  UPGRADE_TO_CATALOG_SUBSCRIPTION,
  ENROLL_COURSE,
  AUDIT_COURSE,
} from 'bundles/enroll-course/common/EnrollmentChoiceTypes';
import _t from 'i18n!nls/enroll';
// @ts-ignore TS7016 Untyped import http://go.dkandu.me/strict-ts-migration#TS7016
import { getHeaderAndValueProps } from 'bundles/enroll/components/subscriptions/catalogSubscription/utils/headerValuePropsText';
import redirect from 'js/lib/coursera.redirect';
import 'css!./__styles__/CatalogSubscriptionEnrollModal';

type Props = {
  courseId?: string;
  s12nId?: string;
  prioritizeCourse?: boolean;
  course?: CoursesV1;
  s12n?: OnDemandSpecializationsV1;
  onClose: (x0: any) => void;
  catalogSubscriptionsEnrollmentState?: CatalogSubscriptionsEnrollmentState;
  enrollmentAvailableChoices?: EnrollmentAvailableChoicesV1;
  onSdp?: boolean;
  disableAuditOption?: boolean;
};

type BodyText = {
  header: React.ReactNode;
  subheader?: React.ReactNode;
};

type State = {
  shouldShow: boolean;
  shouldRedirectToCheckout: boolean;
  auditEnrollFail: boolean;
};

class CatalogSubscriptionEnrollModal extends React.Component<Props, State> {
  static contextTypes = {
    router: PropTypes.object.isRequired,
  };

  state = {
    shouldShow: false,
    shouldRedirectToCheckout: false,
    auditEnrollFail: false,
  };

  handleClose = () => {
    // @ts-expect-error TSMIGRATION
    this.props.onClose();
  };

  onAuditClick = (evt: React.SyntheticEvent<any>) => {
    const { courseId, enrollmentAvailableChoices, course } = this.props;
    const { router } = this.context;
    // @ts-expect-error TSMIGRATION
    const { enrollmentType } = evt.target.dataset;
    if (courseId && enrollmentAvailableChoices) {
      const freeEnrollCall = choiceTypeToHandleSubmitPromise[enrollmentType];
      freeEnrollCall({ courseId }).then((status: $TSFixMe /* TODO: type choiceTypeToHandleSubmitPromise */) => {
        if (enrollmentType === AUDIT_COURSE) {
          return router.push({
            ...router.location,
            params: router.params,
            query: Object.assign({}, router.location.query, {
              showOnboardingModal: 'checkAndRedirect',
              courseSlug: course?.slug,
            }),
          });
        }
        if (status) {
          const redirectLocation = (course && course.phoenixHomeLink) || '/';
          redirect.setLocation(redirectLocation);
        } else {
          const [userId] = stringKeyToTuple(enrollmentAvailableChoices.id);
          logger.warn(`Audit/Free enrollment failed for user ${userId} and course ${courseId}`);
          this.setState(() => ({ auditEnrollFail: true }));
        }
      });
    } else {
      logger.warn('Invalid audit attempt');
    }
  };

  getBodyText(): BodyText | null {
    const { s12nId, courseId, catalogSubscriptionsEnrollmentState } = this.props;
    const { header, subheader } = getHeaderAndValueProps(
      catalogSubscriptionsEnrollmentState,
      courseId,
      s12nId,
      undefined
    );

    return {
      header: <FormattedMessage message={header} numDays={freeTrial.numDays} />,
      subheader,
    };
  }

  getEnrollmentChoiceType(
    enrollmentAvailableChoices: EnrollmentAvailableChoicesV1
  ): EnrollmentChoiceTypesValues | null {
    if (!enrollmentAvailableChoices) {
      return null;
    } else {
      const {
        canEnrollThroughCatalogSubscriptionFreeTrial,
        canEnrollThroughCatalogSubscription,
        canEnrollThroughCatalogSubscriptionUpgrade,
      } = enrollmentAvailableChoices;

      if (canEnrollThroughCatalogSubscriptionFreeTrial) {
        return SUBSCRIBE_TO_CATALOG_TRIAL;
      } else if (canEnrollThroughCatalogSubscription) {
        return SUBSCRIBE_TO_CATALOG;
      } else if (canEnrollThroughCatalogSubscriptionUpgrade) {
        return UPGRADE_TO_CATALOG_SUBSCRIPTION;
      } else {
        logger.warn('No valid catalog subscription enrollment available choice');
        return null;
      }
    }
  }

  toggleCheckout = () => {
    this.setState(({ shouldRedirectToCheckout }) => ({ shouldRedirectToCheckout: !shouldRedirectToCheckout }));
  };

  updateShouldShow = () => {
    this.setState(() => ({
      shouldShow: true,
    }));
  };

  renderBody() {
    const { courseId, s12nId, prioritizeCourse, disableAuditOption, catalogSubscriptionsEnrollmentState } = this.props;
    // @ts-expect-error TSMIGRATION
    const { enrollmentChoiceType } = catalogSubscriptionsEnrollmentState;
    // @ts-expect-error TSMIGRATION
    const { header, subheader } = this.getBodyText();
    return (
      <div className="enroll-modal-container">
        <h2 className="catalog-subs-header headline-5-text">
          <strong>{header}</strong>
        </h2>
        {subheader && (
          <h3 className="catalog-subs-subheader headline-1-text">
            <strong>{subheader}</strong>
          </h3>
        )}
        <CatalogSubscriptionsValueProps
          courseId={courseId}
          s12nId={s12nId}
          prioritizeCourse={prioritizeCourse}
          showParent={this.updateShouldShow}
        />
        <TrackedButton
          trackingName="subscription_enroll_to_cart"
          className="subscription-enroll-to-cart primary cozy"
          data={{ courseId, s12nId, enrollmentChoiceType }}
          onClick={this.toggleCheckout}
        >
          {_t('Continue')}
        </TrackedButton>
        {!disableAuditOption && this.renderFooter()}
      </div>
    );
  }

  renderFooter() {
    const { courseId, enrollmentAvailableChoices } = this.props;
    const { auditEnrollFail } = this.state;

    let message;
    let button;
    let enrollmentType;
    let premiumGrading;

    if (!courseId || !enrollmentAvailableChoices) {
      return null;
    } else if (enrollmentAvailableChoices.hasFreeEnrollOptionIntoCourse) {
      message = _t('Or {button}');
      button = _t('enroll without certificate');
      premiumGrading = false;
      enrollmentType = ENROLL_COURSE;
    } else if (enrollmentAvailableChoices.canAuditCourse) {
      message = _t('Or {button} this course');
      button = _t('audit');
      premiumGrading = true;
      enrollmentType = AUDIT_COURSE;
    } else {
      return null;
    }

    return (
      <div className="catalog-subs-enroll-footer">
        <div className="catalog-subs-hairline" />
        <FormattedMessage
          message={message}
          button={
            <TrackedButton
              className="button-link"
              trackingName="enroll_for_free_button"
              data={{ courseId, premiumGrading }}
              data-enrollment-type={enrollmentType}
              onClick={this.onAuditClick}
            >
              {button}
            </TrackedButton>
          }
        />
        {auditEnrollFail && (
          <p className="audit-enroll-error body-1-text">{_t('There was a problem with your enrollment.')}</p>
        )}
      </div>
    );
  }

  render() {
    const {
      s12nId,
      courseId,
      s12n,
      course,
      catalogSubscriptionsEnrollmentState,
      enrollmentAvailableChoices,
      onSdp,
    } = this.props;

    const { shouldShow, shouldRedirectToCheckout } = this.state;

    let s12nIdToEnroll;
    if (s12nId) {
      s12nIdToEnroll = s12nId;
    } else if (course && course.s12nIds) {
      s12nIdToEnroll = course.s12nIds[0];
    }

    let courseIdToEnroll;
    if (courseId) {
      courseIdToEnroll = courseId;
    } else if (s12n && s12n.courseIds) {
      courseIdToEnroll = s12n.courseIds[0];
    }

    if (!catalogSubscriptionsEnrollmentState) {
      return null;
    }

    const { eligibility, monthlyCatalogSubscriptionSkuId, enrollmentChoiceType } = catalogSubscriptionsEnrollmentState;
    const queryParams = onSdp ? { prioritizeS12nEnrollment: true } : {};
    const wrapperClass = classNames('rc-CatalogSubscriptionEnrollModal', {
      hide: !shouldShow,
    });
    return (
      <Modal
        className={wrapperClass}
        trackingName="catalog_subscription_enroll_modal"
        data={{ enrollmentChoiceType }}
        modalName={_t('Catalog subscription enrollment')}
        handleClose={this.handleClose}
      >
        {this.renderBody()}
        {shouldRedirectToCheckout && (
          <RedirectToCheckout
            s12nId={s12nIdToEnroll}
            courseId={courseIdToEnroll}
            enrollmentChoice={this.getEnrollmentChoiceType(enrollmentAvailableChoices)}
            catalogSubscriptionEligibilityType={eligibility}
            productSkuId={monthlyCatalogSubscriptionSkuId}
            onCloseModal={this.toggleCheckout}
            additionalQueryParams={queryParams}
          />
        )}
      </Modal>
    );
  }
}

const CatalogSubscriptionEnrollModalNC = Naptime.createContainer<Props, Omit<Props, 's12n' | 'course'>>(
  ({ courseId, s12nId }) => ({
    ...(courseId && {
      course: CoursesV1.get(courseId, {
        fields: ['s12nIds'],
      }),
    }),
    ...(s12nId && {
      s12n: OnDemandSpecializationsV1.get(s12nId, {
        fields: ['courseIds'],
      }),
    }),
  })
)(CatalogSubscriptionEnrollModal);

export default withCatalogSubscriptions(CatalogSubscriptionEnrollModalNC);
