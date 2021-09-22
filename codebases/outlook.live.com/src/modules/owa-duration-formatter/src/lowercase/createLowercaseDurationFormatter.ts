import createDurationFormatter, { FormattingOptions } from '../createDurationFormatter';
import getLowercaseSingularPluralStrings from './getLowercaseSingularPluralStrings';
import type { DurationProperties } from '../DurationTypes';

export type { FormattingOptions };

/** Creates a duration formatter using the plural rules of the given culture and the given strings */
export default function createLowercaseDurationFormatter(
    userCulture: string,
    options?: FormattingOptions,
    durationUnitsProps?: DurationProperties[]
) {
    let singularPluralStrings = getLowercaseSingularPluralStrings();
    return createDurationFormatter(userCulture, singularPluralStrings, options, durationUnitsProps);
}
