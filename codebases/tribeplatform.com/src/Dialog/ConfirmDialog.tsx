// NOTE: not sure using AlertDialog instead of Modal component, the only difference was AlertDialog is centered
import React, { useRef, useCallback } from 'react';
import { AlertDialog, AlertDialogBody, AlertDialogCloseButton, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogOverlay, Divider, } from '@chakra-ui/react';
import { confirmable } from 'react-confirm';
import { Button } from '../Button';
import { withTheme } from '../utils/hoc/withTheme';
export const ConfirmDialog = ({ show, proceed, title, body, proceedLabel = 'Confirm', cancelLabel = 'Cancel', cancelButtonProps, proceedButtonProps, headerProps, hideCloseIcon, hideHeaderDivider, validation, danger, closeOnEsc = true, closeOnOverlayClick = true, }) => {
    const cancelRef = useRef();
    const onConfirm = useCallback(() => {
        if (typeof validation === 'function') {
            return validation() && proceed(true);
        }
        proceed(true);
    }, [proceed, validation]);
    return (React.createElement(AlertDialog, { closeOnEsc: closeOnEsc, closeOnOverlayClick: closeOnOverlayClick, "data-testid": "confirm-dialog", isCentered: true, isOpen: show, leastDestructiveRef: cancelRef, motionPreset: "slideInBottom", onClose: () => proceed(false) },
        React.createElement(AlertDialogOverlay, null,
            React.createElement(AlertDialogContent, { bg: "bg.base" },
                React.createElement(AlertDialogHeader, Object.assign({ id: "dialog-header" }, headerProps), title),
                !hideHeaderDivider && React.createElement(Divider, null),
                !hideCloseIcon && React.createElement(AlertDialogCloseButton, null),
                React.createElement(AlertDialogBody, null, body),
                React.createElement(AlertDialogFooter, null,
                    cancelLabel && (React.createElement(Button, Object.assign({ variant: "ghost", onClick: () => proceed(false), mr: 2, ref: cancelRef, autoFocus: true, "data-testid": "confirm-cancel-btn" }, cancelButtonProps), cancelLabel)),
                    proceedLabel && (React.createElement(Button, Object.assign({ buttonType: danger ? 'danger' : 'primary', mr: 3, onClick: onConfirm, "data-testid": "confirm-approve-btn" }, proceedButtonProps), proceedLabel)))))));
};
// confirmable HOC pass props `show`, `dismiss`, `cancel` and `proceed` to your component.
export default confirmable(withTheme(ConfirmDialog));
//# sourceMappingURL=ConfirmDialog.js.map