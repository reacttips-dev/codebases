import PropTypes from 'prop-types';
import { __ } from 'services/localization-service';
import styles from './_progress-bar.scss';

@cssModule(styles)
export default class ProgressBar extends React.Component {
  static displayName = 'common/lesson-card/_progress-bar';

  static propTypes = {
    percentage: PropTypes.number.isRequired,
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
  };

  _getPercentageText() {
    const { percentage } = this.props;

    if (percentage === 100) {
      return __('<%= percentage %>% Viewed', { percentage });
    } else if (percentage > 0) {
      return __('<%= percentage %>%', { percentage });
    } else {
      return __('Not Started');
    }
  }

  render() {
    const { percentage, width, height } = this.props;

    return (
      <div styleName="progress-bar-container">
        <div
          styleName="progress-bar"
          style={{
            width,
            height,
          }}
        >
          <div
            styleName="progress-bar-inner"
            style={{ width: `${percentage}%` }}
          />
        </div>

        <span styleName="completion-amount">{this._getPercentageText()}</span>
      </div>
    );
  }
}
