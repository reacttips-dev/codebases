import { Heading, Loading } from '@udacity/veritas-components';
import { Tab, TabList, TabPanel, Tabs } from 'react-tabs';
import { __, i18n } from 'services/localization-service';

import Actions from 'actions';
import AddPayment from '../_add-payment';
import ClassroomPropTypes from 'components/prop-types';
import CreditCardWrapper from '../_credit-card-wrapper';
import { PaymentCard } from '@udacity/ureact-payment';
import PaymentSepa from '../_payment-sepa';
import PropTypes from 'prop-types';
import SepaFormWrapper from '../_sepa-form-wrapper';
import StripeService from 'services/stripe-service';
import SubscriptionHelper from 'helpers/subscription-helper';
import { connect } from 'react-redux';
import styles from './_billing-card.scss';

@cssModule(styles)
export class BillingCard extends React.Component {
  static displayName = 'settings/subscriptions/_billing-card';

  static propTypes = {
    billingMethod: ClassroomPropTypes.billingMethod,
    onBillingChange: PropTypes.func.isRequired,
    onDeletePaymentMethod: PropTypes.func,
    subscriptions: PropTypes.array,
  };

  static defaultProps = {
    onDeletePaymentMethod: () => {},
    subscriptions: [],
  };

  state = {
    editingComponent: null,
    loading: true,
    errorMessage: {
      show: false,
      text: '',
    },
  };

  componentDidMount() {
    if (i18n.getCountryCode() === 'CN') {
      // We do not need StripeService in China
      this.setState({ loading: false });
    } else {
      StripeService.load().then(() => this.setState({ loading: false }));
    }
  }

  handleAddClick = () => {
    this.setState({
      editingComponent: CreditCardWrapper,
    });
  };

  handleCancelClick = () => {
    this.setState({
      editingComponent: null,
    });
  };

  handleEditClick = (evt) => {
    evt.preventDefault();
    this.setState({
      editingComponent: CreditCardWrapper,
    });
  };

  handleSaveSuccess = (newAddress) => {
    // Finish editing and show the user the new payment details
    this.props.onBillingChange();
    this.setState({
      editingComponent: null,
      address: newAddress,
    });
  };

  handleRemoveClick = (evt) => {
    const { billingMethod } = this.props;

    evt.preventDefault();
    if (this._isSepaPayment(billingMethod)) {
      this._showCannotDeleteSepaError();
    } else {
      this.props.onDeletePaymentMethod(billingMethod.urn).then(() => {
        this.props.onBillingChange().then(() => {
          this.setState({ editingComponent: null });
        });
      });
    }
  };

  _isSepaPayment = (method) => {
    return method ? method.type === 'sepa_debit' : false;
  };

  _renderMultiplePaymentForm = (isSepaEnabled, urn) => {
    return (
      <fieldset styleName="billing-fieldset">
        <Tabs
          styleName="payment-method-tabs"
          selectedIndex={isSepaEnabled ? 1 : 0}
        >
          <TabList>
            <Tab>Credit Card</Tab>
            <Tab>SEPA Direct-Debit</Tab>
          </TabList>

          <TabPanel>{this._renderEditingComponent(urn)}</TabPanel>
          <TabPanel>
            <SepaFormWrapper
              onCancelClick={this.handleCancelClick}
              onSaveSuccess={this.handleSaveSuccess}
            />
          </TabPanel>
        </Tabs>
      </fieldset>
    );
  };

  _showCannotDeleteSepaError = () => {
    this.setState({
      errorMessage: {
        show: true,
        text: __(`To delete this payment option, please send an empty email with the subject line
                           "Delete SEPA payment details" to de-support@udacity.com`),
      },
    });
  };

  _renderEditingComponent = (urn) => {
    const EditingComponent = this.state.editingComponent;
    const { billingMethod } = this.props;
    const props = {
      billingMethod,
      onCancelClick: this.handleCancelClick,
      onSaveSuccess: this.handleSaveSuccess,
      urn: urn,
      onHandleRemoveClick: this.handleRemoveClick,
      showCannotDeleteSepaError: this._showCannotDeleteSepaError,
    };
    return <EditingComponent {...props} />;
  };

  _shouldShowRemoveButton = (hasPaymentMethod) => {
    if (!hasPaymentMethod) return false;

    const { subscriptions } = this.props;
    const statusThatHidesRemoveButton = [
      SubscriptionHelper.status.ACTIVE,
      SubscriptionHelper.status.CANCELING,
      SubscriptionHelper.status.TRIALING,
    ];

    return !_.some(subscriptions, (subscription) => {
      const subscriptionStatus = SubscriptionHelper.subscriptionStatus(
        subscription
      );

      return statusThatHidesRemoveButton.includes(subscriptionStatus);
    });
  };

  _renderHeaders = (hasPaymentMethod) => {
    const showRemoveButton = this._shouldShowRemoveButton(hasPaymentMethod);

    return (
      <div styleName="header">
        <Heading size="h5" as="h2" spacing="none">
          {__('Payment Method')}
        </Heading>
        <div>
          {showRemoveButton && (
            <a href="#" onClick={this.handleRemoveClick} styleName="edit">
              <Heading size="h5" as="h3">
                {__('remove')}
              </Heading>
            </a>
          )}
          {hasPaymentMethod && (
            <a href="#" onClick={this.handleEditClick} styleName="edit">
              <Heading size="h5" as="h3">
                {__('edit')}
              </Heading>
            </a>
          )}
        </div>
      </div>
    );
  };

  render() {
    const { billingMethod } = this.props;
    const { editingComponent } = this.state;
    let paymentContainer;
    const isChina = i18n.getCountryCode() === 'CN';

    // See EXCO-721
    const isSepaEnabled = false;
    /*
      GermanyPayments.isSEPACountry() &&
      !GermanyPayments.hasCurrencyConflict(subscriptions);
      */

    if (isChina) {
      return (
        <div>
          <section styleName="content-container" />
        </div>
      );
    }

    if (this.state.loading) {
      return (
        <section styleName="content-container">
          <Loading label={__('Loading')} />
        </section>
      );
    }

    if (_.isNil(billingMethod)) {
      paymentContainer = <AddPayment onAddClick={this.handleAddClick} />;
    } else {
      const isSepaPayment = this._isSepaPayment(billingMethod);
      paymentContainer = (
        <div>
          {isSepaPayment ? (
            <PaymentSepa source={billingMethod} />
          ) : (
            <PaymentCard billingMethod={billingMethod} />
          )}
          {this.state.errorMessage.show ? (
            <span styleName="error-container">
              {this.state.errorMessage.text}
            </span>
          ) : null}
        </div>
      );
    }

    return (
      <div styleName="item">
        {editingComponent === null ? (
          <div>
            {this._renderHeaders(billingMethod)}
            {paymentContainer}
          </div>
        ) : isSepaEnabled ? (
          this._renderMultiplePaymentForm(
            isSepaEnabled,
            _.get(billingMethod, 'urn')
          )
        ) : (
          this._renderEditingComponent(_.get(billingMethod, 'urn'))
        )}
      </div>
    );
  }
}

export default connect(null, {
  onDeletePaymentMethod: Actions.deletePaymentMethod,
})(BillingCard);
