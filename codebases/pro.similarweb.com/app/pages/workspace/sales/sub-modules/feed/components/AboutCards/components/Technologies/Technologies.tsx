import React, { useEffect, useState } from "react";
import { TECHNOLOGIES_TITLE, TECHNOLOGIES_DESCRIPTION, NEW } from "../../../../constants";
import { PrimaryBoxTitle } from "styled components/StyledBoxTitle/src/StyledBoxTitle";
import { TitleContainer } from "../SiteInfo/styles";
import {
    CardContainer,
    StyledSubTitle,
    StyledTechnologiesWrapper,
    LoaderWrapper,
} from "../../styles";
import { technologiesColumns, TECHNOLOGIES_PAGE_SIZE } from "./config";
import { useTranslation } from "components/WithTranslation/src/I18n";
import { HierarchyCategoryFilter } from "pages/website-analysis/technographics/filters/HierarchyCategoryFilter";
import { StyledFiltersWrapper, StyledFilter } from "pages/website-analysis/technographics/styles";
import { SubDomainFilter } from "pages/website-analysis/technographics/filters/SubDomainFilter";
import { TechnographicsTable } from "pages/website-analysis/technographics/TechnographicsTable";
import { LeadLabel } from "pages/lead-generator/lead-generator-exist/components/styles";
import { TechnologiesConnectedProps } from "./TechnologiesContainer";
import { CircularLoader } from "components/React/CircularLoader";
import { circularLoaderOptions } from "pages/workspace/common/WebsiteExpandData/Tabs/StyledComponents";
import * as cs from "classnames";
import DropdownHeaderItem from "pages/workspace/sales/components/multi-select-dropdown/DropdownHeaderItem/DropdownHeaderItem";
import { KEYS } from "pages/website-analysis/technographics/constants";
import { PreferencesService } from "services/preferences/preferencesService";
import { allTrackers } from "services/track/track";

const TECHNO_CARD_CATEGORY = "technoCardCategory";

