import connectToStores from 'vendor/cnpm/fluxible.v0-4/addons/connectToStores';

import Naptime from 'bundles/naptimejs';
import React from 'react';
import { compose, mapProps } from 'recompose';
import PropTypes from 'prop-types';
import isEqual from 'lodash/isEqual';
import raven from 'raven-js';
import EnrollmentChoiceTypes from 'bundles/enroll-course/common/EnrollmentChoiceTypes';

import PromotionApplicableCheckoutMessage from 'bundles/enroll/components/common/PromotionApplicableCheckoutMessage';
// @ts-ignore TS7016 Untyped import http://go.dkandu.me/strict-ts-migration#TS7016
import { doesChoiceTypeHaveSubmitHandler } from 'bundles/enroll-course/lib/enrollmentChoiceUtils';
import CoursesV1 from 'bundles/naptimejs/resources/courses.v1';
import OnDemandSpecializationsV1 from 'bundles/naptimejs/resources/onDemandSpecializations.v1';
import PriceWithDiscountIndicator from 'bundles/payments-common/components/PriceWithDiscountIndicator';
import { FormattedHTMLMessage, FormattedMessage } from 'js/lib/coursera.react-intl';
import withCatalogSubscriptions from 'bundles/enroll/components/catalog-subs-hoc/withCatalogSubscriptions';
// @ts-ignore TS7016 Untyped import http://go.dkandu.me/strict-ts-migration#TS7016
import ProductPricesV3 from 'bundles/naptimejs/resources/productPrices.v3';
// @ts-ignore TS7016 Untyped import http://go.dkandu.me/strict-ts-migration#TS7016
import type EnrollmentAvailableChoicesV1 from 'bundles/naptimejs/resources/enrollmentAvailableChoices.v1';
import ReactPriceDisplay from 'bundles/payments-common/components/ReactPriceDisplay';
import { freeTrial } from 'bundles/payments/common/constants';
import Imgix from 'js/components/Imgix';
import hoistNonReactStatics from 'js/lib/hoistNonReactStatics';
import logger from 'js/app/loggerSingleton';
import _t from 'i18n!nls/enroll-course';
import type { Program, ThirdPartyOrganization, Group } from 'bundles/enroll-course/common/Enterprise';
import withPromotionInfo from 'bundles/promotions/components/withPromotionInfo';
import type PromotionDetailsV1 from 'bundles/naptimejs/resources/promotionDetails.v1';
import type PromotionEligibilitiesV1 from 'bundles/naptimejs/resources/promotionEligibilities.v1';
import { LONG_DATE_ONLY_DISPLAY } from 'js/utils/DateTimeUtils';
import { getPromotionExpirationDate } from 'bundles/promotions/utils/promotionDateUtils';
import { SvgHonorsAssignment } from '@coursera/coursera-ui/svg';
import 'css!./__styles__/CourseEnrollChoiceDescription';
import epic from 'bundles/epic/client';
import config from 'js/app/config';
import { getShouldLoadRaven } from 'js/lib/sentry';

const {
  BULKPAY_FULL_SPECIALIZATION,
  BULKPAY_REMAINING_SPECIALIZATION_COURSES,
  PURCHASE_SINGLE_COURSE,
  ENROLL_COURSE,
  AUDIT_COURSE,
  ENROLL_THROUGH_PROGRAM,
  ENROLL_THROUGH_PROGRAM_INVITATION,
  ENROLL_THROUGH_GROUP,
  SUBSCRIBE_TO_CATALOG,
  SUBSCRIBE_TO_CATALOG_TRIAL,
  UPGRADE_TO_CATALOG_SUBSCRIPTION,
} = EnrollmentChoiceTypes;

type EnrollmentChoiceType = keyof typeof EnrollmentChoiceTypes;

const CERTIFICATE_ICON = `${config.url.resource_assets}growth_catalog_subscription/ic_cert.png`;

type PropsFromCaller = {
  courseId: string;
  userId: string;
  choiceType: EnrollmentChoiceType;
  program?: Program;
  thirdPartyOrganization?: ThirdPartyOrganization;
  group?: Group;
  hasLoadedCallback?: () => void;
};

