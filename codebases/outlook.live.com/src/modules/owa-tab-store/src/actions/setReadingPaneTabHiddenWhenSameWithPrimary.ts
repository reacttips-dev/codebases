import { mutatorAction } from 'satcheljs';
import type SecondaryReadingPaneTabData from '../store/schema/SecondaryReadingPaneTabData';

const setReadingPaneTabHiddenWhenSameWithPrimary = mutatorAction(
    'Tab_SetReadingPaneTabHiddenWhenSameWithPrimary',
    (viewState: SecondaryReadingPaneTabData, hideWhenSameWithPrimary: boolean) => {
        viewState.hideWhenSameWithPrimary = hideWhenSameWithPrimary;
    }
);

export default setReadingPaneTabHiddenWhenSameWithPrimary;
