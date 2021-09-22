import { observer } from 'mobx-react-lite';
import { overflowMenuAccessibilityLabel } from '../strings.locstring.json';
import loc from 'owa-localize';
import * as React from 'react';
import executeContextual from '../utils/entryPointOperations/executeContextual';
import MinorFrame from './Compliance/MinorFrame';

import { ActionButton, IconButton } from '@fluentui/react/lib/Button';
import { AddinCommandsManifestCacheProvider } from 'owa-addins-osf-facade';
import { AddinIcons } from 'owa-addins-icons';
import { Callout } from '@fluentui/react/lib/Callout';
import { Icon } from '@fluentui/react/lib/Icon';
import type { IContextualMenuItem } from '@fluentui/react/lib/ContextualMenu';
import { IOverflowSet, OverflowSet } from '@fluentui/react/lib/OverflowSet';
import { isMinorForbidden } from '../utils/entryPointOperations/AddinChecker';
import { OsfHostContainer } from '../components/OsfHostContainer';
import 'owa-addins-osfruntime';
import {
    ContextualAddinCommand,
    getExtensibilityState,
    terminateContextualCallout,
} from 'owa-addins-store';

import style from './ContextualCallout.scss';

const CONTEXTUAL_CALLOUT_WIDTH = '570px';
const CONTEXTUAL_CALLOUT_HEIGHT_DEFAULT = '350px';

export default observer(function ContextualCallout(props: {}) {
    const commandBar = React.useRef<IOverflowSet>();
    const focusOnAddinBar = (): void => {
        commandBar.current.focus();
    };
    const refCallback = (commandBarSet: IOverflowSet) => {
        commandBar.current = commandBarSet;
    };
    const state = getExtensibilityState();
    if (!state.runningContextualAddinCommand) {
        return <div />;
    }
    const anchor = state.contextualCalloutState.contextualAnchor;
    const { hostItemIndex, addinCommand } = state.runningContextualAddinCommand;
    const contextualAddin: ContextualAddinCommand = addinCommand as ContextualAddinCommand;
    const addinBarItems = convertAddinsToCommandBarItems(
        state.contextualCalloutState.activeContextualAddinCommands,
        contextualAddin
    );
    const iframeStyle = {
        height: !contextualAddin.detectedEntity.RequestedHeight
            ? CONTEXTUAL_CALLOUT_HEIGHT_DEFAULT
            : contextualAddin.detectedEntity.RequestedHeight + 'px',
    };
    const hostActions = {};
    hostActions[OSF.AgaveHostAction.TabExit] = focusOnAddinBar;
    hostActions[OSF.AgaveHostAction.TabExitShift] = focusOnAddinBar;
    hostActions[OSF.AgaveHostAction.EscExit] = dismissCallout;
    const addinPart = isMinorForbidden(contextualAddin) ? (
        <MinorFrame onClickUninstall={dismissCallout} />
    ) : (
        <OsfHostContainer
            addinCommand={state.runningContextualAddinCommand.addinCommand}
            controlId={state.runningContextualAddinCommand.controlId}
            hostItemIndex={hostItemIndex}
            manifestCacheProvider={AddinCommandsManifestCacheProvider}
            style={iframeStyle}
            notifyHostActions={hostActions}
        />
    );
    return (
        <Callout
            gapSpace={0}
            target={anchor}
            onDismiss={dismissCallout}
            setInitialFocus={true}
            calloutWidth={parseInt(CONTEXTUAL_CALLOUT_WIDTH)}
            beakWidth={19}
            className={style.divContainer}>
            <Icon className={style.appIcon} iconName={AddinIcons.OfficeAddinsLogo} />
            <div className={style.divider} />
            <OverflowSet
                componentRef={refCallback}
                items={addinBarItems}
                className={style.contextualBar}
                onRenderItem={onRenderContextualAddin}
                onRenderOverflowButton={onRenderOverflowButton}
            />
            <div className={style.contextualAddinFrame}>{addinPart}</div>
        </Callout>
    );
});

export function dismissCallout(): void {
    const {
        runningContextualAddinCommand,
        activeDialogs,
        contextualCalloutState,
    } = getExtensibilityState();
    const { hostItemIndex } = runningContextualAddinCommand;

    if (!!activeDialogs.get(hostItemIndex)) {
        return;
    }

    contextualCalloutState.contextualAnchor.focus();
    terminateContextualCallout();
}

function getContextualExecutor(contextual: ContextualAddinCommand): () => void {
    return () => {
        const {
            hostItemIndex,
            addinCommand,
        } = getExtensibilityState().runningContextualAddinCommand;
        if (contextual.get_Id() !== addinCommand.get_Id()) {
            executeContextual(hostItemIndex, contextual);
        }
    };
}

function onRenderContextualAddin(addin: IContextualMenuItem): JSX.Element {
    return (
        <ActionButton
            className={addin.className}
            onClick={addin.onClick as () => void}
            text={addin.text}
            ariaLabel={addin.text}
        />
    );
}

function onRenderOverflowButton(overflowItems: IContextualMenuItem[]): JSX.Element {
    return (
        <IconButton
            menuIconProps={{ iconName: 'More' }}
            menuProps={{ items: overflowItems! }}
            ariaLabel={loc(overflowMenuAccessibilityLabel)}
        />
    );
}

export function convertAddinsToCommandBarItems(
    activeAddins: ContextualAddinCommand[],
    selectedAddin: ContextualAddinCommand
): IContextualMenuItem[] {
    return activeAddins.map(addin => {
        const isSelected: boolean = addin.get_Id() === selectedAddin.get_Id();
        return {
            key: addin.get_Id(),
            className: isSelected && style.selected,
            text: addin.detectedEntity.Label,
            onClick: getContextualExecutor(addin),
        };
    });
}
