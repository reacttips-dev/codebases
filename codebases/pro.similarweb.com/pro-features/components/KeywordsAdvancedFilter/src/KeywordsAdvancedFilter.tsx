import { IconButton } from "@similarweb/ui-components/dist/button";
import {
    ChipDownContainer,
    Dropdown,
    EllipsisDropdownItem,
    IChipDownContainerProps,
} from "@similarweb/ui-components/dist/dropdown";
import { ItemIcon, Type } from "@similarweb/ui-components/dist/item-icon";
import { SimpleLegend } from "@similarweb/ui-components/dist/simple-legend";
import * as _ from "lodash";
import * as React from "react";
import styled from "styled-components";
import { IChosenItem } from "../../../../app/@types/chosenItems";
import { IAdvancedFilter } from "../../../../app/services/AdvancedFilterService/AdvancedFilterService";
import { KeywordAdvancedFilterService } from "../../../../app/services/AdvancedFilterService/KeywordsAdvancedFilters";
import { GapAnalysis, IGroup } from "../../GapAnalysis/src/GapAnalysis";
import { IProModalCustomStyles, ProModal } from "../../Modals/src/ProModal";
import { useTrack } from "components/WithTrack/src/useTrack";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "components/WithTranslation/src/I18n";
import { useWebsiteKeywordsPageTableTopContext } from "pages/website-analysis/traffic-sources/search/components/WebsiteKeywordsPageContext";
import UIComponentStateService from "services/UIComponentStateService";
const LOCALE_STORAGE_KEY = "search-keywords-sigle";
interface IKeywordsAdvancedFilterGroup extends IChosenItem, IGroup {}

export interface IKeywordsAdvancedFilterProps
    extends Pick<IChipDownContainerProps, "onClick" | "onCloseItem"> {
    onDone: (data) => void;
    predefinedItems: IAdvancedFilter[];
    selectedFilter: string;
    openAdvancedFilterByDefault?: boolean;
}

const proModalStyles: IProModalCustomStyles = {
    content: {
        padding: 22,
        width: 498,
    },
};

const CompetitorsDropDownItem = styled(EllipsisDropdownItem)`
    display: flex;
    align-items: center;
    .ItemIcon {
        margin-right: 12px;
    }
`;

const CompetitorsDropDownItemContent = styled.div`
    display: flex;
    align-items: center;
`;

export const KeywordsAdvancedFilterUtils = {
    getAdvancedFilterGroups: (domains, advancedFilter): IKeywordsAdvancedFilterGroup[] => {
        const [mainDomain, ...competitors] = domains;
        // if there is no selected advanced filter, the main site gets 0% - 100%
        if (!advancedFilter) {
            return [
                KeywordsAdvancedFilterUtils.addRange(mainDomain),
                ...competitors.map((c) => KeywordsAdvancedFilterUtils.addRange(c, null)),
            ];
        }
        return KeywordAdvancedFilterService.parseApi(advancedFilter, domains);
    },
    getButtonText: (selectedFilter, i18n) =>
        selectedFilter
            ? null
            : i18n("analysis.source.search.keywords.filters.advanced.addcompetitor"),
    addRange: (domain, value = [0, 100]) => {
        return {
            ...domain,
            range: value && { value },
        };
    },
};

