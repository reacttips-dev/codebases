/* @jsx jsx */
import React, { useState } from 'react';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { jsx } from '@emotion/react';
import { compose, withProps } from 'recompose';
import { breakPoint, SvgButton } from '@coursera/coursera-ui';
import { SvgArrowLeft } from '@coursera/coursera-ui/svg';
import { FormattedMessage } from 'js/lib/coursera.react-intl';
import logger from 'js/app/loggerSingleton';

import LoadingIcon from 'bundles/courseraLoadingIcon/LoadingIcon';
import EnrollErrorModal from 'bundles/enroll/components/common/EnrollErrorModal';
import PromotionApplicableCheckoutMessage from 'bundles/enroll/components/common/PromotionApplicableCheckoutMessage';
import SubscriptionFooter from 'bundles/enroll/components/subscriptions/SubscriptionFooter';
import Modal from 'bundles/phoenix/components/Modal';
import CSSTransitionGroup from 'react-transition-group/CSSTransitionGroup';
import S12nPaymentMethod from 'bundles/s12n-enroll/components/non-recurring/S12nPaymentMethod';
import NonRecurringChoices from 'bundles/s12n-enroll/components/non-recurring/NonRecurringChoices';

import { withEnrollment } from 'bundles/enroll/components/xdp/withNaptimeData';
import type { PropsFromWithEnrollment } from 'bundles/enroll/components/xdp/withNaptimeData';
import type { ApiError } from 'bundles/enroll/utils/errorUtils';
import EnrollmentChoiceTypes from 'bundles/enroll-course/common/EnrollmentChoiceTypes';
import {
  choiceTypeToHandleSubmitPromise,
  submitEnrollmentPromise,
  /* @ts-ignore ts-migrate(7016) FIXME: Untyped import */
} from 'bundles/enroll-course/lib/enrollmentChoiceUtils';
// @ts-ignore ts-migrate(7016) FIXME: Could not find a declaration file for module 'bund... Remove this comment to see the full error message
import type EnrollmentAvailableChoicesV1 from 'bundles/naptimejs/resources/enrollmentAvailableChoices.v1';
import type PromotionEligibilitiesV1 from 'bundles/naptimejs/resources/promotionEligibilities.v1';
import type { PropsFromWithPromotionInfo } from 'bundles/promotions/components/withPromotionInfo';
import withPromotionInfo from 'bundles/promotions/components/withPromotionInfo';
import { getS12nMonthlySkuId } from 'bundles/s12n-common/utils/subscriptionPriceUtils';
import {
  withS12nPrepaidPrice,
  withS12nSubscriptionPrice,
} from 'bundles/s12n-enroll/components/non-recurring/withS12nPrice';
import type {
  PropsFromWithS12nPrepaidPrice,
  PropsFromWithS12nSubscriptionPrice,
} from 'bundles/s12n-enroll/components/non-recurring/withS12nPrice';
import { withS12nProductInfo } from 'bundles/s12n-enroll/components/non-recurring/withS12nProductInfo';
import type { PropsFromWithS12nProductInfo } from 'bundles/s12n-enroll/components/non-recurring/withS12nProductInfo';
import type { PrepaidOptionProp } from 'bundles/s12n-enroll/components/non-recurring/NonRecurringChoices';
import ReactPriceDisplay from 'bundles/payments-common/components/ReactPriceDisplay';
import { getHoursPerWeekFromCourses, getTotalMonthsFromCourses } from 'bundles/xdp/utils/xdpUtils';

import type { SDPPageQuery_XdpV1Resource_slug_elements_xdpMetadata_XdpV1_sdpMetadataMember_sdpMetadata_courses as Course } from 'bundles/xdp/components/__generated__/SDPPageQuery';

import _t from 'i18n!nls/s12n-enroll';

const MODAL_TYPES = {
  PAYMENT_METHOD: 'PAYMENT_METHOD',
  NON_RECURRING_CHOICES: 'NON_RECURRING_CHOICES',
  ERROR: 'ERROR',
};

type PropsFromCaller = {
  s12nId: string;
  onSdp: boolean;
  courseIdOverride?: string;
  isFromS12nSelection?: boolean;
  onClose?: () => void;
};

type PropsFromWithProps = {
  isSpecialization: boolean;
  courseId?: string;
};

type PropsToComponent = PropsFromCaller &
  PropsFromWithProps &
  PropsFromWithPromotionInfo &
  PropsFromWithEnrollment &
  PropsFromWithS12nProductInfo &
  PropsFromWithS12nPrepaidPrice &
  PropsFromWithS12nSubscriptionPrice;

