import { observer } from 'mobx-react-lite';
import { loadingBody, loadMoreBody } from './LoadFullBodyButton.locstring.json';
import loc from 'owa-localize';
import { Icon } from '@fluentui/react/lib/Icon';
import { Spinner, SpinnerSize } from '@fluentui/react/lib/Spinner';
import { loadFullBody } from 'owa-mail-reading-pane-store/lib/actions/loadFullBody';
import type ItemViewState from 'owa-mail-reading-pane-store/lib/store/schema/ItemViewState';

import * as React from 'react';

import styles from './LoadFullBodyButton.scss';

export interface LoadFullBodyButtonProps {
    viewState: ItemViewState;
}

export default observer(function LoadFullBodyButton(props: LoadFullBodyButtonProps) {
    const onLoadMoreClick = () => {
        loadFullBody(props.viewState);
    };
    return (
        <div className={styles.loadMoreContainer}>
            {props.viewState.isLoadingFullBody ? (
                <div className={styles.loading}>
                    <div className={styles.spinnerContainer}>
                        <Spinner size={SpinnerSize.small} />
                    </div>
                    {loc(loadingBody)}
                </div>
            ) : (
                <div className={styles.loadMore} onClick={onLoadMoreClick}>
                    <Icon iconName={'ChevronDown'} className={styles.chevron} />
                    {loc(loadMoreBody)}
                </div>
            )}
        </div>
    );
});
