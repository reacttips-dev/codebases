import * as React from 'react';
import AddinEntryButton from './AddinEntryButton';
import type { Addin } from 'owa-addins-store';

import styles from './AddinEntryButtonListView.scss';

export interface AddinEntryButtonListViewProps {
    hostItemIndex: string;
    addins: Addin[];
}

function AddinEntryButtonListView(props: AddinEntryButtonListViewProps) {
    const listViewItems: JSX.Element[] = [];
    for (const addin of props.addins) {
        listViewItems.push(
            <AddinEntryButton hostItemIndex={props.hostItemIndex} addin={addin} key={addin.Id} />
        );
    }
    return <div className={styles.listViewContainer}>{listViewItems}</div>;
}
export default AddinEntryButtonListView;
