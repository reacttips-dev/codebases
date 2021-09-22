import createMeasurementUnit from 'owa-measurementunit-formatter/lib/createMeasurementUnit';
import getSingularPluralExpressions from 'owa-measurementunit-formatter/lib/getSingularPluralExpressions';
import type { DurationMagnitudes, DurationSingularPluralStrings } from './DurationTypes';

export { DurationMagnitudes, DurationSingularPluralStrings };

/** Creates the set of duration units, with the given set of magnitudes
 *  the strings that represent the singular and plural forms of each unit.
 */
export default function createDurationUnits(
    userCulture: string,
    magnitudes: DurationMagnitudes,
    strings: DurationSingularPluralStrings
) {
    let expressions = getSingularPluralExpressions(userCulture);

    return {
        year: createMeasurementUnit(magnitudes.year, strings.year, expressions),
        month: createMeasurementUnit(magnitudes.month, strings.month, expressions),
        week: createMeasurementUnit(magnitudes.week, strings.week, expressions),
        day: createMeasurementUnit(magnitudes.day, strings.day, expressions),
        hour: createMeasurementUnit(magnitudes.hour, strings.hour, expressions),
        minute: createMeasurementUnit(magnitudes.minute, strings.minute, expressions),
        second: createMeasurementUnit(magnitudes.second, strings.second, expressions),
    };
}
