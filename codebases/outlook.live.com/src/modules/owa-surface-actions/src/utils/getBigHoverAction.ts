import type { HoverActionKey } from 'owa-outlook-service-options';
// Determines which big hover action will be shown on the right side of the mail item. We will either show Delete or Archive.
// Delete takes precedence over Archive so if we find a delete we can return early.
export function getBigHoverAction(actions: string[] | HoverActionKey[]) {
    if (!actions) {
        return '';
    }
    let bigAction = '';
    for (const action of actions) {
        if (action == 'Delete') {
            return action;
        }
        if (action == 'Archive') {
            bigAction = action;
        }
    }
    return bigAction;
}
