import { FAILED, FILTERABLE_PAYMENT_STATUSES, PAST_DUE } from './_constants';
import { IconDownload, IconWarning } from '@udacity/veritas-icons';
import { RoundButton, Tooltip } from '@udacity/veritas-components';

import ClassroomPropTypes from 'components/prop-types';
import DateHelper from 'helpers/date-helper';
import InvoiceModal from './_invoice-modal';
import PaymentsHelper from 'helpers/payments-helper';
import PropTypes from 'prop-types';
import { __ } from 'services/localization-service';
import styles from './_subscription-card-billing-history.scss';

@cssModule(styles)
export default class BillingHistory extends React.Component {
  static propTypes = {
    nextPayment: ClassroomPropTypes.nextPayment,
    payments: ClassroomPropTypes.paymentHistory,
    productInfo: ClassroomPropTypes.purchasedProduct,
    paymentPlan: ClassroomPropTypes.paymentPlan,
    isFlexSubscription: PropTypes.bool.isRequired,
  };

  state = {
    showInvoiceModal: false,
  };

  filteredPayments = () => {
    const { payments } = this.props;
    return _.filter(
      payments,
      ({ status }) => !_.includes(FILTERABLE_PAYMENT_STATUSES, status)
    );
  };

  paymentsWithNext = () => {
    const { nextPayment } = this.props;

    if (nextPayment) {
      const formattedNextPayment = {
        ...nextPayment,
        status: PaymentsHelper.isPaymentOverdue(nextPayment)
          ? 'past_due'
          : 'due',
        charge: {
          charged_at: _.get(nextPayment, 'due_at'),
        },
      };
      return [formattedNextPayment, ...this.filteredPayments()];
    }

    return this.filteredPayments();
  };

  openModal = (id) => {
    this.setState({ showInvoiceModal: id });
  };

  closeModal = () => {
    this.setState({ showInvoiceModal: null });
  };

  renderTooltip(date) {
    const gracePeriod = DateHelper.getGracePeriod(date);
    const tooltipCopy = __(
      'If you do not make a payment before the grace period ends on <%= gracePeriod %>, your subscription and enrollment to the program will become inactive',
      { gracePeriod }
    );
    const trigger = <IconWarning color="orange" size="md" />;

    return (
      <Tooltip
        content={tooltipCopy}
        trigger={trigger}
        direction="bottom"
        inverse
      />
    );
  }

  renderStatus(payment) {
    const status = _.get(payment, 'status');
    const displayStatus = PaymentsHelper.getDisplayStatus(payment);
    return status === PAST_DUE || status === FAILED ? (
      <div>
        <span styleName="overdue">{displayStatus}</span>
        {this.renderTooltip(_.get(payment, 'charge.charged_at'))}
      </div>
    ) : (
      <div>{displayStatus}</div>
    );
  }

  render() {
    const { isFlexSubscription } = this.props;
    const { showInvoiceModal } = this.state;

    return (
      <div styleName="billing-history">
        <div styleName={isFlexSubscription ? 'grid-5' : 'grid-4'}>
          <div styleName="label">{__('Due Date')}</div>
          <div styleName="label">{__('Status')}</div>
          <div styleName="label">{__('Amount')}</div>
          {isFlexSubscription && (
            <div styleName="label">{__('Billing Period')}</div>
          )}
          <div styleName="label">{__('Receipt')}</div>
          {_.map(this.paymentsWithNext(), (payment, i) => (
            <React.Fragment key={_.get(payment, 'urn')}>
              <div styleName="value">
                {DateHelper.formatShortMonth(
                  _.get(payment, 'charge.charged_at')
                )}
              </div>
              <div styleName="value">{this.renderStatus(payment)}</div>
              <div styleName="value">
                {PaymentsHelper.getDisplayPrice(payment)}
              </div>
              {isFlexSubscription && (
                <div styleName="value">{`${DateHelper.formatShortMonth(
                  _.get(payment, 'period_start')
                )} - ${DateHelper.formatShortMonth(
                  _.get(payment, 'period_end')
                )}`}</div>
              )}
              <div styleName="value">
                <RoundButton
                  label={__('request receipt')}
                  icon={<IconDownload color="cerulean" size="sm" />}
                  onClick={() => this.openModal(i)}
                  variant="minimal"
                />
                <InvoiceModal
                  payment={payment}
                  productInfo={this.props.productInfo}
                  open={showInvoiceModal === i}
                  onClose={this.closeModal}
                  paymentPlan={this.props.paymentPlan}
                />
              </div>
            </React.Fragment>
          ))}
        </div>
      </div>
    );
  }
}
