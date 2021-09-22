import React from "react";
import { colorsPalettes, rgba } from "@similarweb/styles";
import * as styles from "./styles";
import { ProModal } from "components/Modals/src/ProModal";
import { Button } from "@similarweb/ui-components/dist/button";
import { useTranslation } from "components/WithTranslation/src/I18n";
import { ListNotFoundModalContainerProps } from "./ListNotFoundModalContainer";

const CUSTOM_MODAL_STYLES = {
    content: { padding: 0, width: 460 },
    overlay: {
        backgroundColor: rgba(colorsPalettes.midnight["300"], 0.7),
    },
};
const ListNotFoundModal: React.FC<ListNotFoundModalContainerProps> = (props) => {
    const translate = useTranslation();
    const { isOpen, toggleOpen } = props;

    return (
        <ProModal isOpen={isOpen} showCloseIcon={false} customStyles={CUSTOM_MODAL_STYLES}>
            <div>
                <styles.StyledModalContent>
                    <styles.StyledTitle>
                        <span>{translate("si.components.not_found_list_modal.title")}</span>
                    </styles.StyledTitle>
                    <styles.StyledDescription>
                        <span>{translate("si.components.not_found_list_modal.subtitle")}</span>
                    </styles.StyledDescription>
                </styles.StyledModalContent>
                <styles.StyledModalFooter>
                    <Button type="flat" onClick={() => toggleOpen(false)}>
                        {translate("si.components.not_found_list_modal.button")}
                    </Button>
                </styles.StyledModalFooter>
            </div>
        </ProModal>
    );
};

export default ListNotFoundModal;
