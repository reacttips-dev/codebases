import { createStore } from 'satcheljs';
import { ObservableMap } from 'mobx';
import type ActionState from './schema/ActionState';
import type ActionButtonState from './schema/ActionButtonState';

export default createStore<ActionButtonState>('joinButtonStore', {
    // The key is  groupSmtpAddress.toLowerCase()
    groupActionState: new ObservableMap<string, ActionState>(),
})();
