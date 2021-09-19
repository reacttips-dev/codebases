import { CLEAR_EVENT_QUEUE, STORE_EVENT_IN_QUEUE } from 'constants/reduxActions';
export interface AmethystEvent {
  [key: string]: Record<string, any>[];
  abTests: Record<string, any>[];
}

export function storeEventInQueue(event: AmethystEvent) {
  return {
    type: STORE_EVENT_IN_QUEUE,
    event
  } as const;
}

export function clearEventQueue() {
  return {
    type: CLEAR_EVENT_QUEUE
  } as const;
}

export type AmethystAction =
| ReturnType<typeof storeEventInQueue>
| ReturnType<typeof clearEventQueue>;
