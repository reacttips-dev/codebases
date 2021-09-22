import type { PerformanceDatapoint } from 'owa-analytics';
import { confirm, DialogResponse } from 'owa-confirm-dialog';
import addInfoBarMessage from 'owa-info-bar/lib/actions/addInfoBarMessage';
import type { ComposeViewState } from 'owa-mail-compose-store';
import {
    messageValidationFailed,
    onBlockingDialogOpen,
} from '../../actions/messageValidationFailed';
import { markDatapointAsWaiting } from '../../utils/markDatapointAsWaiting';
import { ValidateScenario } from './validateScenario';
import type { VerificationStep } from './verificationStep';

async function validateStep(
    step: VerificationStep,
    viewState: ComposeViewState,
    datapoint: PerformanceDatapoint,
    scenario: ValidateScenario,
    targetWindow: Window
): Promise<boolean> {
    let validationResult = await step.validate(viewState, datapoint);

    if (!validationResult) {
        if (step.messageId) {
            addInfoBarMessage(viewState, step.messageId);
        } else if (step.getConfirmDialogOptions != undefined) {
            markDatapointAsWaiting(datapoint);

            const dialogOpenTime = new Date().getTime();
            onBlockingDialogOpen(viewState.composeId, step.errorCode, dialogOpenTime);

            const dialogOptions = step.getConfirmDialogOptions(viewState);
            const confirmResult: DialogResponse = await confirm(
                dialogOptions.text,
                dialogOptions.subtext,
                false /*resolveImmediately*/,
                { ...dialogOptions.confirmOptions, targetWindow }
            );
            if (!!dialogOptions.onModalResolveCallback) {
                dialogOptions.onModalResolveCallback(confirmResult);
            }
            validationResult =
                dialogOptions.continueOnUserConfirmation && confirmResult === DialogResponse.ok;
        }

        messageValidationFailed(
            viewState.composeId,
            step.errorCode,
            validationResult /* forceContinue */,
            scenario === ValidateScenario.onSend /* isSend */
        );
    }

    return Promise.resolve(validationResult);
}

export async function validateSteps(
    viewState: ComposeViewState,
    datapoint: PerformanceDatapoint,
    validationSteps: VerificationStep[],
    scenario: ValidateScenario,
    targetWindow: Window
): Promise<string> {
    for (let i = 0; i < validationSteps.length; i++) {
        if (
            !(await validateStep(validationSteps[i], viewState, datapoint, scenario, targetWindow))
        ) {
            return Promise.resolve(validationSteps[i].errorCode);
        }
    }

    return Promise.resolve(null);
}
