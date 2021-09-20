import { CreditCardForm, TokenService } from '@udacity/ureact-payment';

import Actions from 'actions';
import BillingHeader from './_billing-header';
import { Checkbox } from '@udacity/veritas-components';
import PropTypes from 'prop-types';
import SettingButtons from './_setting-buttons';
import { __ } from 'services/localization-service';
import { connect } from 'react-redux';
import styles from './_credit-card-wrapper.scss';

const mapDispatchToProps = {
  onUpdateDefaultPaymentMethod: Actions.updateDefaultPaymentMethod,
  createErrorAlert: Actions.createErrorAlert,
};

const emptyAddressDetails = {
  city: '',
  country: '',
  line1: '',
  line2: '',
  phoneNumber: '',
  postalCode: '',
  region: '',
  state: '',
};

const emptyCardDetails = {
  cardNumber: '',
  expiry: '',
  cvc: '',
  type: '',
};

@cssModule(styles)
export class CreditCardWrapper extends React.Component {
  static displayName = 'settings/setting-billing/_credit-card-wrapper';
  static propTypes = {
    billingMethod: PropTypes.object,
    onCancelClick: PropTypes.func,
    onSaveSuccess: PropTypes.func.isRequired,
  };

  static defaultProps = {
    onCancelClick: _.noop,
  };

  state = {
    validateAllFields: false,
    card: {},
    valid: false,
  };

  getAddressFromBilling = () => {
    const { billingMethod } = this.props;
    let address = null;
    if (
      !_.isNil(billingMethod) &&
      _.has(billingMethod, 'credit_card.address')
    ) {
      const billingData = billingMethod.credit_card.address;
      address = {
        city: billingData.city,
        country: billingData.country,
        line1: billingData.line1,
        line2: billingData.line2,
        phoneNumber: billingData.phone,
        postalCode: billingData.postal_code,
        region: billingData.region,
      };
    }
    return address;
  };

  handleSaveClick = async () => {
    try {
      const { onUpdateDefaultPaymentMethod } = this.props;
      const { card, valid } = this.state;
      if (!valid) {
        this.setState({ validateAllFields: true });
        return;
      }
      const cardTokenData = await TokenService.createCardToken('stripe', card);
      const address = _.pick(card, [
        'line1',
        'line2',
        'city',
        'region',
        'country',
        'postalCode',
      ]);
      await onUpdateDefaultPaymentMethod(cardTokenData.card_token, address);
      this.props.onSaveSuccess(address);
    } catch (error) {
      this.props.createErrorAlert(
        __(
          'Unable to add Card. Please verify the information you have entered.'
        )
      );
    }
  };

  handleCheckboxChange = ({ target: { checked } }) => {
    const currentAddress = this.getAddressFromBilling();
    const formAddress = checked ? currentAddress : emptyAddressDetails;
    this.setState({
      card: {
        ...formAddress,
        ...emptyCardDetails,
      },
    });
  };

  isCheckboxChecked = () => {
    const { card } = this.state;
    const currentAddress = this.getAddressFromBilling();
    // Create object with form's current address details using keys from emptyAddressDetails
    const currentFormData = _.pick(card, _.keys(emptyAddressDetails));
    return _.isEqual(currentAddress, currentFormData);
  };

  handleOnChange = ({ card, valid }) => {
    this.setState({ card, valid });
  };

  render() {
    const { onCancelClick } = this.props;
    const { card, validateAllFields } = this.state;
    const address = this.getAddressFromBilling();

    return (
      <form>
        <div styleName="content-container">
          <BillingHeader />
          <div styleName="checkbox">
            {address && (
              <Checkbox
                label={__('Use Current Billing Address')}
                checked={this.isCheckboxChecked()}
                id="current-address"
                onChange={this.handleCheckboxChange}
              />
            )}
          </div>
          <CreditCardForm
            onChange={this.handleOnChange}
            validateAllFields={validateAllFields}
            cardForm={{ card: card }}
          />
        </div>
        <div styleName="buttons-container">
          <SettingButtons
            onSaveClick={this.handleSaveClick}
            onCancelClick={onCancelClick}
          />
        </div>
      </form>
    );
  }
}

export default connect(null, mapDispatchToProps)(CreditCardWrapper);
