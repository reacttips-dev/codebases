import {
  Banner,
  Button,
  Checkbox,
  Text,
  Tooltip,
} from '@udacity/veritas-components';
import {
  CANCELABLE_STATUSES,
  CANCELING,
  CA_OVER_LIMIT,
  FLEX_SUBSCRIPTION,
  PREORDER,
  SHOW_PAYMENT_METHOD_STATUSES,
} from 'constants/payment-status';
import FreeTrialHelper, {
  FREE_TRIAL_SUBMISSION_LIMIT,
} from 'helpers/free-trial-helper';
import {
  checkCancelFlowFeatures,
  commonCancellationEventProps,
  setAllFeaturesTo,
} from './_cancel-flow-logic';

import Actions from 'actions';
import AnalyticsService from 'services/analytics-service';
import AuthService from 'services/authentication-service';
import AutoPayModal from './_autopay-modal';
import BillingHistory from './_subscription-card-billing-history';
import CancelModal from './_cancel-modal';
import CatalogService from 'services/catalog-service';
import ClassroomPropTypes from 'components/prop-types';
import DateHelper from 'helpers/date-helper';
import ExperimentsApi from 'services/experiments-api-service';
import Features from 'constants/features';
import GhostImage from 'images/settings/ghost.gif';
import GhostSleepingImage from 'images/settings/ghost-sleeping.png';
import { IconWarning } from '@udacity/veritas-icons';
import MapFlagImage from 'images/settings/map-flag.png';
import PaymentsHelper from 'helpers/payments-helper';
import PredictionHelper from 'helpers/prediction-helper';
import PropTypes from 'prop-types';
import SubscriptionHelper from 'helpers/subscription-helper';
import UserHelper from 'helpers/user-helper';
import _ from 'lodash';
import { __ } from 'services/localization-service';
import { connect } from 'react-redux';
import { i18n } from 'services/localization-service';
import styles from './_subscription-card.scss';

@cssModule(styles, { allowMultiple: true })
export class SubscriptionCard extends React.Component {
  static displayName = 'settings/subscriptions/_subscription-card';

  static propTypes = {
    autoRenewConfigurable: PropTypes.bool.isRequired, // Does subscription payment type support auto-renew?
    autoRenewEligible: PropTypes.bool.isRequired, // Can user activate auto-renew for subscription?
    createErrorAlert: PropTypes.func.isRequired,
    createNotificationAlert: PropTypes.func.isRequired,
    canGraduate: PropTypes.bool.isRequired, // Can user graduate from this subscription?
    handleOrderHistoryUpdate: PropTypes.func.isRequired,
    isFreeTrial: PropTypes.bool,
    onAutoRenewChange: PropTypes.func.isRequired,
    onOrderCancel: PropTypes.func.isRequired,
    onOrderUncancel: PropTypes.func.isRequired,
    onDiscountApplied: PropTypes.func.isRequired,
    subscription: ClassroomPropTypes.historicOrder,
  };

  constructor(props) {
    super(props);

    this.setWindowWidth = this.setWindowWidth.bind(this);
    // Store a reference to the debounced function to add/remove event listener
    this.debouncedSetWindowWidth = _.debounce(this.setWindowWidth, 300);

    const initialCancelFlowFeatures = setAllFeaturesTo(null);

    this.state = {
      historyOpen: false,
      isAutoPayModalOpen: false,
      isCancelModalOpen: false,
      toolTipOpen: false,
      width: 0,
      catalogDegree: {},
      cancelFlowFeatures: initialCancelFlowFeatures,
    };
  }

