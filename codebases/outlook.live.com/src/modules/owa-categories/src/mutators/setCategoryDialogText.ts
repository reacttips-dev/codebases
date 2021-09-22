import { mutatorAction } from 'satcheljs';
import categoryStore from '../store/store';

export default mutatorAction('setCategoryDialogText', function setCategoryDialogText(text: string) {
    categoryStore.categoryDialogViewState.categoryName = text;
    categoryStore.categoryDialogViewState.errorText = '';
});
