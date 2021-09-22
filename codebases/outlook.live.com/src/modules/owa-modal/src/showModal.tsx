/* tslint:disable:jsx-no-lambda WI:47636 */
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { ErrorBoundary, ErrorComponentType } from 'owa-error-boundary';
import { WindowProvider } from '@fluentui/react/lib/WindowProvider';

export interface OwaModalProps<T> {
    onDismiss: (t: T) => void;
}

let modalId = 0;

/**
 * Show a modal dialog and get a value when it closes.
 *
 * If the dialog is closed from outside (via the returned dismiss function), the Promise rejects.
 *
 * @param Modal The constructor for the modal dialog to show
 *
 * @returns A tuple of [Promise that resolves on dialog close with dialog return value, dismiss function]
 */
export function showModal<T>(
    Modal: React.ComponentType<OwaModalProps<T>>,
    targetWindow?: Window
): [Promise<T>, () => void] {
    const document = (targetWindow || window).document;
    let modalHost = document.createElement('div');
    modalHost.id = `owa-modal-${modalId++}`;
    document.body.appendChild(modalHost);

    let dismissModalCalled = false;
    const dismissModal = () => {
        if (dismissModalCalled) {
            return;
        }
        dismissModalCalled = true;
        ReactDOM.unmountComponentAtNode(modalHost);
        document.body.removeChild(modalHost);
    };

    let modalReject;

    const modalPromise = new Promise<T>((resolve, reject) => {
        modalReject = reject;

        ReactDOM.render(
            <WindowProvider window={targetWindow || window}>
                <ErrorBoundary
                    type={ErrorComponentType.None}
                    onError={() => {
                        dismissModal();
                        reject();
                    }}>
                    <Modal
                        onDismiss={t => {
                            dismissModal();
                            resolve(t);
                        }}
                    />
                </ErrorBoundary>
            </WindowProvider>,
            modalHost
        );
    });

    return [
        modalPromise,
        () => {
            dismissModal();
            modalReject();
        },
    ];
}
