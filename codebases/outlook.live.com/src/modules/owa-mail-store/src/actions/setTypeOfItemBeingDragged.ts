import { getStore } from '../store/Store';
import { mutatorAction } from 'satcheljs';

export default mutatorAction(
    'setTypeOfItemBeingDragged',
    function setTypeOfItemBeingDragged(dataItemType: string | null) {
        getStore().typeOfItemBeingDragged = dataItemType;
    }
);
