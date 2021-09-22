import closeAllUILessAddinsForItem from './closeAllUILessAddinsForItem';
import { closeAllAutoRunCommandsforHostItemIndex } from 'owa-addins-store';
import { onComposeCloseAction } from 'owa-addins-apis/lib/apis/close/closeApiMethod';
import { orchestrator } from 'satcheljs';

export default function onComposeClose(hostItemIndex: string) {
    closeAllUILessAddinsForItem(hostItemIndex);
    closeAllAutoRunCommandsforHostItemIndex(hostItemIndex);
}

orchestrator(onComposeCloseAction, ({ hostItemIndex }) => onComposeClose(hostItemIndex));