const styles: Record<string, CSSProperties> = {
  s12nEnrollModal: {
    '.c-modal-content': {
      padding: '0 !important',
      [`@media (max-width: 767px)`]: {
        maxWidth: '100% !important',
        width: '100% !important',
        top: '0 !important',
      },
    },
    '.c-modal-x-out a': {
      color: '#fafafa !important',
    },
  },
  titleContainer: {
    padding: '40px 32px 32px',
    background: '#08274e',
  },
  title: {
    fontFamily: 'OpenSans',
    color: '#fff',
    fontSize: '24px',
    lineHeight: '30px',
    textAlign: 'center',
    [`@media (max-width: ${breakPoint.md - 1}px)`]: {
      textAlign: 'left',
    },
  },
  modalContent: {
    padding: '30px 0 0 0',
  },
  paymentMethodContent: {
    padding: '0 50px 30px',
    [`@media (max-width: ${breakPoint.md - 1}px)`]: {
      padding: '0 30px 30px',
    },
  },
  paymentTitle: {
    fontFamily: 'OpenSans',
    fontWeight: 700,
    fontSize: '20px',
    lineHeight: '24px',
    marginBottom: '18px',
  },
  valuePropsTitle: {
    display: 'block',
    fontSize: '14px',
    marginBottom: '8px',
  },
  valueProps: {
    paddingLeft: '20px',
    marginBottom: '25px',
  },
  valueProp: {
    marginBottom: '8px',
  },
  paymentMethodContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    [`@media (max-width: ${breakPoint.md - 1}px)`]: {
      flexDirection: 'column',

      ':nth-of-type(n) > div:first-of-type': {
        marginBottom: '40px',
      },
    },
    '.rc-PromotionApplicableCheckoutMessage': {
      lineHeight: '21px !important',
      marginBottom: '16px',
    },
  },
  gradientFooter: {
    height: '80px',
    position: 'sticky',
    width: '100%',
    bottom: 0,
    left: 0,
    background: 'linear-gradient(rgba(255,255,255,0),rgba(255,255,255,1) 70%)',
    [`@media (min-width: ${breakPoint.md}px)`]: {
      display: 'none',
    },
  },
  goBackButton: {
    padding: '0 50px',
    minHeight: '24px',
    marginBottom: '25px',
    [`@media (max-width: ${breakPoint.md - 1}px)`]: {
      padding: '0 30px',
    },
  },
  auditFooter: {
    width: '300px',
    margin: '16px auto 0',
  },
};

const handleClose = (onClose?: () => void) => {
  if (onClose) {
    onClose();
  }
};

const handleContinue = (
  setIsEnrolling: (isEnrolling: boolean) => void,
  setEnrollmentError: (error: ApiError | undefined) => void,
  setActiveModal: (modalType: string) => void,
  enrollmentAvailableChoices: EnrollmentAvailableChoicesV1,
  enrollmentChoice: keyof typeof EnrollmentChoiceTypes,
  s12nId: string,
  courseId?: string,
  additionalData?: { paymentPassOption: PrepaidOptionProp },
  promotionEligibilities?: PromotionEligibilitiesV1 | null
) => {
  setIsEnrolling(true);
  setEnrollmentError(undefined);

  const data = {
    s12nId,
    ...additionalData,
  };

  const productSkuId = getS12nMonthlySkuId(enrollmentAvailableChoices, s12nId);

  // Promotion only applies to s12n subscription checkout and is only passed in that `handleContinue`
  // TODO - update once we support promotions for s12n prepaid
  const promoCode = promotionEligibilities?.isEligible ? promotionEligibilities.promoCodeId : undefined;

  const options = {
    productSkuId,
    courseId,
    s12nId,
    data,
  };

  const handleSubmitPromise = choiceTypeToHandleSubmitPromise[enrollmentChoice];
  submitEnrollmentPromise({ handleSubmitPromise, options, promoCode }).catch((error: ApiError) => {
    setEnrollmentError(error);
    setActiveModal(MODAL_TYPES.ERROR);
  });
};

