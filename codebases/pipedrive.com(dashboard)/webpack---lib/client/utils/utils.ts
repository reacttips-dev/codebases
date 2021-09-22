import { LabelColors } from 'Types/types';

export const mapLabelColor = (colorName: LabelColors) => {
	if (colorName === LabelColors.Gray) {
		return undefined;
	}

	return colorName;
};

export const getRandomLabelColor = () => {
	const randomIndex = Math.floor(Math.random() * 5);

	const colors = Object.keys(LabelColors);

	const randomColor = LabelColors[colors[randomIndex] as keyof typeof LabelColors];

	return randomColor;
};

const isEmpty = (value: unknown) => {
	return value === null || value === '' || value === undefined;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const notEmpty = <TValue extends any>(value: TValue | null | undefined): value is TValue => {
	return value !== null && value !== undefined;
};

export const removeEmpty = (obj: Record<string, unknown>) => {
	const keys = Object.keys(obj);

	return keys.reduce<Record<string, unknown>>((acc, key) => {
		if (!isEmpty(obj[key])) {
			acc[key] = obj[key];
		}

		return acc;
	}, {});
};

export const isElementTruncated = (e: HTMLButtonElement | null) => {
	if (!e) {
		return;
	}
	const spanElement = e.querySelector('span');

	return spanElement && spanElement.offsetWidth < spanElement.scrollWidth;
};
