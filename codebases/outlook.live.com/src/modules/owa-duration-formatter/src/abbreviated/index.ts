import { getCurrentCulture } from 'owa-localize';
import type { DurationProperties } from '../DurationTypes';
import createAbbreviatedDurationFormatter, {
    FormattingOptions,
} from './createAbbreviatedDurationFormatter';

export type { FormattingOptions };

/** Creates a duration formatter using the user's culture and the standard abbreviated strings. */
export function createAbbreviatedFormatter(
    options?: FormattingOptions,
    durationUnitsProps?: DurationProperties[]
) {
    return createAbbreviatedDurationFormatter(getCurrentCulture(), options, durationUnitsProps);
}

/**
 * Format a duration value using the user's culture and the standard abbreviated strings.
 * When formatting multiple values, it is better to use createFormatter and then
 * invoke it multiple times.
 */
export default function abbreviatedFormatDuration(
    value: number,
    options?: FormattingOptions,
    durationUnitsProps?: DurationProperties[]
) {
    let formatter = createAbbreviatedFormatter(options, durationUnitsProps);
    return formatter(value);
}
