import {
  Button,
  Heading,
  Loading,
  Select,
  Space,
  Text,
} from '@udacity/veritas-components';
import React, { useCallback, useMemo, useState } from 'react';
import { CANCEL_SURVEY } from 'constants/cancel-survey';
import CancelQuestion from './_cancel-question';
import ClockImage from 'images/settings/cancel/clock.svg';
import MapFlagImage from 'images/settings/map-flag.png';
import MessageImage from 'images/settings/cancel/message.svg';
import NanodegreeImage from 'images/settings/cancel/nanodegree.svg';
import PaymentsHelper from 'helpers/payments-helper';
import PropTypes from 'prop-types';
import { TYPES } from 'constants/survey';
import TagsImage from 'images/settings/cancel/tags.svg';
import { __ } from 'services/localization-service';
import styles from './_assisted-cancel-followup.scss';

//TODO: localize these
const LOCALIZED = {
  HEADER: "We're Here to Help!",
  TO_CHANGE: 'To change or cancel, please talk to an Enrollment Advisor.',
  CHAT_CTA: 'Chat with Us',
  REQUESTED: 'Request Sent',
  AT_UDACITY:
    'At Udacity, we provide you with the fastest, most flexible way to upgrade and expand your technology and business skills. Udacity Nanodegree programs represent collaborations with our industry partners who help us develop our content.',
  CONTACT_BY_EMAIL:
    'If you cannot connect with us by phone, please email keeplearning@udacity.com for an Enrollment Advisor who can process your request and assist you with other matters.',
  CONTACT_BY_CHAT:
    'If you cannot connect with us by phone, <span class="linkify">click here</span> to chat with an Enrollment Advisor who can process your request and assist you with other matters.',
  ERROR_HEADER: 'An unexpected error occurred',
  ERROR_MESSAGE: 'Please refresh the page and try again.',
  SUBSCRIPTION_CANCELLED_MESSAGE: 'Your Cancellation Confirmation',
  CATALOG_MESSAGE_REFUNDABLE:
    "We've cancelled your enrollment in this program. Check out our catalog to find the right Nanodegree program for you.",
  CATALOG_MESSAGE:
    "We've cancelled your enrollment in this program effective <%= periodEndDate %>. Check out our catalog to find the right Nanodegree program for you.",
  COUPON_CREATE_ERROR_HEADER: 'Unable To Generate Coupon',
  COUPON_CREATE_ERROR_BODY:
    'Please contact support at keeplearning@udacity.com for additional assistance.',
  REQUEST_CANCELLATION: 'Request Cancellation',
  CONTINUE_CANCELLATION: 'Continue Cancellation',
  ACCEPT_OFFER: 'Accept Offer',
  LOADING: 'Loading',
  LEAVING_HEADER: "We're sorry to see you go!",
  KEEP_LEARNING_PRICE: 'Keep learning for less',
  KEEP_LEARING_TIME: 'Need more time?',
  WE_WANT_TO_HELP: 'We want to help keep your learning on track!',
  DISCOUNT_PRICE_SUFFIX: 'on your subscription',
  DISCOUNT_PRICE_SUFFIX_NEXT_CYCLE:
    'Your discount will be applied to all future payments.',
  DISCOUNT_PRICE_SUFFIX_PARTIAL_REFUND:
    'You will receive a refund of <%= refundedDisplayAmount %> for the current month.',
  CANCEL_REASON_BODY:
    'Your feedback is valuable to helping us improve our programs. Once you complete the survey, your subscription will be cancelled effective: <%= periodEndDate %>',
  CANCEL_REASON_BODY_REFUNDABLE:
    'Your feedback is valuable to helping us improve our programs. Canceling your subscription will result in loss of access immediately. Your refund will be posted to your billing history.',
  BACK: 'Back',
  SEARCH_CATALOG: 'Search Catalog',
  CLOSE: 'Close',
  NEXT_PAYMENT: 'Next payment: ',
  ORIGINAL_PRICE: 'Original price: ',
  THIS_FAR: "But you've made it this far!",
  FINISH_LINE: 'Get to the finish line!',
  SWITCH_PROGRAMS: 'Switch programs',
  SWITCH_PROGRAMS_TITLE: 'Switch to a new Nanodegree Program',
  SWITCH_PROGRAMS_PROMPT:
    'Which Nanodegree Program you would like to switch into? This will end your current enrollment in <%= title %>.',
  SWITCH_PROGRAMS_SELECT_LABEL: 'Nanodegree Programs',
  SWITCH_PROGRAMS_SUCCESS: 'We are transferring your program!',
  SWITCH_PROGRAMS_WAIT_FOR_SETUP:
    'Wait just a moment and we will redirect you to <%= title %>...',
  CANNOT_SWITCH_PROGRAMS_TITLE:
    'We have cancelled your enrollment in <%= title %>',
  CANNOT_SWITCH_PROGRAMS_EXPLANATION:
    'Continue to our overview page for <%= title %> to enroll in your new Nanodegree Program.',
  ENROLL: 'Enroll',
  REQUIREMENTS:
    'Note: For information or requirements for switching your Nanodegree Program, <%= link %>.',
  UNAVAILABLE_SWITCH:
    'This program is unavailable for switching. Please cancel your enrollment in <%= title %> before signing up.',
};

