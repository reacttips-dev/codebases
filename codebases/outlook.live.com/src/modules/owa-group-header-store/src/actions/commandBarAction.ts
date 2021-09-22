import { mutatorAction } from 'satcheljs';
import type NavigationButton from '../store/schema/NavigationButton';
import commandBarStore from '../store/CommandBarStore';

export default mutatorAction('commandBarAction', (buttonSelected: NavigationButton) => {
    commandBarStore.navigationButtonSelected = buttonSelected;
});
