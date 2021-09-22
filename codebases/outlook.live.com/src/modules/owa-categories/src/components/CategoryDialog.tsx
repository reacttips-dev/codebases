import {
    categoryDialogNameCategory,
    categoryDialogTextFieldLabel,
    categoryDialogColorPickerLabel,
    categoryDialogSave,
    categoryDialogCancel,
    editCategoryTitle,
    newCategoryTitle,
} from './CategoryDialog.locstring.json';
import loc from 'owa-localize';
import resetCategoryDialogViewState from '../mutators/resetCategoryDialogViewState';
import setCategoryDialogColorId from '../mutators/setCategoryDialogColorId';
import setCategoryDialogText from '../mutators/setCategoryDialogText';
import categoryStore from '../store/store';
import type CategoryActionSource from '../utils/CategoryActionSource';
import { isCategoryNameValid } from '../utils/getCategoryNameErrorText';
import updateCategoryColor from '../utils/updateCategoryColor';
import { observer } from 'mobx-react-lite';
import { TextField } from '@fluentui/react/lib/TextField';
import { KeyCodes } from '@fluentui/react/lib/Utilities';
import { Dialog, DialogFooter } from '@fluentui/react/lib/Dialog';
import { PrimaryButton, DefaultButton } from '@fluentui/react/lib/Button';
import { SwatchColorPicker } from '@fluentui/react/lib/SwatchColorPicker';
import toggleCategoryDialogShouldFavorite from '../mutators/toggleCategoryDialogShouldFavorite';
import setCategoryNameErrorText from '../mutators/setCategoryNameErrorText';
import { StarCharm } from 'owa-star-charm';
import { addToFavoritesCategoryText } from 'owa-locstrings/lib/strings/addtofavoritescategorytext.locstring.json';
import { removeFromFavoritesCategoryText } from 'owa-locstrings/lib/strings/removefromfavoritescategorytext.locstring.json';
import getUserConfiguration from 'owa-session-store/lib/actions/getUserConfiguration';
import { getColorCellMenuItems, getColorGridCellStyles } from '../utils/getColorPickerProps';
import {
    addMasterCategories,
    renameMasterCategories,
} from '../actions/masterCategoryListOperation';
import { getGuid } from 'owa-guid';
import { getCategoryIdFromName } from '../utils/categoryIdNameConverter';
import applyCategoryOperationHelper from '../utils/applyCategoryOperationHelper';
import CategoryOperationType from 'owa-service/lib/contract/CategoryOperationType';
import getMasterCategoryList from '../utils/getMasterCategoryList';
import type { MailboxInfo } from 'owa-client-ids';
import fetchCategoryDetails from '../utils/fetchCategoryDetails';
import { getCategoryTotalCount } from '../utils/getCategoryCounts';
import setBlockedCategoryNames from '../mutators/setBlockedCategoryNames';
import { DatapointStatus, PerformanceDatapoint } from 'owa-analytics';

import * as React from 'react';
import * as ReactDOM from 'react-dom';

import styles from './CategoryDialog.scss';

export interface CategoryDialogProps {
    actionSource: CategoryActionSource;
    addFavoriteCategory: (categoryId: string, actionSource: CategoryActionSource) => void;
    removeFavoriteCategory?: (categoryId: string, actionSource: CategoryActionSource) => void;
    onAfterCreateNewCategory: (
        categoryName?: string,
        addCategoryPromise?: Promise<boolean>
    ) => void;
    onAfterRenameCategory?: (oldCategoryName: string, newCategoryName: string) => void;
    mailboxInfo?: MailboxInfo;
}

