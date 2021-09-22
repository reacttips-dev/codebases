/* @jsx jsx */
import React, { useState } from 'react';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { jsx } from '@emotion/react';
import { compose, withProps } from 'recompose';
import { breakPoint } from '@coursera/coursera-ui';
import { SvgCheckV2 } from '@coursera/coursera-ui/svg';
import logger from 'js/app/loggerSingleton';

import { withEnrollment } from 'bundles/enroll/components/xdp/withNaptimeData';
import type { PropsFromWithEnrollment } from 'bundles/enroll/components/xdp/withNaptimeData';
import EnrollmentChoiceTypes from 'bundles/enroll-course/common/EnrollmentChoiceTypes';
import {
  choiceTypeToHandleSubmitPromise,
  submitEnrollmentPromise,
  /* @ts-ignore ts-migrate(7016) FIXME: Untyped import */
} from 'bundles/enroll-course/lib/enrollmentChoiceUtils';
// @ts-ignore ts-migrate(7016) FIXME: Could not find a declaration file for module 'bund... Remove this comment to see the full error message
import type EnrollmentAvailableChoicesV1 from 'bundles/naptimejs/resources/enrollmentAvailableChoices.v1';
import { withS12nProductInfo } from 'bundles/s12n-enroll/components/non-recurring/withS12nProductInfo';
import type { PropsFromWithS12nProductInfo } from 'bundles/s12n-enroll/components/non-recurring/withS12nProductInfo';
import type { PrepaidOptionProp } from 'bundles/s12n-enroll/components/non-recurring/NonRecurringChoices';
import { getHoursPerWeekFromCourses, getTotalMonthsFromCourses } from 'bundles/xdp/utils/xdpUtils';

import EnrollErrorModal from 'bundles/enroll/components/common/EnrollErrorModal';
import SubscriptionFooter from 'bundles/enroll/components/subscriptions/SubscriptionFooter';
import type { ApiError } from 'bundles/enroll/utils/errorUtils';
import Modal from 'bundles/phoenix/components/Modal';
import CSSTransitionGroup from 'react-transition-group/CSSTransitionGroup';
import NonRecurringChoices from 'bundles/s12n-enroll/components/non-recurring/NonRecurringChoices';

import _t from 'i18n!nls/s12n-enroll';

const MODAL_TYPES = {
  ENROLL: 'ENROLL',
  ERROR: 'ERROR',
};

type PropsFromWithProps = {
  isSpecialization: boolean;
  courseId?: string;
};

type PropsFromCaller = {
  s12nId: string;
  onSdp: boolean;
  courseIdOverride?: string;
  isFromS12nSelection?: boolean;
  onClose?: () => void;
};

type PropsToComponent = PropsFromCaller & PropsFromWithProps & PropsFromWithS12nProductInfo & PropsFromWithEnrollment;

