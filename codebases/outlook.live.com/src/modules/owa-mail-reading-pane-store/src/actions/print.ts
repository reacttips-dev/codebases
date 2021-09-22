import loadItemReadingPane from './loadItemReadingPane';
import setItemPrintPaneViewState from './setItemPrintPaneViewState';
import datapoints from '../datapoints';
import { logUsage, wrapFunctionForDatapoint } from 'owa-analytics';
import type { ActionSource } from 'owa-analytics-types';
import type { ClientItemId } from 'owa-client-ids';
import { lazyReloadSecondaryTabAsDeeplink } from 'owa-tab-store';

export default wrapFunctionForDatapoint(
    datapoints.PrintItem,
    function print(
        itemId: ClientItemId,
        actionSource: ActionSource,
        targetWindow: Window
    ): Promise<void> {
        const itemIdToPrint = itemId;
        if (itemIdToPrint) {
            const isProjection: boolean = targetWindow && targetWindow !== window;
            if (isProjection) {
                logUsage('printFromProjection');
                lazyReloadSecondaryTabAsDeeplink.importAndExecute(itemIdToPrint.Id, {
                    Print: '',
                });
            } else {
                return loadItemReadingPane(
                    itemIdToPrint,
                    null /* instrumentationContext */,
                    setItemPrintPaneViewState,
                    true /* isPrint */
                );
            }
        }

        return Promise.resolve();
    }
);