  componentDidMount() {
    const {
      fetchFeatureEnabledOptimizely,
      fetchPredictions,
      subscription,
      subscription: { cancel_url, status },
    } = this.props;
    const nanodegreeKey = SubscriptionHelper.getNanodegreeKey(subscription);
    // only fetch assisted sales cancellation feature if user can cancel this subscription
    if (_.isString(cancel_url) && _.includes(CANCELABLE_STATUSES, status)) {
      fetchFeatureEnabledOptimizely(
        `${Features.CANCEL_FLOW_INTERCOM}-${nanodegreeKey}`,
        AuthService.getCurrentUserId(),
        Features.CANCEL_FLOW_INTERCOM,
        {
          is_china_managed_nd: SubscriptionHelper.isChinaManaged(subscription),
          is_enterprise: SubscriptionHelper.isEnterprise(subscription),
          is_preorder: SubscriptionHelper.isPreorder(subscription),
          is_open_ended: _.isEqual(
            _.get(subscription, 'type'),
            FLEX_SUBSCRIPTION
          ),
        }
      );
    }

    // fetch cancellation flow features from optimizely
    checkCancelFlowFeatures(fetchPredictions, ExperimentsApi.getFeatures, {
      userId: AuthService.getCurrentUserId(),
      subscription,
    }).then((features) => {
      this.setState({ cancelFlowFeatures: features });
    });

    // get nanodegree details from the catalog:
    // we'll use this later to get the correct slug when students need to re-enroll in a degree
    this.setCatalogDegree();

    this.setWindowWidth();
    window.addEventListener('resize', this.debouncedSetWindowWidth);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.debouncedSetWindowWidth);
  }

  setCatalogDegree = async () => {
    const {
      subscription: { purchased_products },
    } = this.props;

    try {
      const catalogDegree = await CatalogService.getNDFromContentful(
        _.get(purchased_products, '[0].nanodegree_key')
      ).then((res) => res.items[0].fields);

      this.setState({ catalogDegree });
    } catch (error) {
      console.error(error);
    }
  };

  setWindowWidth() {
    this.setState({ width: window.innerWidth });
  }

  handleEnableAutoPayClick = () => {
    const { subscription } = this.props;
    AnalyticsService.track('Opened Subscription Enable Auto-Renew Modal', {
      subscription: _.omit(subscription, [
        'event_history',
        'next_payment',
        'payment_method',
        'payment_history',
      ]),
    });
    this.setState({ isAutoPayModalOpen: true });
  };

  handleSelfServeCancel = async (cancelReason, followUp) => {
    const {
      onOrderCancel,
      subscription: { can_refund, type, urn },
    } = this.props;

    await onOrderCancel(
      urn,
      type,
      can_refund,
      false, //not isIntercomCancel
      cancelReason,
      followUp
    );
  };

  handleSelfServeDiscountApplied = async () => {
    const { onDiscountApplied } = this.props;
    await onDiscountApplied();
  };

  handleCloseAutoPayModalClick = () => {
    const { subscription } = this.props;
    AnalyticsService.track('Closed Subscription Enable Auto-Renew Modal', {
      subscription: _.omit(subscription, [
        'event_history',
        'next_payment',
        'payment_method',
        'payment_history',
      ]),
    });
    this.setState({ isAutoPayModalOpen: false });
  };

  handleConfirmAutoPayClick = async () => {
    const {
      onAutoRenewChange,
      subscription: { urn },
      subscription,
    } = this.props;
    const isAutoRenewOn = true;
    try {
      await onAutoRenewChange(urn, isAutoRenewOn);
      AnalyticsService.track('Clicked Enable Auto-Renew for Subscription', {
        subscription: _.omit(subscription, [
          'event_history',
          'next_payment',
          'payment_method',
          'payment_history',
        ]),
      });
      this.setState({ isAutoPayModalOpen: false });
    } catch (err) {
      console.error(err);
      this.setState({ isAutoPayModalOpen: false });
    }
  };

  handleHistoryClick = (evt) => {
    evt.preventDefault();
    const { historyOpen: curr } = this.state;
    this.setState({ historyOpen: !curr });
  };

  handleClickCancel = () => {
    this.setState({ isCancelModalOpen: true });
  };

  renderCancelBtn = () => {
    const {
      canGraduate,
      handleOrderHistoryUpdate,
      subscription,
      subscription: {
        can_refund,
        period_end_date,
        status,
        type,
        urn,
        original_price,
      },
      grcModel,
    } = this.props;
    const { cancelFlowFeatures, isCancelModalOpen } = this.state;

    const cancelEventProps = commonCancellationEventProps(
      i18n.getCountryCode(),
      SubscriptionHelper.getRegion(subscription),
      subscription,
      grcModel,
      cancelFlowFeatures
    );

    return [
      <Button
        onClick={() => this.handleClickCancel()}
        label={__('Cancel')}
        small
        variant="minimal"
        key="btn"
      />,
      <CancelModal
        show={isCancelModalOpen}
        nanodegreeTitle={SubscriptionHelper.getNanodegreeTitle(subscription)}
        onHide={() => this.setState({ isCancelModalOpen: false })}
        onSelfServeCancel={this.handleSelfServeCancel}
        onSelfServeDiscountApplied={this.handleSelfServeDiscountApplied}
        handleOrderHistoryUpdate={handleOrderHistoryUpdate}
        itemType={type}
        key="cancel"
        cancelEventProps={cancelEventProps}
        cancelFlowFeatures={cancelFlowFeatures}
        refundable={can_refund && !canGraduate}
        isPreorder={status === PREORDER}
        periodEndDate={DateHelper.formatDate(period_end_date)}
        subscriptionUrn={urn}
        originalPrice={original_price}
      />,
    ];
  };

  renderPayBtn = () => {
    const {
      subscription: {
        next_payment: { payment_url },
      },
    } = this.props;
    if (_.isString(payment_url)) {
      return (
        <Button
          external
          full
          href={payment_url}
          label={__('Pay Now')}
          variant="primary"
        />
      );
    }
  };

  renderAutoRenew() {
    const {
      subscription: {
        urn,
        next_payment: { can_auto_renew: autoRenewOn },
        payment_method,
      },
      autoRenewConfigurable,
      autoRenewEligible,
    } = this.props;

    if (!autoRenewConfigurable) {
      return null;
    }

    if (autoRenewConfigurable && autoRenewOn) {
      return (
        <p styleName="payment-message">
          {__(
            'Your subscription has auto-renew enabled. Your payment will be processed on the due date.'
          )}
        </p>
      );
    }

    const processor = _.get(payment_method, 'processor', '');
    const { isAutoPayModalOpen } = this.state;

    return autoRenewEligible ? (
      <div>
        <div styleName="flex-center">
          <Checkbox
            label={__('Enable Auto-renew')}
            id={`autopay-${urn}`}
            checked={autoRenewOn}
            onChange={this.handleEnableAutoPayClick}
            testID="autopay-checkbox"
          />
          <AutoPayModal
            onConfirmAutoPay={this.handleConfirmAutoPayClick}
            onCloseModal={this.handleCloseAutoPayModalClick}
            isOpen={isAutoPayModalOpen}
          />
          {!autoRenewConfigurable && processor === 'stripe' && (
            <Tooltip
              trigger={
                <IconWarning
                  color="orange"
                  size="md"
                  title="add payment method"
                />
              }
              direction={this.state.width > 550 ? 'bottom' : 'start'}
              content={__(
                'Please add a payment method below to enable auto-renew for this subscription.'
              )}
            />
          )}
        </div>
        <p styleName="payment-message">
          {__(
            'Keep your subscription active and enable auto-renew or pay before the due date.'
          )}
        </p>
      </div>
    ) : (
      <p styleName="payment-message">
        {__('Keep your subscription active and pay before the due date')}
      </p>
    );
  }

  renderBanner(date, type) {
    const gracePeriod = DateHelper.getGracePeriod(date);
    const style = {
      overdue: {
        copy: __(
          'Payment is past due! Pay before <%= date %> to avoid losing access.',
          { date: gracePeriod }
        ),
        variant: 'warning',
      },
      failed: {
        copy: __(
          'Failed payment. Pay before <%= date %> to avoid losing access.',
          { date: gracePeriod }
        ),
        variant: 'error',
      },
      preorder: {
        copy: __(
          'The classroom is now open! Pay before <%= date %> to start learning.',
          { date: gracePeriod }
        ),
        variant: 'warning',
      },
    };

    return (
      <div styleName="banner">
        <Banner embedded icon={<IconWarning />} variant={style[type].variant}>
          {style[type].copy}
        </Banner>
      </div>
    );
  }

  renderNextPayment() {
    const { subscription } = this.props;
    const { next_payment, payment_history } = subscription;
    const last_payment = _.get(payment_history, '[0]', {});
    return (
      <div styleName="payment">
        {PaymentsHelper.paymentFailed(last_payment) &&
          this.renderBanner(
            _.get(last_payment, 'charge.charged_at', ''),
            'failed'
          )}
        {PaymentsHelper.isPaymentOverdue(next_payment)
          ? PaymentsHelper.isPreOrder(subscription)
            ? this.renderBanner(_.get(next_payment, 'due_at', ''), 'preorder')
            : this.renderBanner(_.get(next_payment, 'due_at', ''), 'overdue')
          : null}
        <div styleName="grid">
          <div styleName="payment-info">
            <p styleName="payment-due">{__('due date')}</p>
            <p styleName="payment-due-date">
              {DateHelper.formatShortMonth(_.get(next_payment, 'due_at'))}
            </p>
          </div>
          <div styleName="payment-auto-renew">{this.renderAutoRenew()}</div>
          <div styleName="payment-pay-now">
            <p styleName="pay-amount">
              {PaymentsHelper.getDisplayPrice(next_payment)}
            </p>
            {this.renderPayBtn()}
          </div>
        </div>
      </div>
    );
  }

  renderNoNextPayment() {
    const {
      onOrderUncancel,
      subscription: {
        status,
        type,
        urn,
        payment_history,
        can_uncancel,
        no_uncancel_reason,
        period_end_date,
      },
    } = this.props;
    const last_payment = _.get(payment_history, '[0]', {});
    const { catalogDegree } = this.state;

    if (type === FLEX_SUBSCRIPTION) {
      if (status === CANCELING) {
        if (can_uncancel === false) {
          let unCancelCopy;
          switch (no_uncancel_reason) {
            case CA_OVER_LIMIT:
              unCancelCopy = __(
                'Your billing address indicates that you are a resident of California. You have reached the mandatory price cap set by California education regulations for this subscription. You have been granted additional time free of charge in order to complete the program. Full access will end on <%= period_end_date %>. Learn more about California regulations <a href="https://www.udacity.com/legal/en-us/california-residents">here</a>',
                {
                  period_end_date: DateHelper.formatShortMonth(period_end_date),
                },
                { renderHTML: true }
              );
              break;
            default:
              unCancelCopy = __('You cannot resume this subscription.');
          }
          return (
            <div styleName="no-payment-canceling">
              {can_uncancel && (
                <img
                  src={GhostSleepingImage}
                  alt={__('Illustration of a sleeping book')}
                />
              )}
              <Text>{unCancelCopy}</Text>
            </div>
          );
        } else {
          return (
            <div styleName="no-payment-canceling">
              <div>
                <img
                  src={GhostSleepingImage}
                  alt={__('Illustration of a sleeping book')}
                />
              </div>
              <div>
                <Text>{__(`Change your mind? It's not too late.`)}</Text>
                <Button
                  onClick={() => {
                    this.setState({ isCancelModalOpen: false });
                    onOrderUncancel(urn);
                  }}
                  label={__('Keep my enrollment')}
                  small
                  variant="primary"
                />
              </div>
            </div>
          );
        }
      }

      if (!_.isEmpty(catalogDegree)) {
        const reEnrollUrl = `https://www.udacity.com/course/${_.get(
          catalogDegree,
          'slug'
        )}`;

        return (
          <div styleName="no-payment-canceled">
            <div>
              <img src={GhostImage} alt={__('Illustration of a ghost')} />
            </div>
            <div>
              <Text>{__('Jump back in where you left off.')}</Text>
              <Button
                href={reEnrollUrl}
                external
                label={__('Re-Enroll')}
                small
                variant="primary"
              />
            </div>
          </div>
        );
      } else {
        return null;
      }
    } else {
      return (
        <div styleName="no-payment-needed">
          {PaymentsHelper.paymentFailed(last_payment) &&
            this.renderBanner(
              _.get(last_payment, 'charge.charged_at', ''),
              'failed'
            )}
          <img
            src={MapFlagImage}
            alt={__('Illustration of a map with a flag')}
          />
          <div>
            {!PaymentsHelper.paymentFailed(last_payment) && (
              <Text>{__('No upcoming payment. Keep on learning!')}</Text>
            )}
          </div>
        </div>
      );
    }
  }

  renderEnrolledDate() {
    const {
      subscription: {
        created_at,
        canceled_at,
        period_end_date,
        status,
        updated_at,
      },
    } = this.props;

    const show = (name, date) => {
      return (
        <p styleName="info-line">
          <span styleName="bold">{name}: </span>
          {DateHelper.formatDate(date)}
        </p>
      );
    };

    if (_.isEqual(status, PREORDER)) {
      const due_at = _.get(this.props, 'subscription.next_payment.due_at');
      return show(__('Opens on'), due_at);
    } else if (_.includes(CANCELABLE_STATUSES, status)) {
      return show(__('Enrolled on'), created_at);
    } else if (status === CANCELING) {
      return show(__('Enrollments end on'), period_end_date);
    }
    return show(__('Unenrolled on'), canceled_at || updated_at);
  }

  renderPaymentMethod() {
    const {
      subscription: { payment_method },
    } = this.props;
    return (
      <div>
        <p styleName="info-line">
          <span styleName="bold">{__('Payment method')}: </span>
          {payment_method.description}
        </p>
      </div>
    );
  }

  renderStatus(status) {
    switch (status) {
      case CANCELING:
        return __('cancel pending');
      default:
        return __(_.lowerCase(status));
    }
  }

  render() {
    const {
      subscription: {
        cancel_url,
        next_payment,
        payment_method,
        purchased_products,
        status,
        payment_history,
        payment_plan,
        type,
      },
      isFreeTrial,
    } = this.props;
    const { historyOpen } = this.state;
    const shouldRenderPaymentMethod =
      payment_method && _.includes(SHOW_PAYMENT_METHOD_STATUSES, status);
    const hasPayments = !_.isEmpty(payment_history);
    const canCancel =
      _.isString(cancel_url) && _.includes(CANCELABLE_STATUSES, status);

    return (
      <li styleName="item">
        {isFreeTrial && (
          <div styleName="free-trial-message">
            <Text size="sm" align="center" spacing="none">
              {__(
                'There is a <%= count %> project limit during your free trial',
                { count: FREE_TRIAL_SUBMISSION_LIMIT }
              )}
            </Text>
          </div>
        )}
        <div styleName="contain">
          <div styleName="product">
            <p styleName="status">{this.renderStatus(status)}</p>
            <p styleName="title">{purchased_products[0].name}</p>
            {this.renderEnrolledDate()}
            {shouldRenderPaymentMethod && this.renderPaymentMethod()}
          </div>
          {next_payment ? this.renderNextPayment() : this.renderNoNextPayment()}
        </div>
        <div>
          {historyOpen && (
            <BillingHistory
              nextPayment={next_payment}
              payments={payment_history}
              productInfo={purchased_products[0]}
              paymentPlan={payment_plan}
              isFlexSubscription={type === FLEX_SUBSCRIPTION}
            />
          )}
          {(hasPayments || canCancel) && (
            <div styleName={hasPayments ? 'billing' : 'billing-cancel'}>
              {hasPayments && (
                <a
                  styleName={'billing-link'}
                  href="javascript:void(0)"
                  title={__('billing history')}
                  onClick={this.handleHistoryClick}
                >
                  <div styleName="flex-center">
                    {historyOpen ? (
                      <span styleName="drawer-icon">&minus;</span>
                    ) : (
                      <span styleName="drawer-icon">&#43;</span>
                    )}
                    <span>{__('billing history')}</span>
                  </div>
                </a>
              )}
              {canCancel && this.renderCancelBtn()}
            </div>
          )}
        </div>
      </li>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  const nanodegreeKey = SubscriptionHelper.getNanodegreeKey(
    ownProps.subscription
  );
  return {
    grcModel: PredictionHelper.getGrcModel(
      UserHelper.State.getPredictions(state),
      null
    ),
    isFreeTrial: FreeTrialHelper.State.isFreeTrial(state, nanodegreeKey),
  };
};

export default connect(mapStateToProps, {
  createErrorAlert: Actions.createErrorAlert,
  createNotificationAlert: Actions.createNotificationAlert,
  fetchFeatureEnabledOptimizely: Actions.fetchFeatureEnabledOptimizely,
  fetchPredictions: Actions.fetchPredictions,
})(SubscriptionCard);
