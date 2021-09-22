import { ColumnsPickerLite } from "@similarweb/ui-components/dist/columns-picker";
import { ChipDownContainer, EllipsisDropdownItem } from "@similarweb/ui-components/dist/dropdown";
import { SearchInput } from "@similarweb/ui-components/dist/search-input";
import { swSettings } from "common/services/swSettings";
import { CategoriesFilter } from "components/filtersPanel/src/CategoriesFilter";
import { Pill } from "components/Pill/Pill";
import { AddToDashboardButton } from "components/React/AddToDashboard/AddToDashboardButton";
import { DownloadButtonMenu } from "components/React/DownloadButtonMenu/DownloadButtonMenu";
import { i18nFilter } from "filters/ngFilters";
import capitalize from "lodash/capitalize";
import { websiteTypeItems } from "pages/keyword-analysis/Organic";
import { SearchContainer } from "pages/workspace/StyledComponent";
import * as queryString from "querystring";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { allTrackers } from "services/track/track";
import { FlexRow } from "styled components/StyledFlex/src/StyledFlex";
import styled from "styled-components";
import { colorsPalettes } from "@similarweb/styles";
import { addToDashboard } from "UtilitiesAndConstants/UtilityFunctions/addToDashboard";
import {
    closeDashboardsModal,
    getColumnsPickerLiteProps,
} from "pages/keyword-analysis/common/UtilityFunctions";

const i18n = i18nFilter();

const Right = styled.div`
    flex-grow: 0;
    display: flex;
    align-items: center;
    margin-left: 10px;
`;

const DownloadExcelContainer = styled.a`
    margin: 0 8px 0 16px;
`;

const StyledPill = styled(Pill)`
    margin-left: 10px;
    font-size: 10px !important;
`;

const ChipdownItem = styled.div`
    flex-grow: 0;
    margin-right: 8px;
`;

const FiltersContainers = styled(FlexRow)`
    margin: 10px 15px;
`;

