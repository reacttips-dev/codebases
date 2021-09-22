import {
    webpushSetupSuccessCalloutGotIt,
    webpushSetupSuccessCalloutHeader,
    webpushSetupSuccessCalloutBody,
} from './SuccessCallout.locstring.json';
import loc from 'owa-localize';
import * as React from 'react';
import { observer } from 'mobx-react-lite';
import { TeachingBubble } from '@fluentui/react/lib/TeachingBubble';
import { IButtonProps, ButtonType } from '@fluentui/react/lib/Button';
import { DirectionalHint } from '@fluentui/react/lib/Callout';
import { dismissWebPushSuccessCallout } from '../actions/successCalloutActions';

export interface SuccessCalloutProps {
    target: () => HTMLElement;
}

export const SuccessCallout = observer(function SuccessCallout(props: SuccessCalloutProps) {
    let gotItButtonProps: IButtonProps = {
        buttonType: ButtonType.primary,
        children: loc(webpushSetupSuccessCalloutGotIt),
        onClick: dismissWebPushSuccessCallout,
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
            onDismiss={dismissWebPushSuccessCallout}
            hasSmallHeadline={true}
            isWide={true}
            headline={loc(webpushSetupSuccessCalloutHeader)}
            primaryButtonProps={gotItButtonProps}>
            {loc(webpushSetupSuccessCalloutBody)}
        </TeachingBubble>
    );
});
