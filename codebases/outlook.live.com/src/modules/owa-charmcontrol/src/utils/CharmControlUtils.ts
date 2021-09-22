import CharmControlColorPattern from '../components/CharmControlColorPattern';
import type CharmControlColorProps from '../components/CharmControlColorProps';
import generateNewCSSClassName from './generateNewCssClassName';

const CLS2 = 'cls-2';

/**
 * This function updates the svg color using the given ColorScheme. The CharmControl uses different color patterns according to where it is displayed.
 * colorProps   -> The CharmControlProperties.
 *
 * Returns the Hex color based on the colorPattern.
 */
export function getCharmControlColor(colorProps?: CharmControlColorProps) {
    let selectedColor = '';
    if (!colorProps) {
        return selectedColor;
    }

    if (colorProps.colorPattern == null) {
        return selectedColor;
    }

    switch (colorProps.colorPattern) {
        case CharmControlColorPattern.Normal:
            selectedColor = colorProps.calPrimary ? colorProps.calPrimary : selectedColor;
            break;
        case CharmControlColorPattern.TextColor:
            selectedColor = colorProps.inheritTextColor ? 'inherit' : colorProps.textColor;
            break;
        case CharmControlColorPattern.Dark:
            selectedColor = colorProps.calDarkAlt ? colorProps.calDarkAlt : selectedColor;
            break;
        default:
            break;
    }

    return selectedColor;
}

/**
 * This function updates the svg color using the given ColorScheme. The CharmControl uses different color patterns according to where it is displayed.
 * svgText                  -> The string that contains the complete <svg> html.
 * CharmControlColorProps   -> Charm Control properties
 *
 * Returns the updated <svg> html.
 */
export function changeSvgColor(id: number, svgText: string, colorProps?: CharmControlColorProps) {
    if (svgText == null || svgText == '') {
        return '';
    }

    if (!colorProps) {
        return svgText;
    }

    let selectedColor = getCharmControlColor(colorProps);

    if (selectedColor != '') {
        let originalCssClass = 'class="' + CLS2 + '"';

        // Generate the new css classname by using an incrementing counter
        let newCssClassName = generateNewCSSClassName(CLS2);

        let newCssClass = 'class="' + newCssClassName + '"';

        if (svgText.indexOf(originalCssClass) > 0 || svgText.indexOf(newCssClass) > 0) {
            svgText = setCssClass(svgText, newCssClassName);
            svgText = updateSvgInnerCssFill(id, svgText, selectedColor, newCssClassName);
            svgText = svgText.replace(originalCssClass, newCssClass);
        }
    }

    return svgText;
}

/**
 * This function replaces the svg's CSS class in its <path> with the provided CSS class
 * svgText  -> The string that contains the complete <svg> html.
 * cssClass -> the name of the CSS class to be applied to the svg.
 *
 * Returns the updated <svg> html.
 */
export function setCssClass(svgText: string, cssClass: string) {
    if (svgText == null || svgText == '') {
        return '';
    }

    if (cssClass == null || cssClass == '' || cssClass.indexOf(' ') > 0) {
        return svgText;
    }

    if (svgText.indexOf(cssClass + ' {') < 0) {
        svgText = svgText.replace(CLS2, cssClass);
    }

    return svgText;
}

/**
 * This function creates a CSS class, assigns it to the svg's <path>, and updates the inner svg fill color.
 * svgText      -> The string that contains the complete <svg> html.
 * color        -> The color to be used
 * cssClass     -> the name of the CSS class to be applied to the svg, according to who is rendering it.
 *
 * Returns the updated <svg> html.
 */
export function updateSvgInnerCssFill(
    id: number,
    svgText: string,
    color: string,
    cssClass: string
) {
    if (svgText == null || svgText == '') {
        return '';
    }

    if (cssClass == null || cssClass == '') {
        return svgText;
    }

    let clsIndex = svgText.indexOf(cssClass + ' {');

    if (clsIndex > 0) {
        let newSvgText = svgText;
        let originalClsStr = newSvgText.substring(clsIndex - 1);
        let endOfFill = originalClsStr.indexOf('}');

        originalClsStr = originalClsStr.substring(0, endOfFill);
        let beginOfFill = originalClsStr.indexOf('fill:');
        endOfFill = originalClsStr.indexOf(';');

        let originalFillStr = originalClsStr.substring(beginOfFill, endOfFill);

        if (color == null || color == '') {
            return svgText;
        }
        let newFillStr = 'fill: ' + color;

        let newClsStr = '';
        newClsStr =
            '#CharmControlID' + id + ' ' + originalClsStr.replace(originalFillStr, newFillStr);

        newSvgText = newSvgText.replace(originalClsStr, newClsStr);

        return newSvgText;
    }

    return svgText;
}

export default changeSvgColor;
