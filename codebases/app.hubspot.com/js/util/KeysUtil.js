'use es6';

import enviro from 'enviro';
import { VAPID_PROD_PUBLIC_KEY, VAPID_QA_PUBLIC_KEY } from '../constants/SubscriptionConstants';
export function getVapidKey() {
  return enviro.isQa() ? VAPID_QA_PUBLIC_KEY : VAPID_PROD_PUBLIC_KEY;
}