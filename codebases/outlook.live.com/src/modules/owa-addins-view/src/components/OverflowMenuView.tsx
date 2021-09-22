import { observer } from 'mobx-react-lite';
import { overflowMenuTooltip } from './OverflowMenuView.locstring.json';
import { overflowMenuAccessibilityLabel } from '../strings.locstring.json';
import loc from 'owa-localize';
import * as React from 'react';
import classNames from 'classnames';
import convertToIContextualMenuItem from '../utils/convertToIContextualMenuItem';

import type { Addin } from 'owa-addins-store';
import { ControlIcons } from 'owa-addins-icons';
import { createAddinCommandSurfaceActions } from '../utils/contextMenuDataUtils';
import { IconButton } from '@fluentui/react/lib/Button';
import { IconType } from '@fluentui/react/lib/Icon';
import ProjectionContext from 'owa-popout-v2/lib/context/ProjectionContext';

import styles from './OverflowMenuView.scss';

export interface OverflowMenuViewProps {
    hostItemIndex: string;
    addins: Addin[];
}

export default observer(function OverflowMenuView(props_0: OverflowMenuViewProps) {
    const targetWindow = React.useContext(ProjectionContext);
    const iconProps = {
        iconType: IconType.Default,
        iconName: ControlIcons.ChevronDownMed,
        className: classNames([styles.overflowChevron]),
    };
    const props = {
        className: classNames([styles.overflowChevronContainer]),
        iconProps: iconProps,
        title: loc(overflowMenuTooltip),
        ariaLabel: loc(overflowMenuAccessibilityLabel),
    };
    const menuData = createAddinCommandSurfaceActions(props_0.addins, targetWindow);
    convertToIContextualMenuItem(props_0.hostItemIndex, menuData);
    return (
        <div className={classNames([styles.overflowContainer])}>
            <div className={classNames([styles.overflowDivider])} />
            <IconButton
                onMenuClick={handleChevronLeftClick}
                menuProps={{ items: [menuData] }}
                menuIconProps={null}
                {...props}
            />
        </div>
    );
});

function handleChevronLeftClick(e: any) {
    e.stopPropagation();
}
