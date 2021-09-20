import { SepaForm, TokenService } from '@udacity/ureact-payment';
import Actions from 'actions';
import BillingHeader from './_billing-header';
import PropTypes from 'prop-types';
import SettingButtons from './_setting-buttons';
import { __ } from 'services/localization-service';
import { connect } from 'react-redux';
import styles from './_sepa-form-wrapper.scss';

const mapDispatchToProps = {
  onUpdateDefaultSource: Actions.updateDefaultSource,
  createErrorAlert: Actions.createErrorAlert,
};

@cssModule(styles)
export class SepaFormWrapper extends React.Component {
  static displayName = 'settings/setting-billing/_sepa-form-wrapper';

  static propTypes = {
    onCancelClick: PropTypes.func,
    onSaveSuccess: PropTypes.func.isRequired,
  };

  static defaultProps = {
    onCancelClick: _.noop,
  };

  state = {
    validateAllFields: false,
    bankAccount: {},
    valid: false,
  };

  handleSaveClick = async () => {
    try {
      const { onUpdateDefaultSource } = this.props;
      const { bankAccount, valid } = this.state;
      if (!valid) {
        this.setState({ validateAllFields: true });
        return;
      }
      const sepaTokenData = await TokenService.createSepaToken(bankAccount);
      await onUpdateDefaultSource(sepaTokenData);
      this.props.onSaveSuccess();
    } catch (error) {
      this.props.createErrorAlert(
        __('An error occurred while trying to update your SEPA direct-debit')
      );
    }
  };

  handleOnChange = ({ bankAccount, valid }) => {
    this.setState({ bankAccount, valid });
  };

  render() {
    const { validateAllFields } = this.state;

    return (
      <div>
        <div className="sepa-form">
          <div styleName="content-container">
            <BillingHeader />
            <div styleName="inputs-container">
              <SepaForm
                onChange={this.handleOnChange}
                validateAllFields={validateAllFields}
              />
            </div>
          </div>
        </div>
        <SettingButtons
          onSaveClick={this.handleSaveClick}
          onCancelClick={this.props.onCancelClick}
        />
      </div>
    );
  }
}

export default connect(null, mapDispatchToProps)(SepaFormWrapper);
