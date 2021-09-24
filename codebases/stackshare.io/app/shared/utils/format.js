import {format, formatDistanceToNowStrict} from 'date-fns';

// Format a count 1200 -> "1.2K"
// see: https://stackoverflow.com/a/41984610
export const formatCount = number => {
  const SI_POSTFIXES = ['', 'K', 'M', 'G', 'T', 'P', 'E'];
  const tier = (Math.log10(Math.abs(number)) / 3) | 0;

  if (tier === 0) {
    return number;
  }

  const postfix = SI_POSTFIXES[tier];
  const scale = Math.pow(10, tier * 3);
  const scaled = number / scale;
  let formatted = scaled.toFixed(1) + '';

  if (/\.0$/.test(formatted)) {
    formatted = formatted.substr(0, formatted.length - 2);
  }

  return formatted + postfix;
};

export const formatDuration = date => {
  const distance = formatDistanceToNowStrict(new Date(date)).split(' ');
  let suffix = '';

  switch (distance[1]) {
    case 'year':
    case 'years':
      suffix = 'y';
      break;
    case 'month':
    case 'months':
      suffix = 'y';
      break;
    case 'day':
    case 'days':
      suffix = 'y';
      break;
    case 'hour':
    case 'hours':
      suffix = 'h';
      break;
    default:
      suffix = 'h';
  }

  return `${distance[0]}${suffix}`;
};

export const formatNumber = number => {
  return String(number).replace(/(.)(?=(\d{3})+$)/g, '$1,');
};

export const formatDate = (dateFormat, date = new Date()) => {
  switch (dateFormat) {
    case 'lll':
      return format(new Date(date), "MMM d yyyy h':'mm a");
    case 'll [at] h:mmA':
      return format(new Date(date), "MMM d yyyy 'at' h:mma");
    case 'DD/MM/YYYY':
      return format(new Date(date), 'dd/MM/yyyy');
    case 'MMMM Do YYYY [at] h:mma':
      return format(new Date(date), "MMMM do yyyy 'at' h':'mma");
    case 'MMMM Do YYYY, [@]h:mm a':
      return format(new Date(date), "MMMM do yyyy '@' h':'mm a");
    case 'll':
      return format(new Date(date), "MMM d',' yyyy");
    case 'MMM dd':
      return format(new Date(date), 'MMM dd');
  }
};
