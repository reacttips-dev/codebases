import { observer } from 'mobx-react-lite';
/* tslint:disable:jsx-no-lambda WI:47651 */
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Callout, DirectionalHint } from '@fluentui/react/lib/Callout';
import type { WhatsNewCardIdentity } from '../store/schema/WhatsNewCardIdentity';
import { logWhatsNewCalloutShown } from '../utils/logDatapoint';

interface WhatsNewCalloutProps {
    identity: WhatsNewCardIdentity;
    target: HTMLElement;
    onDismiss: () => void;
    gapSpace?: number;
}

import Styles from './WhatsNewCallout.scss';

const WhatsNewCallout = observer(function WhatsNewCallout(props: WhatsNewCalloutProps) {
    React.useEffect(() => {
        logWhatsNewCalloutShown(props.identity);
    }, []);
    const [visible, setVisible] = React.useState<boolean>(true);
    const onDismiss = () => {
        props.onDismiss();
        setVisible(false);
    };
    return (
        visible && (
            <Callout
                gapSpace={props.gapSpace != undefined ? props.gapSpace : 30}
                className={Styles.callout}
                target={props.target}
                directionalHint={DirectionalHint.leftCenter}
                isBeakVisible={false}
                onDismiss={onDismiss}>
                <div className={Styles.pulse} />
            </Callout>
        )
    );
});

export function showWhatsNewCallout(
    id: WhatsNewCardIdentity,
    target: () => HTMLElement,
    gapSpace?: number
) {
    // Show a callout and anchor it to the quick option
    let attempts = 0;
    let intervalId = window.setInterval(() => {
        const option = target();

        if (option || ++attempts > 3) {
            // Clear the interval
            window.clearInterval(intervalId);
        }

        if (option) {
            // Display the callout
            let calloutContainer = document.createElement('div');
            document.body.appendChild(calloutContainer);
            ReactDOM.render(
                <React.StrictMode>
                    <WhatsNewCallout
                        identity={id}
                        target={option}
                        onDismiss={() => document.body.removeChild(calloutContainer)}
                        gapSpace={gapSpace}
                    />
                </React.StrictMode>,
                calloutContainer
            );
        }
    }, 1000);
}
