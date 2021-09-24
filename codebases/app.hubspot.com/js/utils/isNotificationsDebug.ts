import { get } from './tempStorage';
export default function isNotificationsDebug() {
  return get('NOTIFICATIONS_DEBUG') === 'true';
}