import { SWReactIcons } from "@similarweb/icons";

import {
    ColumnsPickerLite,
    IColumnsPickerLiteProps,
} from "@similarweb/ui-components/dist/columns-picker";
import { DomainsChipDownContainer } from "@similarweb/ui-components/dist/dropdown";
import { ListItemWebsite } from "@similarweb/ui-components/dist/list-item";

import { PlainTooltip } from "@similarweb/ui-components/dist/plain-tooltip";
import { SearchInput } from "@similarweb/ui-components/dist/search-input";
import { MultiCategoriesChipDown } from "components/MultiCategoriesChipDown/src/MultiCategoriesChipDown";
import * as _ from "lodash";
import { CategoryDistribution } from "pages/website-analysis/incoming-traffic/CategoryDisterbution";
import * as React from "react";

import { InfoIcon } from "../../../../../../.pro-features/components/BoxTitle/src/BoxTitle";
import { TagsCloud } from "../../../../../../.pro-features/components/TagsCloud/TagsCloud";
import { PrimaryBoxTitle } from "../../../../../../.pro-features/styled components/StyledBoxTitle/src/StyledBoxTitle";
import { Injector } from "../../../../../../scripts/common/ioc/Injector";
import { SwNavigator } from "../../../../../../scripts/common/services/swNavigator";
import { AddToDashboardButton } from "../../../../../components/React/AddToDashboard/AddToDashboardButton";
import { DownloadButtonMenu } from "../../../../../components/React/DownloadButtonMenu/DownloadButtonMenu";
import { i18nFilter } from "../../../../../filters/ngFilters";
import { allTrackers } from "../../../../../services/track/track";
import { DownloadExcelContainer, SearchContainer } from "../../../../workspace/StyledComponent";
import {
    adaptDomainCategoryItems,
    adaptUserCustomCategoryItems,
} from "./AudienceInterestsCategoriesManager";
import {
    CategoriesAndTopicsDist,
    CategoriesWrapper,
    ChipdownItem,
    Container,
    Right,
    Section,
    SectionContainer,
    Separator,
    Title,
    TopicsTitle,
    TopicsWrapper,
} from "./AudienceInterestsTableTopStyles";
import {
    AudienceInterestsCategoryItem,
    IAudienceInterestsTableTopProps,
    IAudienceInterestsTableTopState,
} from "./AudienceInterestsTableTopTypes";
import { FlexRow } from "styled components/StyledFlex/src/StyledFlex";
import { addToDashboard } from "UtilitiesAndConstants/UtilityFunctions/addToDashboard";
import { apiHelper } from "common/services/apiHelper";
import { buildSearchFilterForTable } from "../AudienceInterestsUtils";

const i18n = i18nFilter();

export class AudienceInterestsTableTop extends React.PureComponent<
    IAudienceInterestsTableTopProps,
    IAudienceInterestsTableTopState
