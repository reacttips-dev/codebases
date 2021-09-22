import { getScenarioStore } from 'owa-search-store';
import KeyboardCharCodes from 'owa-hotkeys/lib/utils/keyboardCharCodes';
import { mutator } from 'satcheljs';
import { onKeyDownSearchInput } from 'owa-search-actions';

mutator(onKeyDownSearchInput, actionMessage => {
    const { evtKeyCode, scenarioId } = actionMessage;

    getScenarioStore(scenarioId).isLastKeyPressedDeletion =
        evtKeyCode === KeyboardCharCodes.Backspace || evtKeyCode === KeyboardCharCodes.Delete;
});
