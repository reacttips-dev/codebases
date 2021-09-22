import { mutatorAction } from 'satcheljs';
import categoryStore from '../store/store';

export default mutatorAction(
    'setCategoryDialogColorId',
    function setCategoryDialogColorId(selectedColorId: string) {
        categoryStore.categoryDialogViewState.selectedColorId = selectedColorId;
    }
);
