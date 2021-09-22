import { observer } from 'mobx-react-lite';
import { useComputedValue } from 'owa-react-hooks/lib/useComputed';
import { logUsage } from 'owa-analytics';
import * as React from 'react';
import type { CategoryColorValue } from '../store/schema/CategoryColor';
import getCategoryColorsForCategory from '../utils/getCategoryColorsForCategory';
import getMasterCategoryList from '../utils/getMasterCategoryList';
import type CategoryType from 'owa-service/lib/contract/CategoryType';
import { IButtonProps, IconButton } from '@fluentui/react/lib/Button';
import { ControlIcons } from 'owa-control-icons';
import { removeCategoryButtonLabel, searchCategoryButtonLabel } from './Category.locstring.json';
import loc, { format } from 'owa-localize';
import { isFeatureEnabled } from 'owa-feature-flags';
import { getDensityModeString } from 'owa-fabric-theme';
import { lazyGetOptimalTextColorString, lazyGenerateColorScheme } from 'owa-color-utils';

import styles from './Category.scss';
import classnamesBind from 'classnames/bind';
const classNames = classnamesBind.bind(styles);

export interface CategoryProps {
    category: string;
    categoryList?: CategoryType[];
    actionSource: string;
    isLastInWell: boolean;
    containerClassName?: string;
    onCategoryClicked?: (
        ev: React.MouseEvent<unknown>,
        category: string,
        actionSource: string
    ) => void;
    showCategoryRemove?: boolean;
    onRemoveCategoryClicked?: (category: string) => void;
}

export default observer(function Category(props: CategoryProps) {
    const categoryContainerElement = React.useRef<HTMLElement>();
    const categoryColor = useComputedValue((): CategoryColorValue => {
        return getCategoryColorsForCategory(
            props.category,
            props.categoryList ? props.categoryList : getMasterCategoryList()
        );
    }, [props.category, props.categoryList]);
    const { textColor, primaryColor, secondaryColor } = categoryColor;
    const hasDensityNext = isFeatureEnabled('mon-densities');

    const onCategoryClicked = (ev: React.MouseEvent<unknown>) => {
        if (props.onCategoryClicked) {
            logUsage('Category_Well_Click', [props.actionSource]);
            props.onCategoryClicked(ev, props.category, props.actionSource);
        }
    };
    const onMouseEnterCategory = () => {
        if (props.onCategoryClicked) {
            categoryContainerElement.current.style.borderColor = textColor;
        }
    };
    const onMouseLeaveCategory = () => {
        if (props.onCategoryClicked) {
            categoryContainerElement.current.style.borderColor = secondaryColor;
        }
    };
    const cStyle = {
        backgroundColor: primaryColor,
        borderColor: secondaryColor,
        color: textColor,
        cursor: props.onCategoryClicked ? 'pointer' : 'initial',
    };
    const categoryName = props.category;
    const containerClassnames = classNames(
        props.containerClassName,
        props.isLastInWell ? styles.lastCategoryContainer : styles.categoryContainer,
        props.showCategoryRemove ? styles.categoryMaxWidth : styles.categoryMaxWidthWithButton
    );
    const categoryClassnames = classNames(
        styles.categoryName,
        hasDensityNext && getDensityModeString()
    );
    const onRemoveCategoryClicked = React.useCallback(
        evt => {
            evt.stopPropagation();
            props.onRemoveCategoryClicked(categoryName);
        },
        [props.onRemoveCategoryClicked, props.category]
    );

    const optimalTextColorOnHover = useComputedValue(() => {
        // Only do the work to get an accessible color if showing category remove button
        if (props.showCategoryRemove) {
            const getOptimalTextColorString = lazyGetOptimalTextColorString.tryImportForRender();
            const generateColorScheme = lazyGenerateColorScheme.tryImportForRender();
            if (generateColorScheme && getOptimalTextColorString) {
                return getOptimalTextColorString(
                    secondaryColor,
                    generateColorScheme(textColor),
                    textColor
                );
            }
        }
        return null;
    }, [categoryColor, props.showCategoryRemove]);

    // Props for the button that removes the category
    const removeButtonProps: IButtonProps = {
        iconProps: {
            iconName: ControlIcons.Cancel,
        },
        className: styles.removeCategoryButton,
        onClick: onRemoveCategoryClicked,
        ariaLabel: format(loc(removeCategoryButtonLabel), categoryName),
        title: format(loc(removeCategoryButtonLabel), categoryName),
        styles: {
            icon: {
                color: textColor,
                backgroundColor: primaryColor,
                fontSize: '12px',
            },
            iconHovered: {
                backgroundColor: secondaryColor,
                color: optimalTextColorOnHover,
            },
            rootPressed: {
                backgroundColor: secondaryColor,
                color: optimalTextColorOnHover,
            },
            rootHovered: {
                backgroundColor: secondaryColor,
                color: optimalTextColorOnHover,
            },
        },
    };
    return (
        <div
            ref={r => (categoryContainerElement.current = r)}
            key={categoryName}
            className={containerClassnames}
            style={cStyle}
            title={format(loc(searchCategoryButtonLabel), categoryName)}
            onMouseEnter={onMouseEnterCategory}
            onMouseLeave={onMouseLeaveCategory}
            onClick={onCategoryClicked}>
            <span className={categoryClassnames}>{categoryName}</span>
            {props.showCategoryRemove && <IconButton {...removeButtonProps} />}
        </div>
    );
});
