import { action } from 'satcheljs';

/**
 * This action is used to inform hosted components of what is being dragged outside it (before it enters that component)
 * e.g. user starts to drag an email or a calendar event in the mail/calendar module.
 * we need the task panel and the task charm in the header to know about this so it can render a drop hint for the user.
 *
 * Mail module will invoke this action when a list item is dragged up and over its surface.
 *
 * We cannot simply rely on owa-dnd's dragDataUtils/setDragType to invoke this
 * because this is invoked when a component is unmounted, which results in setDragType to be set to null.
 * Even if we checked for isBeingDragged before we set this, or did this in a onDragStart,
 * it would only cover drags that started inside the module.
 * So we would miss out on stuff like local files that were dragged over the mail module.
 * We can't auto set this dnd's onDragOver either because it would get unset as it left a Droppable's onDragLeave.
 * So as we dragged an item across the module, various Droppable components in the module would keep setting/unsetting it.
 */
export const setDraggedItemType = action(
    'OWA_MODULE_SET_DRAGGED_ITEM_TYPE',
    (typeOfItemDragged: string | null) => ({
        typeOfItemDragged,
    })
);
