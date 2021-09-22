import * as magnitudesInSeconds from './magnitudesInSeconds';
import createDurationUnits, { DurationSingularPluralStrings } from './createDurationUnits';
import createMeasurementFormatter, { FormattingOptions } from 'owa-measurement-formatter';
import type { DurationProperties } from './DurationTypes';

export { DurationSingularPluralStrings, FormattingOptions };

/** Creates a duration formatter using the plural rules of the given culture and
 *  the strings that represent the singular and plural forms of each unit.
 */
export default function createDurationFormatter(
    userCulture: string,
    singularPluralStrings: DurationSingularPluralStrings,
    options?: FormattingOptions,
    durationUnitsProps?: DurationProperties[]
) {
    let durationUnits = createDurationUnits(
        userCulture,
        magnitudesInSeconds,
        singularPluralStrings
    );
    const durationsProperties = durationUnitsProps
        ? durationUnitsProps
        : [
              'minute' /* first, so a value of 0 formats as '0 minutes' as OwaDateTime did.*/,
              'year',
              'month',
              'week',
              'day',
              'hour',
              'second',
          ];
    const units = durationsProperties.map(p => durationUnits[p]);

    return createMeasurementFormatter(units, options);
}
