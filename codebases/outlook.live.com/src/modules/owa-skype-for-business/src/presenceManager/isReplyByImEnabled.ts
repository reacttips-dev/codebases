import isSignedIn from './isSignedIn';
import { getStore } from '../store/chatStore';
import ChatProvider from '../store/schema/ChatProvider';

export default function isReplyByImEnabled(): boolean {
    const chatProvider = getStore().chatProvider;
    return isSignedIn() && (chatProvider == ChatProvider.UCMA || chatProvider == ChatProvider.UCWA);
}
