import getStore from '../store/store';
import { mutator } from 'satcheljs';
import { setDraggedItemType } from '../actions/setDraggedItemType';

export const setDraggedItemTypeMutator = mutator(setDraggedItemType, actionMessage => {
    getStore().draggedItemType = actionMessage.typeOfItemDragged;
});
