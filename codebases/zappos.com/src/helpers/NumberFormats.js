import { NUMBER_SANS_COMMAS_RE_GEN } from 'common/regex';

const regexFormatter = n => {
  if (typeof n === 'string') {
    n = parseFloat(n);
  }
  if (isNaN(n)) {
    return '';
  } else {
    return `$${n.toFixed(2).toString().replace(NUMBER_SANS_COMMAS_RE_GEN(), ',')}`;
  }
};

export const getFormatter = () => {
  if (typeof Intl !== 'undefined') {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });
  } else {
    // Safari 9.x, IE 9/10 don't support Intl
    return { format: regexFormatter, fallback: true };
  }
};

const formatter = getFormatter();

export function toUSD(n, formatZeroValues = true) {
  if (n === '' || n === undefined || n === null || (!formatZeroValues && n === 0)) {
    return '';
  }
  return formatter.format(n);
}

// Take string, remove all non-numericals, return string representation of number accurate to 2 decimal places.
export function usdToNumber(u) {
  const noDollarSign = u.toString().replace(/[^\d.]/g, '');
  return parseFloat(noDollarSign).toFixed(2);
}

export function numberToUsd(n) {
  return n.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
}

export function toThousandsSeparator(n) {
  if (n === '' || n === undefined || n === null) {
    return '';
  }

  if (typeof(n) === 'string') {
    n = +n;
  }

  return n.toLocaleString('en-US');
}

// Take string, remove non-numericals(except for decimal), then return the float
export function toFloatInt(str) {
  const type = typeof str;
  if (type === 'number') {
    return str;
  } else if (type === 'string') {
    const num = parseFloat(str.replace(/[^\d.-]/g, ''));
    return isNaN(num) ? undefined : num;
  }
}
