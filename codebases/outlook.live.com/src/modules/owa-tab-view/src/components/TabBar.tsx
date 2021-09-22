import { observer } from 'mobx-react-lite';
import Tab from './Tab';
import getVisibleTabs from '../utils/getVisibleTabs';
import ensurePrimaryReadingPaneTabHandler from 'owa-mail-reading-pane-store/lib/utils/primaryReadingPaneTabHandler';
import { lazySubscribeToResizeEvent, lazyUnsubscribeFromResizeEvent } from 'owa-resize-event';
import setTabBarWidth from 'owa-tab-store/lib/actions/setTabBarWidth';
import { getStore } from 'owa-tab-store/lib/store/tabStore';
import * as React from 'react';

import styles from './TabBar.scss';
import classnamesBind from 'classnames/bind';
const classNames = classnamesBind.bind(styles);

export default observer(function TabBar(props: {}) {
    React.useEffect(() => {
        lazySubscribeToResizeEvent.importAndExecute(onResize);
        onResize();
        return () => {
            lazyUnsubscribeFromResizeEvent.importAndExecute(onResize);
        };
    }, []);
    const div = React.useRef<HTMLDivElement>();
    const onResize = () => {
        if (div.current) {
            const width = div.current.clientWidth;
            if (width > 0) {
                if (width != getStore().tabBarWidth) {
                    setTabBarWidth(width);
                }
            }
        }
    };
    const refCallback = React.useCallback((ref: HTMLDivElement) => {
        if (div.current != ref) {
            div.current = ref;
            onResize();
        }
    }, []);

    ensurePrimaryReadingPaneTabHandler();
    const { totalVisibleCount, visibleTabs, shouldShrinkActiveChatTabs } = getVisibleTabs();
    return totalVisibleCount > 1 ? (
        <div
            className={classNames(styles.tabBar, {
                shrinkChatTabs: shouldShrinkActiveChatTabs,
            })}
            ref={refCallback}>
            {visibleTabs.map(tab => (
                <Tab key={tab.id} viewState={tab} />
            ))}
        </div>
    ) : null;
});
