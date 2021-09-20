import SettingCourses from 'components/settings/setting-courses';
import SettingLanguagePreference from 'components/settings/setting-language-preference';
import SettingLinkedAccounts from 'components/settings/setting-linked-accounts';
import SettingNotifications from 'components/settings/setting-notifications';
import SettingPassword from 'components/settings/setting-password';
import SettingPersonalInfo from 'components/settings/setting-personal-info';
import SettingSubscriptions from 'components/settings/setting-subscriptions';
import { makeRouteWithAnalytics } from './helpers';

export const Routes = [
  makeRouteWithAnalytics('personal-info', SettingPersonalInfo),
  makeRouteWithAnalytics('language-preference', SettingLanguagePreference),
  makeRouteWithAnalytics('password', SettingPassword),
  makeRouteWithAnalytics('linked-accounts', SettingLinkedAccounts),
  makeRouteWithAnalytics('notifications', SettingNotifications),
  makeRouteWithAnalytics('subscriptions', SettingSubscriptions),
  makeRouteWithAnalytics('courses', SettingCourses),
  // hide referrals at request of payments
  // makeRouteWithAnalytics('referrals', SettingAccountCredit) // only for users with en-us locale
];
