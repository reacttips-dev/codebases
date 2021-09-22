import {
    webpushDeviceDiscoveryYes,
    webpushDeviceDiscoveryNoThanks,
    webpushDeviceDiscoveryHeader,
    webpushDeviceDiscoveryBody,
} from './EnableWebPushCallout.locstring.json';
import loc from 'owa-localize';
/* tslint:disable:jsx-no-lambda WI:47650 */
import { CalloutResult, completeEnableWebPushCallout } from '../actions/calloutActions';
import { observer } from 'mobx-react-lite';
import { ButtonType, IButtonProps } from '@fluentui/react/lib/Button';
import { DirectionalHint } from '@fluentui/react/lib/Callout';
import { TeachingBubble } from '@fluentui/react/lib/TeachingBubble';

import * as React from 'react';

export interface EnableWebPushCalloutProps {
    target: () => HTMLElement;
}

export const EnableWebPushCallout = observer(function EnableWebPushCallout(
    props: EnableWebPushCalloutProps
) {
    let enableButtonProps: IButtonProps = {
        buttonType: ButtonType.primary,
        children: loc(webpushDeviceDiscoveryYes),
        onClick: () => completeEnableWebPushCallout(CalloutResult.Enabled),
    };

    let disableButtonProps: IButtonProps = {
        buttonType: ButtonType.normal,
        children: loc(webpushDeviceDiscoveryNoThanks),
        onClick: () => completeEnableWebPushCallout(CalloutResult.Disabled),
    };

    return (
        <TeachingBubble
            calloutProps={{
                beakWidth: 15,
                directionalHint: DirectionalHint.bottomAutoEdge,
                preventDismissOnLostFocus: true,
                preventDismissOnScroll: true,
            }}
            targetElement={props.target()}
            hasCloseIcon={true}
            onDismiss={() => completeEnableWebPushCallout(CalloutResult.Dismissed)}
            hasSmallHeadline={true}
            isWide={true}
            headline={loc(webpushDeviceDiscoveryHeader)}
            primaryButtonProps={enableButtonProps}
            secondaryButtonProps={disableButtonProps}>
            {loc(webpushDeviceDiscoveryBody)}
        </TeachingBubble>
    );
});
