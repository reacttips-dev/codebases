import { mutatorAction } from 'satcheljs';
import categoryStore from '../store/store';

export default mutatorAction(
    'resetCategoryDialogViewState',
    function resetCategoryDialogViewState() {
        categoryStore.categoryDialogViewState = null;
    }
);
