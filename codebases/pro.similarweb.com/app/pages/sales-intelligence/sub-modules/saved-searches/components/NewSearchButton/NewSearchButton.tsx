import React from "react";
import { IconButton } from "@similarweb/ui-components/dist/button";
import { useTranslation } from "components/WithTranslation/src/I18n";
import { StyledFadeIn } from "../../../../common-components/styles";

type NewSearchButtonProps = {
    onClick(): void;
};

const NewSearchButton = (props: NewSearchButtonProps) => {
    const translate = useTranslation();

    return (
        <StyledFadeIn>
            <IconButton
                iconName="add"
                type="primary"
                onClick={props.onClick}
                dataAutomation="si-new-dynamic-list-button"
            >
                {translate("si.pages.my_lists.button.new_search")}
            </IconButton>
        </StyledFadeIn>
    );
};

export default NewSearchButton;
