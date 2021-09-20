/* eslint-disable @trello/disallow-filenames */
export function decimalToDegrees(decimal: number): string {
  const absDecimal = Math.abs(decimal);
  const justDegrees = Math.floor(absDecimal);
  const degreesFormat = `${justDegrees}°`;

  const minutes = (absDecimal - justDegrees) * 60;
  const justMinutes = Math.floor(minutes);
  const minutesFormat = justMinutes !== 0 ? `${justMinutes}'` : '';

  const seconds = (minutes - justMinutes) * 60;
  const justSeconds = Math.floor(seconds);
  const secondsFormat = justSeconds !== 0 ? `${seconds.toFixed(1)}"` : '';

  return `${degreesFormat}${minutesFormat}${secondsFormat}`;
}

export function formatLatLng(latitude: number, longitude: number) {
  const latOrientation = latitude >= 0 ? 'N' : 'S';
  const lngOrientation = longitude >= 0 ? 'E' : 'W';

  return `${decimalToDegrees(latitude)}${latOrientation} ${decimalToDegrees(
    longitude,
  )}${lngOrientation}`;
}
