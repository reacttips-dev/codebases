import { addAsTask } from './DropHintView.locstring.json';
import { observer } from 'mobx-react-lite';
import { DropHintWithBeakView, DropHintWithBeakViewProps } from 'owa-drophint-views';
import loc from 'owa-localize';
import * as React from 'react';

import styles from './TaskDropHintView.scss';

export type TaskDropHintViewProps = Omit<
    DropHintWithBeakViewProps,
    'dropHintLabel' | 'dropHintIconBaseClass' | 'dropHintIconActiveClass'
>;

export default observer(function TaskDropHintView(props: TaskDropHintViewProps) {
    return (
        <DropHintWithBeakView
            dropHintLabel={loc(addAsTask)}
            dropHintIconBaseClass={styles.taskDropHintIconBase}
            dropHintIconActiveClass={styles.taskDropHintIconActive}
            {...props}
        />
    );
});
