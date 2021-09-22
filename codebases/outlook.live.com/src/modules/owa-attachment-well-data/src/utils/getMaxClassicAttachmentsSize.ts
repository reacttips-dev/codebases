import { OneKBInBytes, OneMBInBytes } from './attachmentConstants';
import { computed } from 'mobx';
import getUserConfiguration from 'owa-session-store/lib/actions/getUserConfiguration';

const DEFAULT_MAX_TOTAL_CLASSIC_ATTACHMENT_SIZE = 25 * OneMBInBytes;
export const MAX_SIZE_BUFFER_IN_KB = 2048; //  We need a little buffer for overhead such as other request headers or the size of message body

export default function getMaxClassicAttachmentsSize(): number {
    return computedGetMaxClassicAttachmentsSize.get();
}

const computedGetMaxClassicAttachmentsSize = computed(() => {
    const userConfiguration = getUserConfiguration();
    if (!userConfiguration || !userConfiguration.SessionSettings) {
        return DEFAULT_MAX_TOTAL_CLASSIC_ATTACHMENT_SIZE;
    }

    return (getMaxValueInKb() - MAX_SIZE_BUFFER_IN_KB) * OneKBInBytes;

    function getMaxValueInKb() {
        return userConfiguration.SessionSettings.MaxMessageSizeInKb;
    }
});
