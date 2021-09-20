import { IconChecked } from '@udacity/veritas-icons';
import PropTypes from 'prop-types';
import { __ } from 'services/localization-service';
import styles from './feedback-confirmation.scss';
import withFeedbackContext from 'components/content-feedback/with-feedback-context';

@cssModule(styles)
export class FeedbackConfirmation extends React.Component {
  static propTypes = {
    // withFeedbackContext
    showConfirmation: PropTypes.bool,
  };

  render() {
    const { showConfirmation } = this.props;
    if (showConfirmation) {
      return (
        <div className={styles['feedback-confirmation-container']}>
          <p>
            <IconChecked size="md" color="green" />
            {__(
              'Thank you very much for your feedback! Our team will review your input and may revise this content as needed.'
            )}
          </p>
        </div>
      );
    }
    return null;
  }
}

export default withFeedbackContext(FeedbackConfirmation);