const CategoryDialog = observer(function CategoryDialog(props: CategoryDialogProps) {
    const renderCategoryDialog = () => {
        const categoryDialogViewState = categoryStore.categoryDialogViewState;

        // Only render if in a new/edit category view state
        if (!categoryDialogViewState) {
            return null;
        }

        return (
            <Dialog
                hidden={!categoryDialogViewState}
                title={
                    categoryDialogViewState.operation === 'new'
                        ? loc(newCategoryTitle)
                        : loc(editCategoryTitle)
                }
                onDismiss={resetCategoryDialogViewState}
                minWidth={'450px'}>
                <div className={styles.dialogSecondRow}>
                    {renderCategoryTextField()}
                    {props.addFavoriteCategory && renderToggleFavoriteButton()}
                </div>
                <div className={styles.colorLabel}>{loc(categoryDialogColorPickerLabel)}</div>
                {renderColorPickerControl(categoryDialogViewState.selectedColorId)}
                <DialogFooter styles={{ actionsRight: styles.footerRight }}>
                    <PrimaryButton
                        disabled={!shouldEnableSave()}
                        onClick={commitCategory}
                        text={loc(categoryDialogSave)}
                    />
                    <DefaultButton
                        onClick={resetCategoryDialogViewState}
                        text={loc(categoryDialogCancel)}
                    />
                </DialogFooter>
            </Dialog>
        );
    };

    // Only allow save if the new category name is valid or we are editing
    // and have changed the color or favorite status with the exact same name
    const shouldEnableSave = () => {
        const {
            initialCategoryState,
            categoryName,
            operation,
            selectedColorId,
            shouldFavorite,
        } = categoryStore.categoryDialogViewState;
        return (
            isCategoryNameValid(categoryName) ||
            (operation === 'edit' &&
                categoryName === initialCategoryState.categoryName &&
                (initialCategoryState.selectedColorId !== selectedColorId ||
                    initialCategoryState.isFavorite !== shouldFavorite))
        );
    };

    const renderToggleFavoriteButton = () => {
        // We don't support add/remove favorites in explicit logon scenarios
        if (getUserConfiguration()?.SessionSettings?.IsExplicitLogon) {
            return null;
        }

        const addText = loc(addToFavoritesCategoryText);
        const removeText = loc(removeFromFavoritesCategoryText);
        const isSetToFavorite = categoryStore.categoryDialogViewState.shouldFavorite;
        return (
            <StarCharm
                isStarred={isSetToFavorite}
                onClick={toggleCategoryDialogShouldFavorite}
                iconStyles={styles.categoryActionIcon}
                ariaLabelText={isSetToFavorite ? removeText : addText}
                tooltip={{
                    starred: removeText,
                    unstarred: addText,
                }}
            />
        );
    };

    /**
     * Render the color picker control
     */
    const renderColorPickerControl = (categoryColorId: string): JSX.Element => {
        return (
            <SwatchColorPicker
                key={'category_color_picker'}
                cellShape={'circle'}
                colorCells={getColorCellMenuItems()}
                columnCount={10}
                cellHeight={30}
                cellWidth={30}
                cellBorderWidth={2}
                getColorGridCellStyles={getColorGridCellStyles}
                onColorChanged={setCategoryDialogColorId}
                selectedId={categoryColorId}
                shouldFocusCircularNavigate={true}
            />
        );
    };

    const onValidateTextField = () => {
        setCategoryNameErrorText();
    };

    /**
     * Render the text field to input the category name
     */
    const renderCategoryTextField = (): JSX.Element => {
        const { errorText, categoryName } = categoryStore.categoryDialogViewState;
        return (
            <TextField
                autoComplete={'new-password'}
                label={loc(categoryDialogTextFieldLabel)}
                autoFocus={true}
                className={errorText ? styles.categoryTextField : styles.categoryTextFieldNoError}
                multiline={false}
                onChange={onCategoryTextChanged}
                onKeyDown={onKeyDownOnTextField}
                placeholder={loc(categoryDialogNameCategory)}
                value={categoryName}
                errorMessage={errorText}
                validateOnFocusOut={true}
                onNotifyValidationResult={onValidateTextField}
            />
        );
    };

    /**
     * Store text
     */
    const onCategoryTextChanged = (
        event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>,
        text: string
    ) => {
        setCategoryDialogText(text);
    };

    /**
     * Handler key down event on the TextField
     * OnEnter- call commit new category (calls create from props)
     * OnEscape- resetCategoryDialogViewState, which will dismiss *only* the category dialog
     */
    const onKeyDownOnTextField = (event: React.KeyboardEvent<unknown>) => {
        switch (event.keyCode) {
            case KeyCodes.enter:
                // Stop propagation and default so other forms are not submitted
                event.stopPropagation();
                event.preventDefault();
                if (shouldEnableSave()) {
                    commitCategory();
                } else {
                    setCategoryNameErrorText();
                }
                break;

            case KeyCodes.escape:
                // Stop propagation so that it does not dismiss the entire menu.
                event.stopPropagation();
                resetCategoryDialogViewState();
                break;
        }
    };

    const commitCategory = () => {
        categoryStore.categoryDialogViewState.operation === 'new'
            ? commitNewCategory()
            : commitEditCategory();
        resetCategoryDialogViewState();
    };

    const commitNewCategory = () => {
        const {
            categoryName,
            shouldFavorite,
            selectedColorId,
        } = categoryStore.categoryDialogViewState;

        const trimmedCategoryName = categoryName.trim();
        const currentTime = new Date().toISOString();
        const categoriesToAdd = [
            {
                Id: getGuid(),
                Name: trimmedCategoryName,
                Color: +selectedColorId,
                LastTimeUsed: currentTime,
            },
        ];

        // Add category to master list
        const addCategoryPromise = addMasterCategories(
            categoriesToAdd,
            props.actionSource,
            props.mailboxInfo
        );
        // Add category to favorites if set to favorite
        addCategoryPromise.then((success: boolean) => {
            if (success && shouldFavorite) {
                const categoryId = getCategoryIdFromName(categoryName, getMasterCategoryList());
                props.addFavoriteCategory(categoryId, props.actionSource);
            }
        });
        props.onAfterCreateNewCategory(trimmedCategoryName, addCategoryPromise);
    };

    const commitEditCategory = async () => {
        const {
            initialCategoryState,
            categoryName,
            selectedColorId,
            shouldFavorite,
        } = categoryStore.categoryDialogViewState;
        const trimmedCategoryName = categoryName.trim();

        // If name is not changing just edit the category
        if (trimmedCategoryName === initialCategoryState.categoryName) {
            if (initialCategoryState.selectedColorId !== selectedColorId) {
                updateCategoryColor(+selectedColorId, trimmedCategoryName, props.actionSource);
            }
            if (initialCategoryState.isFavorite !== shouldFavorite) {
                const categoryId = getCategoryIdFromName(
                    trimmedCategoryName,
                    getMasterCategoryList()
                );
                if (shouldFavorite) {
                    props.addFavoriteCategory(categoryId, props.actionSource);
                } else if (props.removeFavoriteCategory) {
                    props.removeFavoriteCategory(categoryId, props.actionSource);
                }
            }
        } else {
            // Perform rename operation
            await renameCategory();
            // Wait until MCL is updated to apply local updates
            props.onAfterRenameCategory?.(initialCategoryState.categoryName, trimmedCategoryName);
        }
    };

    const renameCategory = async () => {
        const {
            initialCategoryState,
            categoryName,
            selectedColorId,
            shouldFavorite,
        } = categoryStore.categoryDialogViewState;

        const oldCategoryName = initialCategoryState.categoryName;
        const newCategoryName = categoryName.trim();
        setBlockedCategoryNames([oldCategoryName, newCategoryName], true /* shouldBlockNames */);
        let datapoint;
        try {
            const oldCategory = getMasterCategoryList().filter(
                category => category.Name === oldCategoryName
            )[0];

            await fetchCategoryDetails();
            const categoryTotalCount = getCategoryTotalCount(oldCategoryName);
            if (categoryStore.isSearchFolderReady) {
                datapoint = new PerformanceDatapoint('OptionsRenameCategory', {
                    timeout: 120000,
                });
                datapoint.addCustomData([categoryTotalCount]);
            }

            // Remove favorite category if favorited
            if (initialCategoryState.isFavorite) {
                props.removeFavoriteCategory(oldCategory.Id, props.actionSource);
            }

            // Remove the category that needs to be updated from the master category list and
            // add the new category to the master category list
            const replacementCategory = {
                Name: newCategoryName,
                Color: +selectedColorId,
                Id: getGuid(),
                LastTimeUsed: oldCategory.LastTimeUsed,
            };
            await renameMasterCategories(
                [replacementCategory],
                [oldCategoryName],
                props.actionSource
            );

            // Add favorite category if favorited
            if (shouldFavorite) {
                props.addFavoriteCategory(
                    getCategoryIdFromName(newCategoryName, getMasterCategoryList()),
                    props.actionSource
                );
            }

            // Apply category operation service to rename the category on all applied items
            applyCategoryOperationHelper(
                CategoryOperationType.Rename,
                datapoint,
                oldCategoryName,
                newCategoryName
            );
        } catch (err) {
            if (datapoint) {
                datapoint.endWithError(DatapointStatus.ServerError);
            }
            setBlockedCategoryNames(
                [oldCategoryName, newCategoryName],
                false /* shouldBlockNames */
            );
        }
    };

    return renderCategoryDialog();
});

export default CategoryDialog;

export function showCategoryDialog(props: CategoryDialogProps) {
    const {
        actionSource,
        addFavoriteCategory,
        removeFavoriteCategory,
        onAfterCreateNewCategory,
        onAfterRenameCategory,
        mailboxInfo,
    } = props;

    const categoryDialogDiv = document.createElement('div');
    categoryDialogDiv.id = 'categoryDialogDiv';
    document.body.appendChild(categoryDialogDiv);

    ReactDOM.render(
        <React.StrictMode>
            <CategoryDialog
                actionSource={actionSource}
                addFavoriteCategory={addFavoriteCategory}
                removeFavoriteCategory={removeFavoriteCategory}
                onAfterCreateNewCategory={onAfterCreateNewCategory}
                onAfterRenameCategory={onAfterRenameCategory}
                mailboxInfo={mailboxInfo}
            />
        </React.StrictMode>,
        categoryDialogDiv
    );
}
