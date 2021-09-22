import { observer } from 'mobx-react-lite';
import * as React from 'react';
import convertToIContextualMenuItem from '../utils/convertToIContextualMenuItem';
import executeEntryPoint from '../utils/entryPointOperations/executeEntryPoint';
import type { Addin } from 'owa-addins-store';
import { ControlIcons } from 'owa-addins-icons';
import { createAddinCommandSurfaceAction } from '../utils/contextMenuDataUtils';
import { IconButton } from '@fluentui/react/lib/Button';
import { IconType } from '@fluentui/react/lib/Icon';
import { ImageFit, ImageLoadState } from '@fluentui/react/lib/Image';
import {
    canExecute,
    getAccessibilityText,
    getFirstCommand,
    needShowMenu,
} from '../utils/entryPointOperations/AddinChecker';

import styles from './AddinEntryButton.scss';

export interface AddinEntryButtonProps {
    hostItemIndex: string;
    addin: Addin;
}

export default observer(function AddinEntryButton(props_0: AddinEntryButtonProps) {
    const [hasLoadFailed, setHasLoadFailed] = React.useState<boolean>(false);
    const onLoadingStateChanged = (loadState: ImageLoadState) => {
        if (loadState == ImageLoadState.error) {
            setHasLoadFailed(true);
        } else {
            setHasLoadFailed(false);
        }
    };
    const handleAddinButtonLeftClick = (e: any) => {
        e.stopPropagation();
        if (canExecute(props_0.addin)) {
            executeEntryPoint(props_0.hostItemIndex, getFirstCommand(props_0.addin));
        }
    };
    const iconProps = {
        iconType: IconType.Image,
        imageProps: {
            src: props_0.addin.IconUrl,
            width: 16,
            height: 16,
            imageFit: ImageFit.contain,
            onLoadingStateChange: onLoadingStateChanged,
        },
    };
    const fallbackIconProps = {
        iconType: IconType.Default,
        iconName: ControlIcons.Photo2,
    };
    const accessibilityText = getAccessibilityText(props_0.addin);
    const props = {
        className: styles.addinEntryButton,
        iconProps: hasLoadFailed ? fallbackIconProps : iconProps,
        title: accessibilityText,
        ariaLabel: accessibilityText,
    };
    if (canExecute(props_0.addin)) {
        return <IconButton onClick={handleAddinButtonLeftClick} {...props} />;
    }
    if (needShowMenu(props_0.addin)) {
        const surfaceActions = createAddinCommandSurfaceAction(props_0.addin);
        convertToIContextualMenuItem(props_0.hostItemIndex, surfaceActions);
        return (
            <IconButton
                onMenuClick={handleAddinButtonLeftClick}
                menuProps={surfaceActions.subMenuProps}
                menuIconProps={null}
                {...props}
            />
        );
    }
    return null;
});
