import { logUsage } from 'owa-analytics';
import type { ClientItem } from 'owa-mail-store';
import { mutatorAction } from 'satcheljs';
import getYammerScenario from 'owa-yammer-thread/lib/utils/getYammerScenario';

export default mutatorAction('setYammerData', (item: ClientItem) => {
    if (item.YammerNotification || item.ExtensibleContentData) {
        const yammerScenario = getYammerScenario(
            item.ExtensibleContentData,
            item.YammerNotification
        );
        if (yammerScenario?.isValid()) {
            item.YammerData = yammerScenario;
        } else {
            item.YammerData = null;
            logUsage(
                'Yammer_FailedToParseId',
                {
                    YammerNotificationHeader: item.YammerNotification || item.ExtensibleContentData,
                },
                { logEvery: 1 }
            );
        }
    }
});

export const setYammerDataToNull = mutatorAction('setYammerDataToNull', (item: ClientItem) => {
    // If this is not a Yammer thread, always set the value to null
    item.YammerData = null;
});
