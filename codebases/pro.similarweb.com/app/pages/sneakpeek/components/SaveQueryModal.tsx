import React, { FC, useEffect, useState } from "react";
import { IProModalCustomStyles, ProModal } from "components/Modals/src/ProModal";
import { Button } from "@similarweb/ui-components/dist/button";
import {
    SaveQueryModalContainer,
    SaveQueryModalHeader,
    SaveQueryModalSubtitle,
    SaveQueryModalTitle,
    SaveQueryModalButtonsContainer,
    SaveQueryModalInput,
} from "pages/sneakpeek/StyledComponents";
import Input from "pages/sneakpeek/components/Input";
import { buttonTypes } from "UtilitiesAndConstants/Constants/ButtonTypes";

interface ISaveQueryModalProps {
    isOpen: boolean;
    queryName: string;
    onTitleChange: (event) => void;
    onCancel: () => void;
    onSave: () => void;
}

export const SaveQueryModal: FC<ISaveQueryModalProps> = (props) => {
    const { isOpen, queryName, onTitleChange, onCancel, onSave } = props;

    const [isSaveButtonEnabled, setIsSaveButtonEnabled] = useState(false);

    useEffect(() => {
        !!queryName ? setIsSaveButtonEnabled(true) : setIsSaveButtonEnabled(false);
    }, [queryName]);

    const modalStyles: IProModalCustomStyles = {
        content: {
            padding: "24px",
            width: 460,
            height: 224,
            border: 0,
            borderRadius: 6,
            overflow: "hidden",
            boxSizing: "border-box",
            boxShadow: "0px 15px 12px rgba(0, 0, 0, 0.22), 0px 19px 38px rgba(0, 0, 0, 0.3)",
        },
        overlay: {
            background: "rgba(67, 89, 147, 0.7)",
        },
    };
    return (
        <ProModal isOpen={isOpen} customStyles={modalStyles} showCloseIcon={false}>
            <SaveQueryModalContainer>
                <SaveQueryModalHeader>
                    <SaveQueryModalTitle>Save query</SaveQueryModalTitle>
                    <SaveQueryModalSubtitle>Select a name for your query</SaveQueryModalSubtitle>
                </SaveQueryModalHeader>
                <SaveQueryModalInput>
                    <Input
                        placeholder="Query title"
                        width="100%"
                        onChange={onTitleChange}
                        value={queryName}
                    />
                </SaveQueryModalInput>
                <SaveQueryModalButtonsContainer>
                    <Button type={buttonTypes.FLAT} onClick={onCancel} textCase={"none"}>
                        Cancel
                    </Button>
                    <Button isDisabled={!isSaveButtonEnabled} onClick={onSave} textCase={"none"}>
                        Save and run
                    </Button>
                </SaveQueryModalButtonsContainer>
            </SaveQueryModalContainer>
        </ProModal>
    );
};