const styles: Record<string, CSSProperties> = {
  nonRecurringEnrollModal: {
    '.c-modal-content': {
      padding: '0 !important',
      height: '75% !important',
      // Set max height to 650 to give users notice of more content to scroll down towards
      maxHeight: '650px !important',
      [`@media (max-width: 767px)`]: {
        maxWidth: '100% !important',
        width: '100% !important',
        top: '0 !important',
        maxHeight: 'initial !important',
        height: '100% !important',
      },
    },
    '.c-modal-x-out a': {
      color: '#fafafa !important',
    },
  },
  modalContent: {
    padding: '30px 0 0 0',
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
  modalBodyContainer: {
    padding: '0 50px',
    [`@media (max-width: ${breakPoint.md - 1}px)`]: {
      padding: '0 30px',
    },
  },
  valuePropsTitle: {
    display: 'block',
    fontSize: '14px',
    marginBottom: '14px',
  },
  valueProps: {
    listStyle: 'none',
    paddingLeft: '0',
    marginBottom: '25px',
    display: 'flex',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    [`@media (max-width: ${breakPoint.md - 1}px)`]: {
      marginBottom: '10px',
    },
  },
  valueProp: {
    width: '48%',
    marginBottom: '4px',
    display: 'flex',
    [`@media (max-width: ${breakPoint.md - 1}px)`]: {
      width: '100%',
    },
  },
  auditFooter: {
    width: '300px',
    margin: '16px auto 0',
  },
};

const getValueProps = (numOfCourses: number, partnerName: string) => [
  _t('Unlimited access to all #{numOfCourses} courses', { numOfCourses }),
  _t('EMI payment options'),
  _t('Shareable certificate of completion from #{partnerName}', { partnerName }),
  _t('14 day refund period'),
];

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
  additionalData?: { paymentPassOption: PrepaidOptionProp }
) => {
  setIsEnrolling(true);
  setEnrollmentError(undefined);

  const data = {
    s12nId,
    ...additionalData,
  };

  // TODO - update once we support promotions for s12n prepaid
  const promoCode = undefined;

  // productSkuId is not needed because this modal only shows prepaid, not subscription
  const options = {
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
  const valueProps = getValueProps(numOfCourses, partnerName);

  return (
    <div css={styles.modalBodyContainer}>
      <p>
        {onSdp
          ? _t('#{productName} is a #{numOfCourses}-course #{product}.', { productName, numOfCourses, product })
          : _t('#{productName} is part of the #{s12nName} certificate.', { productName, s12nName })}
      </p>

      <div>
        <strong css={styles.valuePropsTitle}>{_t('This #{product} includes:', { product })}</strong>
        <ul css={styles.valueProps}>
          {valueProps.map((valueProp) => (
            <li data-test="valueProp" key={valueProp} css={styles.valueProp}>
              <SvgCheckV2
                suppressTitle
                style={{
                  minWidth: '18px',
                  height: '14px',
                  marginRight: '14px',
                  marginTop: '5px',
                  fill: '#2A73CC',
                }}
              />
              <p>{valueProp}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export const NonRecurringEnrollModal: React.FunctionComponent<PropsToComponent> = ({
  productName,
  product,
  s12nName,
  partnerName,
  numOfCourses,
  courses,
  onSdp,
  s12nId,
  courseId,
  onClose,
  enrollmentAvailableChoices,
}) => {
  const [activeModal, setActiveModal] = useState(MODAL_TYPES.ENROLL);
  const [isEnrolling, setIsEnrolling] = useState(false);
  const [enrollmentError, setEnrollmentError] = useState<ApiError | undefined>(undefined);

  const numOfHoursPerWeek = getHoursPerWeekFromCourses(courses);
  const numOfMonths = getTotalMonthsFromCourses(courses);
  const prepaidEnrollmentData = enrollmentAvailableChoices.getS12nPrepaidEnrollmentData();

  const canAuditCourse = !onSdp && courseId;
  const auditComponent = canAuditCourse ? (
    <div css={styles.auditFooter}>
      <SubscriptionFooter
        courseId={courseId as string}
        canAuditCourse={enrollmentAvailableChoices?.canAuditCourse}
        disableAuditOption={false}
        removeStyles
      />
    </div>
  ) : undefined;

  if (!prepaidEnrollmentData) {
    logger.error('Unable to render enroll modal content');
    return null;
  }

  switch (activeModal) {
    case MODAL_TYPES.ENROLL:
      return (
        <div data-test="rc-NonRecurringEnrollModal" css={styles.nonRecurringEnrollModal}>
          <CSSTransitionGroup transitionName="fade" transitionEnter={false} transitionLeaveTimeout={300}>
            <Modal
              trackingName="s12n_payment_method_enroll_modal"
              data={{ id: s12nId }}
              key="NonRecurringEnrollModal"
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
                {renderModalBody(onSdp, numOfCourses, product, productName, s12nName, partnerName)}
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
                  auditComponent={auditComponent}
                />
              </div>
            </Modal>
          </CSSTransitionGroup>
        </div>
      );
    case MODAL_TYPES.ERROR:
      return <EnrollErrorModal error={enrollmentError} onClose={() => handleClose(onClose)} isFinancialAid={false} />;
    default:
      logger.error('Unable to render NonRecurringEnrollModal');
      return null;
  }
};

export default compose<PropsToComponent, PropsFromCaller>(
  // These `isSpecialization` and `courseId` props are needed in `withEnrollment`
  withProps<PropsFromWithProps, PropsFromCaller>(({ courseIdOverride, onSdp }) => ({
    isSpecialization: onSdp,
    courseId: courseIdOverride,
  })),
  withEnrollment<PropsFromCaller & PropsFromWithProps>(),
  withS12nProductInfo<PropsFromCaller>()
)(NonRecurringEnrollModal);
