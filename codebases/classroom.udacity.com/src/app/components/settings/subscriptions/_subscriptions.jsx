import { Button, Heading, Loading, Text } from '@udacity/veritas-components';

import Actions from 'actions';
import BillingCard from './_billing-card';
import ClassroomPropTypes from 'components/prop-types';
import { FLEX_SUBSCRIPTION } from 'constants/payment-status';
import GhostSleepingImage from 'images/settings/ghost-sleeping.png';
import NanodegreeHelper from 'helpers/nanodegree-helper';
import PaymentsHelper from 'helpers/payments-helper';
import PropTypes from 'prop-types';
import SettingsHelper from 'helpers/settings-helper';
import SubscriptionCard from './_subscription-card';
import UserHelper from 'helpers/user-helper';
import { __ } from 'services/localization-service';
import { connect } from 'react-redux';
import styles from './_subscriptions.scss';

const NUM_INITIAL_ITEMS = 2;

@cssModule(styles)
export class Subscriptions extends React.Component {
  static displayName = 'settings/subscriptions/_subscriptions';

  static propTypes = {
    billingInfo: ClassroomPropTypes.billingInfo,
    cancelOrder: PropTypes.func.isRequired,
    cancelTermPurchase: PropTypes.func.isRequired,
    createErrorAlert: PropTypes.func.isRequired,
    createNotificationAlert: PropTypes.func.isRequired,
    fetchOrderHistory: PropTypes.func.isRequired,
    isReadyToGraduateNdKeys: PropTypes.arrayOf(PropTypes.string),
    orderHistory: PropTypes.arrayOf(ClassroomPropTypes.historicOrder),
    user: ClassroomPropTypes.user,
  };

  state = {
    hideCards: true,
  };

  componentDidMount() {
    this.props.fetchSubscribedNanodegrees();
  }

  handleShowMoreClick = (evt) => {
    evt.preventDefault();
    const { hideCards: curr } = this.state;
    this.setState({ hideCards: !curr });
  };

  handleAutoRenewChange = async (urn, isAutoRenewOn) => {
    const {
      createErrorAlert,
      createSuccessAlert,
      fetchOrderHistory,
      updateAutoRenew,
    } = this.props;
    try {
      await updateAutoRenew(urn, isAutoRenewOn);
      let msg;
      if (isAutoRenewOn) {
        msg = __(
          'Saved! Your subscription will auto-renew and your payment method will automatically be charged monthly.'
        );
      } else {
        msg = __(
          'Saved! Your subscription will not auto-renew. You will receive a monthly bill.'
        );
      }
      await createSuccessAlert(msg);
      await fetchOrderHistory();
    } catch (err) {
      await createErrorAlert(err.message);
    }
  };

  handleBillingChange = async () => {
    await this.props.fetchOrderHistory();
  };

  handleOrderCancel = async (
    urn,
    urnType,
    isRefund,
    isCancelRequest,
    cancelReason,
    followUp
  ) => {
    const {
      cancelOrder,
      cancelTermPurchase,
      createErrorAlert,
      createNotificationAlert,
      user,
      updateNotificationPreferences,
    } = this.props;
    try {
      let msg;

      if (urnType === FLEX_SUBSCRIPTION) {
        await cancelOrder(
          urn,
          isRefund,
          isCancelRequest,
          cancelReason,
          followUp
        );
        if (isCancelRequest) {
          await updateNotificationPreferences(user.id, [
            {
              category: 'cancellation',
              channel: 'phone',
              value: false,
            },
            {
              category: 'cancellation',
              channel: 'email',
              value: true,
            },
          ]);
          msg = __('We received your cancellation request.');
        } else {
          msg = __('Your cancellation request has been processed.');
        }
      } else {
        await cancelTermPurchase({ urn }, isRefund);
        msg = __('Your purchase is pending cancellation.');
      }

      if (isRefund && !isCancelRequest) {
        msg = msg + ' ';
        msg = msg + __('A refund is being processed to your account.');
      }

      await createNotificationAlert(msg);
    } catch (err) {
      await createErrorAlert(err.message);
    }
  };

  handleOrderUncancel = async (urn) => {
    const {
      createErrorAlert,
      createNotificationAlert,
      fetchOrderHistory,
      uncancelOrder,
    } = this.props;
    try {
      await uncancelOrder(urn);
      const msg = __(
        'You closed your cancellation request. Your subscription is now active.'
      );
      await createNotificationAlert(msg);
      fetchOrderHistory();
    } catch (err) {
      const errorMsg = __(
        'You cannot re-enroll in the subscription. Please contact support@udacity.com if you need help.'
      );
      await createErrorAlert(errorMsg);
    }
  };

  handleDiscountApplied = async () => {
    const { createErrorAlert, createNotificationAlert } = this.props;
    try {
      // TODO: possibly Add price info
      const msg = __('Your discount has been applied!');
      await createNotificationAlert(msg);
      await this.props.fetchOrderHistory();
    } catch (err) {
      await createErrorAlert(err.message);
    }
  };

