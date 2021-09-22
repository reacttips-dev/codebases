import React from "react";
import { IconButton } from "@similarweb/ui-components/dist/button";
import { Dropdown } from "@similarweb/ui-components/dist/dropdown";
import { useTranslation } from "components/WithTranslation/src/I18n";
import { StyledOptionDescription, StyledAddWebsitesDropdownItem } from "./styles";

type AddWebsitesDropdownProps = {
    onOpenWebsitesModal(): void;
    onOpenRecommendations(): void;
};

// TODO: Replace translation keys
const AddWebsitesDropdown = (props: AddWebsitesDropdownProps) => {
    const translate = useTranslation();
    const { onOpenWebsitesModal, onOpenRecommendations } = props;

    const onClick = ({ id }: { id: string }) => {
        if (id === "open-websites-modal") {
            onOpenWebsitesModal();
        }

        if (id === "open-recommendations") {
            onOpenRecommendations();
        }
    };

    return (
        <div>
            <Dropdown width={240} onClick={onClick} dropdownPopupPlacement="bottom-right">
                <IconButton key="add-websites-dropdown-button" type="primary" iconName="add">
                    {translate("si.pages.my_lists.button.more_leads")}
                </IconButton>
                <StyledAddWebsitesDropdownItem
                    iconName="add"
                    id="open-websites-modal"
                    className="more_leads__item"
                    key="add-websites-dropdown-open-modal-button"
                >
                    <div>{translate("workspace.sales.add.addNew")}</div>
                    <StyledOptionDescription>
                        {translate("workspace.sales.add.description")}
                    </StyledOptionDescription>
                </StyledAddWebsitesDropdownItem>
                <StyledAddWebsitesDropdownItem
                    iconName="wand"
                    id="open-recommendations"
                    className="more_leads__item"
                    key="add-websites-dropdown-open-recommendations-button"
                >
                    <div>{translate("workspace.recommendation_sidebar.indicator")}</div>
                    <StyledOptionDescription>
                        {translate("workspace.recommendation_sidebar.indicatorDescription")}
                    </StyledOptionDescription>
                </StyledAddWebsitesDropdownItem>
            </Dropdown>
        </div>
    );
};

export default AddWebsitesDropdown;
