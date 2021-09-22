import * as React from 'react';
import * as ReactDOM from 'react-dom';
import MessageOptionsDialog from './components/MessageOptionsDialog';
import type { ComposeViewState } from 'owa-mail-compose-store';
import { logUsage } from 'owa-analytics';
import { WindowProvider } from '@fluentui/react/lib/WindowProvider';

const MESSAGE_OPTIONS_DIALOG_ID = 'MessageOptionsDialog';

export default function showMessageOptionsDialog(
    composeViewState: ComposeViewState,
    targetWindow: Window
) {
    const document = targetWindow.document;

    // Only allow one message options dialog to exist at once
    const existingMessageOptionsDialogDiv = document.getElementById(MESSAGE_OPTIONS_DIALOG_ID);
    if (existingMessageOptionsDialogDiv !== null) {
        logUsage(
            'MessageOptionsMultipleDialogsInvariantViolation',
            null, // customData
            {}
        );
        return;
    }

    const unmountDialog = () => {
        ReactDOM.unmountComponentAtNode(messageOptionsDialogDiv);
        document.body.removeChild(messageOptionsDialogDiv);
    };

    const messageOptionsDialogDiv = document.createElement('div');
    messageOptionsDialogDiv.id = MESSAGE_OPTIONS_DIALOG_ID;
    document.body.appendChild(messageOptionsDialogDiv);
    ReactDOM.render(
        <React.StrictMode>
            <WindowProvider window={targetWindow}>
                <MessageOptionsDialog onClose={unmountDialog} composeViewState={composeViewState} />
            </WindowProvider>
        </React.StrictMode>,
        messageOptionsDialogDiv
    );
}