  getSubscriptions = () => {
    const { orderHistory } = this.props;

    return _.sortBy(orderHistory, (subscription) => {
      const nextPayment = subscription.next_payment;
      return nextPayment
        ? new Date(nextPayment.due_at)
        : new Date(
            _.get(
              subscription,
              'payment_history[0].charge.charged_at',
              subscription.created_at
            )
          );
    }).reverse();
  };

  renderMoreItems = (total) => {
    const { hideCards } = this.state;
    return [
      <div styleName="showing" key="line">
        <div styleName="line" />
        <Text size="xs" spacing="none">
          {__('Showing <%= visible %> of <%= total %> Subscriptions', {
            visible: hideCards ? NUM_INITIAL_ITEMS : total,
            total,
          })}
        </Text>
        <div styleName="line" />
      </div>,

      <a
        href="#"
        onClick={this.handleShowMoreClick}
        styleName="center"
        key="link"
      >
        <h2 color="cerulean" align="center" styleName="see-more">
          {hideCards ? __('See More') : __('See Less')}
        </h2>
      </a>,
    ];
  };

  renderNoSubscriptions() {
    return (
      <div styleName="no-subscriptions">
        <img
          src={GhostSleepingImage}
          alt={__('Illustration of a sleeping book')}
        />
        <div>
          <Heading size="h3" spacing="2x">
            {__('You have yet to enroll in a Nanodegree program.')}
          </Heading>
          <Button
            external
            href="https://www.udacity.com/nanodegree"
            label={__('See our programs')}
            variant="primary"
          />
        </div>
      </div>
    );
  }

  renderSubscriptions = (subscriptions) => {
    const {
      billingInfo: { auto_renew_eligible: autoRenewEligible },
      isReadyToGraduateNdKeys,
    } = this.props;

    return (
      <ul>
        {_.map(subscriptions, (subscription) => {
          const canGraduate = _.includes(
            isReadyToGraduateNdKeys,
            _.get(subscription, 'purchased_products[0].nanodegree_key')
          );
          const autoRenewConfigurable = _.get(
            subscription,
            'payment_method.supports_auto_renew',
            false
          );
          return (
            <SubscriptionCard
              subscription={subscription}
              key={subscription.urn}
              autoRenewConfigurable={autoRenewConfigurable}
              autoRenewEligible={autoRenewEligible}
              onAutoRenewChange={this.handleAutoRenewChange}
              onOrderCancel={this.handleOrderCancel}
              onOrderUncancel={this.handleOrderUncancel}
              onDiscountApplied={this.handleDiscountApplied}
              canGraduate={canGraduate}
              handleOrderHistoryUpdate={this.props.fetchOrderHistory}
            />
          );
        })}
      </ul>
    );
  };

  render() {
    const { billingInfo, orderHistory } = this.props;
    const { hideCards } = this.state;

    const sortedSubscriptions = this.getSubscriptions();
    const total = _.size(this.getSubscriptions());
    const moreItems = total > NUM_INITIAL_ITEMS;
    const visibleSubscriptions = hideCards
      ? sortedSubscriptions.slice(0, NUM_INITIAL_ITEMS)
      : sortedSubscriptions;

    const billingMethod = _.get(billingInfo, 'billing_methods[0]');

    return (
      <section styleName="content-container">
        <Loading busy={false} label={__('Loading')}>
          <Heading size="h3" as="h1">
            {__('Subscriptions & Billing')}
          </Heading>
          {total > 0
            ? this.renderSubscriptions(visibleSubscriptions)
            : this.renderNoSubscriptions()}
          {moreItems && this.renderMoreItems(total)}
          <div styleName="billing-card">
            <BillingCard
              billingMethod={billingMethod}
              onBillingChange={this.handleBillingChange}
              subscriptions={orderHistory}
            />
          </div>
          <div styleName="footer">
            <Heading size="h5" spacing="half">
              {__('Need Help?')}
            </Heading>
            <Text size="sm">
              {__(
                'Check out <a href="https://udacity.zendesk.com/hc/en-us" target="_blank">Help and FAQs</a>',
                { renderHTML: true }
              )}
            </Text>
          </div>
        </Loading>
      </section>
    );
  }
}

export const mapStateToProps = (state) => {
  return {
    billingInfo: PaymentsHelper.State.getBillingInfo(state),
    orderHistory: PaymentsHelper.State.getOrderHistory(state),
    isReadyToGraduateNdKeys: _.chain(
      UserHelper.State.getSubscribedNanodegrees(state)
    )
      .filter(NanodegreeHelper.isReadyToGraduate)
      .map('key')
      .value(),
    user: SettingsHelper.State.getUser(state),
  };
};

export default connect(mapStateToProps, {
  createSuccessAlert: Actions.createSuccessAlert,
  createNotificationAlert: Actions.createNotificationAlert,
  createErrorAlert: Actions.createErrorAlert,
  cancelOrder: Actions.cancelOrder,
  cancelTermPurchase: Actions.cancelTermPurchase,
  fetchOrderHistory: Actions.fetchOrderHistory,
  fetchSubscribedNanodegrees: Actions.fetchSubscribedNanodegrees,
  uncancelOrder: Actions.uncancelOrder,
  updateAutoRenew: Actions.updateAutoRenew,
  updateNotificationPreferences: Actions.updateNotificationPreferences,
})(Subscriptions);
