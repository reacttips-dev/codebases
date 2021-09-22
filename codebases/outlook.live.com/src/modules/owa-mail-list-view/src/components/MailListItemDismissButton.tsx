import { dismissInListView } from './MailListItemDismissButton.locstring.json';
import loc from 'owa-localize';
import { lazyDismissNudge } from 'owa-mail-triage-action';
import * as React from 'react';
import { getDensityModeString } from 'owa-fabric-theme';
import { isFeatureEnabled } from 'owa-feature-flags';

import styles from './MailListItemDismissButton.scss';
import classnamesBind from 'classnames/bind';
const classNames = classnamesBind.bind(styles);

export interface MailListItemDismissButtonProps {
    rowKey: string;
    tableViewId: string;
}

export default function MailListItemDismissButton(props: MailListItemDismissButtonProps) {
    const dismissButtonText = loc(dismissInListView);

    const onClick = React.useCallback(
        evt => {
            evt.stopPropagation();
            lazyDismissNudge.import().then(dismissNudge => {
                dismissNudge(props.rowKey, props.tableViewId, 'ListView');
            });
        },
        [props.rowKey, props.tableViewId]
    );

    return (
        <button
            className={classNames(
                styles.dismissButton,
                isFeatureEnabled('mon-densities') && getDensityModeString()
            )}
            title={dismissButtonText}
            onClick={onClick}
            aria-label={dismissButtonText}>
            <span>{dismissButtonText}</span>
        </button>
    );
}
