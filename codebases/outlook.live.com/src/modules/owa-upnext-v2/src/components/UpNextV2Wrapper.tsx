import { default as UpNextV2EventList } from './UpNextV2EventList';
import { getUpNextEventWithConflicts } from '../selectors/getUpNextEventWithConflicts';
import { observer } from 'mobx-react-lite';
import * as React from 'react';

export interface UpNextV2WrapperProps {
    containerStyle: any;
}

export default observer(function UpNextV2Wrapper(props: UpNextV2WrapperProps) {
    // Show nothing if there is no up-next event
    const upNextEventWithConflicts = getUpNextEventWithConflicts();
    if (!upNextEventWithConflicts || !upNextEventWithConflicts.upNextEvent) {
        return null;
    }

    const conflictingEvents = upNextEventWithConflicts.conflictingEvents;

    return (
        <UpNextV2EventList
            upNextEvent={upNextEventWithConflicts.upNextEvent}
            conflictingEvents={conflictingEvents}
            containerStyle={props.containerStyle}
        />
    );
});
