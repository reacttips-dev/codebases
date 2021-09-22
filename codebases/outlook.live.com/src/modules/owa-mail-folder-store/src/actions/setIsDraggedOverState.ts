import { default as viewStateStore } from '../store/store';
import { mutatorAction } from 'satcheljs';

/*
 * Toggles isDraggedOver state
 * @param isDraggedOver indicates if folder pane is dragged over
 */
export default mutatorAction(
    'setIsDraggedOverState',
    function setIsDraggedOverState(isDraggedOver: boolean): void {
        viewStateStore.isDraggedOver = isDraggedOver;
    }
);