export function CancelByChat(props) {
  const [chatRequested, setChatRequested] = useState(false);

  const handleButtonClick = () => {
    setChatRequested(true);
    props.handleChat();
  };

  return (
    <div>
      <Heading size="h3" align="center">
        {__(LOCALIZED.HEADER)}
      </Heading>
      <div className={styles.body}>
        <div className={styles['image-container']}>
          <img src={MessageImage} alt="text messaging app" />
        </div>
        <div className={styles.secondary}>
          <Text>{__(LOCALIZED.TO_CHANGE)}</Text>
        </div>
      </div>
      <div className={styles['button-container']}>
        <div className={styles.center} id={props.chatId}>
          <Button
            full
            disabled={chatRequested}
            label={__(chatRequested ? LOCALIZED.REQUESTED : LOCALIZED.CHAT_CTA)}
            onClick={handleButtonClick}
            variant="primary"
          />
        </div>
      </div>
    </div>
  );
}

CancelByChat.propTypes = {
  chatId: PropTypes.string.isRequired,
  handleChat: PropTypes.func.isRequired,
};

export function CancelError() {
  return (
    <div>
      <Heading size="h3" align="center">
        {__(LOCALIZED.ERROR_HEADER)}
      </Heading>
      <div className={styles.body}>{__(LOCALIZED.ERROR_MESSAGE)}</div>
    </div>
  );
}

export function CancelSurveyDiscountQuestions(props) {
  const [cancelReasonKey, setCancelReasonKey] = useState(CANCEL_SURVEY.COST);
  const [otherText, setOtherText] = useState('');
  const [radioSelection, setRadioSelection] = useState(
    CANCEL_SURVEY.getReasonsShortVariation().find(
      (option) => option.key === CANCEL_SURVEY.COST
    ).raw
  );

  const handleOtherReasonChange = (otherText) => {
    setOtherText(otherText);
    setRadioSelection(CANCEL_SURVEY.OTHER);
    // set cancel reason key and message in parent component
    props.handleCancelReasonChange(CANCEL_SURVEY.OTHER, otherText);
  };

  const handleReasonChange = async (reason) => {
    const radioSelection = _.get(reason, 'raw');
    const cancelReasonKey = _.get(reason, 'key');

    setCancelReasonKey(cancelReasonKey);
    setRadioSelection(radioSelection);

    // set cancel reason key and message in parent component
    props.handleCancelReasonChange(cancelReasonKey, radioSelection);
  };

  const {
    periodEndDate,
    handleContinueCancellation,
    handleSwitchPrograms,
    checkOfferEligibilityInFlight,
    handleModalClose,
    cancelInFlight,
    isLoading,
    isRefundable,
  } = props;

  const cancelReasonBody = isRefundable
    ? __(LOCALIZED.CANCEL_REASON_BODY_REFUNDABLE)
    : __(LOCALIZED.CANCEL_REASON_BODY, { periodEndDate });

  return (
    <Loading
      label={__(LOCALIZED.LOADING)}
      busy={checkOfferEligibilityInFlight || isLoading}
    >
      <CancelQuestion
        heading={
          <Heading size="h3" align="center">
            {__(LOCALIZED.LEAVING_HEADER)}
          </Heading>
        }
        question={cancelReasonBody}
        reasons={CANCEL_SURVEY.getReasonsShortVariation()}
        type={TYPES.RADIO}
        onReasonChange={handleReasonChange}
        radioSelection={radioSelection}
        value={radioSelection}
        hasOtherOption
        onOtherTextChange={handleOtherReasonChange}
        otherText={otherText}
      />
      <div className={styles['button-container-right']}>
        {cancelReasonKey === CANCEL_SURVEY.FIT ? (
          <React.Fragment>
            <Space size="2x" type="inline">
              <Button
                label={__(LOCALIZED.BACK)}
                variant="minimal"
                onClick={handleModalClose}
              />
            </Space>
            <Button
              label={__(LOCALIZED.SWITCH_PROGRAMS)}
              variant="primary"
              onClick={handleSwitchPrograms}
            />
          </React.Fragment>
        ) : (
          <React.Fragment>
            {!cancelInFlight && (
              <Space size="2x" type="inline">
                <Button
                  label={__(LOCALIZED.CONTINUE_CANCELLATION)}
                  variant="minimal"
                  onClick={() =>
                    handleContinueCancellation(cancelReasonKey, radioSelection)
                  }
                />
              </Space>
            )}
            <Button
              label={__(LOCALIZED.BACK)}
              variant="primary"
              onClick={handleModalClose}
            />
          </React.Fragment>
        )}
      </div>
    </Loading>
  );
}