export const TableTop: React.FC<any> = (props) => {
    const [family, setFamily] = useState<string>();
    const [source, setSource] = useState<string>();
    const [selectedCategory, setSelectedCategory] = useState<any>(undefined);
    const [websiteType, setWebsiteType] = useState<string>();
    const [search, setSearch] = useState<string>();
    const addToDashboardModal = useRef<{ result?: Promise<any>; close?: VoidFunction }>();
    const categoriesChipDownRef = React.useRef(undefined);

    const a2d = useCallback(() => {
        const addToDashboardModalInstance = addToDashboard({
            modelType: "fromKeyword",
            metric: props.addToDashboardMetric,
            type: "KeywordsDashboardTable",
            webSource: props.addToDashboardWebsource,
            overrideAddToDashboardParams: {
                orderBy: "TotalShare desc",
                timeGranularity: "Monthly",
                filter: props.filtersStateObject.filter,
                category: props.filtersStateObject.category,
                FuncFlag: props.filtersStateObject.FuncFlag,
            },
        });
        addToDashboardModal.current = addToDashboardModalInstance;
        // clear the ref when the modal is closed
        if (addToDashboardModal.current.result) {
            addToDashboardModal.current.result.finally(() => {
                addToDashboardModal.current = null;
            });
        }
    }, [props.filtersStateObject]);
    useEffect(() => {
        return closeDashboardsModal(addToDashboardModal);
    }, [addToDashboardModal.current]);

    const trackExcelDownload = () => {
        allTrackers.trackEvent("Download", "submit-ok", "Table/Excel");
    };
    const createFilterString = useCallback(
        (filter) => {
            return [
                ...(props.filtersStateObject.filter || "").split(",").filter((x) => x),
                filter,
            ].join(",");
        },
        [props.filtersStateObject],
    );
    const removeFromFilterString = useCallback(
        (filterName) => {
            return (props.filtersStateObject.filter || "")
                .split(",")
                .filter((filterStr) => {
                    return filterStr.split(";")[0] !== filterName;
                })
                .join(",");
        },
        [props.filtersStateObject],
    );
    const onSearch = useCallback(
        (search) => {
            setSearch(search);
            if (search) {
                props.onFilterChange(
                    { filter: createFilterString(`Domain;contains;"${search}"`) },
                    false,
                );
            } else {
                // remove from filter
                props.onFilterChange({ filter: removeFromFilterString("Domain") }, false);
            }
        },
        [createFilterString, removeFromFilterString],
    );
    /**** Click on dropdown items ****/
    const onFamilyItemClick = useCallback(
        (family) => {
            setFamily(family.id);
            props.onFilterChange({ filter: createFilterString(`family;==;"${family.id}"`) }, false);
        },
        [createFilterString],
    );
    const onSourceItemClick = useCallback(
        (source) => {
            setSource(source.text);
            props.onFilterChange({ filter: createFilterString(`Source;==;${source.id}`) }, false);
        },
        [createFilterString],
    );

    const onCategorySelected = (selectedCategory) => {
        categoriesChipDownRef?.current?.closePopup();
        setSelectedCategory(selectedCategory);
        const { isCustomCategory, forApi: selectedCategoryForApi } = selectedCategory;
        if (!selectedCategoryForApi) {
            return;
        }
        if (isCustomCategory) {
            const category = selectedCategoryForApi;
            props.onFilterChange({ category }, false);
            return;
        }
        const filter = `category;category;"${selectedCategoryForApi}"`;
        props.onFilterChange({ filter }, false);
    };
    const onWebsiteTypeItemClick = (websiteType) => {
        setWebsiteType(websiteType.text);
        // tslint:disable-next-line:radix
        props.onFilterChange({ funcFlag: parseInt(websiteType.id) }, false);
    };

    /**** clear dropdown values ****/
    const onCloseFamilyItem = useCallback(() => {
        setFamily(undefined);
        props.onFilterChange({ filter: removeFromFilterString("family") }, false);
    }, [removeFromFilterString]);
    const onCloseSourceItem = useCallback(() => {
        setSource(undefined);
        props.onFilterChange({ filter: removeFromFilterString("Source") }, false);
    }, [removeFromFilterString]);
    const onCloseWebsiteTypeItem = () => {
        setWebsiteType(undefined);
        props.onFilterChange({ funcFlag: null }, false);
    };
    const onCloseCategory = () => {
        setSelectedCategory(undefined);
        props.onFilterChange(
            { filter: removeFromFilterString("category"), category: undefined },
            false,
        );
    };
    /**** create dropdown items ****/
    const familyItems = props.families.map((family) => {
        const text = `${capitalize(family.text)} (${family.count})`;
        return (
            <EllipsisDropdownItem key={family.text} id={family.text} text={family.text}>
                {text}
            </EllipsisDropdownItem>
        );
    });
    const sourceItems = props.sources.map((source) => {
        const text = `${capitalize(source.text)} (${source.count})`;
        return (
            <EllipsisDropdownItem key={source.text} id={source.id} text={source.text}>
                {text}
            </EllipsisDropdownItem>
        );
    });

    const excelLink = useMemo(() => {
        const queryStringParams = queryString.stringify(props.filtersStateObject);
        return `/widgetApi/KeywordAnalysisOP/${props.excelMetric}/Excel?${queryStringParams}`;
    }, [props.filtersStateObject]);
    const excelAllowed = swSettings.current.resources.IsExcelAllowed;
    const searchFilter = useCallback((term, item) => {
        return item?.props?.text?.toLowerCase().includes(term.toLowerCase());
    }, []);
    const filterBySelectedCategory = ({ forApi }) =>
        selectedCategory ? forApi === selectedCategory?.forApi : true;
    const { categories, customCategories } = props;
    const allCategories = {
        common: categories.filter(filterBySelectedCategory),
        custom: customCategories.filter(filterBySelectedCategory),
    };
    return (
        <div>
            <FiltersContainers alignItems="center">
                <ChipdownItem>
                    <ChipDownContainer
                        hasSearch={true}
                        selectedIds={family && { [family]: true }}
                        selectedText={family && capitalize(family)}
                        buttonText={i18n("dropdown.search")}
                        onClick={onFamilyItemClick}
                        onCloseItem={onCloseFamilyItem}
                        searchFilter={searchFilter}
                        searchPlaceHolder={props.tableTopFiltersSearchPlaceHolders.familyItems}
                    >
                        {familyItems}
                    </ChipDownContainer>
                </ChipdownItem>
                <ChipdownItem>
                    <ChipDownContainer
                        hasSearch={true}
                        selectedIds={source && { [source]: true }}
                        selectedText={source && capitalize(source)}
                        buttonText={i18n("analysis.source.search.keywords.filters.all-channels")}
                        onClick={onSourceItemClick}
                        onCloseItem={onCloseSourceItem}
                        searchFilter={searchFilter}
                        searchPlaceHolder={props.tableTopFiltersSearchPlaceHolders.sourceItems}
                    >
                        {sourceItems}
                    </ChipDownContainer>
                </ChipdownItem>
                <ChipdownItem>
                    <ChipDownContainer
                        ref={categoriesChipDownRef}
                        width={379}
                        selectedText={selectedCategory?.text}
                        buttonText={i18n("dropdown.category")}
                        closeOnItemClick={false}
                        onCloseItem={onCloseCategory}
                        cssClassContainer={"Popup-content-industry-filter"}
                    >
                        {[
                            <CategoriesFilter
                                tabList={allCategories}
                                onItemClickCallback={onCategorySelected}
                            />,
                        ]}
                    </ChipDownContainer>
                </ChipdownItem>
                <ChipdownItem>
                    <ChipDownContainer
                        width={280}
                        hasSearch={false}
                        selectedIds={websiteType && { [websiteType]: true }}
                        selectedText={websiteType && capitalize(websiteType)}
                        buttonText={
                            <span>
                                {i18n("analysis.source.search.keywords.filters.websitetype")}
                                <StyledPill
                                    backgroundColor={colorsPalettes.orange[400]}
                                    text="NEW"
                                />
                            </span>
                        }
                        onClick={onWebsiteTypeItemClick}
                        onCloseItem={onCloseWebsiteTypeItem}
                    >
                        {websiteTypeItems}
                    </ChipDownContainer>
                </ChipdownItem>
            </FiltersContainers>
            <SearchContainer>
                <SearchInput
                    clearValue={false}
                    defaultValue={search}
                    debounce={400}
                    onChange={onSearch}
                    placeholder={i18n("forms.search.placeholder")}
                />
                <Right>
                    <FlexRow>
                        <DownloadExcelContainer href={excelLink}>
                            <DownloadButtonMenu
                                Excel={true}
                                downloadUrl={excelLink}
                                exportFunction={trackExcelDownload}
                                excelLocked={!excelAllowed}
                            />
                        </DownloadExcelContainer>
                        <div>
                            <ColumnsPickerLite
                                {...getColumnsPickerLiteProps(
                                    props.tableColumns,
                                    props.onClickToggleColumns,
                                )}
                                withTooltip={true}
                            />
                        </div>
                        <div>
                            <AddToDashboardButton onClick={a2d} />
                        </div>
                    </FlexRow>
                </Right>
            </SearchContainer>
        </div>
    );
};

TableTop.defaultProps = {
    families: [],
    sources: [],
    categories: [],
    customCategories: [],
    addToDashboardWebsource: "Desktop",
    excelMetric: "KeywordAnalysisOrganic",
    tableTopFiltersSearchPlaceHolders: { familyItems: "", sourceItems: "" },
};
