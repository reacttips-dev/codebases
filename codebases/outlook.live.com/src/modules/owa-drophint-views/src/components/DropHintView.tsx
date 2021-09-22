import { observer } from 'mobx-react-lite';
import type { DropViewState } from 'owa-dnd';
import * as React from 'react';

import styles from './DropHintView.scss';
import classNames from 'classnames';

export interface DropHintViewProps {
    /** CTA label */
    dropHintLabel: string;
    /** Class to apply when the dragged item is not over the drop hint (typically a B+W background image)  */
    dropHintIconBaseClass: string;
    /** Class to apply when the dragged item is dragged over the drop hint (typically a color background image)  */
    dropHintIconActiveClass: string;
    /** Drop view state to listen to */
    dropViewState: DropViewState;
    /** Override to show additional content inside the drophint, above the standard icon and label */
    customDropHintAreaContent?: React.ReactNode;
}

export default observer(function DropHintView(props: DropHintViewProps) {
    const {
        dropHintLabel,
        dropHintIconBaseClass,
        dropHintIconActiveClass,
        dropViewState,
        customDropHintAreaContent,
    } = props;

    const isDragOver = dropViewState.isDragOver;

    return (
        <div className={styles.dropHintArea}>
            <span className={classNames(styles.dropHintAreaInner, isDragOver && styles.isActive)}>
                {customDropHintAreaContent}
                <span
                    className={classNames(
                        styles.dropHintIcon,
                        isDragOver ? dropHintIconActiveClass : dropHintIconBaseClass
                    )}
                />
                <span className={styles.dropHintLabel}>{dropHintLabel}</span>
            </span>
        </div>
    );
});
