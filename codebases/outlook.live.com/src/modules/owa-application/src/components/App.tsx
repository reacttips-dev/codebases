import * as React from 'react';
import classNames from 'classnames';
import { observer } from 'mobx-react-lite';
import { isShySuiteHeaderMode } from 'owa-suite-header-store';
import AppPaneUnderlay from './AppPaneUnderlay';
import { ThemeProvider } from '@fluentui/react/lib/utilities/ThemeProvider';
import type { AppPaneUnderlayViewState } from '../store/store';
import { getDensity } from 'owa-fabric-theme';
import { useFocusRects } from '@fluentui/utilities';

import styles from './App.css';

export interface AppProps {
    renderHeader?: () => React.ReactElement<{}> | undefined;
    children?: React.ReactNode;
    renderSkipLinkPlaceholder?: () => React.ReactElement<{}> | undefined;
    underlay?: AppPaneUnderlayViewState;
}

export default observer(function App({
    renderHeader,
    children,
    renderSkipLinkPlaceholder,
    underlay,
}: AppProps) {
    useFocusRects();
    return (
        <ThemeProvider className={styles.appContainer} theme={getDensity()}>
            {renderSkipLinkPlaceholder?.()}
            {renderHeader?.()}
            <div
                className={classNames(styles.main, {
                    isShyHeaderMode: isShySuiteHeaderMode(),
                })}>
                {children}
                <AppPaneUnderlay underlay={underlay} />
            </div>
        </ThemeProvider>
    );
});
