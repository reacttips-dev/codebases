import { TimeStringFuncs } from '@pipedrive/time-strings';

let timeStringsReference: TimeStringFuncs | null = null;

export const setTimeStringsReference = (timeStrings: TimeStringFuncs) => {
	timeStringsReference = timeStrings;
};

export const getTimeStringsReference = () => {
	if (!timeStringsReference) {
		throw new Error('Time strings reference not available yet');
	}

	return timeStringsReference;
};
