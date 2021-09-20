import {
  CancelDiscountOffer,
  CancelDiscountOfferError,
  CancelError,
  CancelSuccess,
  CancelSurveyDiscountQuestions,
  CannotSwitchPrograms,
  SwitchPrograms,
  SwitchProgramsSuccess,
} from './_assisted-cancel-followup';
import {
  SUPPORT_BY,
  checkDiscountOfferEligibility,
  generateDiscountCoupon,
} from './_cancel-flow-logic';
import Actions from 'actions';
import CatalogHelper from 'helpers/catalog-helper';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

const DECLINED_NO_OFFERS = 0;
// eslint-disable-next-line
const DECLINED_FIRST_OFFER = 1;
const DECLINED_SECOND_OFFER = 2;

const DELAY = 1000;

const MODAL_PAGES = {
  INITIAL_QUESTIONS: 'Initial Questions Page',
  SWITCH_PROGRAMS: 'Program Switch Page',
  SWITCH_PROGRAMS_SUCCESS: 'Program Switch Success Page',
  CANNOT_SWITCH_PROGRAMS: 'Cannot Switch Programs Page',
  DISCOUNT_OFFER: 'Discount Offer Page',
  DISCOUNT_OFFER_ERROR: 'Discount Offer Error Page',
  SUBSCRIPTION_CANCELLED: 'Subscription Cancelled Page',
};

const initialState = {
  cancelReasonKey: '',
  cancelReasonMessage: '',
  cancelInFlight: false,
  checkOfferEligibilityInFlight: false,
  discountedDisplayPrice: '',
  subtotalDisplayAmount: '',
  refundDisplayAmount: '',
  isLoading: false,
  currentPage: MODAL_PAGES.INITIAL_QUESTIONS,
  generateCouponInFlight: false,
  declinedOffer: DECLINED_NO_OFFERS,
};

export class CancelSurveyWithDiscount extends React.Component {
  static propTypes = {
    onSurveyCancel: PropTypes.func.isRequired,
    onSurveyDiscountApplied: PropTypes.func.isRequired,
    onSurveyDiscountAccepted: PropTypes.func.isRequired,
    onSurveyDiscountApplyFailed: PropTypes.func.isRequired,
    onSurveyDiscountPresented: PropTypes.func.isRequired,
    onSurveyDiscountAbandoned: PropTypes.func.isRequired,
    handleSurveyModalClose: PropTypes.func.isRequired,
    handleCatalogOpen: PropTypes.func.isRequired,
    itemType: PropTypes.string.isRequired,
    isPreorder: PropTypes.bool.isRequired,
    periodEndDate: PropTypes.string,
    refundable: PropTypes.bool.isRequired,
    subscriptionUrn: PropTypes.string.isRequired,
    originalPrice: PropTypes.object,
    alternateCancelOption: PropTypes.string.isRequired,
    handleAlternateCancelOption: PropTypes.func.isRequired,
    nanodegreeTitle: PropTypes.string.isRequired,
    // State props
    catalogNds: PropTypes.array.isRequired,
    // Dispatch props
    fetchNanodegreeCatalog: PropTypes.func.isRequired,
    switchNanodegrees: PropTypes.func.isRequired,
    checkSwitchEligibility: PropTypes.func,
  };

  state = initialState;

  componentDidMount = () => {
    // Pre-emptively fetch catalog to prepare for the possibility that the
    // user wants to switch Nanodegrees rather than fully cancel.
    this.props.fetchNanodegreeCatalog();
  };

  componentWillUnmount = () => {
    this.cancelSpinnerTimeout();
  };

  getHasDeclinedOffer = () => this.state.declinedOffer !== DECLINED_NO_OFFERS;

  resetCancelForm = () => {
    this.setState(initialState);
  };

  handleCancelReasonChange = (cancelReasonKey, cancelReasonMessage) => {
    this.setState({
      cancelReasonKey,
      cancelReasonMessage,
    });
  };

  handleGenerateDiscountCoupon = async () => {
    const {
      onSurveyDiscountApplied,
      onSurveyDiscountAccepted,
      onSurveyDiscountApplyFailed,
      subscriptionUrn,
    } = this.props;
    const {
      cancelReasonMessage,
      discountedDisplayPrice,
      refundDisplayAmount,
      subtotalDisplayAmount,
    } = this.state;

    onSurveyDiscountAccepted(
      cancelReasonMessage,
      discountedDisplayPrice,
      subtotalDisplayAmount,
      refundDisplayAmount
    );

    this.setState({ generateCouponInFlight: true });
    const success = await generateDiscountCoupon(
      subscriptionUrn,
      this.getHasDeclinedOffer()
    );
    this.setState({ generateCouponInFlight: false });

    if (success) {
      // close modal and show banner that offer has been applied
      onSurveyDiscountApplied(
        cancelReasonMessage,
        discountedDisplayPrice,
        subtotalDisplayAmount,
        refundDisplayAmount
      );
    } else {
      onSurveyDiscountApplyFailed(
        cancelReasonMessage,
        discountedDisplayPrice,
        subtotalDisplayAmount,
        refundDisplayAmount
      );
      this.setState({ currentPage: MODAL_PAGES.DISCOUNT_OFFER_ERROR });
    }
  };

