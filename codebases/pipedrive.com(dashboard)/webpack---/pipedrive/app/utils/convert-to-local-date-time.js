import moment from 'moment';
import _ from 'lodash';

export const UTC_DATE_FORMAT = 'YYYY-MM-DD';
export const UTC_TIME_FORMAT = 'HH:mm';
export const UTC_DATE_TIME_FORMAT = `${UTC_DATE_FORMAT} ${UTC_TIME_FORMAT}`;

export default function(dueDate, dueTime) {
	let localMoment = moment();

	if (_.isEmpty(dueDate)) {
		return localMoment;
	}

	if (_.isEmpty(dueTime)) {
		// No utc conversion needed, since only date is set
		localMoment = moment(dueDate, UTC_DATE_FORMAT).endOf('day');
		localMoment.noTime = true;
	} else {
		localMoment = moment.utc(`${dueDate} ${dueTime}`, UTC_DATE_TIME_FORMAT).local();
		localMoment.noTime = false;
	}

	return localMoment;
}