type PropsToComponent = PropsFromCaller & {
  s12n?: OnDemandSpecializationsV1;
  productPrice?: ProductPricesV3;
  catalogSubscriptionPrice?: ProductPricesV3;
  enrollmentAvailableChoices: EnrollmentAvailableChoicesV1;
  isMonthlyCatalogSubscriptionEnabled: boolean;
  requestCountryCode: string;
  course: CoursesV1;
  promotionEligibilities?: PromotionEligibilitiesV1;
  promotionDetails?: PromotionDetailsV1;
};

class CourseEnrollChoiceDescription extends React.Component<PropsToComponent> {
  // Context set in CDPPage and SDPPage
  static contextTypes = {
    enableIntegratedOnboarding: PropTypes.bool,
  };

  componentDidMount() {
    const { hasLoadedCallback } = this.props;
    if (hasLoadedCallback) {
      hasLoadedCallback();
    }
  }

  // TODO(jnam) make sure to distinguish pay-by-course case and standalone course cert case
  renderPrimaryDescription() {
    const { choiceType, productPrice, catalogSubscriptionPrice, enrollmentAvailableChoices, course, s12n } = this.props;

    const renderProductPrice = () => {
      if (!productPrice) {
        return null;
      }

      if (this.canPurchaseSingleCourseAndHasFullDiscount()) {
        return (
          <PriceWithDiscountIndicator
            amount={productPrice.amount}
            finalAmount={0}
            currencyCode={productPrice.currencyCode}
            discountColorType="green"
            hideCurrencyCode={false}
            showDiscountPrice={true}
            showDiscountPercent={false}
          />
        );
      } else {
        return (
          <PriceWithDiscountIndicator
            amount={productPrice.amount}
            finalAmount={productPrice.finalAmount}
            currencyCode={productPrice.currencyCode}
            hideCurrencyCode={
              enrollmentAvailableChoices && enrollmentAvailableChoices.isCatalogSubscriptionStandaloneCourse
            }
          />
        );
      }
    };

    switch (choiceType) {
      case BULKPAY_FULL_SPECIALIZATION:
        return (
          <span>
            <span>{_t('Purchase Specialization')}</span>
            <span className="price-delim"> · </span>
            {productPrice && renderProductPrice()}
          </span>
        );
      case BULKPAY_REMAINING_SPECIALIZATION_COURSES:
        return (
          <span>
            <span>{_t('Purchase Remaining Courses')}</span>
            <span className="price-delim"> · </span>
            {productPrice && renderProductPrice()}
          </span>
        );
      case PURCHASE_SINGLE_COURSE:
        if (enrollmentAvailableChoices && enrollmentAvailableChoices.isCatalogSubscriptionStandaloneCourse) {
          return (
            <span>
              <span>{_t('Enroll in this course only')}</span>
              <span className="price-delim"> · </span>
              {productPrice && (
                <strong>
                  <FormattedMessage message={_t('One-time fee of {price}')} price={renderProductPrice()} />
                </strong>
              )}
            </span>
          );
        }
        return (
          <span>
            <span>{_t('Purchase Course')}</span>
            <span className="price-delim"> · </span>
            {productPrice && renderProductPrice()}
            {!this.canPurchaseSingleCourseAndHasFullDiscount() && (
              <PromotionApplicableCheckoutMessage course={course} s12n={s12n} />
            )}
          </span>
        );
      case ENROLL_THROUGH_PROGRAM:
        return <span>{_t('Enroll with Learning Programs')}</span>;
      case ENROLL_THROUGH_PROGRAM_INVITATION:
        return <span>{_t('Enroll with Learning Programs')}</span>;
      case ENROLL_THROUGH_GROUP:
        return <span>{_t('Join now for free')}</span>;
      case ENROLL_COURSE:
        return _t('Full Course, No Certificate');
      case AUDIT_COURSE:
        if (enrollmentAvailableChoices && enrollmentAvailableChoices.isCatalogSubscriptionStandaloneCourse) {
          return _t('Audit this course');
        }
        return _t('Audit only');
      case SUBSCRIBE_TO_CATALOG:
      case SUBSCRIBE_TO_CATALOG_TRIAL:
      case UPGRADE_TO_CATALOG_SUBSCRIPTION:
        if (catalogSubscriptionPrice) {
          if (enrollmentAvailableChoices && enrollmentAvailableChoices.isCatalogSubscriptionStandaloneCourse) {
            return (
              <span>
                <span>{_t('Enroll in any course on Coursera · ')}</span>
                <strong>
                  <FormattedMessage
                    message={_t('Free for {numDays} days, then {price} per month')}
                    numDays={freeTrial.numDays}
                    price={
                      <ReactPriceDisplay
                        currency={catalogSubscriptionPrice.currencyCode}
                        value={catalogSubscriptionPrice.amount}
                        hideCurrencyCode={true}
                      />
                    }
                  />
                </strong>
              </span>
            );
          }
          return (
            <FormattedMessage
              message={_t('Full Course, With Certificate \u2022 {price}/month')}
              price={
                <ReactPriceDisplay
                  currency={catalogSubscriptionPrice.currencyCode}
                  value={catalogSubscriptionPrice.amount}
                />
              }
            />
          );
        } else {
          throw new Error('Catalog subscription price required');
        }
      default:
        throw new Error(`Unable to get detect description for ${choiceType}`);
    }
  }

