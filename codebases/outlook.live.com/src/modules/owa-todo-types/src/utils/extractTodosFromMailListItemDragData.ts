import type Todo from '../schema/Todo';
import type { MailListRowDragData } from 'owa-mail-types/lib/types/MailListRowDragData';
import { DRAGGED_EMAIL_ENTITY_SUBTYPE } from '../index';

export function extractTodosFromMailListItemDragData(
    dragData: MailListRowDragData
): Partial<Todo>[] {
    if (!dragData || !dragData.subjects || dragData.subjects.length === 0) {
        return [];
    }
    const todos = dragData.subjects.map((sub, index) => ({
        Subject: sub,
        LinkedEmail: {
            Id: dragData.latestItemIds[index],
            EntitySubtype: DRAGGED_EMAIL_ENTITY_SUBTYPE,
            DisplayName: sub,
        },
    }));
    return todos;
}
