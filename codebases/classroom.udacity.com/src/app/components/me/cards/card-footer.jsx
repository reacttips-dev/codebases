import { IconBadge, IconCelebrate, IconGraphUp } from '@udacity/veritas-icons';
import PropTypes from 'prop-types';
import { __ } from 'services/localization-service';
import styles from './card-footer.scss';

@cssModule(styles)
export default class CardFooter extends React.Component {
  static displayName = 'me/cards/card-footer';

  static propTypes = {
    isGraduated: PropTypes.bool,
    inProgress: PropTypes.bool,
    isReadyForGraduation: PropTypes.bool,
    button: PropTypes.func,
  };

  static defaultProps = {
    isGraduated: false,
    inProgress: false,
    isReadyForGraduation: false,
    button: _.noop,
  };

  render() {
    const {
      isGraduated,
      isReadyForGraduation,
      inProgress,
      button,
    } = this.props;

    switch (true) {
      case isGraduated:
        return (
          <div styleName="footer">
            <div>
              <IconBadge size="sm" /> {__('Graduated')}
            </div>
            <div styleName="action">{isGraduated && button()}</div>
          </div>
        );

      case isReadyForGraduation:
        return (
          <div styleName="footer">
            <strong>
              <IconCelebrate size="sm" /> {__('Ready to graduate!')}
            </strong>
          </div>
        );

      case inProgress:
        return (
          <div styleName="footer">
            <IconGraphUp size="sm" /> {__('In Progress')}
          </div>
        );

      default:
        return;
    }
  }
}
