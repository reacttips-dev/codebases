import { SharedState } from '@trello/shared-state';
import { FlagArgs } from './types';

export const flagsState = new SharedState<FlagArgs[]>([]);
