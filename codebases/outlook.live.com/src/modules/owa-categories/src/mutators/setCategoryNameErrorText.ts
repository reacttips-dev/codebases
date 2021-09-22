import { mutatorAction } from 'satcheljs';
import categoryStore from '../store/store';
import { getCategoryNameErrorText } from '../utils/getCategoryNameErrorText';

export default mutatorAction('setCategoryNameErrorText', function setCategoryNameErrorText() {
    categoryStore.categoryDialogViewState.errorText = getCategoryNameErrorText(
        categoryStore.categoryDialogViewState.categoryName
    );
});
