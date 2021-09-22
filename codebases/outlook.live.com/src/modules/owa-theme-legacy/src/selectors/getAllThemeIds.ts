import { isUserPersonalizationAllowed, isTenantThemeDataAvailable } from 'owa-theme-common';
import { getNonBootUserConfigurationSync } from 'owa-nonboot-userconfiguration-manager';
import { ThemeConstants } from 'owa-theme-shared';
import { isBrowserEDGECHROMIUM } from 'owa-user-agent';
import { getDate, now } from 'owa-datetime';
import { getQueryStringParameter } from 'owa-querystring';
import isThemeofDayIconVisible from '../utils/isThemeofDayIconVisible';

interface ThemeIdsAndCondition {
    themes: string[];
    isAvailable: () => boolean;
    isEdgeOnly?: boolean;
    rotatingThemes: string[];
}

// These are in sorted order, which is why some conditionals may be repeated
export const themeIdsAndConditions: ThemeIdsAndCondition[] = [
    {
        // Edge only themes
        themes: ['edgeiod'],
        rotatingThemes: [
            'edge1',
            'edge2',
            'edge3',
            'edge4',
            'edge5',
            'edge6',
            'edge7',
            'edge8',
            'edge9',
            'edge10',
            'edge11',
            'edge12',
            'edge13',
            'edge14',
            'edge15',
            'edge16',
            'edge17',
            'edge18',
            'edge19',
            'edge20',
        ],
        isAvailable: () => {
            return isUserPersonalizationAllowed() && isThemeofDayIconVisible();
        },
        isEdgeOnly: true,
    },
    {
        themes: [ThemeConstants.BASE_THEME_ID],
        isAvailable: () => true,
        rotatingThemes: [],
    },
    {
        themes: [ThemeConstants.BASE_OFFICE_THEME_ID],
        isAvailable: () => isTenantThemeDataAvailable() && isUserPersonalizationAllowed(),
        rotatingThemes: [],
    },
    {
        themes: [ThemeConstants.CONTRAST_THEME_ID],
        isAvailable: () => true,
        rotatingThemes: [],
    },
    {
        // Pride themes
        themes: ['rainbow', 'ribbon', 'unicorn'],
        isAvailable: isUserPersonalizationAllowed,
        rotatingThemes: [],
    },
    {
        // EDU themes
        themes: ['supplies', 'backpack'],
        isAvailable: () => {
            const { IsEdu = false } = getNonBootUserConfigurationSync() || {};

            return IsEdu && isUserPersonalizationAllowed();
        },
        rotatingThemes: [],
    },
    {
        themes: [
            'mountain',
            'beach',
            'circuit',
            'blueprint',
            'far',
            'whale',
            'super',
            'jelly',
            'wrld',
            'angular',
            'balloons',
            'black',
            'blueberry',
            'bricks',
            'cats',
            'chevron',
            'comic',
            'cordovan',
            'crayon',
            'cubes',
            'cubism',
            'darkcordovan',
            'darkorange',
            'diamonds',
            'grape',
            'lightblue',
            'lightgreen',
            'lite',
            'mediumdarkblue',
            'minimal',
            'modern',
            'orange',
            'paint',
            'pink',
            'pixel',
            'polka',
            'pomegranate',
            'primary',
            'raspberry',
            'robot',
            'simple',
            'spectrum',
            'strawberry',
            'teagarden',
            'teal',
            'watermelon',
            'whimsical',
            'wntrlnd',
        ],
        isAvailable: isUserPersonalizationAllowed,
        rotatingThemes: [],
    },
];

export default function getAllThemeIds() {
    return themeIdsAndConditions.reduce(
        (accumulatedThemeIds: string[], currentSet) =>
            accumulatedThemeIds.concat(
                currentSet.isAvailable() && !currentSet.isEdgeOnly ? currentSet.themes : []
            ),
        []
    );
}

export function isEdgeThemeEnabled(themeId) {
    return isThemeEdgeOnly(themeId) ? isBrowserEDGECHROMIUM() : true;
}

export function getEdgeThemeById(themeId) {
    let edgeThemes: string[] = getEdgeRotatingThemesById(themeId);

    if (edgeThemes.length > 0) {
        let todayDate = getDate(now());
        return edgeThemes[
            getQueryStringParameter('loadEdgeTheme')
                ? getQueryStringParameter('loadEdgeTheme')
                : todayDate > 20
                ? (todayDate % 20) - 1
                : todayDate - 1
        ];
    }

    return themeId;
}

export function isThemeEdgeOnly(themeId) {
    return getEdgeRotatingThemesById(themeId).length > 0;
}

function getEdgeRotatingThemesById(themeId) {
    return themeIdsAndConditions.reduce(
        (accumulatedThemeIds: string[], currentSet) =>
            accumulatedThemeIds.concat(
                currentSet.isAvailable() &&
                    currentSet.isEdgeOnly &&
                    (currentSet.themes.indexOf(themeId) > -1 ||
                        currentSet.rotatingThemes.indexOf(themeId) > -1)
                    ? currentSet.rotatingThemes
                    : []
            ),
        []
    );
}
