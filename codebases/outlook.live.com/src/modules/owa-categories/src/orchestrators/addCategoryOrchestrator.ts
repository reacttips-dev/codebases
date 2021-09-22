import addCategory from '../actions/addCategory';
import { orchestrator } from 'satcheljs';
import { addMasterCategories } from '../actions/masterCategoryListOperation';
import { getCategoryIdFromName, getMasterCategoryList } from '../index';
import { getGuid } from 'owa-guid';

orchestrator(addCategory, actionMessage => {
    const {
        name,
        colorId,
        shouldFavorite,
        categoryActionSource,
        addFavoriteCategory,
        mailboxInfo,
        onAfterCreateNewCategory,
    } = actionMessage;

    const trimmedCategoryName = name.trim();
    const currentTime = new Date().toISOString();
    const categoriesToAdd = [
        {
            Id: getGuid(),
            Name: trimmedCategoryName,
            Color: colorId,
            LastTimeUsed: currentTime,
        },
    ];

    // Add Category to master list
    const addCategoryPromise = addMasterCategories(
        categoriesToAdd,
        categoryActionSource,
        mailboxInfo
    );
    addCategoryPromise.then((success: boolean) => {
        if (success && shouldFavorite) {
            // Add a category to favorites
            const categoryId = getCategoryIdFromName(trimmedCategoryName, getMasterCategoryList());
            addFavoriteCategory(categoryId, categoryActionSource);
        }
    });

    // We have to pass in addCategoryPromise and call onAfterCreateNewCategory synchronously, instead of waiting for the addMasterCategories
    // promise is resolved as true, because the callback scenario is to optimistically update conversations/emails with the newly created category
    if (onAfterCreateNewCategory) {
        onAfterCreateNewCategory(trimmedCategoryName, addCategoryPromise);
    }
});
