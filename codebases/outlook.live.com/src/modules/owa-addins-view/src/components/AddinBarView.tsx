import { observer } from 'mobx-react-lite';
import * as React from 'react';
import AddinEntryButtonListView from './AddinEntryButtonListView';
import OverflowMenuView from './OverflowMenuView';
import { getAdapter } from 'owa-addins-adapters';
import {
    Addin,
    ExtensibilityHostItem,
    extensibilityState,
    IEnabledAddinCommands,
} from 'owa-addins-store';
import { ExtensibilityModeEnum } from 'owa-addins-types';

import divStyle from './AddinBarView.scss';

const DefaultMaxVisibleAddinsCount = 5;

const MaxVisibleAddinsCountOnRead = 3;

const MaxVisibleAddinsCountOnCompose = 5;

export interface AddinBarViewProps {
    Index: string;
}

export default observer(function AddinBarView(props: AddinBarViewProps) {
    const hostItem: ExtensibilityHostItem = extensibilityState.HostItems.get(props.Index);
    const enabledAddinCommands: IEnabledAddinCommands = extensibilityState.EnabledAddinCommands;
    if (!hostItem || !enabledAddinCommands) {
        return <div />;
    }
    const adapter = getAdapter(props.Index);
    let maxVisibleAddinsCount = getMaxVisibleAddinsCount(adapter.mode);
    const existingAddinCommands = enabledAddinCommands.getExtensionPoint(adapter.mode);
    maxVisibleAddinsCount = Math.min(maxVisibleAddinsCount, existingAddinCommands.length);
    let overflowMenu: JSX.Element = null;
    if (maxVisibleAddinsCount < existingAddinCommands.length) {
        overflowMenu = (
            <OverflowMenuView
                hostItemIndex={props.Index}
                addins={
                    existingAddinCommands.slice(
                        maxVisibleAddinsCount,
                        existingAddinCommands.length
                    ) as Addin[]
                }
            />
        );
    }
    return (
        <div className={divStyle.divContainer}>
            <AddinEntryButtonListView
                hostItemIndex={props.Index}
                addins={existingAddinCommands.slice(0, maxVisibleAddinsCount) as Addin[]}
            />
            {overflowMenu}
        </div>
    );
});

function getMaxVisibleAddinsCount(mode: ExtensibilityModeEnum): number {
    switch (mode) {
        case ExtensibilityModeEnum.MessageRead:
            return MaxVisibleAddinsCountOnRead;
        case ExtensibilityModeEnum.MessageCompose:
            return MaxVisibleAddinsCountOnCompose;
        default:
            return DefaultMaxVisibleAddinsCount;
    }
}
