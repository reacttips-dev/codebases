import {
  Button,
  Flex,
  Heading,
  Modal,
  Text,
} from '@udacity/veritas-components';
import PropTypes from 'prop-types';
import { __ } from 'services/localization-service';

export default class AutoPayModal extends React.PureComponent {
  static propTypes = {
    onConfirmAutoPay: PropTypes.func.isRequired,
    onCloseModal: PropTypes.func.isRequired,
    isOpen: PropTypes.bool.isRequired,
  };

  render() {
    const { isOpen, onCloseModal, onConfirmAutoPay } = this.props;

    return (
      <Modal
        open={isOpen}
        onClose={onCloseModal}
        label={__('Cancel Subscription')}
        closeLabel={__('Close Modal')}
      >
        <Heading size="h2" align="center" color="slate">
          {__('Never Miss a Payment. Enable Auto-Renew.')}
        </Heading>
        <Text color="slate" align="center">
          {__(
            'Enable auto-renew to ensure you’ll never miss a payment, and have a continuous learning experience and access to services. Your subscription payment will be processed automatically until you complete your program requirements or cancel your subscription.'
          )}
        </Text>
        <Flex center full>
          <Button
            label="Enable Auto-renew"
            variant="primary"
            onClick={onConfirmAutoPay}
          />
          <Button label="Cancel" variant="secondary" onClick={onCloseModal} />
        </Flex>
      </Modal>
    );
  }
}
