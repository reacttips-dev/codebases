import { computed, IComputedValue } from 'mobx';
import { getComposeHostItemIndex, isAnyNonAutoRunUilessAddinRunning } from 'owa-addins-core';
import { LazyInsertLinksBlockDialog } from 'owa-insert-link';
import loc from 'owa-localize';
import { blockOnNavigationCancelLabel } from 'owa-locstrings/lib/strings/blockonnavigationcancellabel.locstring.json';
import { blockOnNavigationContinueLabel } from 'owa-locstrings/lib/strings/blockonnavigationcontinuelabel.locstring.json';
import { blockOnNavigationMessage } from 'owa-locstrings/lib/strings/blockonnavigationmessage.locstring.json';
import { blockOnNavigationTitle } from 'owa-locstrings/lib/strings/blockonnavigationtitle.locstring.json';
import type { ComposeViewState } from 'owa-mail-compose-store';
import { trace } from 'owa-trace';
import * as React from 'react';
import { INSERT_LINK_ERROR_CODE } from './blockDialog/validateErrorCodes';
import { ValidateScenario } from './blockDialog/validateScenario';
import { validateSteps } from './blockDialog/validateSteps';
import type { VerificationStep } from './blockDialog/verificationStep';
import {
    getAllInsertLinksIds,
    getInsertLinksBlockDialogOnSaveStrings,
    validateFromInsertLinks,
} from './validateFromInsertLinks';

export function uiLessAddinIsRunning(viewState: ComposeViewState): boolean {
    return isAnyNonAutoRunUilessAddinRunning(getComposeHostItemIndex(viewState.composeId));
}

export async function validateSave(
    viewState: ComposeViewState,
    targetWindow: Window
): Promise<string> {
    let result: string = null;
    try {
        result = await validateSteps(
            viewState,
            null /* datapoint */,
            computedValidationSteps.get(),
            ValidateScenario.onCloseDraft,
            targetWindow
        );
    } catch (e) {
        trace.warn(e);
        return Promise.reject(e);
    }

    return Promise.resolve(result);
}

const computedValidationSteps: IComputedValue<VerificationStep[]> = computed(
    () =>
        [
            {
                validate: async (viewState: ComposeViewState) => {
                    return !uiLessAddinIsRunning(viewState);
                },
                errorCode: 'uiLessAddinIsRunning',
                getConfirmDialogOptions: (viewState: ComposeViewState) => {
                    return {
                        text: loc(blockOnNavigationTitle),
                        subtext: loc(blockOnNavigationMessage),
                        confirmOptions: {
                            cancelText: loc(blockOnNavigationCancelLabel),
                            okText: loc(blockOnNavigationContinueLabel),
                        },
                        continueOnUserConfirmation: true,
                    };
                },
            },
            {
                validate: (viewState: ComposeViewState) => {
                    return validateFromInsertLinks(viewState, false /*isSend*/);
                },
                errorCode: INSERT_LINK_ERROR_CODE,
                getConfirmDialogOptions: (viewState: ComposeViewState) => {
                    return {
                        text: () => getInsertLinksBlockDialogOnSaveStrings().title, // Passing the callback to the ConfirmDialog component,  so that it can observe the store value.
                        confirmOptions: {
                            cancelText: () =>
                                getInsertLinksBlockDialogOnSaveStrings().cancelButtonText, // Passing the callback to the ConfirmDialog component,  so that it can observe the store value.
                            okText: () => getInsertLinksBlockDialogOnSaveStrings().okButtonText, // Passing the callback to the ConfirmDialog component,  so that it can observe the store value.
                            bodyElement: (
                                <LazyInsertLinksBlockDialog
                                    insertLinksIds={getAllInsertLinksIds()}
                                    isSend={false}
                                />
                            ),
                        },
                        continueOnUserConfirmation: true,
                    };
                },
            },
        ] as VerificationStep[]
);
