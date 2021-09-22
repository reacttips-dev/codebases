import { Teaser } from "pages/competitive-tracking/arena/Teaser";
import React from "react";
import { IProModalCustomStyles, ProModal } from "components/Modals/src/ProModal";

export const TeaserWrapper = ({ isOpen, setIsOpen }) => {
    const customStyles: IProModalCustomStyles = {
        content: {
            boxSizing: "content-box",
            padding: "0px",
        },
    };
    return (
        <ProModal isOpen={isOpen} showCloseIcon={false} customStyles={customStyles}>
            <Teaser onClickCallback={() => setIsOpen(false)} />
        </ProModal>
    );
};
