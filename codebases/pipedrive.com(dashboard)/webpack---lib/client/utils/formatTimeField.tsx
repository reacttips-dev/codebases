import parse from 'date-fns/parse';

export const formatTimeField = (time: string | null, locale: string) => {
	if (!time) {
		return;
	}

	const parsedTime = parse(time, 'HH:mm:ss.SSSX', new Date());

	return new Intl.DateTimeFormat(locale, {
		hour: 'numeric',
		minute: 'numeric',
		timeZone: 'UTC',
	}).format(parsedTime);
};
