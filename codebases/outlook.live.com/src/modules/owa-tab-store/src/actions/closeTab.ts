import type TabViewState from '../store/schema/TabViewState';
import datapoints from '../datapoints';
import setTabIsShown from './setTabIsShown';
import { wrapFunctionForDatapoint } from 'owa-analytics';
import { mutatorAction } from 'satcheljs';
import { getTabHandler } from '../utils/TabHandler';
import { getStore } from '../store/tabStore';

export default wrapFunctionForDatapoint(
    datapoints.TabViewCloseTab,
    async function (viewState: TabViewState, forceClose?: boolean) {
        let canClose = true;
        const handler = getTabHandler(viewState.type);
        if (!forceClose && handler && handler.canClose) {
            canClose = await handler.canClose(viewState);
        }

        if (canClose) {
            // Reuse the code in setTabIsShown to activate next tab if necessary
            setTabIsShown(viewState, false /*isShown*/);

            const index = getStore().tabs.indexOf(viewState);
            if (index >= 0) {
                spliceTabs(index);
            }
        }
    }
);

const spliceTabs = mutatorAction('spliceTabs', (index: number) => {
    getStore().tabs.splice(index, 1);
});
