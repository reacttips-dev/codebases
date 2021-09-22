import { mutatorAction } from 'satcheljs';
import { getStore } from '../store/parentStore';

const setIsProjectionAvailable = mutatorAction(
    'SetIsProjectionAvailable',
    (isAvailable: boolean) => {
        getStore().isAvailable = isAvailable;
    }
);

export default setIsProjectionAvailable;
