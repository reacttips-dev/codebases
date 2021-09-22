import _ from 'lodash';
import moment from 'moment';

export const getCallToLink = ({ user, phoneNr, data }) => {
	if (!_.isString(phoneNr) || !user) {
		return '';
	}

	const cleanPhone = phoneNr.replace(/(\s)/g, '');

	let formatted = user.settings.get('callto_link_syntax');

	formatted = formatted.split('[number]').join(cleanPhone);
	formatted = formatted.split('[user_id]').join(user.get('id'));

	formatted = formatted.split('[deal_id]').join((data && data.dealId) || '');
	formatted = formatted.split('[person_id]').join((data && data.personId) || '');
	formatted = formatted.split('[org_id]').join((data && data.orgId) || '');

	if (formatted.match(/javascript/gi)) {
		return '';
	}

	return formatted;
};

/**
 * Deep difference between two objects
 * @param  {Object} object Object compared
 * @param  {Object} base   Object to compare with
 * @return {Object}        New object representing the difference
 */
export const objDifference = (object, base) => {
	return _.transform(object, (result, value, key) => {
		if (!_.isEqual(value, base[key])) {
			result[key] =
				_.isObject(value) && _.isObject(base[key])
					? objDifference(value, base[key])
					: value;
		}
	});
};

/**
 * Returns formatted date as in threads list
 * @param {String} dateString - js date string
 */
export const getFormattedDate = (dateString) => {
	const time = moment.utc(dateString).local();
	const todaysDate = moment.utc().local();

	let formattedDate;

	if (todaysDate.isSame(time, 'd')) {
		formattedDate = time.format('HH:mm');
	} else if (todaysDate.diff(time.startOf('day'), 'years') > 0) {
		formattedDate = time.format('L');
	} else {
		formattedDate = `${time.format('pd_day_month')}, ${time.format('Y')}`;
	}

	return formattedDate;
};

/**
 * Asynchronous forEach loop. Loop will continue once callback promise has resolved.
 * @param  {Array} - array of items to loop over
 * @param  {Promise} promisedCallback - promise to resolve in the loop
 *
 * PS: if promisedCallback returns false the loop will be cancelled.
 */
export const asyncForEach = async (array, promisedCallback) => {
	for (let index = 0; index < array.length; index++) {
		const cb = await promisedCallback(array[index], index, array);

		/**
		 * Break the loop if promisedCallback returns false
		 */
		if (cb === false) {
			break;
		}
	}
};

export const isInteger = (n) => {
	return _.isNumber(n) && n % 1 === 0;
};

export const combineHumanizedFilesize = (size) => {
	if (!isInteger(size)) {
		return '';
	}

	const i = size === 0 ? size : Math.floor(Math.log(size) / Math.log(1024));

	return `${(size / Math.pow(1024, i)).toFixed(2) * 1} ${['B', 'kB', 'MB', 'GB', 'TB'][i]}`;
};

export const getUid = () =>
	Math.random()
		.toString(36)
		.substr(2, 16);
