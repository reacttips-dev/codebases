import CreateEventDroppable from './CreateEventDroppable';
import EventDropHintView, { EventDropHintViewProps } from './EventDropHintView';
import { getEventDropState } from '../selectors/timePanelDndStoreSelectors';
import { observer } from 'mobx-react-lite';
import * as React from 'react';

type TimePanelEventDropHintContainerProps = Pick<
    EventDropHintViewProps,
    'referenceElementId' | 'beakAdjustmentX'
> & {
    containerClassName?: string;
};

export default observer(function TimePanelEventDropHintContainer(
    props: TimePanelEventDropHintContainerProps
) {
    const { containerClassName, ...eventDropHintViewProps } = props;
    const eventDropState = getEventDropState();

    return (
        <CreateEventDroppable
            dropViewState={eventDropState}
            dropTarget={'TimePanelDropHint'}
            classNames={containerClassName}>
            <EventDropHintView dropViewState={eventDropState} {...eventDropHintViewProps} />
        </CreateEventDroppable>
    );
});