const renderModalBody = (
  onSdp: boolean,
  numOfCourses: number,
  product: string,
  productName: string,
  s12nName: string,
  partnerName: string
) => {
  return (
    <React.Fragment>
      <p>
        {onSdp
          ? _t('#{productName} is a #{numOfCourses}-course #{product}.', { productName, numOfCourses, product })
          : _t('#{productName} is part of the #{s12nName} certificate.', { productName, s12nName })}
      </p>

      <div>
        <strong css={styles.valuePropsTitle}>{_t('This #{product} includes:', { product })}</strong>
        <ul css={styles.valueProps}>
          <li>
            <p css={styles.valueProp}>{_t('Unlimited access to all #{numOfCourses} courses', { numOfCourses })}</p>
          </li>
          <li>
            <p>{_t('Shareable certificate of completion from #{partnerName}', { partnerName })}</p>
          </li>
        </ul>
      </div>
    </React.Fragment>
  );
};

const renderModalContent = (
  activeModal: string,
  setActiveModal: React.Dispatch<React.SetStateAction<string>>,
  isEnrolling: boolean,
  setIsEnrolling: React.Dispatch<React.SetStateAction<boolean>>,
  setEnrollmentError: React.Dispatch<React.SetStateAction<ApiError | undefined>>,
  enrollmentAvailableChoices: EnrollmentAvailableChoicesV1,
  onSdp: boolean,
  numOfCourses: number,
  courses: Array<Course>,
  product: string,
  productName: string,
  s12nName: string,
  partnerName: string,
  prepaidPriceText: JSX.Element | null,
  subscriptionPriceText: JSX.Element,
  hasFreeTrial: boolean,
  prepaidEnrollmentData: {
    enrollmentChoiceData: {
      definition: {
        availablePrepaid: Array<PrepaidOptionProp>;
      };
    };
  },
  s12nId: string,
  courseId?: string,
  promotionEligibilities?: PromotionEligibilitiesV1 | null
) => {
  const numOfHoursPerWeek = getHoursPerWeekFromCourses(courses);
  const numOfMonths = getTotalMonthsFromCourses(courses);

  switch (activeModal) {
    case MODAL_TYPES.PAYMENT_METHOD: {
      if (!prepaidPriceText) {
        return <LoadingIcon />;
      }

      return (
        <React.Fragment>
          <div css={styles.paymentMethodContent}>
            {renderModalBody(onSdp, numOfCourses, product, productName, s12nName, partnerName)}
            <h3 css={styles.paymentTitle}>{_t('Choose your enrollment method')}</h3>
            <div css={styles.paymentMethodContainer}>
              <S12nPaymentMethod
                data-test="NonRecurringPayment"
                title={_t('One-time payment')}
                description={
                  <FormattedMessage
                    message={_t('Plans starting from {priceText}. Does not automatically renew.')}
                    priceText={prepaidPriceText}
                  />
                }
                valueProps={[_t('EMI Available'), _t('14 day refund period')]}
                onButtonClick={() => setActiveModal(MODAL_TYPES.NON_RECURRING_CHOICES)}
                isEnrolling={isEnrolling}
                hideLoader={true}
              />
              <S12nPaymentMethod
                data-test="SubscriptionPayment"
                title={_t('Monthly Subscription')}
                description={
                  <FormattedMessage
                    message={_t('Pay {priceText} per month, charged automatically every month.')}
                    priceText={subscriptionPriceText}
                  />
                }
                valueProps={[
                  ...(hasFreeTrial && !promotionEligibilities?.isEligible ? [_t('7-day free trial')] : []),
                  _t('Cancel anytime'),
                ]}
                onButtonClick={() =>
                  handleContinue(
                    setIsEnrolling,
                    setEnrollmentError,
                    setActiveModal,
                    enrollmentAvailableChoices,
                    EnrollmentChoiceTypes.ENROLL_THROUGH_S12N_SUBSCRIPTION_TRIAL,
                    s12nId,
                    courseId,
                    undefined,
                    promotionEligibilities
                  )
                }
                additionalMessage={<PromotionApplicableCheckoutMessage s12nId={s12nId} />}
                isEnrolling={isEnrolling}
              />
            </div>
            {!onSdp && courseId && (
              <SubscriptionFooter
                courseId={courseId as string}
                canAuditCourse={enrollmentAvailableChoices?.canAuditCourse}
                disableAuditOption={false}
              />
            )}
          </div>
          <div css={styles.gradientFooter} />
        </React.Fragment>
      );
    }
    case MODAL_TYPES.NON_RECURRING_CHOICES:
      return (
        <React.Fragment>
          <SvgButton
            type="icon"
            svgElement={
              <SvgArrowLeft
                style={{
                  width: '24px',
                  height: '24px',
                }}
              />
            }
            onClick={() => setActiveModal(MODAL_TYPES.PAYMENT_METHOD)}
            css={styles.goBackButton}
          />
          <NonRecurringChoices
            numOfCourses={numOfCourses}
            numOfHoursPerWeek={numOfHoursPerWeek}
            numOfMonths={numOfMonths}
            prepaidEnrollmentData={prepaidEnrollmentData}
            enrollmentAvailableChoices={enrollmentAvailableChoices}
            onButtonClick={(paymentPassOption) =>
              handleContinue(
                setIsEnrolling,
                setEnrollmentError,
                setActiveModal,
                enrollmentAvailableChoices,
                EnrollmentChoiceTypes.ENROLL_THROUGH_S12N_PREPAID,
                s12nId,
                courseId,
                {
                  paymentPassOption,
                }
              )
            }
            isEnrolling={isEnrolling}
          />
        </React.Fragment>
      );
    case MODAL_TYPES.ERROR:
    default:
      logger.error('Unable to render enroll modal content');
      return null;
  }
};

