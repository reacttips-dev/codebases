import type { ClientItemId } from 'owa-client-ids';
import { action } from 'satcheljs';

export const clickCalendarEvent = action('clickCalendarEvent', (id: ClientItemId) => ({
    id,
}));

export const clickAgendaTodo = action('clickAgendaTodo', (todoId: string) => ({
    todoId,
}));

export const doubleClickCalendarEvent = action('doubleClickCalendarEvent', (id: ClientItemId) => ({
    id,
}));

export const resetCalendarView = action('resetCalendarView');
