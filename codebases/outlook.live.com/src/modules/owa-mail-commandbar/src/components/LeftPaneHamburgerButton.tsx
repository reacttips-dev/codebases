import { HamburgerButton, HamburgerHandle } from 'owa-hamburger-button';
import { lazyToggleFolderPaneExpansion, isFolderPaneAutoCollapsed } from 'owa-mail-layout';
import { LightningId } from 'owa-lightning-core-v2/lib/LightningId';
import { lighted } from 'owa-lightning-v2/lib/utils/lighted';
import { FolderPaneAutoCollapseFirstRunCallout } from '../lazyFunctions';
import * as React from 'react';

interface LeftPaneHamburgerButtonProps {
    isPaneExpanded: boolean;
}
import leftPaneStyles from './LeftPaneHamburgerButton.scss';
export default function LeftPaneHamburgerButton(props: LeftPaneHamburgerButtonProps): JSX.Element {
    const freTarget = React.useRef<HamburgerHandle>(null);
    const setTarget = React.useCallback(() => freTarget.current?.getRef(), [freTarget.current]);
    return (
        <>
            <HamburgerButton
                ref={freTarget}
                isPaneExpanded={props.isPaneExpanded}
                toggleHamburgerButton={lazyToggleFolderPaneExpansion.importAndExecute}
                freButtonCustomClass={leftPaneStyles.hamburgerButtonInFreMode}
                lid={LightningId.DynamicLayoutFolderPaneCollapse}
                onFreDismiss={onFREDismiss}
            />
            {isFolderPaneAutoCollapsed() && (
                <FolderPaneAutoCollapseFirstRunCallout
                    lid={LightningId.DynamicLayoutFolderPaneCollapse}
                    target={setTarget}
                    when={startLightning}
                />
            )}
        </>
    );
}
function onFREDismiss() {
    lighted(LightningId.DynamicLayoutFolderPaneCollapse);
}
function startLightning(lightup: Function) {
    setTimeout(lightup, 500);
}
