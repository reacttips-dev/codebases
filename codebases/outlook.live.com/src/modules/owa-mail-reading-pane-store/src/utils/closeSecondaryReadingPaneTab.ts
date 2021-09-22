import { getStore as getMailStore } from 'owa-mail-store';
import { getStore as getTabStore, TabType, lazyCloseTab } from 'owa-tab-store';

export default function closeSecondaryReadingPaneTab(conversationId: string, itemId: string) {
    const idToClose = [conversationId, itemId];
    const mailStore = getMailStore();
    if (mailStore.conversations.has(conversationId)) {
        const conversationItemParts = mailStore.conversations.get(conversationId);
        for (const conversationNodeId of conversationItemParts.conversationNodeIds) {
            const conversationNode = mailStore.conversationNodes.get(conversationNodeId);
            for (const itemId of conversationNode.itemIds) {
                idToClose.push(itemId);
            }
        }
    }

    const tabStore = getTabStore();
    const tabs = tabStore.tabs.filter(
        tab => tab.type == TabType.SecondaryReadingPane && idToClose.indexOf(tab.data.id.Id) >= 0
    );
    tabs.forEach(tab => lazyCloseTab.importAndExecute(tab));
}
