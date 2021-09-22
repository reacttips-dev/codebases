import { changeMasterCategories } from '../actions/masterCategoryListOperation';
import { getMasterCategoryList } from '../index';
import type CategoryType from 'owa-service/lib/contract/CategoryType';
import type CategoryActionSource from './CategoryActionSource';

export default function updateCategoryColor(
    newColorId: number,
    categoryName: string,
    actionSource: CategoryActionSource
) {
    const matchingCategory = getMasterCategoryList().filter(
        category => category.Name === categoryName
    )[0];

    if (!matchingCategory) {
        throw new Error('UpdateCategoryColor should be called on an existing color');
    }
    if (matchingCategory === newColorId) {
        return;
    }

    const newCategory = <CategoryType>{
        Name: matchingCategory.Name,
        Color: newColorId,
        Id: matchingCategory.Id,
        LastTimeUsed: matchingCategory.LastTimeUsed,
    };
    changeMasterCategories([newCategory], actionSource);
}