CancelSurveyDiscountQuestions.propTypes = {
  periodEndDate: PropTypes.string.isRequired,
  handleContinueCancellation: PropTypes.func.isRequired,
  handleSwitchPrograms: PropTypes.func.isRequired,
  handleCancelReasonChange: PropTypes.func.isRequired,
  handleModalClose: PropTypes.func.isRequired,
  checkOfferEligibilityInFlight: PropTypes.bool.isRequired,
  cancelInFlight: PropTypes.bool.isRequired,
  isLoading: PropTypes.bool.isRequired,
  isRefundable: PropTypes.bool.isRequired,
};

export function CancelDiscountOffer(props) {
  const {
    handleAbandonDiscountOffer,
    handleGenerateDiscountCoupon,
    refundedDisplayAmount,
    subtotalDisplayAmount,
    generateCouponInFlight,
    cancelReasonKey,
    cancelInFlight,
    isLoading,
    originalPrice,
    declinedOffer,
  } = props;

  const priceStyle = !declinedOffer
    ? 'discount-text-price'
    : 'discount-text-price-contrast';
  const subheading = !declinedOffer
    ? __(LOCALIZED.WE_WANT_TO_HELP)
    : __(LOCALIZED.FINISH_LINE);
  let heading = '';
  let image = '';
  switch (cancelReasonKey) {
    case CANCEL_SURVEY.COST:
      if (!declinedOffer) {
        heading = __(LOCALIZED.KEEP_LEARNING_PRICE);
        image = <img src={TagsImage} alt="tags" />;
        break;
      } else {
        heading = __(LOCALIZED.THIS_FAR);
        image = <img src={MapFlagImage} alt="" />;
        break;
      }
    case CANCEL_SURVEY.OTHER:
    case CANCEL_SURVEY.TIME:
    default:
      heading = __(LOCALIZED.KEEP_LEARING_TIME);
      image = <img src={ClockImage} alt="clock" />;
      break;
  }
  let discount_price_details = (
    <div className={styles['discount-text-details']}>
      {!_.isEmpty(refundedDisplayAmount)
        ? __(LOCALIZED.DISCOUNT_PRICE_SUFFIX_PARTIAL_REFUND, {
            refundedDisplayAmount: PaymentsHelper.getDisplayPrice(
              refundedDisplayAmount
            ),
          })
        : __(LOCALIZED.DISCOUNT_PRICE_SUFFIX_NEXT_CYCLE)}
    </div>
  );

  return (
    <Loading label={__(LOCALIZED.LOADING)} busy={isLoading}>
      <Heading size="h3" align="center">
        {heading}
      </Heading>
      <div className={styles['column-container']}>
        <div className={styles['discount-image-container']}>{image}</div>
        <div>
          <Text spacing="1x" className={styles['discount-secondary-header']}>
            {subheading}
          </Text>
          <div className={styles['discount-price-container']}>
            <span>{__(LOCALIZED.NEXT_PAYMENT)}</span>
            <span className={styles[priceStyle]}>
              {PaymentsHelper.getDisplayPrice(subtotalDisplayAmount)}
            </span>
            <span className={styles['price']}>
              {__(LOCALIZED.ORIGINAL_PRICE)}
            </span>
            <span className={styles['original-price']}>{`$${(
              originalPrice.minor / 100
            ).toFixed(2)}`}</span>
          </div>
          {discount_price_details}
        </div>
      </div>
      <div className={styles['button-container-right']}>
        {!generateCouponInFlight && !cancelInFlight && (
          <Space size="2x" type="inline">
            <Button
              label={__(LOCALIZED.CONTINUE_CANCELLATION)}
              variant="minimal"
              onClick={handleAbandonDiscountOffer}
            />
          </Space>
        )}
        <Button
          label={__(LOCALIZED.ACCEPT_OFFER)}
          disabled={generateCouponInFlight}
          variant="primary"
          onClick={handleGenerateDiscountCoupon}
        />
      </div>
    </Loading>
  );
}

