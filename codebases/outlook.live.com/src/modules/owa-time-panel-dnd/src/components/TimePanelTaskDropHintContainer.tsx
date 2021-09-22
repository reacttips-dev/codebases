import TaskDropHintView, { TaskDropHintViewProps } from './TaskDropHintView';
import CreateTaskDroppable from './CreateTaskDroppable';
import { getTaskDropState } from '../selectors/timePanelDndStoreSelectors';
import { observer } from 'mobx-react-lite';
import * as React from 'react';

type TimePanelTaskDropHintContainerProps = Pick<
    TaskDropHintViewProps,
    'referenceElementId' | 'beakAdjustmentX'
> & {
    containerClassName?: string;
};

export default observer(function TimePanelTaskDropHintContainer(
    props: TimePanelTaskDropHintContainerProps
) {
    const { containerClassName, ...taskDropHintViewProps } = props;
    const taskDropState = getTaskDropState();

    return (
        <CreateTaskDroppable
            dropViewState={taskDropState}
            dropTarget={'TimePanelDropHint'}
            classNames={containerClassName}>
            <TaskDropHintView dropViewState={taskDropState} {...taskDropHintViewProps} />
        </CreateTaskDroppable>
    );
});
