import React, { useCallback, useContext } from "react";
import { StyledControlsSection, StyledDropdownsSection, StyledButtonsSection } from "./styles";
import { OpportunityListType } from "../../../../../sub-modules/opportunities/types";
import ListCountryDropdown from "../ListCountryDropdown/ListCountryDropdown";
import SignalsContainer from "pages/workspace/sales/sub-modules/signals/components/SignalsContainer";
import OpportunityListPageContext from "../../../context/OpportunityListPageContext";
import { ControlsSectionContainerProps } from "./ControlsSectionContainer";
import AddWebsitesDropdown from "./AddWebsitesDropdown";

const ControlsSection = (props: ControlsSectionContainerProps) => {
    const {
        workspaceId,
        toggleListModal,
        fetchListTableData,
        toggleRecommendationsBar,
        setMultiSelectorPanelByDefault,
    } = props;

    const { list, listUpdating, updateListCountry } = useContext(OpportunityListPageContext);

    const onSignalChange = useCallback(() => {
        setMultiSelectorPanelByDefault();
        fetchListTableData(list.opportunityListId);
    }, [fetchListTableData, list]);

    const handleCountryChange = useCallback(
        (id: OpportunityListType["country"]) => {
            setMultiSelectorPanelByDefault();
            updateListCountry(list, id);
        },
        [list, updateListCountry],
    );

    const openModal = useCallback(() => toggleListModal(true, list), [list, toggleListModal]);

    const openRecommendations = useCallback(() => {
        toggleRecommendationsBar(true);
    }, [toggleRecommendationsBar]);

    return (
        <StyledControlsSection>
            <StyledDropdownsSection>
                <ListCountryDropdown list={list} onCountryChange={handleCountryChange} />
                <SignalsContainer
                    disabled={false}
                    workspaceId={workspaceId}
                    onChange={onSignalChange}
                    countryCode={list?.country}
                    updatingList={listUpdating}
                    opportunitiesListId={list?.opportunityListId}
                />
            </StyledDropdownsSection>
            <StyledButtonsSection>
                <AddWebsitesDropdown
                    onOpenWebsitesModal={openModal}
                    onOpenRecommendations={openRecommendations}
                />
            </StyledButtonsSection>
        </StyledControlsSection>
    );
};

export default ControlsSection;
