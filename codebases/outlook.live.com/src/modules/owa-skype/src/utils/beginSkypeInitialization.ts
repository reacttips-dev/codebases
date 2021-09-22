import appendSwcDownloadScript from './appendSwcDownloadScript';
import createOnSwcCoreReadyEvents from './createOnSwcCoreReadyEvents';
import addChatWrapper from '../components/ChatWrapper';

export default function beginSkypeInitialization(): void {
    let chatWrapper = addChatWrapper();

    // Create swc core ready events
    createOnSwcCoreReadyEvents(chatWrapper);

    // Append download script
    appendSwcDownloadScript();
}
