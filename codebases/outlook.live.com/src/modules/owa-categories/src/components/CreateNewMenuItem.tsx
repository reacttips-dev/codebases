import { observer } from 'mobx-react-lite';
import {
    categoryMenuCreateNewAriaLabel,
    categoryMenuCreateNewText,
} from './CreateNewMenuItem.locstring.json';
import loc, { format } from 'owa-localize';
import CategoryIcon from './CategoryIcon';
import setInitialCategoryDialogViewState from '../actions/setInitialCategoryDialogViewState';
import categoryStore from '../store/store';
import type CategoryActionSource from '../utils/CategoryActionSource';
import { KeyCodes } from '@fluentui/react/lib/Utilities';
import { logUsage } from 'owa-analytics';
import getDefaultCategoryColorString from '../utils/getDefaultCategoryColorString';

import * as React from 'react';
import getMasterCategoryList from '../utils/getMasterCategoryList';

import styles from './CreateNewMenuItem.scss';
import classnamesBind from 'classnames/bind';
const classNames = classnamesBind.bind(styles);
const createCategoryDatapoint = 'Category_Menu_CreateNewClicked';

export interface CreateNewMenuItemProps {
    actionSource: CategoryActionSource;
    containerClass?: string;
    createNew: (
        name: string,
        selectedColorId: number,
        shouldFavorite: boolean,
        actionSource: CategoryActionSource
    ) => void;
}

export default observer(function CreateNewMenuItem(props: CreateNewMenuItemProps) {
    const renderCreateNewMenu = () => {
        const findText = categoryStore.categoryMenuViewState.findText;
        const categoryColorId = getDefaultCategoryColorString();
        const ariaLabel = format(loc(categoryMenuCreateNewAriaLabel), findText);
        return (
            <div
                aria-label={ariaLabel}
                className={classNames(styles.categoryMenuItemContainer, props.containerClass)}
                data-is-focusable={true}
                onKeyDown={onKeyDownOnCreateNewCategory}
                onClick={onCreateNewCategoryClicked}
                role={'menuitem'}>
                {renderCreateNewIcon(categoryColorId)}
                {renderCreateNew(categoryColorId)}
            </div>
        );
    };
    /**
     * Render simple icon for a create new menu
     */
    const renderCreateNewIcon = (categoryColorId: string): JSX.Element => {
        return (
            <CategoryIcon
                categoryColorId={categoryColorId}
                iconClassName={styles.categoryIconInMenu}
                categoryList={getMasterCategoryList()}
            />
        );
    };
    /**
     * Render the category find text and the (Create new) text
     */
    const renderCreateNew = (selectedColorId: string): JSX.Element => {
        const findText = categoryStore.categoryMenuViewState.findText;
        return (
            <div className={styles.createNewTextContainer}>
                <div className={styles.createNewCategoryMatchText}>{'"' + findText + '"'}</div>
                <div className={styles.createNewCategoryText}>
                    &nbsp;{loc(categoryMenuCreateNewText)}
                </div>
            </div>
        );
    };
    /**
     * On key down on create new category menu
     */
    const onKeyDownOnCreateNewCategory = (ev: React.KeyboardEvent) => {
        const findText = categoryStore.categoryMenuViewState.findText;
        if (ev.keyCode == KeyCodes.enter) {
            ev.stopPropagation();
            setInitialCategoryDialogViewState('new', findText);
            logUsage(createCategoryDatapoint);
        }
    };
    /**
     * On click on create new category menu
     */
    const onCreateNewCategoryClicked = (ev: React.MouseEvent<unknown>) => {
        const findText = categoryStore.categoryMenuViewState.findText;
        ev.stopPropagation();
        setInitialCategoryDialogViewState('new', findText);
        logUsage(createCategoryDatapoint);
    };

    return renderCreateNewMenu();
});
