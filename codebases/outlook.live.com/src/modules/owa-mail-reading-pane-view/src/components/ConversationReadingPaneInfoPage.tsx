import { observer } from 'mobx-react';
import { Spinner } from '@fluentui/react/lib/Spinner';
import EmptyStateReadingPane from './EmptyStateReadingPane';
import UnsupportedItemReadingPane from './UnsupportedItemReadingPane';
import getConversationReadingPaneViewState from 'owa-mail-reading-pane-store/lib/utils/getConversationReadingPaneViewState';
import * as React from 'react';
import { isFeatureEnabled } from 'owa-feature-flags';
import { LoadingShimmer } from 'owa-mail-reading-pane-loading-view';

import styles from './ReadingPane.scss';
import classNames from 'classnames';

const ConversationReadingPaneInfoPage = () => {
    const selectedConversationReadingPaneState = getConversationReadingPaneViewState();
    if (
        !selectedConversationReadingPaneState ||
        selectedConversationReadingPaneState.loadingState.isLoading
    ) {
        // Loading
        return isFeatureEnabled('rp-loadingStateShimmer') ? (
            <LoadingShimmer />
        ) : (
            <Spinner
                className={classNames(
                    styles.loadingSpinner,
                    isFeatureEnabled('mon-tri-subjectHeader') && styles.connectedSubject
                )}
            />
        );
    } else if (selectedConversationReadingPaneState.loadingState.hasLoadFailed) {
        // Error
        return <EmptyStateReadingPane isError={true} />;
    } else if (selectedConversationReadingPaneState.unsupportedItemId) {
        return (
            <UnsupportedItemReadingPane
                itemId={selectedConversationReadingPaneState.unsupportedItemId}
            />
        );
    }
    return null;
};

export default observer(ConversationReadingPaneInfoPage);
