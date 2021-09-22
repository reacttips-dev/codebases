import ReactListViewType from 'owa-service/lib/contract/ReactListViewType';
import { getUserConfiguration } from 'owa-session-store';

export default function isMessageListSeparate(): boolean {
    const userOptions = getUserConfiguration().UserOptions;
    return userOptions.GlobalListViewTypeReact == ReactListViewType.Message;
}
