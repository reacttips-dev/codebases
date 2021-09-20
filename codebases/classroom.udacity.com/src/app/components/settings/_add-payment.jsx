import { Button, Text } from '@udacity/veritas-components';

import GhostImage from 'images/settings/ghost.gif';
import PropTypes from 'prop-types';
import { __ } from 'services/localization-service';
import styles from './_add-payment.scss';

export default cssModule(
  class extends React.Component {
    static displayName = 'settings/setting-billing/_add-payment';

    static propTypes = {
      onAddClick: PropTypes.func,
    };

    static defaultProps = {
      onAddClick: _.noop,
    };

    render() {
      return (
        <div styleName="add-payment-method">
          <img src={GhostImage} alt={__('Illustration of a ghost')} />
          <div>
            <Text>
              {__(
                'Add a credit or debit card to make future purchases faster. This may unlock the auto-renew option so you never miss a payment.'
              )}
            </Text>
            <Button
              onClick={this.props.onAddClick}
              label={__('Add Payment Method')}
              small
              variant="secondary"
            />
          </div>
        </div>
      );
    }
  },
  styles
);
