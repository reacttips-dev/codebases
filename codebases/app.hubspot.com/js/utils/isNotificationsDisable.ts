import { get } from './tempStorage';
export default function isNotificationsDisable() {
  return get('NOTIFICATIONS_DISABLE') === 'true';
}