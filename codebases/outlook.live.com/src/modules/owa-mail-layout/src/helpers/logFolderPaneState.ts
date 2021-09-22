import { logVerboseUsage } from 'owa-analytics';
import type { LayoutChangeSource } from 'owa-layout';

export default function logFolderPaneState(
    layoutChangeSource: LayoutChangeSource,
    folderPaneNewShowState: boolean,
    folderPaneOldShowState: boolean
) {
    logVerboseUsage('TnS_FolderPaneChange', [
        layoutChangeSource.toString(),
        folderPaneNewShowState,
        folderPaneOldShowState,
    ]);
}
