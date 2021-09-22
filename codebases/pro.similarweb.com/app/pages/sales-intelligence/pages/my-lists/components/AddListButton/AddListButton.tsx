import React from "react";
import { IconButton } from "@similarweb/ui-components/dist/button";
import { useTranslation } from "components/WithTranslation/src/I18n";
import { StyledFadeIn } from "../../../../common-components/styles";

type AddListButtonProps = {
    onClick(): void;
};

const AddListButton: React.FC<AddListButtonProps> = (props) => {
    const translate = useTranslation();

    return (
        <StyledFadeIn>
            <IconButton
                iconName="add"
                type="primary"
                onClick={props.onClick}
                dataAutomation="si-add-static-list-button"
            >
                {translate("si.pages.my_lists.button.add_list")}
            </IconButton>
        </StyledFadeIn>
    );
};

export default React.memo(AddListButton);
