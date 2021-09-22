import { mutatorAction } from 'satcheljs';
import categoryStore from '../store/store';

export default mutatorAction(
    'toggleCategoryDialogShouldFavorite',
    function toggleCategoryDialogShouldFavorite() {
        categoryStore.categoryDialogViewState.shouldFavorite = !categoryStore
            .categoryDialogViewState.shouldFavorite;
    }
);
