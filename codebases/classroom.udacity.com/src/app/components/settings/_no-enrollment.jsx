import { IconCourse, IconNanodegree } from '@udacity/veritas-icons';
import PropTypes from 'prop-types';
import { __ } from 'services/localization-service';
import styles from './_no-enrollment.scss';

export default cssModule(
  class extends React.Component {
    static displayName = 'settings/setting-subscriptions/_no-enrollment';

    static propTypes = {
      enrollmentType: PropTypes.string,
    };

    render() {
      var { enrollmentType } = this.props;
      var text;
      var icon;

      if (enrollmentType === 'course') {
        text = __('You currently do not have any course enrollments');
        icon = <IconCourse size="lg" color="green" />;
      } else {
        text = __('You currently do not have any subscriptions');
        icon = <IconNanodegree size="lg" color="cerulean" />;
      }

      return (
        <div styleName="no-enroll-container">
          {icon}
          <h4 styleName="status-text">{text}</h4>
          <a href={__('https://www.udacity.com/courses/all')} target="_blank">
            {__('See full catalog')}
          </a>
        </div>
      );
    }
  },
  styles
);
