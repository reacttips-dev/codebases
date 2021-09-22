import { AutocompleteTrackerWizard } from "components/AutocompleteTrackerWizard/AutocompleteTrackerWizard";
import React, { useState } from "react";
import { SegmentItemRow } from "pages/segments/modals/SegmentGroupModal";
import { SEGMENT_TYPES } from "services/segments/segmentsApiService";
import { Container, ItemContainer, ItemsContainer, FullList } from "./styled";
import { i18nFilter } from "filters/ngFilters";
import { ETrackerAssetType } from "services/competitiveTracker/types";
import { ITrackerAsset } from "components/SecondaryBar/NavBars/MarketResearch/NavBarSections/CompetitiveTracking/CompetitiveTrackingTypes";

interface IAutocompleteTrackerWizardMultiSelectProps {
    selectedValues?: ITrackerAsset[];
    onSelect: (selectedValue: ITrackerAsset[]) => void;
    maxSupportedCompetitors: number;
    selectedAsset?: ITrackerAsset;
}

export const AutocompleteTrackerWizardMultiSelect: React.FunctionComponent<IAutocompleteTrackerWizardMultiSelectProps> = ({
    onSelect,
    selectedValues = [],
    selectedAsset,
    maxSupportedCompetitors,
}) => {
    const [isOpen, setIsOpen] = useState(false);

    const onAdd = (item) => {
        onSelect([...selectedValues, item]);
        setIsOpen(false);
    };
    const onRemove = (item) => () => {
        const newItems = selectedValues.filter(({ id }) => id !== item.id);
        onSelect(newItems);
    };
    const i18n = i18nFilter();
    const containerWidth = isOpen ? "500px" : "100%";
    const excludeItems = [...selectedValues];
    selectedAsset && excludeItems.push(selectedAsset);
    return (
        <Container width={containerWidth}>
            {selectedValues.length >= maxSupportedCompetitors ? (
                <FullList>
                    <strong style={{ paddingRight: "5px" }}>
                        {i18n("competitive.tracker.autocomplete.multi.full.list.header")}
                    </strong>
                    {i18n("competitive.tracker.autocomplete.multi.full.list")}
                </FullList>
            ) : (
                <AutocompleteTrackerWizard
                    onSelect={onAdd}
                    selectedValue={undefined}
                    excludeItems={excludeItems}
                    isOpenCallback={setIsOpen}
                    selectedAsset={selectedAsset}
                />
            )}
            {selectedValues.length > 0 && (
                <ItemsContainer>
                    {selectedValues.map((item) => {
                        const { type, displayText, image, name, id } = item;
                        const segmentType =
                            type === ETrackerAssetType.Segment
                                ? SEGMENT_TYPES.SEGMENT
                                : SEGMENT_TYPES.WEBSITE;
                        return (
                            <ItemContainer key={id}>
                                <SegmentItemRow
                                    displayPill={false}
                                    segmentType={segmentType}
                                    segment={{
                                        favicon: image,
                                        domain: displayText,
                                        segmentName: name,
                                    }}
                                    onRemoveSelected={onRemove(item)}
                                />
                            </ItemContainer>
                        );
                    })}
                </ItemsContainer>
            )}
        </Container>
    );
};
