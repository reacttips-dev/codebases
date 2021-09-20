import {
  Button,
  Heading,
  Modal,
  Text,
  TextInput,
} from '@udacity/veritas-components';

import { RECURRING, UPFRONT_RECURRING } from 'constants/payment-status';
import Actions from 'actions';
import AnalyticsService from 'services/analytics-service';
import AuthService from 'services/authentication-service';
import ClassroomPropTypes from 'components/prop-types';
import FileSaver from 'file-saver';
import PrinterService from 'services/printer-service';
import PropTypes from 'prop-types';
import { __ } from 'services/localization-service';
import { connect } from 'react-redux';
import { i18n } from 'services/localization-service';

const mapDispatchToProps = {
  createErrorAlert: Actions.createErrorAlert,
};

export class InvoiceModal extends React.Component {
  static propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    payment: ClassroomPropTypes.prevPayment.isRequired,
  };

  state = {
    fullName: '',
    address1: '',
    address2: '',
    company: '',
  };

  handleTextChange = (event) => {
    const name = _.get(event, 'target.name');
    const value = _.get(event, 'target.value');
    this.setState({ [name]: value });
  };

  handleDownloadInvoice = () => {
    const {
      createErrorAlert,
      payment,
      onClose,
      productInfo: { cohort_id, nanodegree_key, term_id },
      paymentPlan,
    } = this.props;
    const params = this.getInvoiceParams(payment, paymentPlan);
    const {
      urn,
      total_amount: { display },
    } = payment;
    const user_id = AuthService.getCurrentUserId();
    return PrinterService.fetchInvoice(params)
      .then((resp) => {
        const blob = new File([resp], { type: 'application/octet-stream' });
        FileSaver.saveAs(blob, `Payment receipt ${params.invoice_id}.pdf`);
        AnalyticsService.track(`Receipt Downloaded`, {
          invoiceUrn: urn, // camelCase to match the homeone event
          payment_plan_type: this.getType(paymentPlan),
          receipt_price: display,
          user_id,
          cohort_id,
          nanodegree_key,
          term_id,
          ..._.omit(params, ['template', 'invoice_id']),
        });
        onClose();
      })
      .catch((err) => {
        const message = _.get(err, 'error.message');
        const mappedError = PrinterService.mapInvoiceError(message);
        console.error(message);
        createErrorAlert(mappedError);
        onClose();
      });
  };

  getInvoiceParams = (payment, paymentPlan) => {
    const { address1, address2, company, fullName: name } = this.state;
    const invoice_id = _.last(_.split(_.get(payment, 'urn'), ':'));
    const { line_items } = payment;
    const template = 'nd-term-invoice'; // only invoice type supported in printer
    const locale = i18n.getLocale();

    return {
      address_1: address1,
      address_2: address2,
      company,
      invoice_id,
      locale,
      name,
      template,
      line_items,
      type: this.getType(paymentPlan),
    };
  };

  getType(paymentPlan) {
    switch (_.get(paymentPlan, 'type')) {
      case RECURRING:
        return 'Month';
        break;
      case UPFRONT_RECURRING:
        return `${_.get(paymentPlan, 'upfront_interval_count')} Month Bundle`;
      default:
        return 'Seat';
    }
  }

  render() {
    const { open, onClose } = this.props;
    const locale = i18n.getLocale();

    const { fullName, address1, address2, company } = this.state;
    return locale === 'en-us' ? (
      <Modal onClose={onClose} label="request-receipt" open={open}>
        <Heading spacing="1x" size="h3">
          {__('Download your receipt')}
        </Heading>
        <Text>
          {__(
            'Add your name and address to download your receipt. Add your company information and address if you need an receipt for your employer.'
          )}
        </Text>
        <TextInput
          id="name"
          label={__('Full Name')}
          name="fullName"
          required
          onChange={this.handleTextChange}
          value={fullName}
        />
        <TextInput
          id="company"
          label={__('Company')}
          name="company"
          onChange={this.handleTextChange}
          value={company}
        />
        <TextInput
          id="address1"
          label={__('Address 1')}
          name="address1"
          onChange={this.handleTextChange}
          value={address1}
        />
        <TextInput
          id="address2"
          label={__('Address 2')}
          name="address2"
          onChange={this.handleTextChange}
          value={address2}
        />
        <Button
          disabled={_.isEmpty(fullName)}
          label={__('download receipt')}
          onClick={this.handleDownloadInvoice}
          variant="primary"
        />
      </Modal>
    ) : (
      <Modal onClose={onClose} label="request-receipt" open={open}>
        <Heading spacing="1x" size="h3" align="center">
          {__('Invoice unavaible for your current language setting.')}
        </Heading>
        <Text align="center" style="margin:auto;">
          {__(
            'We are currently working to support receipt downloading in multiple languages. Please <a href="<%= classroomUrl %>">update your language to English</a> to download a receipt.',
            {
              classroomUrl: `${CONFIG.classroomUrl}/settings/language-preference`,
            },
            { renderHTML: true }
          )}
        </Text>
      </Modal>
    );
  }
}

export default connect(null, mapDispatchToProps)(InvoiceModal);
