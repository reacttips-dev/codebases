import isAppPaneUnderlayExpanded from '../utils/isAppPaneUnderlayExpanded';
import isAppPaneUnderlayShrinkable from '../utils/isAppPaneUnderlayShrinkable';
import type { AppPaneUnderlayViewState } from '../store/store';
import { observer } from 'mobx-react-lite';
import * as React from 'react';

import styles from './AppPaneUnderlay.scss';
import classnamesBind from 'classnames/bind';
const classNames = classnamesBind.bind(styles);

let AppPaneUnderlay = observer(
    ({ underlay }: { underlay: AppPaneUnderlayViewState }) =>
        isAppPaneUnderlayExpanded(underlay) && (
            <div
                className={classNames(styles.underlay, {
                    shrinkable: isAppPaneUnderlayShrinkable(underlay),
                })}
            />
        )
);

export default AppPaneUnderlay;
