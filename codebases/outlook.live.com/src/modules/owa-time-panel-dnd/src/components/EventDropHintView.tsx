import { addAsEvent } from './DropHintView.locstring.json';
import { observer } from 'mobx-react-lite';
import { DropHintWithBeakView, DropHintWithBeakViewProps } from 'owa-drophint-views';
import loc from 'owa-localize';
import * as React from 'react';

import styles from './EventDropHintView.scss';

export type EventDropHintViewProps = Omit<
    DropHintWithBeakViewProps,
    'dropHintLabel' | 'dropHintIconBaseClass' | 'dropHintIconActiveClass'
>;

export default observer(function EventDropHintView(props: EventDropHintViewProps) {
    return (
        <DropHintWithBeakView
            dropHintLabel={loc(addAsEvent)}
            dropHintIconBaseClass={styles.eventDropHintIconBase}
            dropHintIconActiveClass={styles.eventDropHintIconActive}
            {...props}
        />
    );
});
