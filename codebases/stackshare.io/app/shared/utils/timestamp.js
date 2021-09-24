import {formatDate} from './format';
import {add, formatDistance, formatDistanceToNowStrict, isValid, parseISO} from 'date-fns';

export default (publishedAt = new Date(), isDate = true) => {
  const publishingDate =
    publishedAt === null || publishedAt === '' ? new Date().toISOString() : publishedAt;
  const parsedDate = parseISO(publishingDate);
  const computedDate = isValid(parsedDate)
    ? parsedDate
    : parseISO(new Date(publishedAt).toISOString());
  if (isDate) {
    const distance = formatDistanceToNowStrict(add(computedDate, {days: 5})).split(' ');
    const notOlderThanFive = (distance[1] === 'days' || distance[1] === 'day') && distance[0] <= 5;
    return notOlderThanFive
      ? formatDistance(computedDate, new Date(), {addSuffix: true})
      : formatDate('ll', computedDate);
  } else {
    return formatDate('ll', computedDate);
  }
};
