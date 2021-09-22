import {
    webpushLightningTryIt,
    webpushLightningMaybeLater,
    webpushLightningHeader,
    webpushLightningBody,
} from './LightableEnableWebPushCallout.locstring.json';
import loc from 'owa-localize';
/* tslint:disable:jsx-no-lambda WI:47650 */
import { completeWebPushLightningCallout } from '../actions/lightningCalloutActions';
import { observer } from 'mobx-react-lite';
import { ButtonType, IButtonProps } from '@fluentui/react/lib/Button';
import { DirectionalHint } from '@fluentui/react/lib/Callout';
import { TeachingBubble } from '@fluentui/react/lib/TeachingBubble';
import { lightable, lighted, LightningProps } from 'owa-lightning-v2';

import * as React from 'react';

export interface LightableEnableWebPushCalloutProps extends LightningProps {
    target: () => HTMLElement;
}

export const LightableEnableWebPushCallout = lightable(
    observer(function LightableEnableWebPushCallout(props: LightableEnableWebPushCalloutProps) {
        const dismiss = (enabled: boolean) => {
            lighted(props.lid, enabled ? 'Primary' : 'Secondary');
            completeWebPushLightningCallout(enabled);
        };

        let enableButtonProps: IButtonProps = {
            buttonType: ButtonType.primary,
            children: loc(webpushLightningTryIt),
            onClick: () => dismiss(true),
        };

        let dismissButtonProps: IButtonProps = {
            buttonType: ButtonType.primary,
            children: loc(webpushLightningMaybeLater),
            onClick: () => dismiss(false),
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
                onDismiss={() => dismiss(false)}
                hasSmallHeadline={true}
                isWide={true}
                headline={loc(webpushLightningHeader)}
                primaryButtonProps={enableButtonProps}
                secondaryButtonProps={dismissButtonProps}>
                {loc(webpushLightningBody)}
            </TeachingBubble>
        );
    })
);
