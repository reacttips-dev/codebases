import React, { useEffect, useMemo, useState } from "react";
import _ from "lodash";
import { TechnographicsTable } from "pages/website-analysis/technographics/TechnographicsTable";
import {
    fetchSiteTechnologies,
    technologiesExcelUrl,
} from "pages/website-analysis/technographics/utils";
import { TrackWithGuidService } from "services/track/TrackWithGuidService";
import { PageContent, StyledFiltersWrapper, StyledCategoryWrapper } from "./styles";
import { CategoryFilter } from "./filters/CategoryFilter";
import { SearchTechnology } from "./filters/SearchTechnology";
import { SubDomainFilter } from "./filters/SubDomainFilter";
import { KEYS, EDIT, CLICK, CLEAR } from "./constants";
import { ITechnologyItem, techDataItem } from "./types";
import { SwLog } from "@similarweb/sw-log";

export function TechnographicsPage({ swSettings, swNavigator, chosenSites }) {
    const [category, onSelectCategory] = useState<string | null>(null);
    const [searchString, onSearch] = useState<string>("");
    const [isSubDomainFilterDisabled, setIsSubDomainFilterDisabled] = useState<boolean>(false);

    const [subDomainsList, setSubDomains] = useState<Record<string, number>>({});

    const [selectedSubdomains, setSelectedSubdomains] = useState<string[]>([]);

    const [data, setData] = useState<techDataItem[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const { key } = swNavigator.getParams();
    const splitKeys = useMemo(() => key.split(","), [key]);
    const excelUrl = useMemo(() => technologiesExcelUrl(splitKeys), [splitKeys]);

    async function fetchData() {
        try {
            setIsLoading(true);

            const tableData = await fetchSiteTechnologies(splitKeys);
            const newData = tableData?.Records.reduce(
                (allItems: ITechnologyItem[], item: ITechnologyItem) => {
                    return [
                        ...allItems,
                        {
                            ...item,
                            ..._.fromPairs(
                                splitKeys.map((key) => [
                                    key,
                                    item?.usedBy.some((used) => used.includes(key)),
                                ]),
                            ),
                        },
                    ];
                },
                [],
            );

            const subdomains = tableData?.Records.reduce((acc, { usedBy }) => {
                for (let i = 0; i < usedBy.length; i++) {
                    acc[usedBy[i]] = acc[usedBy[i]] ? acc[usedBy[i]] + 1 : 1;
                }
                return acc;
            }, {});

            const sortedSubdomains = Object.keys(subdomains)
                .sort((sub1, sub2) => {
                    return sub1.localeCompare(sub2);
                })
                .reduce((acc, item) => {
                    acc[item] = subdomains[item];
                    return acc;
                }, {});
            setSubDomains(sortedSubdomains);
            setIsSubDomainFilterDisabled(Object.keys(sortedSubdomains).length < 1);
            setData(newData);
        } catch (e) {
            SwLog.error(e);
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        fetchData();
    }, [key]);

    function onCategoryChanged(category) {
        const type = category === null ? CLEAR : `select/${category.text}`;
        TrackWithGuidService.trackWithGuid(KEYS.techCategoryFilter, CLICK, {
            type,
        });
        onSelectCategory(category ? category.id : null);
    }

    const onSubDomainChanged = (selectedSubdomains) => {
        setSelectedSubdomains(selectedSubdomains);
    };

    const trackSearch = useMemo(
        () =>
            _.debounce<(term) => void>((term) => {
                if (term) {
                    TrackWithGuidService.trackWithGuid(KEYS.techSearchFilter, EDIT, { term });
                }
            }, 500),
        [],
    );

    function searchCallback({ target: { value } }) {
        trackSearch(value || "");
        onSearch(value || "");
    }

    return (
        <article className="technographics-page-wrapper">
            <PageContent>
                <StyledFiltersWrapper>
                    <StyledCategoryWrapper>
                        <CategoryFilter
                            onSelect={onCategoryChanged}
                            category={category}
                            rawData={data}
                            onClear={() => onCategoryChanged(null)}
                        />
                    </StyledCategoryWrapper>
                    <SubDomainFilter
                        disabled={isSubDomainFilterDisabled}
                        onSelect={onSubDomainChanged}
                        data={subDomainsList}
                        onClear={onSubDomainChanged}
                    />
                </StyledFiltersWrapper>
                <SearchTechnology
                    value={searchString}
                    onSearch={searchCallback}
                    excelUrl={excelUrl}
                />
                <TechnographicsTable
                    isLoading={isLoading}
                    keys={splitKeys}
                    rawData={data}
                    selectedCategory={category}
                    selectedSubdomains={selectedSubdomains}
                    searchString={searchString}
                    getSiteImage={(site) => chosenSites.listInfo[site].icon}
                />
            </PageContent>
        </article>
    );
}
