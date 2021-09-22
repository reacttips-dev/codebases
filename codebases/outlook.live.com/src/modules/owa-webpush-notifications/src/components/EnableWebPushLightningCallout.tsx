import * as React from 'react';
import { LightableEnableWebPushCallout } from './LightableEnableWebPushCallout';
import { when } from '../utils/when';
import { observer } from 'mobx-react-lite';
import { LightningId } from 'owa-lightning-v2';

export interface EnableWebPushLightningCalloutProps {
    target: () => HTMLElement;
}

export const EnableWebPushLightningCallout = observer(function EnableWebPushLightningCallout(
    props: EnableWebPushLightningCalloutProps
) {
    return (
        <LightableEnableWebPushCallout
            lid={LightningId.WebPushPromotion}
            when={when}
            target={props.target}
        />
    );
});