> {
    public static defaultProps = {
        allCategories: [],
        CustomCategories: [],
        selectedCategories: [],
        topics: [],
        domains: [],
    };

    private swNavigator = Injector.get<SwNavigator>("swNavigator");
    private addToDashboardModal: { dismiss: (reason?: string) => void };

    constructor(props, context) {
        super(props, context);
        this.state = {
            params: this.swNavigator.getParams(),
        };
    }

    public componentWillUnmount() {
        if (this.addToDashboardModal) {
            this.addToDashboardModal.dismiss();
        }
    }

    public render() {
        const excelDownloadUrl = this.props.downloadExcelPermitted ? this.props.excelLink : "";
        let excelLinkHref = {};
        if (excelDownloadUrl !== "") {
            excelLinkHref = { href: excelDownloadUrl };
        }

        const categories = adaptDomainCategoryItems(this.props.allCategories);
        const customCategories = adaptUserCustomCategoryItems(this.props.customCategories);
        const allCategories = [...customCategories, ...categories];

        const selectedCategoryIds = this.getSelectedCategoryIds(allCategories);

        return (
            <div>
                <Title>
                    <PrimaryBoxTitle>
                        {i18n("analysis.common.audience.interests.title", {
                            site: this.props.selectedDomain.name,
                        })}
                        <PlainTooltip
                            tooltipContent={i18n(
                                "analysis.common.audience.interests.title.tooltip",
                            )}
                        >
                            <div style={{ display: "inline-block", marginLeft: 6 }}>
                                <SWReactIcons iconName="info" size="xs" />
                            </div>
                        </PlainTooltip>
                    </PrimaryBoxTitle>
                </Title>
                <Separator />
                {
                    <SectionContainer>
                        <Section margin={19}>
                            {this.props.domains.length > 1 && (
                                <ChipdownItem>
                                    <DomainsChipDownContainer
                                        width={200}
                                        onClick={this.onSelectDomain}
                                        selectedDomainText={this.props.selectedDomain.name}
                                        selectedDomainIcon={this.props.selectedDomain.icon}
                                        onCloseItem={this.onClearCategories}
                                        buttonText={i18n("common.category.all")}
                                    >
                                        {this.getDomainsOptions()}
                                    </DomainsChipDownContainer>
                                </ChipdownItem>
                            )}
                            {this.props.allCategories.length > 0 && (
                                <ChipdownItem>
                                    <MultiCategoriesChipDown
                                        categories={allCategories}
                                        initialSelectedCategories={selectedCategoryIds}
                                        onDone={this.onSelectCategories}
                                        buttonText={i18n("common.category.all_industries")}
                                        searchPlaceholder="Search for categories"
                                    />
                                </ChipdownItem>
                            )}
                        </Section>
                        <Separator />
                        {this.props.domainMetaData && (
                            <CategoriesAndTopicsDist>
                                <CategoriesWrapper border={1}>
                                    <CategoryDistribution
                                        domains={this.props.domainMetaData}
                                        data={this.props.categoriesData}
                                        getLink={this.getCategoryLink}
                                    />
                                </CategoriesWrapper>
                                <TopicsWrapper border={1}>
                                    <TopicsTitle>
                                        {i18n("shared.cats-topics.title2")}
                                        <PlainTooltip
                                            placement="top"
                                            tooltipContent={i18n(
                                                "shared.cats-topics.title2.tooltip",
                                            )}
                                        >
                                            <span>
                                                <InfoIcon iconName="info" />
                                            </span>
                                        </PlainTooltip>
                                    </TopicsTitle>
                                    <TagsCloud tags={this.props.topics} />
                                </TopicsWrapper>
                            </CategoriesAndTopicsDist>
                        )}
                    </SectionContainer>
                }
                <Container>
                    <SearchContainer>
                        <SearchInput
                            defaultValue={this.props.searchTerm || ""}
                            debounce={400}
                            onChange={this.onSearch}
                            placeholder={i18n("forms.search.placeholder")}
                        />
                        <Right>
                            <FlexRow>
                                <DownloadExcelContainer {...excelLinkHref}>
                                    <DownloadButtonMenu
                                        Excel={true}
                                        downloadUrl={excelDownloadUrl}
                                        exportFunction={this.trackExcelDownload}
                                        excelLocked={!this.props.downloadExcelPermitted}
                                    />
                                </DownloadExcelContainer>
                                <div>
                                    <ColumnsPickerLite
                                        {...this.getColumnsPickerLiteProps()}
                                        withTooltip
                                    />
                                </div>
                                <div>
                                    <AddToDashboardButton onClick={this.a2d} />
                                </div>
                            </FlexRow>
                        </Right>
                    </SearchContainer>
                </Container>
            </div>
        );
    }

    private getCategoryLink = (category) => {
        return this.swNavigator.href(this.swNavigator.current().name, {
            audienceCategory: category,
        });
    };

    private getColumnsPickerLiteProps = (): IColumnsPickerLiteProps => {
        const columns = this.props.tableColumns.reduce((res, col, index) => {
            if (!col.fixed) {
                return [
                    ...res,
                    {
                        key: index.toString(),
                        displayName: col.displayName,
                        visible: col.visible,
                    },
                ];
            }
            return res;
        }, []);
        return {
            columns,
            onColumnToggle: this.onColumnToggle,
            onPickerToggle: () => null,
            maxHeight: 264,
            width: "auto",
        };
    };

    private onColumnToggle = (key) => {
        this.props.onClickToggleColumns(parseInt(key));
    };

    private getDomainsOptions = () => {
        return this.props.domains.map(({ name, icon }, index) => {
            return <ListItemWebsite key={index} text={name} img={icon} />;
        });
    };

    private getSelectedCategoryIds = (categories: AudienceInterestsCategoryItem[]): string[] => {
        return categories.reduce((result, current) => {
            if (this.props.selectedCategories.includes(current.id)) {
                result.push(current.id);
            }
            current.sons.forEach(({ id }) => {
                if (this.props.selectedCategories.includes(id)) {
                    result.push(id);
                }
            });
            return result;
        }, []);
    };

    private onSearch = (search) => {
        const filter = buildSearchFilterForTable("Domain", search);
        this.props.onFilterChange(filter, false);
        this.swNavigator.applyUpdateParams({
            search: search || null,
        });
    };

    private onSelectDomain = ({ text }) => {
        allTrackers.trackEvent("Drop Down", "click", `Table/Domain/${text}`);
        this.swNavigator.applyUpdateParams({
            selectedSite: text,
        });
    };

    private formatCategoryIds = (categories: AudienceInterestsCategoryItem[]) => {
        return categories && categories.length > 0 ? categories.map((x) => x.id).join(",") : null;
    };

    private onSelectCategories = (categories: AudienceInterestsCategoryItem[]) => {
        const selectedCustomCategories = categories?.filter((x) => x.isCustomCategory);
        const selectedDomainCategories = categories?.filter((x) => !x.isCustomCategory);

        const selectedCustomCategoryIds = this.formatCategoryIds(selectedCustomCategories);
        const selectedDomainCategoryIds = this.formatCategoryIds(selectedDomainCategories);

        selectedDomainCategoryIds
            ? allTrackers.trackEvent(
                  "Drop Down",
                  "click",
                  `Table/Category/${selectedDomainCategoryIds}`,
              )
            : _.noop();
        selectedCustomCategoryIds
            ? allTrackers.trackEvent(
                  "Drop Down",
                  "click",
                  `Table/Category/customCategory/${selectedCustomCategoryIds}`,
              )
            : _.noop();

        this.swNavigator.applyUpdateParams({
            audienceCategory: selectedDomainCategoryIds,
            customCategory: selectedCustomCategoryIds,
        });
    };

    private onClearCategories = () => {
        this.onSelectCategories(null);
    };

    private trackExcelDownload = () => {
        allTrackers.trackEvent("Download", "submit-ok", "Table/Excel");
    };

    private a2d = () => {
        this.addToDashboardModal = addToDashboard({
            modelType: "fromWebsite",
            metric: "AudienceInterests",
            type: "Table",
            filters: { filter: `category;${this.state?.params?.audienceCategory}` },
        });
    };
}
