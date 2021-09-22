import { loadMore as loadMore_1 } from 'owa-locstrings/lib/strings/loadmore.locstring.json';
import { loading } from 'owa-locstrings/lib/strings/loading.locstring.json';
import loc from 'owa-localize';
import busStopStateToIconUrlConverter from '../utils/busStopStateToIconUrlConverter';
import { observer } from 'mobx-react-lite';
import type { IButtonStyles } from '@fluentui/react/lib';
import { DefaultButton } from '@fluentui/react/lib/Button';
import { Spinner } from '@fluentui/react/lib/Spinner';
import type { ClientItemId } from 'owa-client-ids';
import { BusStopState } from 'owa-mail-list-store';
import loadMore from 'owa-mail-reading-pane-store/lib/actions/loadMore';
import { isFeatureEnabled } from 'owa-feature-flags';
import { getDensityModeString } from 'owa-fabric-theme';

import * as React from 'react';

export interface MailListItemExpansionLoadMoreButtonProps {
    conversationId: ClientItemId;
    isLoadMoreInProgress: boolean;
    isSingleLineView: boolean;
    showBusStop: boolean;
}

import styles from './MailListItemExpansionLoadMoreButton.scss';
import classnamesBind from 'classnames/bind';
const classNames = classnamesBind.bind(styles);

export default observer(function MailListItemExpansionLoadMoreButton(
    props: MailListItemExpansionLoadMoreButtonProps
) {
    const loadMoreStyles: IButtonStyles = {
        root: styles.loadCommon,
        textContainer: styles.loadMoreText,
        label: styles.loadMoreButtonLabel,
    };

    const onClickCallback = React.useCallback(
        evt => {
            onLoadMore(evt, props.conversationId);
        },
        [props]
    );

    // load more button has a NoStop bus stop state
    const busStopIcon = busStopStateToIconUrlConverter(BusStopState.NoStop, props.isSingleLineView);
    const showBusStop = props.showBusStop;

    return (
        <div className={styles.loadMoreContainer}>
            <img
                className={classNames(
                    isFeatureEnabled('mon-densities') && getDensityModeString(),
                    props.isSingleLineView
                        ? styles.busStopContainerSingleLine
                        : styles.busStopContainerThreeColumn,
                    !showBusStop && styles.busStopPlaceHolder
                )}
                src={showBusStop ? busStopIcon : undefined}
            />

            {props.isLoadMoreInProgress ? (
                <div className={styles.loadCommon}>
                    <div className={styles.loadingFlexContainer}>
                        <Spinner />
                        <span className={styles.loadingText}>{loc(loading)}</span>
                    </div>
                </div>
            ) : (
                <DefaultButton
                    onClick={onClickCallback}
                    styles={loadMoreStyles}
                    text={loc(loadMore_1)}
                />
            )}
        </div>
    );
});

const onLoadMore = (event: React.MouseEvent<unknown>, conversationId: ClientItemId) => {
    event.stopPropagation();
    loadMore(conversationId);
};
