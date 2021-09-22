import DropHintView, { DropHintViewProps } from './DropHintView';
import { observer } from 'mobx-react-lite';
import * as React from 'react';

import styles from './DropHintWithBeakView.scss';
import classNames from 'classnames';

/**
 * Renders a DropHint with a beak positioned under the reference element and pointing at it
 */
export interface DropHintWithBeakViewProps extends DropHintViewProps {
    /** ID of the element that the beak should use for horizontal positioning */
    referenceElementId?: string;
    /** Optional override to adjust the standard horizontal positioning algoirthm */
    beakAdjustmentX?: number;
}

export default observer(function DropHintWithBeakView(props: DropHintWithBeakViewProps) {
    const { referenceElementId, beakAdjustmentX, ...dropHintViewProps } = props;

    const isDragOver = dropHintViewProps.dropViewState.isDragOver;

    let beakStyle: React.CSSProperties = undefined;
    if (referenceElementId) {
        const referenceElement = document.getElementById(referenceElementId);
        if (referenceElement) {
            const referenceElementCenterX =
                referenceElement.offsetLeft + referenceElement.offsetWidth / 2 + beakAdjustmentX;
            beakStyle = {
                left: `${referenceElementCenterX}px`,
            };
        }
    }

    return (
        <DropHintView
            {...dropHintViewProps}
            customDropHintAreaContent={
                beakStyle && (
                    <div
                        className={classNames(styles.dropHintBeak, isDragOver && styles.isActive)}
                        style={beakStyle}
                    />
                )
            }
        />
    );
});
