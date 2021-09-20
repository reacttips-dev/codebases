import { Checkbox, Heading } from '@udacity/veritas-components';
import {
  NotificationSettingsCard,
  NotificationSettingsCardContent,
} from './_notification-settings-card';
import ImageBullhorn from 'src/assets/images/settings/notifications/bullhorn.png';
import ImageCareers from 'src/assets/images/settings/notifications/careers.png';
import ImageCommunity from 'src/assets/images/settings/notifications/community.png';
import ImageLearningProgress from 'src/assets/images/settings/notifications/learning-progress.png';
import ImagePayment from 'src/assets/images/settings/notifications/payment.png';
import ImageReviews from 'src/assets/images/settings/notifications/reviews.png';
import ImageStudyGroup from 'src/assets/images/settings/notifications/study-group.png';
import ImageStudyReminder from 'src/assets/images/settings/notifications/study-reminder.png';
import { Link } from 'react-router';
import { NotificationPreferencesPropType } from 'services/notification-preferences-api-service';
import PropTypes from 'prop-types';
import { __ } from 'services/localization-service';
import styles from './_notifications.scss';

@cssModule(styles)
export default class Notifications extends React.Component {
  static displayName = 'settings/_notifications';

  static propTypes = {
    hasSchedule: PropTypes.bool.isRequired,
    isCareerPortalEnabled: PropTypes.bool.isRequired,
    isEnterprise: PropTypes.bool.isRequired,
    isPhoneNumberVerified: PropTypes.bool.isRequired,
    isProjectReviewer: PropTypes.bool.isRequired,
    isStudentHubEnabled: PropTypes.bool.isRequired,
    saveSetting: PropTypes.func.isRequired,
    savingGroups: PropTypes.arrayOf(PropTypes.string).isRequired,
    settings: NotificationPreferencesPropType.isRequired,
    studentHubUsername: PropTypes.string.isRequired,
    unsubscribeAll: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
  }

  handleSettingsChange = (group, type, evt) => {
    const nextValue = evt.target.checked;
    return this.props.saveSetting(group, type, nextValue);
  };

  isUnsubscribed = (from) => {
    // Do we have any values that are true? If so then return false
    return !_.some(this.props.settings, (group) => {
      return group[from] === true;
    });
  };

  handleUnsubscribeAllEmail = () => {
    this.props.unsubscribeAll('email');
  };

  handleUnsubscribeAllSMS = () => {
    this.props.unsubscribeAll('sms');
  };