  renderDescriptionWithIconArea(msg: React.ReactNode) {
    const enableIntegratedXdpOnboarding = epic.get('XDP', 'enableIntegratedXdpOnboarding');
    return (
      <div className="horizontal-box">
        <div className="flex-1">
          {!enableIntegratedXdpOnboarding ? (
            <Imgix className="cert-icon" alt={Imgix.DECORATIVE} src={CERTIFICATE_ICON} height={35} width={35} />
          ) : (
            <SvgHonorsAssignment />
          )}
        </div>
        <div className="flex-12">{msg}</div>
        <div className="flex-1" />
      </div>
    );
  }

  renderSecondaryDescription() {
    const { choiceType, s12n, productPrice, enrollmentAvailableChoices, promotionDetails } = this.props;
    let msg: string | undefined;
    switch (choiceType) {
      case BULKPAY_FULL_SPECIALIZATION: {
        const courseCount = s12n?.courseIds?.length;
        const hasDiscount =
          productPrice &&
          productPrice.amount &&
          productPrice.finalAmount &&
          productPrice.finalAmount < productPrice.amount;
        if (hasDiscount) {
          if (courseCount) {
            return (
              <FormattedMessage
                message={_t(
                  'Pre-pay for all {courseCount} courses in the Specialization and Specialization Certificate, and get a special one-time discount.'
                )}
                courseCount={courseCount}
              />
            );
          } else {
            return _t(
              'Pre-pay for all the courses in the Specialization and Specialization Certificate, and get a special one-time discount.'
            );
          }
        } else if (courseCount) {
          return (
            <FormattedMessage
              message={_t(
                'Pre-pay for all {courseCount} courses in the Specialization and Specialization Certificate.'
              )}
              courseCount={courseCount}
            />
          );
        } else {
          return _t('Pre-pay for all the courses in the Specialization and Specialization Certificate.');
        }
      }
      case BULKPAY_REMAINING_SPECIALIZATION_COURSES:
        return _t('Pre-pay for the remaining courses in the Specialization and Specialization Certificate.');
      case PURCHASE_SINGLE_COURSE:
        if (enrollmentAvailableChoices && enrollmentAvailableChoices.isCatalogSubscriptionStandaloneCourse) {
          msg = _t(
            "You'll earn an official Certificate\u2014it's a trusted, sharable way to showcase your new skills on LinkedIn."
          );
          return this.renderDescriptionWithIconArea(msg);
        } else if (this.canPurchaseSingleCourseAndHasFullDiscount()) {
          const endTimeInMilliseconds = promotionDetails?.endsAt ?? 0;
          return (
            <FormattedMessage
              message={_t('Free enrollment available until {date}. Valid for one enrollment per person.')}
              date={getPromotionExpirationDate(endTimeInMilliseconds, LONG_DATE_ONLY_DISPLAY)}
            />
          );
        } else {
          msg = _t("Commit to earning a Certificate\u2014it's a trusted, shareable way to showcase your new skills.");
          return this.renderDescriptionWithIconArea(msg);
        }
      case ENROLL_THROUGH_PROGRAM:
        return this.renderProgramDescription();
      case ENROLL_THROUGH_PROGRAM_INVITATION:
        return this.renderProgramDescription();
      case ENROLL_THROUGH_GROUP:
        return this.renderGroupDescription();
      case ENROLL_COURSE:
        return _t('You will still have access to all course materials for this course.');
      case AUDIT_COURSE:
        if (enrollmentAvailableChoices && enrollmentAvailableChoices.isCatalogSubscriptionStandaloneCourse) {
          return _t(
            'You will still have an access to all course materials for this course but will not earn a Certificate.'
          );
        } else {
          return _t('You will have access to all course materials except graded items.');
        }
      case SUBSCRIBE_TO_CATALOG:
      case UPGRADE_TO_CATALOG_SUBSCRIPTION:
        if (enrollmentAvailableChoices && enrollmentAvailableChoices.isCatalogSubscriptionStandaloneCourse) {
          msg = _t(
            'Enroll in this course, or any other course if this one is not right for you. Earn official Certificates for each course you complete. Cancel anytime.'
          );
          return this.renderDescriptionWithIconArea(msg);
        } else {
          return _t(
            `Get access to 2000+ courses, including this one. Earn official certificates to add to your LinkedIn
              profile. Cancel anytime.`
          );
        }
      case SUBSCRIBE_TO_CATALOG_TRIAL:
        if (enrollmentAvailableChoices && enrollmentAvailableChoices.isCatalogSubscriptionStandaloneCourse) {
          msg =
            'Enroll in this course, or any other course if this one is not right for you. Earn official Certificates for each course you complete. Cancel anytime.';
          return this.renderDescriptionWithIconArea(msg);
        } else {
          msg = `Get access to 2000+ courses, including this one. Earn official certificates to add to your LinkedIn
              profile. First {numDays} {numDays, plural, =1 {day} other {days}} free. Cancel anytime.`;
        }
        return <FormattedMessage message={_t(msg)} numDays={freeTrial.numDays} />;
      default:
        throw new Error(`Unable to get detect description for ${choiceType}`);
    }
  }

