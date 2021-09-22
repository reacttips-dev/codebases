export const formatDateField = (date: string | null, locale: string) => {
	if (!date) {
		return;
	}

	return new Intl.DateTimeFormat(locale, {
		year: 'numeric',
		month: 'short',
		day: 'numeric',
		timeZone: 'UTC',
	}).format(new Date(date));
};
