import { observer } from 'mobx-react-lite';
import { Icon } from '@fluentui/react/lib/Icon';
import getCategoryColorsForCategory, {
    getDefaultCategoryColor,
} from '../utils/getCategoryColorsForCategory';
import { ControlIcons } from 'owa-control-icons';
import categoryStore from '../store/store';
import * as React from 'react';
import getMasterCategoryList from '../utils/getMasterCategoryList';
import type CategoryType from 'owa-service/lib/contract/CategoryType';
import TagFilled from 'owa-fluent-icons-svg/lib/icons/TagFilled';
import { isFeatureEnabled } from 'owa-feature-flags';
import { getDensityModeString } from 'owa-fabric-theme';

import styles from '../scss/CategorySharedStyles.scss';
import classnamesBind from 'classnames/bind';
const classNames = classnamesBind.bind(styles);

export interface CategoryIconProps {
    categoryName?: string;
    categoryList?: CategoryType[];
    categoryColorId?: string;
    iconClassName: string;
}

const CategoryIcon = observer(function CategoryIcon(props: CategoryIconProps) {
    let categoryColor;

    /**
     * Try to get category color from the category name
     * If the name is not specified (in case of new category creation) check if color id is specified and get color from the colorValueMap
     * Else use the default color
     */
    if (props.categoryName) {
        categoryColor = getCategoryColorsForCategory(
            props.categoryName,
            props.categoryList ? props.categoryList : getMasterCategoryList()
        );
    } else if (props.categoryColorId) {
        categoryColor = categoryStore.colorCodeColorValueMap[props.categoryColorId];
    } else {
        categoryColor = getDefaultCategoryColor();
    }
    const iconColor = categoryColor.iconColor;
    const hasDensityNext = isFeatureEnabled('mon-densities');

    const iconStyles = { color: iconColor };
    const iconClass = classNames(
        styles.categoryIcon,
        props.iconClassName,
        hasDensityNext && getDensityModeString(),
        hasDensityNext && styles.categorySize
    );

    return (
        <Icon
            className={iconClass}
            iconName={hasDensityNext ? TagFilled : ControlIcons.TagSolid}
            style={iconStyles}
        />
    );
});
export default CategoryIcon;
