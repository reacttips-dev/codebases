import { mailFaviconProvider, mailOverlayIconProvider } from './mailFaviconProviders';
import { applyFavicon } from 'owa-favicon';

// Initialize orchestrators
import '../orchestrators/onFolderSelectedOrchestrator';
import '../orchestrators/onNewMessageOrchestrator';
import '../orchestrators/onPageVisibilityChanged';

export default function initializeMailFavicon() {
    applyFavicon(mailFaviconProvider(), mailOverlayIconProvider());
}
