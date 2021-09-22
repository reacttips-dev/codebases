import { LazyAction, LazyModule } from 'owa-bundling';
export { userMailInteractionAction } from './triage/userMailInteractionAction';
export type { ActionType } from './triage/userMailInteractionAction';
export type { default as TriageContext } from './triage/TriageContext';

const lazyModule = new LazyModule(
    () => import(/* webpackChunkName: "MailActions" */ './lazyIndex')
);

export let lazyOnKeyboardUpDown = new LazyAction(lazyModule, m => m.onKeyboardUpDown);
export let lazyOnOpenEmail = new LazyAction(lazyModule, m => m.onOpenEmail);
export let lazyOnKeyboardToggleSelect = new LazyAction(lazyModule, m => m.onKeyboardToggleSelect);
