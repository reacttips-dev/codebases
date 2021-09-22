import TranslateAddinCommand from './TranslateAddinCommand';
import { ExtensibilityModeEnum } from 'owa-addins-types';
import { initializeExtensibilityContext } from 'owa-addins-boot';
import { openNonPersistentTaskPaneAddinCommand } from 'owa-addins-view';

export default async function launchTranslateCommand(hostItemIndex: string) {
    await initializeExtensibilityContext();
    const translateCommand = new TranslateAddinCommand();
    if (translateCommand != null) {
        openNonPersistentTaskPaneAddinCommand(
            hostItemIndex,
            translateCommand,
            ExtensibilityModeEnum.MessageRead
        );
        return;
    }
    return null;
}