export const S12nPaymentMethodEnrollModal: React.FunctionComponent<PropsToComponent> = ({
  enrollmentAvailableChoices,
  s12nName,
  s12nId,
  courseId,
  onClose,
  productName,
  product,
  numOfCourses,
  courses,
  partnerName,
  s12nPrepaidPrice,
  s12nSubscriptionPrice,
  onSdp,
  promotionEligibilities,
}) => {
  const [activeModal, setActiveModal] = useState(MODAL_TYPES.PAYMENT_METHOD);
  const [isEnrolling, setIsEnrolling] = useState(false);
  const [enrollmentError, setEnrollmentError] = useState<ApiError | undefined>(undefined);

  const hasFreeTrial = enrollmentAvailableChoices?.canEnrollThroughS12nSubscriptionFreeTrial ?? false;
  const prepaidEnrollmentData = enrollmentAvailableChoices.getS12nPrepaidEnrollmentData();

  if (!prepaidEnrollmentData) {
    logger.error('Unable to render enroll modal content');
    return null;
  }

  const prepaidPriceText = s12nPrepaidPrice ? (
    <ReactPriceDisplay value={s12nPrepaidPrice.amount} currency={s12nPrepaidPrice.currencyCode} />
  ) : null;
  const subscriptionPriceText = (
    <ReactPriceDisplay value={s12nSubscriptionPrice.amount} currency={s12nSubscriptionPrice.currencyCode} />
  );

  if (activeModal === MODAL_TYPES.ERROR) {
    return <EnrollErrorModal error={enrollmentError} onClose={() => handleClose(onClose)} isFinancialAid={false} />;
  } else {
    return (
      <div data-test="rc-S12nPaymentMethodEnrollModal" css={styles.s12nEnrollModal}>
        <CSSTransitionGroup transitionName="fade" transitionEnter={false} transitionLeaveTimeout={300}>
          <Modal
            trackingName="s12n_payment_method_enroll_modal"
            data={{ id: s12nId }}
            key="S12nPaymentMethodEnrollModal"
            modalName={_t('Join this #{product}', { product })}
            handleClose={() => handleClose(onClose)}
            allowClose={true}
          >
            <div css={styles.titleContainer}>
              <h2 css={styles.title}>
                {_t('Enroll in this #{numOfCourses}-course #{product}', { numOfCourses, product })}
              </h2>
            </div>
            <div css={styles.modalContent}>
              {renderModalContent(
                activeModal,
                setActiveModal,
                isEnrolling,
                setIsEnrolling,
                setEnrollmentError,
                enrollmentAvailableChoices,
                onSdp,
                numOfCourses,
                courses,
                product,
                productName,
                s12nName,
                partnerName,
                prepaidPriceText,
                subscriptionPriceText,
                hasFreeTrial,
                prepaidEnrollmentData,
                s12nId,
                courseId,
                promotionEligibilities
              )}
            </div>
          </Modal>
        </CSSTransitionGroup>
      </div>
    );
  }
};

export default compose<PropsToComponent, PropsFromCaller>(
  // These `isSpecialization` and `courseId` props are needed in `withEnrollment`
  withProps<PropsFromWithProps, PropsFromCaller>(({ courseIdOverride, onSdp }) => ({
    isSpecialization: onSdp,
    courseId: courseIdOverride,
  })),
  withPromotionInfo<PropsFromCaller & PropsFromWithProps>(),
  withEnrollment<PropsFromCaller & PropsFromWithProps>(),
  withS12nProductInfo<PropsFromCaller>(),
  withS12nPrepaidPrice<PropsFromCaller & PropsFromWithEnrollment>(),
  withS12nSubscriptionPrice<PropsFromCaller>()
)(S12nPaymentMethodEnrollModal);