  checkDiscountEligibility = async () => {
    const { subscriptionUrn } = this.props;
    let discountOfferEligible = false;
    let discountDisplayPrice = '';
    let subtotalDisplayAmount = '';
    let refundDisplayAmount = '';

    this.setState({ checkOfferEligibilityInFlight: true });

    ({
      discountOfferEligible,
      discountDisplayPrice,
      subtotalDisplayAmount,
      refundDisplayAmount,
    } = await checkDiscountOfferEligibility(
      subscriptionUrn,
      this.getHasDeclinedOffer()
    ));

    this.setState({
      checkOfferEligibilityInFlight: false,
      discountedDisplayPrice: discountDisplayPrice,
      subtotalDisplayAmount: subtotalDisplayAmount,
      refundDisplayAmount: refundDisplayAmount,
    });

    return discountOfferEligible;
  };

  fauxSpinner = (timeout) => {
    return new Promise((res) => {
      this.setState({
        isLoading: setTimeout(() => {
          this.setState({
            isLoading: false,
          });
          res();
        }, timeout),
      });
    });
  };

  cancelSpinnerTimeout = () => {
    if (typeof this.state.isLoading === 'number') {
      clearTimeout(this.state.isLoading);
    }
  };

  handleAbandonDiscountOffer = async () => {
    const { onSurveyDiscountAbandoned } = this.props;
    const { cancelReasonMessage, declinedOffer } = this.state;

    onSurveyDiscountAbandoned(
      cancelReasonMessage,
      this.state.discountedDisplayPrice,
      this.state.subtotalDisplayAmount,
      this.state.refundDisplayAmount
    );

    if (declinedOffer < DECLINED_SECOND_OFFER) {
      await this.fauxSpinner(DELAY + 1000);

      this.setState(
        (state) => ({
          declinedOffer: state.declinedOffer + 1,
        }),
        this._handleDiscountOfferEligibleOrCancel
      );
    } else {
      await this.handleCancel();
    }
  };

  handleDiscountOfferEligibleOrCancel = (
    cancelReasonKey,
    cancelReasonMessage
  ) => {
    this.setState(
      { cancelReasonKey, cancelReasonMessage },
      this._handleDiscountOfferEligibleOrCancel
    );
  };

  _handleDiscountOfferEligibleOrCancel = async () => {
    const {
      onSurveyDiscountPresented,
      alternateCancelOption,
      handleAlternateCancelOption,
    } = this.props;

    const { declinedOffer, cancelReasonKey, cancelReasonMessage } = this.state;

    if (alternateCancelOption !== SUPPORT_BY.SELF_SERVE_DISCOUNT.name) {
      handleAlternateCancelOption(alternateCancelOption);
      return;
    }

    let discountOfferEligible = false;

    await this.fauxSpinner(DELAY);

    discountOfferEligible = await this.checkDiscountEligibility();

    this.setState({
      cancelReasonKey,
      cancelReasonMessage,
    });

    if (discountOfferEligible && declinedOffer < DECLINED_SECOND_OFFER) {
      onSurveyDiscountPresented(
        cancelReasonMessage,
        this.state.discountedDisplayPrice,
        this.state.subtotalDisplayAmount,
        this.state.refundDisplayAmount
      );
      this.setState({
        currentPage: MODAL_PAGES.DISCOUNT_OFFER,
      });
    } else {
      await this.handleCancel();
    }
  };

  handleStartSwitchPrograms = () => {
    this.setState({ currentPage: MODAL_PAGES.SWITCH_PROGRAMS });
  };

  handleSwitchProgramsBack = () => {
    this.setState({ currentPage: MODAL_PAGES.INITIAL_QUESTIONS });
  };

  handleSwitchProgramsConfirm = async ({ key, title }) => {
    const { switchNanodegrees, subscriptionUrn, createErrorAlert } = this.props;
    const res = await switchNanodegrees(subscriptionUrn, key);
    if (res.success) {
      this.setState({
        programToSwitch: { key, title },
        currentPage: MODAL_PAGES.SWITCH_PROGRAMS_SUCCESS,
      });

      // Wait a few seconds to give the user time to register that their transfer
      // succeeded before redirecting to their new nanodegree.
      setTimeout(() => {
        window.location.href = `/nanodegrees/${key}`;
      }, 3.6 * 1000);
    } else {
      await createErrorAlert(res.message);
      console.error(res.message);
    }
  };

