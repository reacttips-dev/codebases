import { observer } from 'mobx-react-lite';
import * as React from 'react';
import getGroupNodeViewStateFromId from 'owa-group-left-nav/lib/selector/getGroupNodeViewStateFromId';
import GroupUnreadCount from './GroupUnreadCount';
import GroupDragDropSpinner from './GroupDragDropSpinner';
import { getDensityModeString } from 'owa-fabric-theme';

export interface GroupRightCharmProps {
    groupId: string;
}

export const GroupRightCharm = observer(function GroupRightCharm(props: GroupRightCharmProps) {
    const viewState = getGroupNodeViewStateFromId(props.groupId);
    return viewState.isDroppingMessage ? (
        <GroupDragDropSpinner />
    ) : (
        <GroupUnreadCount groupId={props.groupId} key={props.groupId + getDensityModeString()} /> // Make sure that the groupnode re renders the charm to the right when the density changes.
    );
});

export const GroupRightCharmHover = observer(function GroupRightCharmHover(
    props: GroupRightCharmProps
) {
    const viewState = getGroupNodeViewStateFromId(props.groupId);
    if (viewState.isDroppingMessage) {
        return <GroupDragDropSpinner />;
    }

    return <GroupUnreadCount groupId={props.groupId} />;
});
