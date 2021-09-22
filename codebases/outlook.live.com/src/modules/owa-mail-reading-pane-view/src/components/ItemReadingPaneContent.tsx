import EmptyStateReadingPane from '../components/EmptyStateReadingPane';
import { observer } from 'mobx-react-lite';
import { Spinner } from '@fluentui/react/lib/Spinner';
import type LoadingState from 'owa-mail-reading-pane-store/lib/store/schema/LoadingState';
import * as React from 'react';
import { isFeatureEnabled } from 'owa-feature-flags';
import { LoadingShimmer } from 'owa-mail-reading-pane-loading-view';

import styles from './ReadingPane.scss';
import classNames from 'classnames';

export interface ItemReadingPaneContentProps {
    loadingState: LoadingState;
    contentCreator: () => JSX.Element;
}

const ItemReadingPaneContent = observer(function ItemReadingPaneContent(
    props: ItemReadingPaneContentProps
) {
    let itemReadingPaneContent: JSX.Element;
    if (!props.loadingState || props.loadingState.isLoading) {
        itemReadingPaneContent = isFeatureEnabled('rp-loadingStateShimmer') ? (
            <LoadingShimmer />
        ) : (
            <Spinner
                className={classNames(
                    styles.loadingSpinner,
                    isFeatureEnabled('mon-tri-subjectHeader') && styles.connectedSubject
                )}
            />
        );
    } else if (props.loadingState.hasLoadFailed) {
        itemReadingPaneContent = <EmptyStateReadingPane isError={true} />;
    } else {
        itemReadingPaneContent = props.contentCreator();
    }

    return itemReadingPaneContent;
});
export default ItemReadingPaneContent;