CancelDiscountOffer.propTypes = {
  discountedDisplayPrice: PropTypes.string,
  refundedDisplayAmount: PropTypes.string.isRequired,
  subtotalDisplayAmount: PropTypes.string.isRequired,
  cancelReasonKey: PropTypes.string.isRequired,
  generateCouponInFlight: PropTypes.bool.isRequired,
  isLoading: PropTypes.bool.isRequired,
  handleAbandonDiscountOffer: PropTypes.func.isRequired,
  handleGenerateDiscountCoupon: PropTypes.func.isRequired,
  cancelInFlight: PropTypes.bool.isRequired,
  declinedOffer: PropTypes.bool.isRequired,
};

export function CancelSuccess(props) {
  const {
    periodEndDate,
    handleModalClose,
    isRefundable,
    handleCatalogOpen,
  } = props;

  const cancelSuccessBody = isRefundable
    ? __(LOCALIZED.CATALOG_MESSAGE_REFUNDABLE)
    : __(LOCALIZED.CATALOG_MESSAGE, { periodEndDate });

  return (
    <div>
      <Heading size="h3" align="center">
        {__(LOCALIZED.SUBSCRIPTION_CANCELLED_MESSAGE)}
      </Heading>
      <div className={styles['column-container']}>
        <div className={styles['discount-image-container']}>
          <img src={NanodegreeImage} alt="nanodegree" />
        </div>
        <Text spacing="1x">{cancelSuccessBody}</Text>
      </div>
      <div className={styles['button-container-right']}>
        <Space size="2x" type="inline">
          <Button
            label={__(LOCALIZED.CLOSE)}
            variant="minimal"
            onClick={handleModalClose}
          />
        </Space>
        <Button
          label={__(LOCALIZED.SEARCH_CATALOG)}
          disabled={false}
          variant="primary"
          onClick={handleCatalogOpen}
        />
      </div>
    </div>
  );
}

CancelSuccess.propTypes = {
  periodEndDate: PropTypes.string.isRequired,
  handleModalClose: PropTypes.func.isRequired,
  isRefundable: PropTypes.bool.isRequired,
  handleCatalogOpen: PropTypes.func.isRequired,
};

export function CancelDiscountOfferError(props) {
  const { handleCancel, handleModalClose, cancelInFlight } = props;

  return (
    <div>
      <Heading size="h3" align="center">
        {__(LOCALIZED.COUPON_CREATE_ERROR_HEADER)}
      </Heading>
      <div className={styles['column-container']}>
        <div className={styles['discount-image-container']}>
          <img src={NanodegreeImage} alt="nanodegree" />
        </div>
        <Text spacing="1x">{__(LOCALIZED.COUPON_CREATE_ERROR_BODY)}</Text>
      </div>
      <div className={styles['button-container-right']}>
        {!cancelInFlight && (
          <Space size="2x" type="inline">
            <Button
              label={__(LOCALIZED.CONTINUE_CANCELLATION)}
              variant="minimal"
              onClick={handleCancel}
            />
          </Space>
        )}
        <Button
          label={__(LOCALIZED.BACK)}
          disabled={false}
          variant="primary"
          onClick={handleModalClose}
        />
      </div>
    </div>
  );
}

CancelDiscountOfferError.propTypes = {
  handleCancel: PropTypes.func.isRequired,
  handleModalClose: PropTypes.func.isRequired,
  cancelInFlight: PropTypes.bool.isRequired,
  isLoading: PropTypes.bool.isRequired,
};

