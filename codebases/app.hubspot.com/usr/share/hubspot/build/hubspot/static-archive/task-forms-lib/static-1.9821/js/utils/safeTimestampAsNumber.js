'use es6';

export default function safeTimestampAsNumber(ts) {
  if (Number(ts)) return Number(ts);
  return null;
}