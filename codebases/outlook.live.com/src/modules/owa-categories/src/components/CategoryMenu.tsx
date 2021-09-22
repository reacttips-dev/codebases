import { observer } from 'mobx-react-lite';
import { isConnectedAccount } from 'owa-accounts-store';
import {
    categoryMenuSearchBoxPlaceholderText,
    categoryMenuNewCategoryTooltipText,
    categoryMenuNewCategoryText,
    categoryMenuAllCategoriesTooltip,
    categoryMenuAllCategoriesText,
    categoryMenuClearCategoriesText,
    categoryMenuClearCategoriesTooltipText,
    categoryMenuManageCategoriesTooltipText,
    categoryMenuManageCategoriesText,
} from './CategoryMenu.locstring.json';
import loc from 'owa-localize';
import type { MailboxInfo } from 'owa-client-ids';
import CreateNewMenuItem from './CreateNewMenuItem';
import CategoryDialog from './CategoryDialog';
import resetCategoryDialogViewState from '../mutators/resetCategoryDialogViewState';
import setInitialCategoryDialogViewState from '../actions/setInitialCategoryDialogViewState';
import setCategoryMenuFindText from '../actions/setCategoryMenuFindText';
import setIsFocusInSearchBox from '../actions/setIsFocusInSearchBox';
import setShouldShowAllCategories from '../actions/setShouldShowAllCategories';
import addCategory from '../actions/addCategory';
import categoryStore from '../store/store';
import { DEFAULT_CATEGORY_COLOR_CODE } from '../utils/categoriesConstants';
import type CategoryActionSource from '../utils/CategoryActionSource';
import getCategorySuggestions from '../utils/getCategorySuggestions';
import { isCategoryNameValid } from '../utils/getCategoryNameErrorText';
import { getCategoriesToShow } from '../utils/getCategoriesToShow';
import {
    FocusZone,
    FocusZoneDirection,
    FocusZoneTabbableElements,
} from '@fluentui/react/lib/FocusZone';
import type { DirectionalHint } from '@fluentui/react/lib/Callout';
import { logUsage } from 'owa-analytics';
import type CategoryType from 'owa-service/lib/contract/CategoryType';

import * as React from 'react';
import {
    SearchBox,
    ISearchBoxStyleProps,
    ISearchBoxStyles,
    ISearchBox,
} from '@fluentui/react/lib/SearchBox';
import { CategoryMenuItem } from './CategoryMenuItem';
import { isFeatureEnabled } from 'owa-feature-flags';
import { getDensityModeString } from 'owa-fabric-theme';

import styles from './CategoryMenu.scss';
import classnamesBind from 'classnames/bind';
const classNames = classnamesBind.bind(styles);

export interface CategoryMenuProps {
    actionSource: CategoryActionSource;
    categoryList: CategoryType[];
    categoriesToCheck: string[]; // Categories which are shown checked
    dismissMenu: () => void;
    shouldShowSearchBox: boolean;
    shouldShowManageCategories: boolean;
    shouldShowClearCategories: boolean;
    addFavoriteCategory: (categoryId: string, actionSource: CategoryActionSource) => void;
    onAfterCreateNewCategory: (category: string, addCategoryPromise?: Promise<boolean>) => void; // Called optimistically when user creates a new categories
    onCheckedCategoryClicked: (category: string) => void;
    onUncheckedCategoryClicked: (category: string) => void;
    manageCategoriesDisabled?: boolean;
    createNewCategoryDisabled?: boolean;
    onManageCategoryClicked?: () => void;
    onClearCategoriesClicked?: () => void;
    mailboxInfo?: MailboxInfo;
    directionalHint?: DirectionalHint;
    useTargetWidth?: boolean;
    coverTarget?: boolean;
}

