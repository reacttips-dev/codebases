import { SWReactIcons } from "@similarweb/icons";
import {
    Dropdown,
    DropdownButton,
    SimpleDropdownItem,
} from "@similarweb/ui-components/dist/dropdown";
import { LinkButton } from "@similarweb/ui-components/dist/link";
import * as React from "react";
import { PureComponent } from "react";
import {
    DropdownContainer,
    TopRow,
} from "../../../.pro-features/pages/conversion/components/benchmarkOvertime/StyledComponents";
import { Injector } from "../../../scripts/common/ioc/Injector";
import { i18nFilter, prettifyConversionCategory } from "../../filters/ngFilters";
import { CatDropElem } from "./StyledComponents";
import * as _ from "lodash";
import { SwTrack } from "services/SwTrack";

export class ConversionQueryBar extends PureComponent<any, any> {
    private services;

    constructor(props, context) {
        super(props, context);
        this.services = {
            $rootScope: Injector.get<any>("$rootScope"),
            swNavigator: Injector.get<any>("swNavigator"),
            window: Injector.get<any>("$window"),
        };
        this.state = this.getState();
    }

    public getState() {
        return {
            selectedCategory: this.services.swNavigator.getParams().category,
        };
    }

    public onDropDownIndustryConversionClick = (value) => {
        const { swNavigator, $rootScope } = this.services;
        $rootScope.$apply(() => {
            swNavigator.go(swNavigator.current().name, {
                industry: swNavigator.getParams().industry,
                category: value.id,
            });
        });
        SwTrack.all.trackEvent("Drop Down", "click", `category filter/${value.id}`);
        this.setState({
            selectedCategory: value.id,
        });
    };

    public onToggle = (isOpen) => {
        const event = isOpen ? "open" : "close";
        SwTrack.all.trackEvent("Drop Down", event, "category filter");
    };

    public getAvailableCategories = () => {
        const currentIndustry = this.services.swNavigator.getParams().industry;
        return Object.keys(this.services.window.similarweb.config.industries[currentIndustry]);
    };

    public getAvailableCategoriesDropItems = () => {
        const currentIndustry = this.services.swNavigator.getParams().industry;
        const availableCategories = this.getAvailableCategories();
        return [
            <DropdownButton key={"channel-button"} width={340}>
                <b>{prettifyConversionCategory(currentIndustry, this.state.selectedCategory)}</b>
            </DropdownButton>,
            ..._.map(availableCategories, (category: string) => {
                const prettyCat = prettifyConversionCategory(currentIndustry, category);
                return (
                    <SimpleDropdownItem key={category} id={category}>
                        <CatDropElem title={prettyCat}>{prettyCat}</CatDropElem>
                    </SimpleDropdownItem>
                );
            }),
        ];
    };

    public render() {
        const props = {
            maxWidth: "250px",
            selectedCat: this.state.selectedCategory,
            trackName: "Header/Category Filter",
            minWidth: "200px",
        };
        const homepageLink = this.services.swNavigator.href("conversion-homepage", {});

        return (
            <TopRow>
                <LinkButton url={homepageLink} label={i18nFilter()("conversion.buyer.journey")} />
                <SWReactIcons iconName="chev-right" size="xs" />
                <DropdownContainer style={{ width: "340px" }}>
                    <Dropdown
                        dropdownPopupPlacement={"bottom-left"}
                        selectedIds={{ [this.state.selectedCategory]: true }}
                        shouldScrollToSelected={true}
                        onToggle={this.onToggle}
                        onClick={this.onDropDownIndustryConversionClick}
                    >
                        {this.getAvailableCategoriesDropItems()}
                    </Dropdown>
                </DropdownContainer>
            </TopRow>
        );
    }
}
