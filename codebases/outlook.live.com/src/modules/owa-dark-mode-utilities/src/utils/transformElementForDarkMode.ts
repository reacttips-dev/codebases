import Color from 'color';
import {
    ATTR_COLOR,
    ATTR_BGCOLOR,
    DATA_OG_STYLE_COLOR,
    DATA_OG_ATTR_COLOR,
    DATA_OG_STYLE_BACKGROUNDCOLOR,
    DATA_OG_ATTR_BGCOLOR,
} from 'owa-content-colors-constants';

const VALID_CONTRAST_VALUE = 4.5;
const EMPTY_STRING = '';

export interface AlteredElement {
    element: HTMLElement;
    styleColor: string | null;
    attrColor: string | null;
    styleBGColor: string | null;
    attrBGColor: string | null;
}

export default function transformElementForDarkMode(
    element: HTMLElement,
    baseColor: string,
    useSimpleMethod?: boolean
): AlteredElement | null {
    // If any element has an invalid color value, Color will throw an exception when trying to create a color object.
    try {
        const baseBGColor = Color(baseColor);
        let elementAltered = false;
        const computedStyles = window.getComputedStyle(element);

        // The color mapped to "white" is always used for the background in the reading pane.
        // The actual color will be flipped to a dark value when darkMode is enabled.
        const styleColor = element.style.color;
        let textColor = Color(computedStyles.color || undefined);

        // Legacy color support, do not remove even though HTML5 deprecates it
        let attrColor = element.getAttribute(ATTR_COLOR);

        // With the simple recolor flag on, recolor only elements with explicit color applied.
        // This should be fine since we inline all CSS at the CTS step.
        // Else, do our original contrast check logic.
        if (useSimpleMethod ? styleColor || attrColor : !isValidContrast(textColor, baseBGColor)) {
            textColor = fixContrast(textColor, baseBGColor, !!useSimpleMethod, baseColor);

            element.style.setProperty('color', textColor.rgb().string(), 'important');
            element.setAttribute(DATA_OG_STYLE_COLOR, styleColor ? styleColor : EMPTY_STRING);

            // Word seems to prioritize color over CSS color so copy/paste has issues without this
            if (attrColor) {
                element.setAttribute(ATTR_COLOR, textColor.rgb().string());
                element.setAttribute(DATA_OG_ATTR_COLOR, attrColor);
            }

            elementAltered = true;
        }

        // Get the background color from the element giving priority to style.
        // If the element contains no background color, default to dark mode background to past contrast checks.
        const styleBGColor = element.style.backgroundColor;
        let bgColor = computedStyles.backgroundColor
            ? Color(computedStyles.backgroundColor)
            : Color(styleBGColor || undefined);

        // Legacy bgcolor support, do not remove even though HTML5 deprecates it
        let attrBGColor = element.getAttribute(ATTR_BGCOLOR);

        if (useSimpleMethod ? styleBGColor || attrBGColor : !isValidContrast(bgColor, textColor)) {
            bgColor = fixContrast(bgColor, textColor, !!useSimpleMethod, baseColor);

            element.style.setProperty('background-color', bgColor.rgb().string(), 'important');
            element.setAttribute(
                DATA_OG_STYLE_BACKGROUNDCOLOR,
                styleBGColor ? styleBGColor : EMPTY_STRING
            );

            // Word seems to prioritize bgcolor over CSS background-color so copy/paste has issues without this
            if (attrBGColor) {
                element.setAttribute(ATTR_BGCOLOR, bgColor.rgb().string());
                element.setAttribute(DATA_OG_ATTR_BGCOLOR, attrBGColor);
            }

            elementAltered = true;
        }

        // If we altered the element cache its attributes for restoring via the undoHandler.
        if (elementAltered) {
            return {
                element: element,
                styleColor,
                attrColor,
                styleBGColor,
                attrBGColor,
            };
        }
    } catch (e) {
        // Simply swallow malformed CSS and move on as to avoid component errors.
    }
    return null;
}

function isValidContrast(color1: Color, color2: Color): boolean {
    return color1.contrast(color2) >= VALID_CONTRAST_VALUE;
}

export function fixContrast(
    color: Color,
    comparisonColor: Color,
    useSimpleMethod: boolean,
    baseColor: string
): Color {
    const baseBGColor = Color(baseColor);
    const baseLValue = baseBGColor.lab().array()[0];

    // Create the CIELAB color array from the provided color
    const colorLab = color.lab().array();

    let newLValue;

    // With simple recolor, we don't try to contrast adjust anymore.
    // This means that white text will become background colored.
    if (useSimpleMethod) {
        // Flipped and scaled L value because baseLValue reduced the range from [0, 100] to [baseLValue, 100]
        newLValue = (100 - colorLab[0]) * ((100 - baseLValue) / 100) + baseLValue;
    } else {
        // L value for the color we need to contrast against
        const comparisonLValue = comparisonColor.lab().array()[0];

        const ceilingDarkLValue = 50; // values above this can't contrast against 100
        const floorLightLValue = 50 + baseLValue; // values below this can't contrast against baseLValue
        const midpointLValue = (floorLightLValue + ceilingDarkLValue) / 2;

        // Scaled L value because baseLValue reduced the range from [0, 100] to [baseLValue, 100]
        newLValue = colorLab[0] * ((100 - baseLValue) / 100) + baseLValue;

        // Flip, or not flip, depends on whichever value is more contrasting
        // Also avoid the dead zone in the middle caused by baseLValue not being 0
        if (comparisonLValue > midpointLValue) {
            // comparisonLValue isLight, newLValue should isDark
            newLValue = Math.min(newLValue, 2 * midpointLValue - newLValue);
            newLValue =
                ((newLValue - baseLValue) * (ceilingDarkLValue - baseLValue)) /
                    (midpointLValue - baseLValue) +
                baseLValue;
        } else {
            // comparisonLValue isDark, newLValue should isLight
            newLValue = Math.max(newLValue, 2 * midpointLValue - newLValue);
            newLValue =
                100 - ((100 - newLValue) * (100 - floorLightLValue)) / (100 - midpointLValue);
        }
    }

    // Create a new color from the old color values and new luminance value.
    return Color.lab(newLValue, colorLab[1], colorLab[2]).rgb().alpha(color.alpha());
}