  renderProgramDescription() {
    const { s12n, program, thirdPartyOrganization } = this.props;
    if (program) {
      const programName = program?.metadata?.name;
      const thirdPartyOrganizationName = thirdPartyOrganization?.name;
      if (s12n) {
        return (
          <FormattedMessage
            message={_t(
              `Join just this course through your {programName}'s sponsorship. As a member of
            the {programName} Learning Program, you can upgrade to the full Specialization at any time.`
            )}
            programName={programName}
          />
        );
      } else {
        return (
          <FormattedMessage
            message={_t(
              `Your enrollment in this course is sponsored by {orgName}. Select Continue to start
            learning free of charge. Complete the course to earn a sharable Course Certificate.`
            )}
            orgName={thirdPartyOrganizationName}
          />
        );
      }
    }
    return null;
  }

  renderGroupDescription() {
    const { group } = this.props;
    if (group) {
      return (
        <FormattedHTMLMessage
          message={_t(
            `As part of <span class="body-2-text">{groupName}</span>, you're able to join
            this course for free!  You'll have access to all graded assignments, a final grade for
          the course, and a shareable Certificate.`
          )}
          groupName={group.name}
        />
      );
    }
    return null;
  }

  canPurchaseSingleCourseAndHasFullDiscount(): boolean {
    const { enrollmentAvailableChoices, promotionEligibilities, promotionDetails } = this.props;
    return !!(
      enrollmentAvailableChoices.canPurchaseSingleCourse &&
      promotionEligibilities?.isEligible &&
      promotionDetails?.discountPercent === 100
    );
  }

