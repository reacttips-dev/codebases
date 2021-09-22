export default function formatCount(c: number): string {
  let count = c || 0;
  let result = String(count);

  if (count.toString().length > 3) {
    count = Math.round((count / 1000) * 10) / 10;
    result = count + 'k';
  }
  return result;
}
