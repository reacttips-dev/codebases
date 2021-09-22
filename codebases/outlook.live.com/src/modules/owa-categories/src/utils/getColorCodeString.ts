import {
    red_Category_ColorPicker_Text,
    orange_Category_ColorPicker_Text,
    peach_Category_ColorPicker_Text,
    yellow_Category_ColorPicker_Text,
    green_Category_ColorPicker_Text,
    tealLight_Category_ColorPicker_Text,
    olive_Category_ColorPicker_Text,
    blue_Category_ColorPicker_Text,
    purple_Category_ColorPicker_Text,
    pink_Category_ColorPicker_Text,
    steelLight_Category_ColorPicker_Text,
    steelGray_Category_ColorPicker_Text,
    grayLight_Category_ColorPicker_Text,
    gray_Category_ColorPicker_Text,
    black_Category_ColorPicker_Text,
    redDark_Category_ColorPicker_Text,
    orangeDark_Category_ColorPicker_Text,
    brown_Category_ColorPicker_Text,
    yellowDark_Category_ColorPicker_Text,
    greenDark_Category_ColorPicker_Text,
    tealDark_Category_ColorPicker_Text,
    oliveDark_Category_ColorPicker_Text,
    blueDark_Category_ColorPicker_Text,
    purpleDark_Category_ColorPicker_Text,
    magentaDark_Category_ColorPicker_Text,
} from './getColorCodeString.locstring.json';
import loc from 'owa-localize';
import CategoryColor from '../store/schema/CategoryColor';

import { trace } from 'owa-trace';

/**
 * Gets the color string given a category color code.
 */
export default function getColorCodeString(categoryColor: CategoryColor) {
    switch (categoryColor) {
        case CategoryColor.Red:
            return loc(red_Category_ColorPicker_Text);

        case CategoryColor.Orange:
            return loc(orange_Category_ColorPicker_Text);

        case CategoryColor.Peach:
            return loc(peach_Category_ColorPicker_Text);

        case CategoryColor.YellowLight:
            return loc(yellow_Category_ColorPicker_Text);

        case CategoryColor.GreenLight:
            return loc(green_Category_ColorPicker_Text);

        case CategoryColor.TealLight:
            return loc(tealLight_Category_ColorPicker_Text);

        case CategoryColor.Olive:
            return loc(olive_Category_ColorPicker_Text);

        case CategoryColor.BlueSky:
            return loc(blue_Category_ColorPicker_Text);

        case CategoryColor.PurpleLight:
            return loc(purple_Category_ColorPicker_Text);

        case CategoryColor.Pink:
            return loc(pink_Category_ColorPicker_Text);

        case CategoryColor.SteelLight:
            return loc(steelLight_Category_ColorPicker_Text);

        case CategoryColor.SteelGrey:
            return loc(steelGray_Category_ColorPicker_Text);

        case CategoryColor.GreyLight:
            return loc(grayLight_Category_ColorPicker_Text);

        case CategoryColor.GreyDark:
            return loc(gray_Category_ColorPicker_Text);

        case CategoryColor.Black:
            return loc(black_Category_ColorPicker_Text);

        case CategoryColor.RedDark:
            return loc(redDark_Category_ColorPicker_Text);

        case CategoryColor.OrangeDark:
            return loc(orangeDark_Category_ColorPicker_Text);

        case CategoryColor.BrownMedium:
            return loc(brown_Category_ColorPicker_Text);

        case CategoryColor.YellowDark:
            return loc(yellowDark_Category_ColorPicker_Text);

        case CategoryColor.GreenDark:
            return loc(greenDark_Category_ColorPicker_Text);

        case CategoryColor.TealDark:
            return loc(tealDark_Category_ColorPicker_Text);

        case CategoryColor.OliveDark:
            return loc(oliveDark_Category_ColorPicker_Text);

        case CategoryColor.BlueDark:
            return loc(blueDark_Category_ColorPicker_Text);

        case CategoryColor.PurpleDark:
            return loc(purpleDark_Category_ColorPicker_Text);

        case CategoryColor.MagentaDark:
            return loc(magentaDark_Category_ColorPicker_Text);

        case CategoryColor.None:
            return '';

        default:
            trace.info('getColorCodeString should be called with a know colorCode');
            return loc(gray_Category_ColorPicker_Text);
    }
}
