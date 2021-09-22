import FontFlags from 'owa-service/lib/contract/FontFlags';
import getUserConfiguration from 'owa-session-store/lib/actions/getUserConfiguration';
import type { DefaultFormat } from 'roosterjs-editor-types';
import { getFontFamily, getFontSizeInPoints } from 'owa-format-options';
import getDarkModeTextColorForLightModeColor from 'owa-color-constants/lib/utils/getDarkModeTextColorForLightModeColor';

// default composing font family (this should match the Calibri font in the FONT_NAME_LIST in FontName.ts), font size and text color
const DEFAULT_FONT_FAMILY: string = 'Calibri,Arial,Helvetica,sans-serif';
const DEFAULT_FONT_SIZE: string = '11pt';
const DEFAULT_TEXT_COLOR: string = '#000000';

export type { DefaultFormat };

const DEFAULT_FORMAT: DefaultFormat = {
    fontFamily: DEFAULT_FONT_FAMILY,
    fontSize: DEFAULT_FONT_SIZE,
    textColor: DEFAULT_TEXT_COLOR,
    bold: false,
    italic: false,
    underline: false,
};

export default function getDefaultComposeFormat(isDarkMode?: boolean): DefaultFormat {
    const userOption = getUserConfiguration().UserOptions;
    if (userOption) {
        return getComposeFormat(
            userOption.ComposeFontName,
            userOption.ComposeFontSize,
            userOption.ComposeFontColor,
            userOption.ComposeFontFlags,
            !!isDarkMode
        );
    } else {
        return DEFAULT_FORMAT;
    }
}

export function getComposeFormat(
    fontName: string,
    fontSize: number,
    fontColor: string,
    fontFlags: FontFlags,
    isDarkMode: boolean
) {
    let defaultFormat = { ...DEFAULT_FORMAT };

    let composeFont: string = fontName ? getFontFamily(fontName) : null;
    if (composeFont) {
        defaultFormat.fontFamily = composeFont;
    }

    let composeSize: string = fontSize ? getFontSizeInPoints(fontSize) : null;
    if (composeSize) {
        defaultFormat.fontSize = composeSize;
    }

    if (fontColor) {
        if (isDarkMode) {
            const darkColor = getDarkModeTextColorForLightModeColor(fontColor);
            if (darkColor) {
                defaultFormat.textColors = {
                    lightModeColor: fontColor,
                    darkModeColor: darkColor,
                };
            } else {
                defaultFormat.textColor = fontColor;
            }
        }
        defaultFormat.textColor = fontColor;
    }

    if (fontFlags) {
        defaultFormat.bold = (fontFlags & FontFlags.Bold) == FontFlags.Bold;
        defaultFormat.italic = (fontFlags & FontFlags.Italic) == FontFlags.Italic;
        defaultFormat.underline = (fontFlags & FontFlags.Underline) == FontFlags.Underline;
    }

    return defaultFormat;
}