  render() {
    const { choiceType, s12n, catalogSubscriptionPrice, program, group } = this.props;
    const { enableIntegratedOnboarding } = this.context;
    if (!doesChoiceTypeHaveSubmitHandler(choiceType)) {
      logger.error(`Cannot render choice type without submit handler: ${choiceType}`);
      return false;
    }

    if (
      (choiceType === SUBSCRIBE_TO_CATALOG || choiceType === SUBSCRIBE_TO_CATALOG_TRIAL) &&
      !catalogSubscriptionPrice
    ) {
      return null;
    }
    const xdpExperimentClassName = enableIntegratedOnboarding ? 'xdp-experiment' : '';
    return (
      <div
        className={`rc-CourseEnrollChoiceDescription ${xdpExperimentClassName}`}
        data-s12nid={s12n && s12n.id}
        data-programid={program ? program.id : null}
        data-groupid={group ? group.id : null}
      >
        <h4 className="primary-description">{this.renderPrimaryDescription()}</h4>
        <div className="secondary-description color-secondary-text">{this.renderSecondaryDescription()}</div>
      </div>
    );
  }
}

const CourseEnrollChoiceDescriptionWithCatalogSubscriptions = withCatalogSubscriptions(CourseEnrollChoiceDescription, {
  withProductPrice: true,
});

type PropsFromStores = PropsFromCaller & {
  requestCountryCode: string;
};

type PropsFromNaptime1 = PropsFromStores & {
  course: CoursesV1;
};

type PropsFromNaptime2 = PropsFromNaptime1 & {
  s12n: OnDemandSpecializationsV1;
};

type PropsFromNaptime3 = PropsFromNaptime2 & {
  productPrice?: ProductPricesV3;
};

const CourseEnrollChoiceDescriptionNaptimeContainer = compose<PropsToComponent, PropsFromCaller>(
  connectToStores<PropsFromStores, PropsFromCaller>(['ApplicationStore'], ({ ApplicationStore }) => ({
    requestCountryCode: ApplicationStore.getState().requestCountryCode,
  })),
  Naptime.createContainer<PropsFromNaptime1, PropsFromStores>(({ courseId }) => ({
    course: CoursesV1.get(courseId, {
      fields: ['name'],
    }),
  })),
  Naptime.createContainer<PropsFromNaptime2, PropsFromNaptime1>(({ userId, courseId }) => ({
    // @ts-expect-error TODO: OnDemandSpecializationsV1.primary can return `null`
    s12n: OnDemandSpecializationsV1.primary(userId, courseId, {}),
  })),
  Naptime.createContainer<PropsFromNaptime3, PropsFromNaptime2>(
    ({ courseId, choiceType, course, requestCountryCode }) => {
      const { s12nIds } = course;
      const courseOptions = {
        courseId,
        requestCountryCode,
      };
      const SpecializationOptions = {
        onDemandSpecializationId: s12nIds,
        requestCountryCode,
      };
      const mapChoiceTypeToOptions = {
        [BULKPAY_FULL_SPECIALIZATION]: SpecializationOptions,
        [BULKPAY_REMAINING_SPECIALIZATION_COURSES]: SpecializationOptions,
        [PURCHASE_SINGLE_COURSE]: courseOptions,
      };
      const options = mapChoiceTypeToOptions[choiceType as keyof typeof mapChoiceTypeToOptions];
      return {
        ...(options && {
          productPrice: ProductPricesV3.deduceProductTypeAndGetProductPrice(options),
          productPrices: ProductPricesV3.deduceProductTypeAndGetProductPrices(options),
        }),
      };
    }
  ),
  mapProps<PropsToComponent, PropsToComponent & { productPrices: ProductPricesV3[] }>(
    ({ productPrice, productPrices, ...rest }) => {
      if (!Array.isArray(productPrices)) {
        return { productPrice, ...rest };
      }
      if (!isEqual(productPrice, productPrices[0])) {
        logger.error(
          'Got different prices from get and byProductIds',
          JSON.stringify(productPrice),
          JSON.stringify(productPrices[0])
        );
        if (getShouldLoadRaven()) {
          raven.captureException(new Error('Got different prices from get and byProductIds'));
        }
      }
      return {
        productPrice: epic.get('payments', 'getPriceByProductId') ? productPrices[0] : productPrice,
        ...rest,
      };
    }
  ),
  withPromotionInfo()
)(CourseEnrollChoiceDescriptionWithCatalogSubscriptions);

hoistNonReactStatics(CourseEnrollChoiceDescriptionNaptimeContainer, CourseEnrollChoiceDescription);
export default CourseEnrollChoiceDescriptionNaptimeContainer;
