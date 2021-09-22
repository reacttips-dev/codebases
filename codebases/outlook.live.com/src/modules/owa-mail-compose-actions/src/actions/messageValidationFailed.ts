import { action } from 'satcheljs';

export const messageValidationFailed = action(
    'messageValidationFailed',
    (composeId: string, errorCode: string, forceContinue: boolean, isSend: boolean) => ({
        composeId,
        errorCode,
        forceContinue,
        isSend,
    })
);

export const onBlockingDialogOpen = action(
    'onBlockingDialogOpen',
    (composeId: string, errorCode: string, dialogOpenTime: number) => ({
        composeId,
        errorCode,
        dialogOpenTime,
    })
);
