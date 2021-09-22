import { createStore } from 'satcheljs';
import type CommandBarState from './schema/CommandBarState';
import NavigationButton from './schema/NavigationButton';

export default createStore<CommandBarState>('commandBarStore', {
    navigationButtonSelected: NavigationButton.Email,
    hidden: false,
})();
