/* eslint-disable @trello/disallow-filenames */
import moment from 'moment';
import Cookies from 'js-cookie';

export function idToDate(id?: string | null) {
  return new Date(1000 * parseInt(id ? id.substr(0, 8) : '', 16));
}

export const getElapsedDaysFromId = (id: string): number => {
  const start = moment(idToDate(id));
  const now = moment(Date.now());

  return now.diff(start, 'days');
};

/** Gets the current date, with possible cookies override
 * Ideally this should just be used for features being tested pre-release,
 * and later replaced with Date.now()
 */
export const getDate = () => {
  const override = Cookies.get('simulateDifferentDate');
  return override && typeof override === 'string' ? override : Date.now();
};
