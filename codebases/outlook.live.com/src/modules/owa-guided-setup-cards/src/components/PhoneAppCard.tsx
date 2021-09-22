import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { observer } from 'mobx-react-lite';
import { Dialog, DialogType } from '@fluentui/react/lib/Dialog';
import { DefaultButton } from '@fluentui/react/lib/Button';
import { GetOutlookMobileComponent } from './GetOutlookMobileComponent';
import { phoneCardDoneButtonText } from './PhoneAppCard.locstring.json';
import { OutlookMobileContainer } from '../utils/OutlookMobileContainer';
import loc from 'owa-localize';
import styles from './PhoneAppCard.scss';

export const PhoneAppCard = observer(function PhoneAppCard(props: { onDismiss: () => void }) {
    const onDialogDismiss = React.useCallback(() => {
        props.onDismiss();
    }, []);

    return (
        <Dialog
            isOpen={true}
            type={DialogType.close}
            isBlocking={true}
            onDismiss={onDialogDismiss}
            modalProps={{
                containerClassName: styles.phoneAppDialogContainer,
            }}
            className={styles.phoneAppDialog}
            dialogContentProps={{
                showCloseButton: true,
            }}>
            <GetOutlookMobileComponent containerName={OutlookMobileContainer.GetStarted} />
            <div className={styles.doneButtonContainer}>
                <DefaultButton onClick={onDialogDismiss}>
                    {loc(phoneCardDoneButtonText)}
                </DefaultButton>
            </div>
        </Dialog>
    );
});

export default function mountPhoneAppCard(onDismiss?: () => void) {
    let phoneAppCardDiv = document.createElement('div');
    phoneAppCardDiv.id = 'phoneAppCardDiv';
    document.body.appendChild(phoneAppCardDiv);

    function onPhoneCardDismiss() {
        ReactDOM.unmountComponentAtNode(phoneAppCardDiv);
        document.body.removeChild(phoneAppCardDiv);
        if (onDismiss) {
            onDismiss();
        }
    }

    ReactDOM.render(
        <React.StrictMode>
            <PhoneAppCard onDismiss={onPhoneCardDismiss} />
        </React.StrictMode>,
        phoneAppCardDiv
    );
}
