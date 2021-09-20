import { HistoryEntry, HistoryAction, HistoryContext } from './types';
import {
  localActionStorage,
  localUndoStackStorage,
} from './local-action-storage';

export interface ActionStorage {
  read(): HistoryEntry[];
  write(history: HistoryEntry[]): void;
}

export interface ActionRecorderOptions {
  storage: ActionStorage;
  undoStack: ActionStorage;
  maxEntries: number;
}

export class ActionRecorder {
  private storage: ActionStorage;
  private undoStack: ActionStorage;
  private maxEntries: number;

  constructor({ storage, undoStack, maxEntries }: ActionRecorderOptions) {
    this.storage = storage;
    this.undoStack = undoStack;
    this.maxEntries = maxEntries;
  }

  append(action: HistoryAction, context: HistoryContext): void {
    const previous = this.get();

    const entry: HistoryEntry = {
      timestamp: Date.now(),
      action,
      context,
    };

    const updated = [entry, ...previous];
    updated.length = Math.min(updated.length, this.maxEntries);

    this.storage.write(updated);
  }

  get(): HistoryEntry[] {
    return this.storage.read();
  }

  /**
   * When an action is undone by the app, we implicitly record a new action for
   * its inverse. In order to produce an undo stack that can be traversed
   * intuitively, we remove the original action from history altogether, and
   * unshift the undone action into the stack.
   */
  undo(): void {
    // Index 0 is the recorded inverted undo action: omit it from record.
    const [, undoneAction, ...previous] = this.get();
    this.storage.write(previous);
    // Order matters here: don't read undo stack until action has been undone.
    this.undoStack.write([undoneAction, ...this.getUndoStack()]);
  }

  /**
   * After redoing an action, the last entry in history will be the new
   * execution of that action; replace it with the originally undone action.
   * This is meaningful for timestamp comparisons per `getUndoStack`.
   */
  redo(): void {
    const [, ...history] = this.get();
    const [undoneAction, ...stack] = this.undoStack.read();
    this.storage.write([undoneAction, ...history]);
    this.undoStack.write(stack);
  }

  getUndoStack(): HistoryEntry[] {
    let stack = this.undoStack.read();
    if (!stack.length) {
      return stack;
    }
    // Clean undo stack if the most recent action was taken after our last undo.
    const [lastAction] = this.get();
    if (lastAction && lastAction.timestamp > stack[0].timestamp) {
      stack = [];
      this.undoStack.write(stack);
    }
    return stack;
  }
}

const MAX_ENTRIES = 256;

// eslint-disable-next-line @trello/no-module-logic
export const ActionHistory = new ActionRecorder({
  storage: localActionStorage,
  undoStack: localUndoStackStorage,
  maxEntries: MAX_ENTRIES,
});
