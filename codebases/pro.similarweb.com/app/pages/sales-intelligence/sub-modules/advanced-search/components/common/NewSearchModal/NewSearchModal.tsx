import React from "react";
import { ProModal } from "components/Modals/src/ProModal";
import { useTranslation } from "components/WithTranslation/src/I18n";
import { PopularSearchKey, PopularSearchTemplate } from "../../../types/common";
import PopularSearchItem from "../PopularSearchItem/PopularSearchItem";
import PopularSearchesSwitch from "../PopularSearchesSwitch/PopularSearchesSwitch";
import usePopularSearchesService from "../../../hooks/usePopularSearchesService";
import {
    CUSTOM_MODAL_STYLES,
    StyledModalContent,
    StyledTitleContainer,
    StyledTitle,
    StyledSubTitle,
    StyledSearchItemsContainer,
} from "./styles";

type NewSearchModalProps = {
    isOpened: boolean;
    onClose(): void;
    onSelect(template: PopularSearchTemplate): void;
};

const NewSearchModal = (props: NewSearchModalProps) => {
    const translate = useTranslation();
    const popularSearchesService = usePopularSearchesService();
    const { isOpened, onClose, onSelect } = props;
    const [selectedTabKey, selectTabKey] = React.useState(PopularSearchKey.any);
    const tabs = popularSearchesService.getAllTabs();

    // TODO: In progress

    const handleTabIndexSelect = (key: PopularSearchKey) => {
        // TODO: Add possible tracking, when defined
        selectTabKey(key);
    };

    const renderCurrentSearches = () => {
        return popularSearchesService
            .getTabByKey(selectedTabKey)
            .searches.map((template, index) => (
                <PopularSearchItem
                    icon={template.icon}
                    key={`search-item-${index}`}
                    title={translate(
                        `si.advanced_search.new_search_modal.tab.${selectedTabKey}.item.${index}.title`,
                    )}
                    subtitle={translate(
                        `si.advanced_search.new_search_modal.tab.${selectedTabKey}.item.${index}.subtitle`,
                    )}
                    onClick={() => {
                        onSelect(template);
                    }}
                />
            ));
    };

    return (
        <ProModal
            isOpen={isOpened}
            onCloseClick={onClose}
            shouldCloseOnOverlayClick={false}
            customStyles={CUSTOM_MODAL_STYLES}
        >
            <StyledModalContent>
                <StyledTitleContainer>
                    <StyledTitle>
                        {translate("si.advanced_search.new_search_modal.title")}
                    </StyledTitle>
                    <StyledSubTitle>
                        {translate("si.advanced_search.new_search_modal.subtitle")}
                    </StyledSubTitle>
                </StyledTitleContainer>
                <PopularSearchesSwitch
                    tabs={tabs}
                    selected={selectedTabKey}
                    onSelect={handleTabIndexSelect}
                />
                <StyledSearchItemsContainer>{renderCurrentSearches()}</StyledSearchItemsContainer>
            </StyledModalContent>
        </ProModal>
    );
};

export default NewSearchModal;