  goToEnrollmentPage = async () => {
    const { catalogNds } = this.props;
    const { programToSwitch } = this.state;
    const fullNd = catalogNds.find((nd) => nd.key === programToSwitch.key);
    const catalogUrl = fullNd
      ? `https://udacity.com/course/${fullNd.slug}`
      : 'https://udacity.com/courses/all';
    window.location.href = catalogUrl;
  };

  // unconditional cancel
  handleCancel = async (nextPage) => {
    const { onSurveyCancel, handleSurveyModalClose } = this.props;
    const { cancelReasonMessage } = this.state;

    this.setState({ cancelInFlight: true });
    await onSurveyCancel(cancelReasonMessage);
    this.setState({ cancelInFlight: false });

    if (nextPage) {
      this.setState({ currentPage: nextPage });
    } else {
      handleSurveyModalClose();
    }
  };

  render() {
    const {
      refundable,
      handleSurveyModalClose,
      handleCatalogOpen,
      originalPrice,
      nanodegreeTitle,
      catalogNds,
      subscriptionUrn,
      checkSwitchEligibility,
    } = this.props;

    const {
      cancelReasonKey,
      currentPage,
      cancelInFlight,
      checkOfferEligibilityInFlight,
      generateCouponInFlight,
      isLoading,
      discountedDisplayPrice,
      refundDisplayAmount,
      subtotalDisplayAmount,
      programToSwitch,
    } = this.state;

    switch (currentPage) {
      case MODAL_PAGES.INITIAL_QUESTIONS:
        return (
          <CancelSurveyDiscountQuestions
            periodEndDate={this.props.periodEndDate}
            handleContinueCancellation={
              this.handleDiscountOfferEligibleOrCancel
            }
            handleSwitchPrograms={this.handleStartSwitchPrograms}
            handleCancelReasonChange={this.handleCancelReasonChange}
            cancelInFlight={cancelInFlight}
            checkOfferEligibilityInFlight={checkOfferEligibilityInFlight}
            isLoading={!!isLoading}
            handleModalClose={handleSurveyModalClose}
            isRefundable={refundable}
          />
        );
      case MODAL_PAGES.DISCOUNT_OFFER:
        return (
          <CancelDiscountOffer
            discountedDisplayPrice={discountedDisplayPrice}
            subtotalDisplayAmount={subtotalDisplayAmount}
            refundedDisplayAmount={refundDisplayAmount}
            cancelReasonKey={cancelReasonKey}
            handleAbandonDiscountOffer={this.handleAbandonDiscountOffer}
            generateCouponInFlight={generateCouponInFlight}
            isLoading={!!isLoading}
            handleGenerateDiscountCoupon={this.handleGenerateDiscountCoupon}
            cancelInFlight={cancelInFlight}
            originalPrice={originalPrice}
            declinedOffer={this.getHasDeclinedOffer()}
          />
        );
      case MODAL_PAGES.SWITCH_PROGRAMS:
        return (
          <SwitchPrograms
            catalogNanodegrees={catalogNds}
            onSwitch={this.handleSwitchProgramsConfirm}
            onBack={this.handleSwitchProgramsBack}
            currentProgramTitle={nanodegreeTitle}
            currentProgramSubscriptionUrn={subscriptionUrn}
            checkSwitchEligibility={checkSwitchEligibility}
          />
        );
      case MODAL_PAGES.SWITCH_PROGRAMS_SUCCESS:
        return <SwitchProgramsSuccess to={programToSwitch} />;
      case MODAL_PAGES.CANNOT_SWITCH_PROGRAMS:
        return (
          <CannotSwitchPrograms
            cancelledProgramTitle={nanodegreeTitle}
            to={programToSwitch}
            onEnroll={this.goToEnrollmentPage}
          />
        );
      case MODAL_PAGES.SUBSCRIPTION_CANCELLED:
        return (
          <CancelSuccess
            periodEndDate={this.props.periodEndDate}
            handleModalClose={handleSurveyModalClose}
            isRefundable={refundable}
            handleCatalogOpen={handleCatalogOpen}
          />
        );
      case MODAL_PAGES.DISCOUNT_OFFER_ERROR:
        return (
          <CancelDiscountOfferError
            handleCancel={this.handleCancel}
            handleModalClose={handleSurveyModalClose}
            cancelInFlight={cancelInFlight}
          />
        );
      default:
        return <CancelError />;
    }
  }
}

export default connect(
  (state) => ({ catalogNds: CatalogHelper.State.getNanodegrees(state) }),
  {
    fetchNanodegreeCatalog: Actions.fetchNanodegreeCatalog,
    switchNanodegrees: Actions.switchNanodegrees,
    createErrorAlert: Actions.createErrorAlert,
    checkSwitchEligibility: Actions.checkSwitchEligibility,
  }
)(CancelSurveyWithDiscount);
