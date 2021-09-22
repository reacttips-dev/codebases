import moment from 'moment';

export function isDealRotten(deal: Pipedrive.Deal): boolean {
	if (deal.rotten_time === null) {
		return false;
	}

	const rottenTime = moment.utc(deal.rotten_time);
	const now = moment.utc();

	return rottenTime.isBefore(now);
}

export function isDealWon(deal: Pipedrive.Deal): boolean {
	return deal.status === 'won';
}

export function isDealLost(deal: Pipedrive.Deal): boolean {
	return deal.status === 'lost';
}
