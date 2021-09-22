import getStore from '../store/store';
import type { HoverActionKey } from 'owa-outlook-service-options';
import { mutator } from 'satcheljs';
import getHoverSurfaceAction from '../utils/hoverSurfaceActionHelper';
import initializeHoverSurfaceAction from '../actions/initializeHoverSurfaceAction';

mutator(initializeHoverSurfaceAction, actionMessage => {
    const hoverActionKeys: HoverActionKey[] = getHoverSurfaceAction();
    getStore().hoverSurfaceActions = hoverActionKeys;
});
