import { groupsLeftNav_MovingMessage } from './GroupDragDropSpinner.locstring.json';
import loc from 'owa-localize';
import { observer } from 'mobx-react-lite';
import * as React from 'react';
import { TooltipHost } from '@fluentui/react/lib/Tooltip';
import { Spinner, SpinnerSize } from '@fluentui/react/lib/Spinner';

const GroupDragDropSpinner = observer(function GroupDragDropSpinner(props: {}) {
    return (
        <TooltipHost content={loc(groupsLeftNav_MovingMessage)} calloutProps={{ gapSpace: 0 }}>
            <Spinner size={SpinnerSize.small} title="" />
        </TooltipHost>
    );
});
export default GroupDragDropSpinner;