  render() {
    const {
      hasSchedule,
      isEnterprise,
      isCareerPortalEnabled,
      isStudentHubEnabled,
      isPhoneNumberVerified,
      isProjectReviewer,
      savingGroups,
      settings,
      studentHubUsername,
    } = this.props;

    return (
      <section styleName="content-container">
        <div styleName="main">
          <Heading size="h3" as="h1">
            {__('Notification Preferences')}
          </Heading>

          <div styleName="content-section">
            <p styleName="intro-text">
              {__(
                'Configure your notification settings by checking the delivery method you prefer. Uncheck the box if you do not wish to receive the notifications for that communication type. SMS notifications require a '
              )}{' '}
              <Link to={`/settings/personal-info`}>
                {__('verified phone number')}
              </Link>
              {'. '}
              {__(
                'You may receive up to three messages per day and message rates may apply. Reply STOP to end.'
              )}
            </p>

            <ul>
              {hasSchedule && (
                <NotificationSettingsCard
                  image={ImageStudyReminder}
                  isSaving={_.includes(savingGroups, 'studyReminders')}
                  subtitle={__(
                    'Notify me at the time I selected in my study plan.'
                  )}
                  title={__('Study Reminders')}
                >
                  <NotificationSettingsCardContent
                    group="studyReminders"
                    settings={settings['studyReminders']}
                    isPhoneNumberVerified={isPhoneNumberVerified}
                    handleChange={_.partial(
                      this.handleSettingsChange,
                      'studyReminders'
                    )}
                  />
                </NotificationSettingsCard>
              )}

              <NotificationSettingsCard
                image={ImagePayment}
                isSaving={_.includes(savingGroups, 'paymentReminders')}
                subtitle={__('Send me messages for payment reminders.')}
                title={__('Payment Reminders')}
              >
                <NotificationSettingsCardContent
                  group="payment_reminders"
                  includePhone={false}
                  includeEmail={false}
                  settings={settings['paymentReminders']}
                  isPhoneNumberVerified={isPhoneNumberVerified}
                  handleChange={_.partial(
                    this.handleSettingsChange,
                    'paymentReminders'
                  )}
                />
              </NotificationSettingsCard>

              <NotificationSettingsCard
                image={ImageLearningProgress}
                isSaving={_.includes(savingGroups, 'learning')}
                subtitle={__(
                  'Notify me with due date reminders, check-ins and more to help me stay on track of my learning goals.'
                )}
                title={__('Learning Progress')}
              >
                <NotificationSettingsCardContent
                  group="learning"
                  settings={settings['learning']}
                  isPhoneNumberVerified={isPhoneNumberVerified}
                  handleChange={_.partial(
                    this.handleSettingsChange,
                    'learning'
                  )}
                />
              </NotificationSettingsCard>

              <NotificationSettingsCard
                image={ImageCommunity}
                isSaving={_.includes(savingGroups, 'community')}
                subtitle={__(
                  'Send me personalized messages from my Community Manager about events and news in the field.'
                )}
                title={__('Community')}
              >
                <NotificationSettingsCardContent
                  group="community"
                  settings={settings['community']}
                  isPhoneNumberVerified={isPhoneNumberVerified}
                  handleChange={_.partial(
                    this.handleSettingsChange,
                    'community'
                  )}
                />
              </NotificationSettingsCard>

              {!isEnterprise && (
                <NotificationSettingsCard
                  image={ImageCareers}
                  isSaving={_.some(savingGroups, (group) => group === 'alumni')}
                  subtitle={__(
                    'Keep me connected with alumni support included in my Nanodegree program.'
                  )}
                  subsubtitle={
                    isCareerPortalEnabled
                      ? __(
                          'Opt-out of emails from our network of Talent Program employers by <a href="https://classroom.udacity.com/profiles/u/edit">unsharing your Udacity Profile</a>.',
                          {},
                          { renderHTML: true }
                        )
                      : __(
                          'Opt-out of emails from our network of Talent Program employers by <a href="https://udacity.com/get-hired" target="_blank">unsharing your Udacity Profile</a>.',
                          {},
                          { renderHTML: true }
                        )
                  }
                  title={__('Alumni Services')}
                >
                  <NotificationSettingsCardContent
                    title={__('Alumni Newsletter')}
                    group="alumni"
                    settings={settings['alumni']}
                    isPhoneNumberVerified={isPhoneNumberVerified}
                    handleChange={_.partial(
                      this.handleSettingsChange,
                      'alumni'
                    )}
                  />
                </NotificationSettingsCard>
              )}

              {isStudentHubEnabled && (
                <NotificationSettingsCard
                  image={ImageStudyGroup}
                  isSaving={_.some(savingGroups, (group) =>
                    _.startsWith(group, 'studentHub')
                  )}
                  subtitle={__(
                    'Notify me when I am mentioned by classmates and mentors.'
                  )}
                  title={__('Student Hub')}
                >
                  <NotificationSettingsCardContent
                    title={studentHubUsername}
                    subtitle={__('Messages tagging me directly in any channel')}
                    group="studentHubMe"
                    settings={settings['studentHubMe']}
                    isPhoneNumberVerified={isPhoneNumberVerified}
                    handleChange={_.partial(
                      this.handleSettingsChange,
                      'studentHubMe'
                    )}
                  />
                  <NotificationSettingsCardContent
                    title={__('Direct Messages')}
                    subtitle={__('Unread messages sent directly to me')}
                    group="studentHubDirect"
                    settings={settings['studentHubDirect']}
                    isPhoneNumberVerified={isPhoneNumberVerified}
                    handleChange={_.partial(
                      this.handleSettingsChange,
                      'studentHubDirect'
                    )}
                  />
                  <NotificationSettingsCardContent
                    title={__('@channel')}
                    subtitle={__('Messages tagging the whole channel')}
                    group="studentHubChannel"
                    settings={settings['studentHubChannel']}
                    isPhoneNumberVerified={isPhoneNumberVerified}
                    handleChange={_.partial(
                      this.handleSettingsChange,
                      'studentHubChannel'
                    )}
                  />
                </NotificationSettingsCard>
              )}

              {isProjectReviewer && (
                <NotificationSettingsCard
                  image={ImageReviews}
                  isSaving={_.includes(savingGroups, 'reviews')}
                  subtitle={__(
                    'Send me notifications when I am assigned a review.'
                  )}
                  title={__('Project Reviews')}
                >
                  <NotificationSettingsCardContent
                    group="reviews"
                    settings={settings['reviews']}
                    isPhoneNumberVerified={isPhoneNumberVerified}
                    handleChange={_.partial(
                      this.handleSettingsChange,
                      'reviews'
                    )}
                  />
                </NotificationSettingsCard>
              )}

              <NotificationSettingsCard
                image={ImageBullhorn}
                isSaving={_.some(savingGroups, (group) =>
                  _.startsWith(group, 'marketing')
                )}
                subtitle={__(
                  'Learn about new courses and programs, scholarship opportunities and upcoming special events.'
                )}
                title={__('Marketing Communications')}
              >
                <NotificationSettingsCardContent
                  title={__('Upcoming special events and webinars')}
                  group="marketingEvents"
                  includePhone={true}
                  settings={settings['marketingEvents']}
                  isPhoneNumberVerified={isPhoneNumberVerified}
                  handleChange={_.partial(
                    this.handleSettingsChange,
                    'marketingEvents'
                  )}
                />
                <NotificationSettingsCardContent
                  title={__('New courses and Nanodegree programs')}
                  group="marketingNewContent"
                  includePhone={true}
                  settings={settings['marketingNewContent']}
                  isPhoneNumberVerified={isPhoneNumberVerified}
                  handleChange={_.partial(
                    this.handleSettingsChange,
                    'marketingNewContent'
                  )}
                />
                <NotificationSettingsCardContent
                  title={__('Scholarship opportunities')}
                  group="marketingScholarships"
                  includePhone={true}
                  settings={settings['marketingScholarships']}
                  isPhoneNumberVerified={isPhoneNumberVerified}
                  handleChange={_.partial(
                    this.handleSettingsChange,
                    'marketingScholarships'
                  )}
                />
                <NotificationSettingsCardContent
                  title={__('Surveys to improve my experience')}
                  group="marketingSurveys"
                  includePhone={true}
                  settings={settings['marketingSurveys']}
                  isPhoneNumberVerified={isPhoneNumberVerified}
                  handleChange={_.partial(
                    this.handleSettingsChange,
                    'marketingSurveys'
                  )}
                />
              </NotificationSettingsCard>
            </ul>

            <div styleName="unsubscribe-all">
              <Checkbox
                label={__(
                  'Unsubscribe me from all Udacity email notifications'
                )}
                id="unsubscribe-email"
                checked={this.isUnsubscribed('email')}
                onChange={this.handleUnsubscribeAllEmail}
              />

              <Checkbox
                label={__('Unsubscribe me from all Udacity SMS notifications')}
                id="unsubscribe-sms"
                checked={this.isUnsubscribed('sms')}
                onChange={this.handleUnsubscribeAllSMS}
              />
            </div>
          </div>
        </div>
      </section>
    );
  }
}