export const KeywordsAdvancedFilter: React.FC<any> = (props) => {
    const { chosenItems, tableFilters } = useWebsiteKeywordsPageTableTopContext();
    const [showModal, setShowModal] = useState(false);
    const [groups, setGroups] = useState<any[]>(
        KeywordsAdvancedFilterUtils.getAdvancedFilterGroups(chosenItems, tableFilters.limits),
    );
    const [selectedFilter, setSelectedFilter] = useState(tableFilters.limits);
    const [trackLegacy, trackWithGuid] = useTrack();
    const openAdvancedFilterByDefault =
        UIComponentStateService.getItem(LOCALE_STORAGE_KEY, "localStorage", false) === "true";
    // reset the local storage key;
    useEffect(() => {
        if (openAdvancedFilterByDefault) {
            UIComponentStateService.setItem(LOCALE_STORAGE_KEY, "localStorage", null, false);
        }
        setSelectedFilter(tableFilters.limits);
    }, [tableFilters]);
    const translate = useTranslation();

    const originalDomains = useRef(chosenItems);
    const track = (name, action, category = "keyword Gap Analysis model pop up") => {
        trackLegacy(category, name, action);
    };

    const onClick = (item) => {
        if (item.id === "CUSTOM") {
            track("keyword Gap Analysis model", "open");
            setShowModal(true);
        } else {
            track(`Keyword analysis advanced filter/${item.id}`, "click", "drop down");
            props.onClick(item);
        }
    };

    const onModalClose = () => {
        track(`keyword Gap Analysis model`, "close");
        setShowModal(false);
    };

    const onChipdownToggle = (isOpen: boolean) => {
        if (isOpen) {
            track("Keyword analysis advanced filter", "open", "drop down");
        }
    };

    const onCustomFilterDone = () => {
        track(`keyword Gap Analysis model/${groups.length}`, "submit-ok");
        props.onDone(groups.map((group) => (group.range ? group.range.value : null)));
        setShowModal(false);
    };

    const onReset = () => {
        track(`keyword Gap Analysis model`, "reset");
        const groups = KeywordsAdvancedFilterUtils.getAdvancedFilterGroups(
            originalDomains.current,
            selectedFilter,
        );
        setGroups(groups);
    };

    const onAddCompetitor = ({ id }) => {
        const index = _.findIndex(groups, { name: id });
        if (index > -1) {
            const newGroups = [...groups];
            const updatedCompetitor = KeywordsAdvancedFilterUtils.addRange(newGroups[index]);
            // replace the competitor
            newGroups.splice(index, 1, updatedCompetitor);
            track(`add a competitor/${updatedCompetitor.name}`, "add");
            setGroups(newGroups);
        }
    };

    const onAddCompetitorToggle = (isOpen: boolean) => {
        track("add a competitor", "click");
    };

    const onChangeGroupRange = (index) => (value) => {
        const newGroups = [...groups];
        const updatedGroup = KeywordsAdvancedFilterUtils.addRange(newGroups[index], value);
        // replace old group with the updated one
        newGroups.splice(index, 1, updatedGroup);
        setGroups(newGroups);
    };

    const onDeleteGroup = (index) => () => {
        const newGroups = [...groups];
        const updatedGroup = KeywordsAdvancedFilterUtils.addRange(newGroups[index], null);
        newGroups.splice(index, 1, updatedGroup);
        track(`add a competitor/${updatedGroup.name}`, "remove");
        setGroups(newGroups);
    };

    const getGroups = (): IGroup[] => {
        return groups
            .filter((group) => group.range !== null)
            .map(({ range, ...data }) => {
                // here index is the index of the group in the original groups array
                const index = _.findIndex(groups, { name: data.name });
                return {
                    label: <SimpleLegend items={[data]} />,
                    range,
                    // first group isn't deletable
                    isDeletable: index !== 0,
                    onChange: onChangeGroupRange(index),
                    onDelete: onDeleteGroup(index),
                } as IGroup;
            });
    };

    const getAddCompetitorsDropDown = () => {
        const groupsWithoutRange = groups.filter((group) => group.range === null);
        if (groupsWithoutRange.length === 0) {
            return null;
        } else {
            const content = [
                <IconButton key={`add-button`} type="flat" iconName="add">
                    {translate("analysis.source.search.keywords.filters.gap.custom.addcompetitor")}
                </IconButton>,
                ...groupsWithoutRange.map(({ name, icon }, index) => {
                    return (
                        <CompetitorsDropDownItem key={`competitor-${index}`} id={name}>
                            <CompetitorsDropDownItemContent>
                                <ItemIcon iconType={Type.Website} iconSrc={icon} iconName="" />
                                {name}
                            </CompetitorsDropDownItemContent>
                        </CompetitorsDropDownItem>
                    );
                }),
            ];
            return (
                <Dropdown
                    key={`KeywordsAdvancedFilter-add-competitors`}
                    dropdownPopupPlacement="ontop-left"
                    width={305}
                    buttonWidth={191}
                    cssClassContainer="DropdownContent-container"
                    onClick={onAddCompetitor}
                    onToggle={onAddCompetitorToggle}
                    appendTo=".keywords-advanced-filter-modal"
                >
                    {content}
                </Dropdown>
            );
        }
    };

    const getGapAnalysisProps = () => ({
        onCancel: onModalClose,
        onDone: onCustomFilterDone,
        onReset,
        text: {
            cancelButton: translate("analysis.source.search.keywords.filters.gap.custom.cancel"),
            doneButton: translate("analysis.source.search.keywords.filters.gap.custom.done"),
            resetButton: translate("analysis.source.search.keywords.filters.gap.custom.reset"),
            title: translate("analysis.source.search.keywords.filters.gap.custom.title"),
            subTitle: translate("analysis.source.search.keywords.filters.gap.custom.subtitle"),
            removeButtonToolTip: translate(
                "analysis.source.search.keywords.filters.gap.remove.website",
            ),
        },
        groups: getGroups(),
        addCompetitor: getAddCompetitorsDropDown(),
    });

    const { onCloseItem, predefinedItems } = props;
    const buttonText = KeywordsAdvancedFilterUtils.getButtonText(selectedFilter, translate);
    const selectedText = KeywordAdvancedFilterService.getAdvancedFilterSelectedText(
        groups,
        selectedFilter,
        translate,
    );
    const isCustom = KeywordAdvancedFilterService.isCustomFilter(selectedFilter);
    return (
        <div id="search-keywords-advanced-filter">
            <ChipDownContainer
                onToggle={onChipdownToggle}
                width={305}
                onClick={onClick}
                selectedText={selectedText ?? ""}
                defaultOpen={openAdvancedFilterByDefault}
                onCloseItem={onCloseItem}
                buttonText={buttonText}
            >
                {[
                    ...predefinedItems.map(({ name, tooltip, id }, index) => {
                        return (
                            <EllipsisDropdownItem
                                key={`advanced-filter-item-${index}`}
                                id={id}
                                tooltipText={translate(tooltip, {
                                    main_website: groups[0].name.toString(),
                                })}
                                selected={id === selectedFilter}
                            >
                                {translate(name)}
                            </EllipsisDropdownItem>
                        );
                    }),
                    <EllipsisDropdownItem
                        selected={isCustom}
                        key={`advanced-filter-item-custom`}
                        id="CUSTOM"
                        iconName="settings"
                    >
                        {translate("analysis.source.search.keywords.filters.advanced.custom.title")}
                    </EllipsisDropdownItem>,
                ]}
            </ChipDownContainer>

            <ProModal
                className="keywords-advanced-filter-modal"
                isOpen={showModal}
                onCloseClick={onModalClose}
                customStyles={proModalStyles}
            >
                <GapAnalysis {...getGapAnalysisProps()} />
            </ProModal>
        </div>
    );
};