export const SwitchPrograms = ({
  onSwitch,
  onBack,
  catalogNanodegrees,
  currentProgramTitle,
  currentProgramSubscriptionUrn,
  checkSwitchEligibility,
}) => {
  const options = useMemo(
    () => catalogNanodegrees.map((nd) => ({ value: nd.key, label: nd.title })),
    [catalogNanodegrees]
  );
  const [selectedOption, setSelectedOption] = useState(undefined);
  const [isEligibleForSelectedOption, setIsEligible] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const handleSelectChange = async (option) => {
    if (!isEligibleForSelectedOption) {
      setIsEligible(true);
    }
    setIsLoading(true);
    const isEligible = await checkSwitchEligibility(
      currentProgramSubscriptionUrn,
      option.value
    );
    setIsEligible(isEligible.success);
    setIsLoading(false);
    setSelectedOption(option);
  };

  const handleConfirmSwitch = useCallback(() => {
    onSwitch({ key: selectedOption.value, title: selectedOption.label });
  }, [selectedOption, onSwitch]);

  return (
    <div>
      <Heading size="h3" align="center">
        {__(LOCALIZED.SWITCH_PROGRAMS_TITLE)}
      </Heading>
      <Space size="3x" type="stack">
        <Space size="2x" type="stack">
          <Space size="2x" type="stack">
            <Text>
              {__(LOCALIZED.SWITCH_PROGRAMS_PROMPT, {
                title: currentProgramTitle,
              })}
            </Text>
          </Space>
          <Text size="sm" color="silver" full>
            {__(
              LOCALIZED.REQUIREMENTS,
              {
                link:
                  "<a target='_blank' rel='noopener noreferrer' href='https://udacity.zendesk.com/hc/en-us/articles/360054765992'>visit our Help Center</a>",
              },
              { renderHTML: true }
            )}
          </Text>
        </Space>
        <Select
          label={__(LOCALIZED.SWITCH_PROGRAMS_SELECT_LABEL)}
          options={options}
          onChange={handleSelectChange}
          value={selectedOption ? selectedOption.label : undefined}
          required
        />
        {!isEligibleForSelectedOption && (
          <Text size="sm" color="red" full>
            {__(LOCALIZED.UNAVAILABLE_SWITCH, { title: currentProgramTitle })}
          </Text>
        )}
      </Space>
      <div className={styles['button-container-right']}>
        <Space size="2x" type="inline">
          <Button
            label={__(LOCALIZED.BACK)}
            variant="minimal"
            onClick={onBack}
          />
        </Space>
        <Button
          label={__(LOCALIZED.SWITCH_PROGRAMS)}
          variant="primary"
          onClick={handleConfirmSwitch}
          loading={isLoading}
          disabled={!selectedOption || !isEligibleForSelectedOption}
        />
      </div>
    </div>
  );
};

SwitchPrograms.propTypes = {
  onSwitch: PropTypes.func.isRequired,
  onBack: PropTypes.func.isRequired,
  catalogNanodegrees: PropTypes.array.isRequired,
  checkSwitchEligibility: PropTypes.func,
  currentProgramSubscriptionUrn: PropTypes.string,
};

export const SwitchProgramsSuccess = ({ to: { title } }) => {
  return (
    <React.Fragment>
      <Heading size="h3" align="center" spacing="1x">
        {__(LOCALIZED.SWITCH_PROGRAMS_SUCCESS)}
      </Heading>
      <Text align="center" spacing="none" full>
        {__(LOCALIZED.SWITCH_PROGRAMS_WAIT_FOR_SETUP, { title })}
      </Text>
      <Loading busy>
        <div className={styles['transfer-success-loading-space']} />
      </Loading>
    </React.Fragment>
  );
};
SwitchProgramsSuccess.propTypes = {
  to: PropTypes.shape({
    title: PropTypes.string.isRequired,
    key: PropTypes.string.isRequired,
  }).isRequired,
};

export const CannotSwitchPrograms = ({
  cancelledProgramTitle,
  to: { title },
  onEnroll,
}) => {
  return (
    <React.Fragment>
      <Heading size="h3">
        {__(LOCALIZED.CANNOT_SWITCH_PROGRAMS_TITLE, {
          title: cancelledProgramTitle,
        })}
      </Heading>
      <Text>{__(LOCALIZED.CANNOT_SWITCH_PROGRAMS_EXPLANATION, { title })}</Text>
      <div className={styles['button-container-right']}>
        <Button
          label={__(LOCALIZED.ENROLL)}
          variant="primary"
          onClick={onEnroll}
        />
      </div>
    </React.Fragment>
  );
};
CannotSwitchPrograms.propTypes = {
  to: PropTypes.shape({
    title: PropTypes.string.isRequired,
    key: PropTypes.string.isRequired,
  }).isRequired,
  onBack: PropTypes.func.isRequired,
  onContinue: PropTypes.func.isRequired,
};
