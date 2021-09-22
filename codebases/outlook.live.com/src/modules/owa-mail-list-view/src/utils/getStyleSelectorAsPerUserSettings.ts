import { getIsBitSet, ListViewBitFlagsMasks } from 'owa-bit-flags/lib/utils/listViewBitFlagsUtil';
import ReactListViewType from 'owa-service/lib/contract/ReactListViewType';
import getMailListTableProps from './getMailListTableProps';

export default function getStyleSelectorAsPerUserSettings(tableViewId: string): string {
    const isSingleLineView = getMailListTableProps(tableViewId).isSingleLine;
    const isSenderImageOff = getIsBitSet(ListViewBitFlagsMasks.HideSenderImage);
    const isItemView =
        getMailListTableProps(tableViewId).listViewType === ReactListViewType.Message;

    let styleForSettingsString = '';

    if (isSingleLineView) {
        styleForSettingsString += 'SLV';
    } else {
        styleForSettingsString += 'threeCol';
    }

    if (isItemView) {
        styleForSettingsString += 'ItemView';
    } else {
        styleForSettingsString += 'ConversationView';
    }

    if (isSenderImageOff) {
        styleForSettingsString += 'SenderImageOff';
    } else {
        styleForSettingsString += 'SenderImageOn';
    }

    return styleForSettingsString;
}
