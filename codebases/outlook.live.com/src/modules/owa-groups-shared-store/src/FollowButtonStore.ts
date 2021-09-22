import { createStore } from 'satcheljs';
import type ActionState from './schema/ActionState';
import type ActionButtonState from './schema/ActionButtonState';
import { ObservableMap } from 'mobx';

export default createStore<ActionButtonState>('followButtonStore', {
    // The key is  groupSmtpAddress.toLowerCase()
    groupActionState: new ObservableMap<string, ActionState>(),
})();
