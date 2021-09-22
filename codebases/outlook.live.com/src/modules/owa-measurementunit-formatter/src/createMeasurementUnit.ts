import getUnitString from './getUnitString';
import type { SingularPluralExpressions } from './SingularPluralExpressions';
import type { SingularPluralStrings } from './SingularPluralStrings';

/** Creates a measurement unit whose suffix is formatted according
 *  to the plural rules specified in the given strings and expressions.
 *  NOTE: this is a port of LocalePluralsStringConverter; it is limited
 *  in the sense that it only deals with 2 types of plurals, but some
 *  languages have more than 2 plurals, so if we need to support them
 *  we might need to revisit this module.
 */
export default function createMeasurementUnit(
    magnitude: number,
    singularPluralStrings: SingularPluralStrings,
    singularPluralExpressions: SingularPluralExpressions
) {
    return {
        magnitude: magnitude,
        format: (x: number) =>
            x + ' ' + getUnitString(x, singularPluralStrings, singularPluralExpressions),
    };
}
