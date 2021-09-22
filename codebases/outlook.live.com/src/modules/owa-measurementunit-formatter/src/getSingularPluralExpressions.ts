import type { SingularPluralExpressions } from './SingularPluralExpressions';

// This is virtually a plain port of what we had in Script# LocaleSpecific.cs.
// However plural rules are more complex than what we have expressed here.
// I would like us to move to better libraries, such as make-firstPlural, ilib or globalize.
// I'm porting the original code so we have at least parity and some level of unit tests.

// For reference:
// http://cldr.unicode.org/cldr-features
// http://cldr.unicode.org/index/cldr-spec/firstPlural-rules
// http://www.unicode.org/cldr/charts/latest/supplemental/language_plural_rules.html

// The regular expressions below are not dealing with fractionary numbers
// and are not dealing with languages that have more than two plurals
// and you cannot test the plural expression without testing the singular expression first!

function singularPlural(singular: RegExp, firstPlural: RegExp): SingularPluralExpressions {
    return {
        singular: singular,
        firstPlural: firstPlural,
    };
}

/// <summary>
/// The default expression matching singular numbers.
/// This expression will only match the number 1.
/// </summary>
let defaultSingular = new RegExp('^1$');

/// <summary>
/// The default expression for matching firstPlural numbers.
/// This expression will match any number, which means it
/// can only be evaluated after defaultSingular!
/// </summary>
let defaultPlural = new RegExp('.');

/// <summary>
/// The expression matching firstPlural numbers in Czech.
/// This expression will match only the exact numbers '2', '3' and '4'.
/// </summary>
let czechPlural = new RegExp('^[234]$');

/// <summary>
/// The regular expression matching singular numbers in Russian.
/// This expression will match any string ending in '1', except those ending in '11'.
/// </summary>
let russianSingular = new RegExp('^1$|[^1]1$');

/// <summary>
/// The expression matching firstPlural numbers in Russian and Polish
/// This expression will match any number ending
/// in '2', '3' or '4', except those ending in '12', '13' or '14'.
/// </summary>
let russianOrPolishPlural = new RegExp('^[234]$|[^1][234]$');

/// <summary>
/// The default regular expressions.
/// </summary>
let defaultExpressions = singularPlural(defaultSingular, defaultPlural);

/// <summary>
/// The regular expressions used for Czech numbers.
/// </summary>
let czech = singularPlural(defaultSingular, czechPlural);

/// <summary>
/// The regular expressions used for Russian numbers.
/// </summary>
let russian = singularPlural(russianSingular, russianOrPolishPlural);

/// <summary>
/// Dictionary mapping culture to regular expressions used to
/// determine correct form of word to return based on ordinal context.
/// </summary>
let ordinalRulesByCulture = {
    'cs-CZ': czech,
    'sk-SK': czech,
    'sl-SI': czech,
    'uk-UA': czech,
    'pl-PL': singularPlural(defaultSingular, russianOrPolishPlural),
    'ru-RU': russian,
    'sr-Latn-CS': russian,
    'sr-Cyrl-CS': russian,
    'lt-LT': russian,
    'lv-LV': russian,
};

export default function getSingularPluralExpressions(
    culture: string | undefined
): SingularPluralExpressions {
    return (culture && ordinalRulesByCulture[culture]) || defaultExpressions;
}
