import { getLocalizedString } from '../localization/getLocalizedString';
import type { DisplayDateParserConfig } from './DisplayDateParserConfig';

export type { DisplayDateParserConfig };

export type StringNames =
    | 'januaryAbbreviatedLowercase'
    | 'februaryAbbreviatedLowercase'
    | 'marchAbbreviatedLowercase'
    | 'aprilAbbreviatedLowercase'
    | 'mayAbbreviatedLowercase'
    | 'juneAbbreviatedLowercase'
    | 'julyAbbreviatedLowercase'
    | 'augustAbbreviatedLowercase'
    | 'septemberAbbreviatedLowercase'
    | 'octoberAbbreviatedLowercase'
    | 'novemberAbbreviatedLowercase'
    | 'decemberAbbreviatedLowercase'
    | 'januaryUppercase'
    | 'februaryUppercase'
    | 'marchUppercase'
    | 'aprilUppercase'
    | 'mayUppercase'
    | 'juneUppercase'
    | 'julyUppercase'
    | 'augustUppercase'
    | 'septemberUppercase'
    | 'octoberUppercase'
    | 'novemberUppercase'
    | 'decemberUppercase'
    | 'amLowercaseShort'
    | 'pmLowercaseShort'
    | 'amLowercase'
    | 'pmLowercase'
    | 'amUppercaseShort'
    | 'pmUppercaseShort'
    | 'amUppercase'
    | 'pmUppercase';

/**
 * Gets the set of strings to check when parsing display dates.
 */
export default function getDisplayDateParserConfig(): DisplayDateParserConfig {
    let monthNamesInUpperCase = {};
    let timeIndicators = {};

    populateMonthNames(monthNamesInUpperCase, [
        getLocalizedString('januaryAbbreviatedLowercase'),
        getLocalizedString('februaryAbbreviatedLowercase'),
        getLocalizedString('marchAbbreviatedLowercase'),
        getLocalizedString('aprilAbbreviatedLowercase'),
        getLocalizedString('mayAbbreviatedLowercase'),
        getLocalizedString('juneAbbreviatedLowercase'),
        getLocalizedString('julyAbbreviatedLowercase'),
        getLocalizedString('augustAbbreviatedLowercase'),
        getLocalizedString('septemberAbbreviatedLowercase'),
        getLocalizedString('octoberAbbreviatedLowercase'),
        getLocalizedString('novemberAbbreviatedLowercase'),
        getLocalizedString('decemberAbbreviatedLowercase'),
    ]);

    populateMonthNames(monthNamesInUpperCase, [
        getLocalizedString('januaryUppercase'),
        getLocalizedString('februaryUppercase'),
        getLocalizedString('marchUppercase'),
        getLocalizedString('aprilUppercase'),
        getLocalizedString('mayUppercase'),
        getLocalizedString('juneUppercase'),
        getLocalizedString('julyUppercase'),
        getLocalizedString('augustUppercase'),
        getLocalizedString('septemberUppercase'),
        getLocalizedString('octoberUppercase'),
        getLocalizedString('novemberUppercase'),
        getLocalizedString('decemberUppercase'),
    ]);

    populateTimeIndicators(timeIndicators, false, [
        getLocalizedString('amLowercaseShort'),
        getLocalizedString('amLowercase'),
        getLocalizedString('amUppercaseShort'),
        getLocalizedString('amUppercase'),
    ]);

    populateTimeIndicators(timeIndicators, true, [
        getLocalizedString('pmLowercaseShort'),
        getLocalizedString('pmLowercase'),
        getLocalizedString('pmUppercaseShort'),
        getLocalizedString('pmUppercase'),
    ]);

    return {
        timeIndicators: timeIndicators,
        monthNamesInUpperCase: monthNamesInUpperCase,
    };
}

function populateTimeIndicators(
    timeIndicators: { [key: string]: boolean },
    value: boolean,
    indicators: string[]
) {
    for (let i = 0; i < indicators.length; i++) {
        if (indicators[i]) {
            timeIndicators[indicators[i]] = value;
        }
    }
}

function populateMonthNames(
    monthNamesInUpperCase: { [key: string]: number },
    monthNames: string[]
) {
    for (let i = 0; i < monthNames.length; i++) {
        if (monthNames[i]) {
            monthNamesInUpperCase[monthNames[i].toUpperCase()] = i;
        }
    }
}
