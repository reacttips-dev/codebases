import { FontPickerItem } from './FontPickerItem';

const POINTS: string = 'pt';

// This is mapping table from browser size (1-7) to PT
export const FONTSIZE_MAPPING: number[] = [
    8 /*1*/,
    10 /*2*/,
    12 /*3*/,
    14 /*4*/,
    18 /*5*/,
    24 /*6*/,
    36 /*7*/,
];

export const FONT_SIZES: number[] = [8, 9, 10, 11, 12, 14, 16, 18, 20, 22, 24, 26, 28, 36, 48, 72];

export const FONT_SIZE_MENU_ITEMS: FontPickerItem[] = FONT_SIZES.map(font => font.toString()).map(
    font => ({
        selectValue: font,
        displayValue: font,
        submitValue: font,
    })
);
export function getFontSizeFromSizeOrIndex(sizeOrIndex: number): number {
    return typeof sizeOrIndex === 'number' && sizeOrIndex <= 7
        ? FONTSIZE_MAPPING[sizeOrIndex - 1]
        : sizeOrIndex;
}

export function getFontSizeInPoints(size: number): string {
    let result = getFontSizeFromSizeOrIndex(size).toString();

    return result ? result + POINTS : result;
}
