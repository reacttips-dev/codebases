export default function (a) {
  return a[0] && a[1] ? a.join(' | ') : a.filter(Boolean).join('');
}