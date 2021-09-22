import _t from 'i18n!nls/ondemand';

import { TimeInterval } from 'bundles/ondemand/types/TimeInterval';

export const SECOND: TimeInterval = {
  millis: 1000,
  singular: _t('second'),
  plural: _t('seconds'),
};
export const MINUTE: TimeInterval = {
  millis: SECOND.millis * 60,
  singular: _t('minute'),
  plural: _t('minutes'),
};
export const HOUR: TimeInterval = {
  millis: MINUTE.millis * 60,
  singular: _t('hour'),
  plural: _t('hours'),
};
export const DAY: TimeInterval = {
  millis: HOUR.millis * 24,
  singular: _t('day'),
  plural: _t('days'),
};
