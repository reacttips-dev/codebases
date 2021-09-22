import type { SingularPluralStrings } from './SingularPluralStrings';
import type { SingularPluralExpressions } from './SingularPluralExpressions';

// DO NOT USE THIS MODULE OUTSIDE owa-measurementunit-formatter!!!
// This is virtually a plain port of what we had in Script# LocalePluralsStringConverter.cs.
// However, it does not deal with languages that have more than two types of plurals.

/**
 * Returns a string based on ordinal context rules.
 * For english, this will be the singularForm for 1, and firstPluralForm for everything else.
 * @param value                     Value of the unit being formatted
 * @param unitStrings               The different forms of the unit string (singular & plurals)
 * @param singularPluralExpressions RegExp that detect single or firstPlural values.
 */
export default function getUnitString(
    value: number,
    singularPluralStrings: SingularPluralStrings,
    singularPluralExpressions: SingularPluralExpressions
) {
    var s = value.toString(10);

    if (singularPluralExpressions.singular.test(s)) {
        return singularPluralStrings.singular;
    }

    if (singularPluralExpressions.firstPlural.test(s)) {
        return singularPluralStrings.firstPlural;
    }

    return singularPluralStrings.secondPlural;
}
