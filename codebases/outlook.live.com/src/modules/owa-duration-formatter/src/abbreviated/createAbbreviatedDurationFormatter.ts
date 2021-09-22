import createDurationFormatter, { FormattingOptions } from '../createDurationFormatter';
import getAbbreviatedSingularPluralStrings from './getAbbreviatedSingularPluralStrings';
import type { DurationProperties } from '../DurationTypes';

export type { FormattingOptions };

/** Creates a duration formatter using the plural rules of the given culture and the given strings */
export default function createAbbreviatedDurationFormatter(
    userCulture: string,
    options?: FormattingOptions,
    durationUnitsProps?: DurationProperties[]
) {
    let singularPluralStrings = getAbbreviatedSingularPluralStrings();
    return createDurationFormatter(userCulture, singularPluralStrings, options, durationUnitsProps);
}
