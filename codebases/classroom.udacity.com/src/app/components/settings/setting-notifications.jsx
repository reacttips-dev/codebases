import ClassroomPropTypes from 'components/prop-types';
import { ExternalServiceConsumer } from 'components/common/external-service-context';
import { Loading } from '@udacity/veritas-components';
import NanodegreeHelper from 'helpers/nanodegree-helper';
import NotificationPreferencesHelper from 'helpers/notification-preferences-helper';
import Notifications from './_notifications';
import PropTypes from 'prop-types';
import ReviewsApiService from 'services/reviews-api-service';
import SettingsHelper from 'helpers/settings-helper';
import UiHelper from 'helpers/ui-helper';
import { __ } from 'services/localization-service';
import { actionsBinder } from 'helpers/action-helper';
import { connect } from 'react-redux';

export class SettingNotifications extends React.Component {
  static displayName = 'settings/notifications';

  static propTypes = {
    nanodegrees: PropTypes.arrayOf(ClassroomPropTypes.nanodegree),
    schedules: PropTypes.objectOf(ClassroomPropTypes.schedule).isRequired,
    schedulesLoaded: PropTypes.bool.isRequired,
    user: PropTypes.object.isRequired,

    // connect
    fetchSchedules: PropTypes.func.isRequired,
    activeNotificationPreferenceChanges: PropTypes.arrayOf(PropTypes.string)
      .isRequired,
    fetchNotificationPreferences: PropTypes.func.isRequired,
    preferences: PropTypes.object,
    preferencesLoaded: PropTypes.bool.isRequired,
    updateNotificationPreferences: PropTypes.func.isRequired,
    updateNotificationPreferencesUnsubscribeAll: PropTypes.func.isRequired,
    updateSchedule: PropTypes.func.isRequired,
    isStudentHubEnabled: PropTypes.bool,
  };

  state = {
    projectReviewerLoaded: false,
    isProjectReviewer: null,
  };

  componentDidMount() {
    const {
      fetchNotificationPreferences,
      fetchSchedules,
      nanodegrees,
      user,
    } = this.props;

    fetchSchedules(user.id, _.map(nanodegrees, 'key'));

    fetchNotificationPreferences(user.id);

    ReviewsApiService.isProjectReviewer().then((isProjectReviewer) => {
      this.setState({ projectReviewerLoaded: true, isProjectReviewer });
    });
  }

  _saveSchedulePreferences = ({ email, sms }) => {
    const { schedules, updateSchedule, user } = this.props;

    return Promise.map(_.toPairs(schedules), ([ndKey, schedule]) => {
      return updateSchedule(user.id, ndKey, schedule.user_timezone, email, sms);
    });
  };

  _saveScheduleReminder = (type, value) => {
    const { schedules } = this.props;

    const settings = {
      email: _.some(schedules, 'email'),
      sms: _.some(schedules, 'sms'),
    };
    settings[type] = value;

    return this._saveSchedulePreferences({
      email: settings['email'],
      sms: settings['sms'],
    });
  };

  _saveNotificationPreference = (category, channel, value) => {
    const { updateNotificationPreferences, user } = this.props;

    return updateNotificationPreferences(user.id, [
      { category, channel, value },
    ]);
  };

  handleSaveSetting = (group, type, value) => {
    if (group === 'studyReminders') {
      this._saveScheduleReminder(type, value);
    }

    this._saveNotificationPreference(group, type, value);
  };

  handleUnsubscribeAll = (from) => {
    const { updateNotificationPreferencesUnsubscribeAll, user } = this.props;
    updateNotificationPreferencesUnsubscribeAll(user.id, from);
    this._saveScheduleReminder(from, false);
  };

  render() {
    const {
      activeNotificationPreferenceChanges,
      nanodegrees,
      preferences,
      preferencesLoaded,
      schedules,
      schedulesLoaded,
      user,
      isStudentHubEnabled,
    } = this.props;
    const { isProjectReviewer, projectReviewerLoaded } = this.state;

    if (!preferencesLoaded || !schedulesLoaded || !projectReviewerLoaded) {
      return (
        <div style={{ display: 'flex' }}>
          <Loading label={__('Loading')} />
        </div>
      );
    }

    const isEnterprise = _.some(nanodegrees, NanodegreeHelper.isEnterprise);

    const settings = {
      ...preferences,
      studyReminders: {
        // Override with the data from this system for now
        email: _.some(schedules, 'email'),
        sms: _.some(schedules, 'sms'),
      },
    };

    return (
      <ExternalServiceConsumer>
        {({ isCareerPortalEnabled }) => {
          return (
            <Notifications
              hasSchedule={!_.isEmpty(schedules)}
              isEnterprise={isEnterprise}
              isPhoneNumberVerified={user.is_phone_number_verified}
              isCareerPortalEnabled={isCareerPortalEnabled}
              isProjectReviewer={isProjectReviewer}
              isStudentHubEnabled={isStudentHubEnabled}
              saveSetting={this.handleSaveSetting}
              savingGroups={activeNotificationPreferenceChanges}
              settings={settings}
              studentHubUsername={SettingsHelper.getStudentHubUsername(user)}
              unsubscribeAll={this.handleUnsubscribeAll}
            />
          );
        }}
      </ExternalServiceConsumer>
    );
  }
}

function mapStateToProps(state) {
  return {
    nanodegrees: SettingsHelper.State.getNanodegrees(state),
    activeNotificationPreferenceChanges: UiHelper.State.activeNotificationPreferenceChanges(
      state
    ),
    preferences: NotificationPreferencesHelper.State.preferences(state),
    preferencesLoaded: !UiHelper.State.isFetchingNotificationPreferences(state),
    schedules: state.schedules,
    schedulesLoaded: !UiHelper.State.isFetchingSchedules(state),
    isStudentHubEnabled: SettingsHelper.State.getHasStudentHub(state),
  };
}

export default connect(
  mapStateToProps,
  actionsBinder(
    'fetchNotificationPreferences',
    'fetchSchedules',
    'updateNotificationPreferences',
    'updateNotificationPreferencesUnsubscribeAll',
    'updateSchedule'
  )
)(SettingNotifications);