export function TechnologiesComponent({
    technologies,
    isLoading,
    activeWebsite,
    setCategory,
    defaultCategory = null,
    topic = "",
}: TechnologiesConnectedProps): JSX.Element {
    const translate = useTranslation();
    const [selectedSubCategory, setSelectedSubCategory] = useState<string | null>(null);
    const [selectedSubdomains, setSelectedSubdomains] = useState<string[]>([]);
    const [showLoader, setShowLoader] = useState<boolean>(false);
    const [category, onSelectCategory] = useState<string | null>(defaultCategory);
    const [subDomainsList, setSubDomains] = useState({});
    const [noPagination, setNoPagination] = useState<boolean>(false);
    const [customTechnographics, setCustomTechnographics] = useState([]);

    const setGlobalCategory = async (category: string) => {
        await PreferencesService.add({ [TECHNO_CARD_CATEGORY]: category });
    };

    const getGlobalCategory = () => {
        const prefTechnoCategory = PreferencesService.get(TECHNO_CARD_CATEGORY);
        return prefTechnoCategory as any;
    };

    useEffect(() => {
        const subdomains = technologies?.technographics.reduce((acc, { usedBy }) => {
            for (let i = 0; i < usedBy.length; i++) {
                acc[usedBy[i]] = acc[usedBy[i]] ? acc[usedBy[i]] + 1 : 1;
            }
            return acc;
        }, {});

        const customTechnographicsList = technologies?.technographics.map((tech) => {
            const topDomain = tech.usedBy.reduce(
                (acc, domain) => {
                    const current = technologies.subdomains.find((item) => {
                        return item.domain === domain;
                    });
                    if (current && current.visits > acc?.visits) {
                        acc = current;
                    }

                    return acc;
                },
                { visits: 0, domain: "" },
            );
            tech["topDomain"] = topDomain.domain;
            return tech;
        });

        const subsWithShare = Object.keys(subdomains).reduce((acc, item) => {
            let share = 0;
            technologies?.subdomains.forEach((subDomainItem) => {
                if (subDomainItem.domain === item) {
                    share = subDomainItem.share;
                }
            });

            acc[item] = {
                share,
                number: subdomains[item],
            };
            return acc;
        }, {});

        const sortedSubdomains = Object.keys(subsWithShare)
            .sort((sub1, sub2) => {
                return subsWithShare[sub2].share - subsWithShare[sub1].share;
            })
            .reduce((acc, key) => ((acc[key] = subsWithShare[key]), acc), {});

        setCustomTechnographics(customTechnographicsList);
        onSelectCategory(getGlobalCategory() || null);
        setSubDomains(sortedSubdomains);
    }, [technologies]);

    const trackChange = (trackCategory: string, eventName?: string) => {
        allTrackers.trackEvent(
            "sidebar about",
            "change",
            eventName
                ? `${eventName}/${topic}/${trackCategory}`
                : `select tech category/${topic}/${trackCategory}`,
        );
    };

    const onCategoryChanged = async (category: { id: string; isChild: boolean }) => {
        trackChange(category.id);
        setShowLoader(true);
        setTimeout(() => {
            setShowLoader(false);
        }, 1500);

        if (category !== null) {
            setGlobalCategory(category.id);
            if (category.isChild) {
                setCategory(category.id);
                setSelectedSubCategory(category.id);
                onSelectCategory(null);
                return;
            }
            setCategory(category.id);
            setSelectedSubCategory(null);
            onSelectCategory(category.id);
        }
    };

    const onClearCategory = (_category?: string) => {
        if (_category) {
            setCategory(_category);
            trackChange(_category, "clear tech category");
        } else {
            trackChange("All tech categories", "clear tech category");
        }
        setSelectedSubCategory(null);
        onSelectCategory(null);
        setCategory(null);
        PreferencesService.remove([TECHNO_CARD_CATEGORY]);
    };

    const onSubDomainChanged = (selectedSubdomains: string[]) => {
        setSelectedSubdomains(selectedSubdomains);
    };

    const loader = (
        <LoaderWrapper>
            <CircularLoader options={circularLoaderOptions} />
        </LoaderWrapper>
    );

    const handlePaginationWrapper = <T extends unknown[]>(data: T): T => {
        setNoPagination(data.length <= 6);
        return data;
    };

    return (
        <CardContainer className={cs("technologies", noPagination && "noPagination")}>
            <div>
                <TitleContainer>
                    <PrimaryBoxTitle>{translate(TECHNOLOGIES_TITLE)}</PrimaryBoxTitle>
                    <LeadLabel width={30}>{translate(NEW)}</LeadLabel>
                </TitleContainer>
                <StyledSubTitle>{translate(TECHNOLOGIES_DESCRIPTION)}</StyledSubTitle>
            </div>
            <StyledFiltersWrapper>
                <StyledFilter className="CategoryWrapper">
                    <HierarchyCategoryFilter
                        trackingPlace="sidebar about"
                        appendTo=".CategoryWrapper"
                        onSelect={onCategoryChanged}
                        selectedCategory={category || selectedSubCategory}
                        data={technologies}
                        onClear={onClearCategory}
                        topic={topic}
                    />
                </StyledFilter>
                <StyledFilter className="SubDomainWrapper">
                    <SubDomainFilter
                        appendTo=".SubDomainWrapper"
                        disabled={false}
                        onSelect={onSubDomainChanged}
                        data={subDomainsList}
                        onClear={onSubDomainChanged}
                        headerComponent={
                            <DropdownHeaderItem key={"header"} isNested>
                                <div>{translate(KEYS.website)}</div>
                                <div>{translate(KEYS.trafficShare)}</div>
                            </DropdownHeaderItem>
                        }
                    />
                </StyledFilter>
            </StyledFiltersWrapper>
            {showLoader ? (
                loader
            ) : (
                <StyledTechnologiesWrapper>
                    <TechnographicsTable
                        dataChangeCallback={handlePaginationWrapper}
                        isLoading={isLoading}
                        keys={[activeWebsite]}
                        rawData={customTechnographics}
                        selectedCategory={category}
                        selectedSubdomains={selectedSubdomains}
                        pageSize={TECHNOLOGIES_PAGE_SIZE}
                        searchString=""
                        columnsConfig={technologiesColumns}
                        selectedSubCategory={selectedSubCategory}
                        lengthToShowPagination={6}
                    />
                </StyledTechnologiesWrapper>
            )}
        </CardContainer>
    );
}
