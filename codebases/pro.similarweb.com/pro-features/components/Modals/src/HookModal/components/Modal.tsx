import { IProModal, IProModalCustomStyles, ProModal } from "components/Modals/src/ProModal";
import React, { FC } from "react";

const proModalCustomStyles: IProModalCustomStyles = {
    content: {
        padding: 0,
        border: 0,
        width: "100%",
        maxWidth: "min(calc(100% - 11px), 1050px)",
        boxShadow: "0 15px 12px rgba(27, 38, 83, 0.2), 0 19px 38px rgba(27, 38, 83, 0.2)",
    },
    overlay: {
        background: "rgba(42, 62, 82, 0.8)",
    },
};

type IModal = Omit<IProModal, "isOpen" | "customStyles">;

export const Modal: FC<IModal> = (props) => (
    <ProModal {...props} isOpen customStyles={proModalCustomStyles} />
);
