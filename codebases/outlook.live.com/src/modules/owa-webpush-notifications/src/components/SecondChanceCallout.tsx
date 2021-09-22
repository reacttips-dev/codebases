import {
    webpushSecondChanceAllow,
    webpushSecondChanceHeader,
    webpushSecondChanceBody,
} from './SecondChanceCallout.locstring.json';
import loc from 'owa-localize';
/* tslint:disable:jsx-no-lambda WI:47650 */
import { observer } from 'mobx-react-lite';
import { ButtonType, IButtonProps } from '@fluentui/react/lib/Button';
import { DirectionalHint } from '@fluentui/react/lib/Callout';
import { TeachingBubble } from '@fluentui/react/lib/TeachingBubble';
import { completeWebPushSecondChanceCallout } from '../actions/secondChanceCalloutActions';
import * as React from 'react';

export interface SecondChanceProps {
    target: () => HTMLElement;
}

export const SecondChanceCallout = observer(function SecondChanceCallout(props: SecondChanceProps) {
    let gotItButtonProps: IButtonProps = {
        buttonType: ButtonType.primary,
        children: loc(webpushSecondChanceAllow),
        onClick: () => completeWebPushSecondChanceCallout(true),
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
            onDismiss={() => completeWebPushSecondChanceCallout(false)}
            hasSmallHeadline={true}
            isWide={true}
            headline={loc(webpushSecondChanceHeader)}
            primaryButtonProps={gotItButtonProps}>
            {loc(webpushSecondChanceBody)}
        </TeachingBubble>
    );
});
