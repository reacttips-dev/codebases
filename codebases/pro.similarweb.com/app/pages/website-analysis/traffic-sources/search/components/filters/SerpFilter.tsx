import { FooterButton } from "components/MultiCategoriesChipDown/src/MultiCategoryChipdownStyles";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { numberFilter, i18nFilter } from "filters/ngFilters";
import { ChipDownContainer, EllipsisDropdownItem } from "@similarweb/ui-components/dist/dropdown";
import { useWebsiteKeywordsPageTableTopContext } from "pages/website-analysis/traffic-sources/search/components/WebsiteKeywordsPageContext";
import { SERP_MAP } from "pages/website-analysis/traffic-sources/search/components/serp/SerpTypes";
import styled from "styled-components";
import { useTrack } from "components/WithTrack/src/useTrack";
import { colorsPalettes } from "@similarweb/styles";
import { SWReactIcons } from "@similarweb/icons";
import { useRankingDistributionTableTopContext } from "pages/website-analysis/traffic-sources/search/tabs/RankingDistribution/RankingDistributionContext";

const EllipsisDropdownItemStyled = styled(EllipsisDropdownItem)`
    ${({ showCheckBox }) =>
        showCheckBox &&
        `
        display: flex;
    `}
    svg {
        path {
            fill: ${colorsPalettes.carbon[300]};
        }
    }
`;
// This is the representational component
const SerpFilter = ({ tableFilters, onSerpFilterApply, resetEnabled, tooltipText = null }) => {
    const initialSelected = useRef(tableFilters.serp || []);
    const dropdownRef = useRef<{ closePopup?: VoidFunction }>();
    const [selected, setSelected] = useState(initialSelected.current);
    useEffect(() => {
        if (tableFilters.serp) {
            setSelected(tableFilters.serp);
            initialSelected.current = tableFilters.serp;
        } else {
            setSelected([]);
            initialSelected.current = [];
        }
    }, [tableFilters.serp]);
    const [trackLegacy, trackWithGuid] = useTrack();
    const onToggle = (isOpen) => {
        if (isOpen) {
            trackWithGuid("serp.table.serp.filter", "open");
        } else {
            trackWithGuid("serp.table.serp.filter", "close");
        }
    };
    const onClick = useCallback(
        ({ id }) => {
            trackWithGuid("serp.table.serp.filter", "click", { feature: id });
            const index = selected.indexOf(id);
            const newSelected = [...selected];
            if (index > -1) {
                newSelected.splice(index, 1);
            } else {
                newSelected.push(id);
            }
            setSelected(newSelected);
        },
        [selected],
    );
    const onClose = () => {
        dropdownRef?.current?.closePopup();
        // useTimeout here since we need to close the popup manually and then update the url.
        // if url is changed before the popup is closed, A react error is being thrown
        setTimeout(() => {
            onSerpFilterApply([]);
        });
        trackWithGuid("serp.table.serp.filter", "remove");
    };
    const onApply = () => {
        dropdownRef?.current?.closePopup();
        // useTimeout here since we need to close the popup manually and then update the url.
        // if url is changed before the popup is closed, A react error is being thrown
        setTimeout(() => {
            onSerpFilterApply(selected);
        });
        trackWithGuid("serp.table.serp.filter", "submit-ok", { feature: selected.join(",") });
    };
    const items = Object.values(SERP_MAP).map(({ id: serpId, icon }, index) => {
        const { name, id } = SERP_MAP[serpId];
        return (
            <EllipsisDropdownItemStyled
                key={index}
                id={id}
                showCheckBox={true}
                selected={false}
                iconName={icon}
                iconSize="sm"
            >
                {name}
            </EllipsisDropdownItemStyled>
        );
    });
    const selectedIds = selected.reduce((result, id) => {
        result[id] = true;
        return result;
    }, {});
    const selectedText = useMemo(() => {
        switch (selected.length) {
            case 0:
                return null;
            case 1:
                return i18nFilter()("serp.filter.selected.single.feature", {
                    name: SERP_MAP[selected[0]].name,
                });
            default:
                return i18nFilter()("serp.filter.selected.multiple.feature", {
                    name: SERP_MAP[selected[0]].name,
                    count: selected.length - 1,
                });
        }
    }, [selected]);
    return (
        <div>
            <ChipDownContainer
                ref={dropdownRef}
                disabled={!resetEnabled}
                onToggle={onToggle}
                hasSearch={false}
                selectedIds={selectedIds}
                selectedText={selectedText}
                buttonText={i18nFilter()("serp.filter.placeholder")}
                onClick={onClick}
                onCloseItem={onClose}
                closeOnItemClick={false}
                width={300}
                footerComponent={() => (
                    <FooterButton onClick={onApply}>
                        {i18nFilter()("serp.filter.apply")}
                    </FooterButton>
                )}
                tooltipText={tooltipText}
            >
                {items}
            </ChipDownContainer>
        </div>
    );
};

// This are the "connectors" that connect the certain context to the representational component
export const SerpFilterForWebsiteKeywords = () => {
    const {
        tableFilters,
        onSerpFilterApply,
        resetEnabled,
    } = useWebsiteKeywordsPageTableTopContext();
    return (
        <SerpFilter
            tableFilters={tableFilters}
            onSerpFilterApply={onSerpFilterApply}
            resetEnabled={resetEnabled}
        />
    );
};

export const SerpFilterForRankingDistribution = () => {
    const { tableFilters, onSerpFilterApply } = useRankingDistributionTableTopContext();
    return (
        <SerpFilter
            tableFilters={tableFilters}
            onSerpFilterApply={onSerpFilterApply}
            resetEnabled={true}
        />
    );
};
