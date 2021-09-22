import ___resources_CombinedDndFREGif from '../resources/CombinedDndFRE.gif';
import ___resources_DragInMailFREGif from '../resources/DragInMailFRE.gif';
import ___resources_DragTaskToCalendarFREGif from '../resources/DragTaskToCalendarFRE.gif';
import FeatureExample from './FeatureExample';
import { dragInMailText, dragToCalendarText } from './TimePanelFRE.locstring.json';
import { observer } from 'mobx-react-lite';
import { LightningId } from 'owa-lightning-v2';
import loc from 'owa-localize';
import { getTimePanelConfig } from 'owa-time-panel-config';
import { isTimePanelDndViewEnabled } from 'owa-time-panel-dnd';
import { getCurrentPanelView } from 'owa-time-panel-settings';
import { getOwaWorkload, OwaWorkload } from 'owa-workloads';
import * as React from 'react';

export default observer(function TimePanelFRE() {
    if (getTimePanelConfig().areFREsDisabled) {
        return null;
    }

    switch (getOwaWorkload()) {
        case OwaWorkload.Mail:
            if (isTimePanelDndViewEnabled()) {
                return <TimePanelCombinedDndFRE />;
            }

            if (!isTimePanelDndViewEnabled() && getCurrentPanelView() === 'Tasks') {
                return <TimePanelDragInMailFRE />;
            }

            break;
        case OwaWorkload.Calendar:
            if (getCurrentPanelView() === 'Tasks') {
                return <TimePanelDragTaskToCalendarFRE />;
            }

            break;
    }

    return null;
});

const TimePanelCombinedDndFRE = observer(() => (
    <FeatureExample
        lid={LightningId.TimePanelCombinedDndFRE}
        when={always}
        gif={___resources_CombinedDndFREGif}
        gifText={loc(dragInMailText)}
        showTextAsOverlay={false}
    />
));

const TimePanelDragInMailFRE = observer(() => (
    <FeatureExample
        lid={LightningId.TodoMailFRE}
        when={always}
        gif={___resources_DragInMailFREGif}
        gifText={loc(dragInMailText)}
        showTextAsOverlay={true}
    />
));

const TimePanelDragTaskToCalendarFRE = observer(() => (
    <FeatureExample
        lid={LightningId.TodoCalendarFRE}
        when={always}
        gif={___resources_DragTaskToCalendarFREGif}
        gifText={loc(dragToCalendarText)}
        showTextAsOverlay={true}
    />
));

function always(lightup: () => void) {
    lightup();
}
