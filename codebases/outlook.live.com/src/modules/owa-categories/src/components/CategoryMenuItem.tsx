import CategoryIcon from './CategoryIcon';
import { Icon } from '@fluentui/react/lib/Icon';
import { logUsage } from 'owa-analytics';
import { ControlIcons } from 'owa-control-icons';
import type CategoryType from 'owa-service/lib/contract/CategoryType';
import * as React from 'react';
import type CategoryActionSource from '../utils/CategoryActionSource';

import styles from './CategoryMenu.scss';

export interface CategoryMenuItemProps {
    categoryName: string;
    isChecked: boolean;
    className: string;
    isFilterMode: boolean;
    categoryList: CategoryType[];
    findText: string;
    onCategoryClickedCallback: (
        categoryName: string,
        isChecked: boolean,
        isFilterMode: boolean
    ) => void;
    actionSource: CategoryActionSource;
}

export function CategoryMenuItem(props: CategoryMenuItemProps) {
    const onCategoryClicked = () => {
        const { categoryName, isChecked, isFilterMode, onCategoryClickedCallback } = props;
        onCategoryClickedCallback(categoryName, isChecked, isFilterMode);
    };
    const onCategoryIconClicked = () => {
        logUsage('Category_Menu_CategoryIconClickedOnFilteredCategory', [props.actionSource]);
    };
    const { categoryName, isChecked, className, categoryList, findText } = props;
    let matchText = '';
    let nonMatchText = categoryName;
    if (findText && categoryName.toLocaleLowerCase().indexOf(findText.toLocaleLowerCase()) == 0) {
        matchText = categoryName.substr(0, findText.length);
        nonMatchText = categoryName.substr(findText.length, categoryName.length - 1);
    }
    return (
        <div
            role={'menuitemcheckbox'}
            aria-checked={isChecked}
            data-is-focusable={true}
            className={className}
            onClick={onCategoryClicked}
            title={categoryName}>
            <div onClick={onCategoryIconClicked}>
                <CategoryIcon
                    categoryName={categoryName}
                    iconClassName={styles.categoryIconInMenu}
                    categoryList={categoryList}
                />
            </div>
            <div className={styles.categoryName}>
                <span className={styles.categoryMatchSuggestion}>{matchText}</span>
                <span className={styles.categorySuggestion}>{nonMatchText}</span>
            </div>
            {isChecked && (
                <Icon iconName={ControlIcons.CheckMark} className={styles.checkMarkIcon} />
            )}
        </div>
    );
}
