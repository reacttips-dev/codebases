import type {
    IColorCellProps,
    IColorPickerGridCellStyles,
    IColorPickerGridCellStyleProps,
} from '@fluentui/react/lib/SwatchColorPicker';
import CategoryColor from '../store/schema/CategoryColor';
import getColorCodeString from './getColorCodeString';
import categoryStore from '../store/store';

export function getColorCellMenuItems(): IColorCellProps[] {
    const colorCellItems: IColorCellProps[] = [];
    const colorCodeSequence = [
        CategoryColor.Red,
        CategoryColor.Orange,
        CategoryColor.Peach,
        CategoryColor.YellowLight,
        CategoryColor.GreenLight,
        CategoryColor.TealLight,
        CategoryColor.Olive,
        CategoryColor.BlueSky,
        CategoryColor.PurpleLight,
        CategoryColor.Pink,
        CategoryColor.SteelLight,
        CategoryColor.SteelGrey,
        CategoryColor.GreyLight,
        CategoryColor.GreyDark,
        CategoryColor.Black,
        CategoryColor.RedDark,
        CategoryColor.OrangeDark,
        CategoryColor.BrownMedium,
        CategoryColor.YellowDark,
        CategoryColor.GreenDark,
        CategoryColor.TealDark,
        CategoryColor.OliveDark,
        CategoryColor.BlueDark,
        CategoryColor.PurpleDark,
        CategoryColor.MagentaDark,
    ];
    for (let i = 0; i < colorCodeSequence.length; i++) {
        const categoryColorValue = categoryStore.colorCodeColorValueMap[colorCodeSequence[i]];
        colorCellItems.push({
            id: colorCodeSequence[i].toString(),
            color: categoryColorValue.iconColor,
            label: getColorCodeString(colorCodeSequence[i]),
        });
    }

    return colorCellItems;
}

export function getColorGridCellStyles(
    props: IColorPickerGridCellStyleProps
): Partial<IColorPickerGridCellStyles> {
    const { selected, theme } = props;
    return {
        colorCell: [
            selected &&
                'isSelected' && {
                    borderColor: theme.palette.themeLight + '!important',
                },
        ],
    };
}
