import {
    sizeWithGigabyteAbbreviationText,
    sizeWithMegabyteAbbreviationText,
    sizeWithKilobyteAbbreviationText,
    sizeWithByteAbbreviationText,
} from './numberToByteQuantifiedStringConverter.locstring.json';
import loc, { format } from 'owa-localize';

export default function numberToByteQuantifiedStringConverter(bytes: number): string {
    let formatString: string;
    if (bytes >= 0x40000000) {
        // GB
        bytes /= 0x40000000;
        formatString = loc(sizeWithGigabyteAbbreviationText);
    } else if (bytes >= 0x100000) {
        // MB
        bytes /= 0x100000;
        formatString = loc(sizeWithMegabyteAbbreviationText);
    } else if (bytes >= 0x400) {
        // KB
        bytes /= 0x400;
        formatString = loc(sizeWithKilobyteAbbreviationText);
    } else {
        formatString = loc(sizeWithByteAbbreviationText);
    }

    return format(formatString, Math.round(bytes));
}
