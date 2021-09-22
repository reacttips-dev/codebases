import createLowercaseDurationFormatter, {
    FormattingOptions,
} from './createLowercaseDurationFormatter';
import { getCurrentCulture } from 'owa-localize';
import type { DurationProperties } from '../DurationTypes';
export type { FormattingOptions };

/** Creates a duration formatter using the user's culture and the standard lowercase strings */
export function createLowercaseFormatter(
    options?: FormattingOptions,
    durationUnitsProps?: DurationProperties[]
) {
    return createLowercaseDurationFormatter(getCurrentCulture(), options, durationUnitsProps);
}

/**
 * Format a duration value using the user's culture and the standard lowercase strings
 * When formatting multiple values, it is better to use createFormatter and then
 * invoke it multiple times.
 */
export default function lowercaseFormatDuration(
    value: number,
    options?: FormattingOptions,
    durationUnitsProps?: DurationProperties[]
) {
    let formatter = createLowercaseFormatter(options, durationUnitsProps);
    return formatter(value);
}
