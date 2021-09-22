import * as React from 'react';
import classNames from 'classnames';
import { observer } from 'mobx-react-lite';

import {
    folderPaneAutoCollapseCalloutDescription,
    folderPaneAutoCollapseCalloutTitle,
    gotItText,
} from './FolderPaneFirstRun.locstring.json';
import { ActionButton, IconButton } from '@fluentui/react/lib/Button';
import { Callout, DirectionalHint } from '@fluentui/react/lib/Callout';
import { lightable, lighted, LightningId } from 'owa-lightning-v2';
import loc from 'owa-localize';
import { ControlIcons } from 'owa-control-icons';
import { isShySuiteHeaderMode } from 'owa-suite-header-store';

import Folder from '../svg/Folder.svg';
import styles from './FolderPaneAutoCollapseFirstRun.scss';

export interface FolderPaneAutoCollapseFirstRunCalloutProps {
    target: () => HTMLDivElement | undefined;
    lid: LightningId;
}

export default lightable(
    observer(function FolderPaneAutoCollapseFirstRunCallout(
        props: FolderPaneAutoCollapseFirstRunCalloutProps
    ) {
        const onClose = () => {
            lighted(props.lid);
        };

        return (
            <Callout
                beakWidth={15}
                directionalHint={DirectionalHint.bottomCenter}
                preventDismissOnLostFocus={true}
                preventDismissOnScroll={true}
                preventDismissOnResize={true}
                directionalHintFixed={true}
                target={props.target()}
                calloutMaxHeight={420}>
                <div
                    className={classNames(styles.freContainer, {
                        isShyHeaderMode: isShySuiteHeaderMode(),
                    })}>
                    <div className={styles.freImageContent}>
                        <img src={Folder} />
                    </div>
                    <div>
                        <div className={styles.freTitle}>
                            {loc(folderPaneAutoCollapseCalloutTitle)}
                        </div>
                        <div className={styles.freDescription}>
                            {loc(folderPaneAutoCollapseCalloutDescription)}
                        </div>
                        <ActionButton
                            styles={{
                                textContainer: styles.gotItButtonText,
                            }}
                            onClick={onClose}>
                            {loc(gotItText)}
                        </ActionButton>
                    </div>
                    <IconButton
                        className={styles.closeButton}
                        iconProps={{ iconName: ControlIcons.Cancel }}
                        onClick={onClose}
                    />
                </div>
            </Callout>
        );
    })
);
