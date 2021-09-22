import { mutator } from 'satcheljs';
import setInitialCategoryDialogViewState from '../actions/setInitialCategoryDialogViewState';
import categoryStore from '../store/store';
import getDefaultCategoryColorString from '../utils/getDefaultCategoryColorString';

mutator(setInitialCategoryDialogViewState, actionMessage => {
    const { operation, initialCategoryName, colorId, isFavorite } = actionMessage;

    categoryStore.categoryDialogViewState = {
        operation,
        categoryName: initialCategoryName || '',
        selectedColorId: colorId || getDefaultCategoryColorString(),
        errorText: '',
        shouldFavorite: isFavorite,
        initialCategoryState: {
            categoryName: initialCategoryName,
            selectedColorId: colorId,
            isFavorite: isFavorite,
        },
    };
});
