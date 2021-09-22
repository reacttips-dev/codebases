import { LazyImport, LazyModule } from 'owa-bundling';
import type { ActionSource } from 'owa-analytics-types';
import type { ShouldShowBehavior } from 'owa-filterable-menu';
import type { DirectionalHint } from '@fluentui/react/lib/ContextualMenu';
import type { TableView } from 'owa-mail-list-store';

const lazyModule = new LazyModule(
    () => import(/* webpackChunkName: "MoveToFolder"*/ './lazyIndex')
);

const lazyGetMoveToPropertiesForContextMenu = new LazyImport(
    lazyModule,
    m => m.getMoveToPropertiesForContextMenu
);
const lazyGetMoveToPropertiesForCommandBar = new LazyImport(
    lazyModule,
    m => m.getMoveToPropertiesForCommandBar
);
const lazyGetCopyToProperties = new LazyImport(lazyModule, m => m.getCopyToProperties);

export function getMoveToPropertiesForCommandBar(
    tableView: TableView,
    shouldShowBehaviorMap: { [id: number]: ShouldShowBehavior },
    directionalHint: DirectionalHint
) {
    let moveToControl = null;
    const getMoveToPropertiesForCommandBarFunc = lazyGetMoveToPropertiesForCommandBar.tryImportForRender();
    if (tableView && getMoveToPropertiesForCommandBarFunc) {
        moveToControl = getMoveToPropertiesForCommandBarFunc(
            tableView,
            shouldShowBehaviorMap,
            directionalHint
        );
    }
    return moveToControl;
}

export function getMoveToPropertiesForContextMenu(
    tableViewId: string,
    onDismiss: (ev?: any) => void,
    actionSource: ActionSource,
    shouldShowBehaviorMap: { [id: number]: ShouldShowBehavior },
    directionalHint: DirectionalHint,
    rowKeysToMove?: string[]
) {
    let moveToControl = null;
    const getMoveToPropertiesForContextMenuFunc = lazyGetMoveToPropertiesForContextMenu.tryImportForRender();
    if (getMoveToPropertiesForContextMenuFunc) {
        moveToControl = getMoveToPropertiesForContextMenuFunc(
            tableViewId,
            onDismiss,
            actionSource,
            shouldShowBehaviorMap,
            directionalHint,
            rowKeysToMove
        );
    }

    return moveToControl;
}

export function getCopyToProperties(
    tableViewId: string,
    onDismiss: (ev?: any) => void,
    actionSource: ActionSource
) {
    let copyToControl = null;
    const getCopyToPropertiesFunc = lazyGetCopyToProperties.tryImportForRender();
    if (getCopyToPropertiesFunc) {
        copyToControl = getCopyToPropertiesFunc(tableViewId, onDismiss, actionSource);
    }

    return copyToControl;
}
