import PropTypes from 'prop-types';
import TextHelper from 'helpers/text-helper';
import { __ } from 'services/localization-service';
import styles from './duration.scss';

@cssModule(styles)
export default class Duration extends React.Component {
  static displayName = 'common/duration';

  static propTypes = {
    duration: PropTypes.number.isRequired,
    showAsRemainder: PropTypes.bool,
  };

  static defaultProps = {
    showAsRemainder: false,
  };

  render() {
    var { duration, showAsRemainder } = this.props;
    const roundedDuration = Math.round(duration);

    if (duration) {
      const durationText = TextHelper.formatDuration(roundedDuration);
      const shortDurationText = TextHelper.formatDurationShort(roundedDuration);

      return (
        <div>
          <div styleName="duration">
            {showAsRemainder
              ? __('<%= durationText %> left', { durationText })
              : durationText}
          </div>
          <div styleName="short-duration">
            {showAsRemainder
              ? __('<%= durationText %> left', {
                  durationText: shortDurationText,
                })
              : shortDurationText}
          </div>
        </div>
      );
    } else {
      return null;
    }
  }
}