export const CategoryMenu = observer(function CategoryMenu(props_0: CategoryMenuProps) {
    React.useEffect(() => {
        startTime.current = Date.now();
        logUsage('Category_Menu_Opened', [props_0.actionSource]);
        // Focus on search box after component mounts
        focusOnSearchBox();
    }, []);
    const searchBoxRef = React.useRef<ISearchBox>();
    const startTime = React.useRef<number>();
    /**
     * Stores the callback to be called when user hits enter in the search box
     */
    const onSearchBoxEnterCallback = React.useRef<() => void>();
    const shouldInputLoseFocusOnArrowKeyCallback = (inputElement: HTMLInputElement) => {
        // We want the up and down arrow keys on search input element to shift the focus to next and previous element respectively
        // irrespective of the default behavior where FocusZone does not permit it if shifting focus is only doable using Tab keys
        return true;
    };
    const dismissMenu = () => {
        props_0.dismissMenu();
    };
    const onSearchInputChange = (event: React.ChangeEvent<HTMLInputElement>, findText: string) => {
        setCategoryMenuFindText(findText);
        setShouldShowAllCategories(false /* shouldShow */);
        resetCategoryDialogViewState();
    };
    const onSearchBoxRender = () => {
        return (
            <SearchBox
                key={'searchCategoryMenu'}
                className={styles.categoryMenuItemContainerCommon}
                componentRef={searchBoxRef}
                placeholder={loc(categoryMenuSearchBoxPlaceholderText)}
                ariaLabel={loc(categoryMenuSearchBoxPlaceholderText)}
                onEscape={onEscapeOnSearchBox}
                onSearch={onEnterOnSearchBox}
                onChange={onSearchInputChange}
                onBlur={onBlurOnSearchBox}
                onFocus={onFocusOnSearchBox}
                styles={getSearchBoxStyles}
                value={categoryStore.categoryMenuViewState.findText}
            />
        );
    };
    const onFocusOnSearchBox = (evt: React.FocusEvent<EventTarget>) => {
        setIsFocusInSearchBox(true);
    };
    const onBlurOnSearchBox = (evt: React.FocusEvent<EventTarget>) => {
        setIsFocusInSearchBox(false);
        onSearchBoxEnterCallback.current = null;
    };
    const onEscapeOnSearchBox = (evt: React.MouseEvent<unknown>) => {
        // Dismiss the menu when user escapes while focus was on search box.
        // This needs to be handled separately than other menu items
        dismissMenu();
    };
    const onEnterOnSearchBox = (evt: React.MouseEvent<unknown>) => {
        if (onSearchBoxEnterCallback.current) {
            onSearchBoxEnterCallback.current();
        }
        logUsage('Category_Menu_SearchBoxEnterClicked', [props_0.actionSource]);
    };
    const focusOnSearchBox = () => {
        window.requestAnimationFrame(() => {
            searchBoxRef.current?.focus?.();
        });
    };
    const onCategoryClicked = (categoryName: string, isChecked: boolean, isFilterMode: boolean) => {
        // Dismiss menu first and then call the click handler
        dismissMenu();
        if (isChecked) {
            props_0.onCheckedCategoryClicked(categoryName);
        } else {
            props_0.onUncheckedCategoryClicked(categoryName);
        }
        const timeToPickCategoryInMillis = Date.now() - startTime.current;
        logUsage('Category_Menu_CategoryClicked', [
            isFilterMode,
            props_0.actionSource,
            timeToPickCategoryInMillis,
        ]);
    };
    const onNewCategoryClicked = (evt: React.MouseEvent<unknown>) => {
        evt.stopPropagation();
        setCategoryMenuFindText('');
        setInitialCategoryDialogViewState('new');
        logUsage('Category_Menu_NewCategoryClicked', [props_0.actionSource]);
    };
    const onViewAllClicked = (evt: React.MouseEvent<unknown>) => {
        // Required so as the menu does not dismiss when view all is clicked.
        // VSO: 22703 - Investigate why preventDefault is required when view all item is clicked in the move to context menu
        evt.stopPropagation();
        evt.preventDefault();
        // Reset Search findText and new category menu view state
        setCategoryMenuFindText('');
        resetCategoryDialogViewState();
        // Show All categories
        setShouldShowAllCategories(true /* shouldShow */);
        logUsage('Category_Menu_ViewAllClicked', [props_0.actionSource]);
        focusOnSearchBox();
    };
    const onManageCategoryClicked = (evt: React.MouseEvent<unknown>) => {
        dismissMenu();
        props_0.onManageCategoryClicked();
        logUsage('Category_Menu_ManageClicked', [props_0.actionSource]);
    };
    const onClearCategoriesClicked = (evt: React.MouseEvent<unknown>) => {
        dismissMenu();
        props_0.onClearCategoriesClicked();
        logUsage('Category_Menu_ClearClicked', [props_0.actionSource]);
    };
    /**
     * Determines whether to highlight the top item in the menu or not
     */
    const shouldHighlightTopItem = (): boolean => {
        // Top item can be highlighted only when
        // 1. Focus is in search box and
        // 2. There is text is the search box
        return (
            categoryStore.categoryMenuViewState.isFocusInSearchBox &&
            categoryStore.categoryMenuViewState.findText.length > 0
        );
    };
    const renderCategoryMenu = (): JSX.Element[] => {
        let categoriesToShow: string[] = [];
        let shouldShowCreateNewCategoryItem = false;
        let { findText, shouldShowAllCategories } = categoryStore.categoryMenuViewState;
        const isFilterMode = findText.trim().length > 0;
        // reset the onSearchBoxEnter call back
        onSearchBoxEnterCallback.current = null;
        // Filtered mode
        if (isFilterMode) {
            let filteredCategorySuggestions = getCategorySuggestions(
                findText,
                props_0.categoryList
            );
            filteredCategorySuggestions.suggestions.map(suggestion => {
                categoriesToShow.push(suggestion.Name);
            });
            shouldShowCreateNewCategoryItem = !filteredCategorySuggestions.hasExactMatch;
        } else {
            categoriesToShow = getCategoriesToShow(
                props_0.categoryList,
                props_0.categoriesToCheck,
                props_0.shouldShowClearCategories,
                shouldShowAllCategories
            );
        }
        const shouldShowAllCategoriesItem =
            !shouldShowAllCategories && categoriesToShow.length < props_0.categoryList.length;
        let items: JSX.Element[] = [];
        // Add search box
        if (props_0.shouldShowSearchBox) {
            addSearchBox(items);
        }
        // Add categories
        const isTopItemHighlighted = addCategories(
            items,
            categoriesToShow,
            isFilterMode,
            findText,
            props_0.categoryList
        );
        // Add divider if we have more than 1 menu items, 1 is for search box and it has a border
        if (items.length > 1) {
            addDividerMenu(items, 'categoryMenu_extendedMenu_divider');
        }
        // Add "Create New" or "New Category" menu
        shouldShowCreateNewCategoryItem =
            shouldShowCreateNewCategoryItem &&
            !props_0.createNewCategoryDisabled &&
            isCategoryNameValid(findText);
        if (shouldShowCreateNewCategoryItem) {
            addCreateNewMenu(items, isTopItemHighlighted);
            addDividerMenu(items, 'categoryMenu_createNewCategory_divider');
        } else {
            if (!props_0.mailboxInfo || !isConnectedAccount(props_0.mailboxInfo.userIdentity)) {
                addNewCategoryMenu(items);
                addDividerMenu(items, 'categoryMenu_newCategory_divider');
            }
        }
        // Add "All categories" menu
        if (shouldShowAllCategoriesItem) {
            addViewAllMenu(items);
        }
        // Add "Clear categories" menu
        if (props_0.shouldShowClearCategories) {
            addClearCategoryMenu(items);
        }
        // Add "Manage categories" menu
        if (props_0.shouldShowManageCategories) {
            addManageCategoryMenu(items);
        }
        return items;
    };
    const addSearchBox = (items: JSX.Element[]) => {
        items.push(onSearchBoxRender());
    };
    const addCategories = (
        items: JSX.Element[],
        categoriesToShow: string[],
        isFilterMode: boolean,
        findText: string,
        categoryList: CategoryType[]
    ): boolean => {
        let isTopItemHighlighted = false;
        for (let i = 0; i < categoriesToShow.length; i++) {
            const categoryName = categoriesToShow[i];
            const isChecked = props_0.categoriesToCheck.indexOf(categoryName) > -1;
            let containerClass;
            // Highlight top item and store the callback
            if (i == 0 && shouldHighlightTopItem()) {
                containerClass = classNames(styles.highlightItem, styles.categoryMenuItemContainer);
                onSearchBoxEnterCallback.current = () => {
                    onCategoryClicked(categoryName, isChecked, isFilterMode);
                };
                isTopItemHighlighted = true;
            } else {
                containerClass = styles.categoryMenuItemContainer;
            }
            items.push(
                <CategoryMenuItem
                    key={'categoryMenu_' + categoryName}
                    categoryName={categoryName}
                    isChecked={isChecked}
                    className={containerClass}
                    isFilterMode={isFilterMode}
                    categoryList={categoryList}
                    findText={findText}
                    onCategoryClickedCallback={onCategoryClicked}
                    actionSource={props_0.actionSource}
                />
            );
        }
        return isTopItemHighlighted;
    };
    const addCreateNewMenu = (items: JSX.Element[], isTopItemHighlighted: boolean) => {
        let containerClass;
        // Highlight create new if top item is not highlighted
        if (!isTopItemHighlighted && shouldHighlightTopItem()) {
            containerClass = styles.highlightItem;
            onSearchBoxEnterCallback.current = () => {
                createNewCategoryOnEnterOnSearch();
            };
        }
        addCategoryDialogHostMenuItem(items, 'SearchCategoryCreateNew' /* actionSource */);
        items.push(
            <CreateNewMenuItem
                key={'createNewCategory'}
                actionSource={'SearchCategoryCreateNew'}
                containerClass={containerClass}
                createNew={createNewAndClickCategory}
            />
        );
    };
    const createNewCategoryOnEnterOnSearch = () => {
        createNewAndClickCategory(
            categoryStore.categoryMenuViewState.findText,
            DEFAULT_CATEGORY_COLOR_CODE,
            false /* shouldFavorite */,
            'SearchBoxMenu'
        );
    };
    const addNewCategoryMenu = (items: JSX.Element[]) => {
        if (categoryStore.categoryDialogViewState) {
            addCategoryDialogHostMenuItem(items, 'NewCategoryButton' /* actionSource */);
        }
        let createNewCategoryClass = classNames(
            styles.extendedMenuItems,
            props_0.createNewCategoryDisabled && styles.disabled
        );
        let createNewCategoryOnClick = props_0.createNewCategoryDisabled
            ? undefined
            : onNewCategoryClicked;
        items.push(
            <div
                key={'newCategory'}
                className={styles.categoryMenuItemContainer}
                data-is-focusable={true}
                role={'menuitem'}
                onClick={createNewCategoryOnClick}>
                <div
                    title={loc(categoryMenuNewCategoryTooltipText)}
                    className={createNewCategoryClass}>
                    {loc(categoryMenuNewCategoryText)}
                </div>
            </div>
        );
    };
    const addCategoryDialogHostMenuItem = (
        items: JSX.Element[],
        actionSource: CategoryActionSource
    ) => {
        items.push(
            <CategoryDialog
                key={'categoryDialog'}
                actionSource={actionSource}
                onAfterCreateNewCategory={onAfterCreateNewCategory}
                addFavoriteCategory={props_0.addFavoriteCategory}
                mailboxInfo={props_0.mailboxInfo}
            />
        );
    };
    const addViewAllMenu = (items: JSX.Element[]) => {
        items.push(
            <div
                key={'categoriesViewAll'}
                className={styles.categoryMenuItemContainer}
                data-is-focusable={true}
                role={'menuitem'}
                onClick={onViewAllClicked}>
                <div
                    title={loc(categoryMenuAllCategoriesTooltip)}
                    className={styles.extendedMenuItems}>
                    {loc(categoryMenuAllCategoriesText)}
                </div>
            </div>
        );
    };
    const onAfterCreateNewCategory = (
        categoryName: string,
        addCategoryPromise: Promise<boolean>
    ) => {
        dismissMenu();
        // Optimistic local update to apply category after creation
        props_0.onAfterCreateNewCategory(categoryName, addCategoryPromise);
    };
    const createNewAndClickCategory = (
        name: string,
        colorId: number,
        shouldFavorite: boolean,
        menuItemActionSource: CategoryActionSource
    ) => {
        dismissMenu();
        addCategory(
            name,
            colorId,
            shouldFavorite,
            menuItemActionSource,
            props_0.addFavoriteCategory,
            props_0.mailboxInfo,
            props_0.onAfterCreateNewCategory
        );
    };
    const addClearCategoryMenu = (items: JSX.Element[]) => {
        items.push(
            <div
                key={'clearCategories'}
                className={styles.categoryMenuItemContainer}
                data-is-focusable={true}
                role={'menuitem'}
                onClick={onClearCategoriesClicked}>
                <div
                    title={loc(categoryMenuClearCategoriesText)}
                    className={styles.extendedMenuItems}>
                    {loc(categoryMenuClearCategoriesTooltipText)}
                </div>
            </div>
        );
    };
    const addManageCategoryMenu = (items: JSX.Element[]) => {
        let manageCategoryClass = classNames(
            styles.extendedMenuItems,
            props_0.manageCategoriesDisabled && styles.disabled
        );
        let manageCategoryOnClick = props_0.manageCategoriesDisabled
            ? undefined
            : onManageCategoryClicked;
        items.push(
            <div
                key={'categoriesEdit'}
                className={styles.categoryMenuItemContainer}
                data-is-focusable={true}
                role={'menuitem'}
                onClick={manageCategoryOnClick}>
                <div
                    title={loc(categoryMenuManageCategoriesTooltipText)}
                    className={manageCategoryClass}>
                    {loc(categoryMenuManageCategoriesText)}
                </div>
            </div>
        );
    };
    const addDividerMenu = (items: JSX.Element[], key: string) => {
        items.push(<div className={styles.categoryMenuDivider} />);
    };
    // Gets the custom styles for the search box to
    // disable animation and hiding of the search icon
    // setting the search icon color to neutral primary
    const getSearchBoxStyles = (props: ISearchBoxStyleProps): Partial<ISearchBoxStyles> => {
        const { palette } = props.theme;
        const hasDensityNext = isFeatureEnabled('mon-densities');
        return {
            root: [
                {
                    paddingLeft: hasDensityNext ? 8 : 0,
                },
            ],
            icon: [
                {
                    opacity: 1,
                    transition: 'none',
                },
            ],
            iconContainer: [
                {
                    width: hasDensityNext ? (getDensityModeString() === 'full' ? 25 : 22) : 30,
                    color: palette.neutralPrimary,
                },
            ],
        };
    };
    return (
        <FocusZone
            direction={FocusZoneDirection.bidirectional}
            isCircularNavigation={true}
            handleTabKey={FocusZoneTabbableElements.all} // The menu is Tab accessible
            shouldInputLoseFocusOnArrowKey={shouldInputLoseFocusOnArrowKeyCallback}>
            {renderCategoryMenu()}
        </FocusZone>
    );
});
