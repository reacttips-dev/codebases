import { observer } from 'mobx-react-lite';
import { moreTabs } from './OverflowTab.locstring.json';
import loc, { format } from 'owa-localize';
import * as React from 'react';
import Tab from './Tab';
import type { OverflowTabViewState } from 'owa-tab-store/lib/store/schema/TabViewState';
import setIsOverflowMenuShown from 'owa-tab-store/lib/actions/setIsOverflowMenuShown';

import { Callout, DirectionalHint } from '@fluentui/react/lib/Callout';
import { Icon } from '@fluentui/react/lib/Icon';

import { getStore } from 'owa-tab-store/lib/store/tabStore';
import { ControlIcons } from 'owa-control-icons';

import styles from './TabBar.scss';

interface OverflowTabProps {
    className: string;
    subjectClassName: string;
    viewState: OverflowTabViewState;
}

export default observer(function OverflowTab(props: OverflowTabProps) {
    const div = React.useRef<HTMLDivElement>();
    const { viewState, className, subjectClassName } = props;
    const overflowTabs = viewState.data;
    const displayText = format(loc(moreTabs), overflowTabs.length);
    return (
        <div
            className={className}
            title={displayText}
            onClick={onClick}
            ref={ref => (div.current = ref)}>
            <div className={subjectClassName}>{displayText}</div>
            <Icon iconName={ControlIcons.ChevronDown} className={styles.overflowChevron} />
            {getStore().isOverflowMenuShown && (
                <Callout
                    target={div.current}
                    isBeakVisible={false}
                    directionalHint={DirectionalHint.topRightEdge}
                    onDismiss={onDismissMenu}>
                    {overflowTabs.map(tab => (
                        <Tab viewState={tab} key={tab.id} />
                    ))}
                </Callout>
            )}
        </div>
    );
});

function onDismissMenu() {
    setIsOverflowMenuShown(false /*isShown*/);
}

function onClick() {
    setIsOverflowMenuShown(true /*isShown*/);
}
