import {
    DeleteGroupConfirmationModal,
    IDeleteGroupConfirmationModalProps,
} from "components/Modals/src/DeleteGroupConfirmationModal";
import React from "react";

export const DeleteTrackersConfirmModal = ({ isOpen, closeModal, deleteTracker }) => {
    const confirmationModal: IDeleteGroupConfirmationModalProps = {
        onCancelClick: closeModal,
        onApproveClick: () => {
            closeModal();
            deleteTracker();
        },
        onCloseClick: closeModal,
        isOpen,
        confirmationTitle: "competitive.tracker.delete.modal.title",
        confirmationSubtitle: "competitive.tracker.delete.modal.title.subtitle",
        groupname: undefined,
    };
    return <DeleteGroupConfirmationModal {...confirmationModal} />;
};
