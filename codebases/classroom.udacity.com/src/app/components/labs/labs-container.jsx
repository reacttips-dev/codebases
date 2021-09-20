import Actions from 'actions';
import ClassroomPropTypes from 'components/prop-types';
import PropTypes from 'prop-types';
import SettingsHelper from 'helpers/settings-helper';
import { connect } from 'react-redux';
import withAnalytics from 'decorators/analytics';

const { fetchLab, updateLabResult } = Actions;

const mapStateToProps = (state) => ({
  userId: _.get(SettingsHelper.State.getUser(state), 'id'),
});

@withAnalytics
export class LabsContainer extends React.Component {
  static displayName = 'components/labs/labs-container';

  static propTypes = {
    lab: ClassroomPropTypes.lab.isRequired,
    fetchLab: PropTypes.func.isRequired,
    updateLabResult: PropTypes.func.isRequired,
    userId: PropTypes.string.isRequired,
    track: PropTypes.func.isRequired, //withAnalytics
  };

  componentWillUnmount() {
    this.trackLabActivity('lab_abandoned');
  }

  trackLabActivity = (eventName, opts) => {
    const { userId, track, lab } = this.props;

    track(eventName, {
      user_id: userId,
      lab_type: lab.evaluation_objective,
      lab_duration: lab.duration * 60,
      lab_result: lab.result.state,
      rating: lab.result.skill_confidence_rating_after,
      rating_scale: 5,
      ...opts,
    });
  };

  render() {
    return React.cloneElement(this.props.children, {
      ...this.props,
      trackLabActivity: this.trackLabActivity,
    });
  }
}

export default connect(mapStateToProps, { fetchLab, updateLabResult })(
  LabsContainer
);
