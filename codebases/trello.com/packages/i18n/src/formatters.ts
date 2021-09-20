import { currentLocale } from '@trello/locale';
import { isSafari, isMac } from '@trello/browser';

export const asNumber = (val: number) => {
  const numberFormatter = new Intl.NumberFormat(currentLocale);
  return numberFormatter.format(val);
};
export const asCompactNumber = (val: number) => {
  // In Safari 14.1 on MacOS Mojave, using Intl.NumberFormat with "notation: 'compact'" results in an exception that
  // crashes Trello - https://ops.internal.atlassian.com/jira/browse/HOT-95177. As a workaround, we fall back to
  // 'standard' notation instead. This means that on the public templates gallery users of Safari 14.1 will see
  // "15,400 Copies, 70,400 Views" instead of "15.4K Copies, 70.5K Views". This solution should only be temporary, and
  // we should aim to find a solution or polyfill that allows us to use 'compact' numbers in Safari 14.1.
  const notation = !(
    isMac() &&
    isSafari() &&
    navigator.userAgent.includes('Version/14.1')
  )
    ? 'compact'
    : 'standard';
  const compactNumberFormatter = new Intl.NumberFormat(currentLocale, {
    notation,
    compactDisplay: 'short',
    minimumFractionDigits: 0,
    maximumFractionDigits: 1,
  });
  return compactNumberFormatter.format(val);
};

export const asPercentage = (val: number) => {
  const percentageFormatter = new Intl.NumberFormat(currentLocale, {
    style: 'percent',
  });
  return percentageFormatter.format(val);
};
export const asMoney = (val: number) => {
  const twoDecimalFormatter = new Intl.NumberFormat(currentLocale, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return twoDecimalFormatter.format(val);
};
export const asTaxRate = (val: number) => {
  const taxRateFormatter = new Intl.NumberFormat(currentLocale, {
    style: 'percent',
    minimumFractionDigits: 4,
    maximumFractionDigits: 4,
  });
  return taxRateFormatter.format(val);
};
