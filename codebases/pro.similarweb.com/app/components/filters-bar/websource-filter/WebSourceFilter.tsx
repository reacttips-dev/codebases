import { SWReactIcons } from "@similarweb/icons";
import { IDropdownItem, WebSourceDropdownItem } from "@similarweb/ui-components/dist/dropdown";
import { Injector } from "common/ioc/Injector";
import { i18nFilter } from "filters/ngFilters";
import * as _ from "lodash";
import * as React from "react";
import { ComponentType, StatelessComponent } from "react";
import styled from "styled-components";
import { FiltersBarDropdown } from "../filters-bar-dropdown/FiltersBarDropdown";
import { FiltersBarDropdownButton } from "../filters-bar-dropdown/FiltersBarDropdownButton";
import "./WebSourceFilter.scss";
import { Pill } from "components/Pill/Pill";
import { colorsPalettes } from "@similarweb/styles";

export interface IWebSourceFilterItem extends IDropdownItem {
    icon?: string;
    disabled?: boolean;
    available?: boolean;
}

export interface IWebSourceFilterProps {
    items: IWebSourceFilterItem[];
    onChange: (itemId: number) => void;
    selectedIds: object;
    height?: number | string;
    width?: number | string;
    disabled?: boolean;
    onToggle?: (isOpen: boolean) => void;
    itemWrapper?: ComponentType<any>;
    appendTo?: string;
    dropdownPopupPlacement?: string;
}

const NewLabelWrapper = styled.span`
    margin-left: 4px;
    display: flex;
    align-items: center;
`;

const newMMXAlgoPages = [
    "websites-trafficOverview",
    "competitiveanalysis_website_overview_marketingchannels",
    "companyresearch_website_marketingchannels",
    "accountreview_website_marketingchannels",
    "websites-trafficSearch-overview",
    "websites-trafficReferrals",
    "competitiveanalysis_website_referrals_incomingtraffic",
    "competitiveanalysis_website_organic_search_overview",
];

export const WebSourceFilter: StatelessComponent<IWebSourceFilterProps> = (props) => {
    const swNavigator = Injector.get("swNavigator") as any;
    const componentName = swNavigator.current().name;
    const selectedId = Object.keys(props.selectedIds)[0];
    const selectedItem = _.find(props.items, { id: selectedId });
    const selectedText = selectedItem.text;
    const button = createButton(
        selectedItem.icon,
        selectedText,
        props.width,
        props.height,
        props.disabled,
    );
    const items = props.items.map((item, index) => {
        return {
            ...item,
            key: index,
        };
    });
    const contents = [button, ...items];

    function getCustomChildren(): JSX.Element[] {
        const children = [button];

        items.forEach((item: any) => {
            children.push(
                <WebSourceDropdownItem
                    key={item.id}
                    {...item}
                    customChildren={
                        item.id === "MobileWeb" ? (
                            <NewLabelWrapper>
                                <Pill
                                    text={i18nFilter()("new.label.pill")}
                                    backgroundColor={colorsPalettes.orange[400]}
                                />
                            </NewLabelWrapper>
                        ) : null
                    }
                    tooltip={
                        item.id === "MobileWeb" ? i18nFilter()("mmx.mobile.web.new.tooltip") : null
                    }
                    wrapper={props.itemWrapper}
                />,
            );
        });

        return children;
    }
    return newMMXAlgoPages.includes(componentName) ? (
        <FiltersBarDropdown
            onClick={props.onChange}
            selectedIds={props.selectedIds}
            closeOnItemClick={true}
            width={221}
            onToggle={props.onToggle}
            appendTo={props.appendTo}
            dropdownPopupPlacement={props.dropdownPopupPlacement}
        >
            {getCustomChildren()}
        </FiltersBarDropdown>
    ) : (
        <FiltersBarDropdown
            onClick={props.onChange}
            selectedIds={props.selectedIds}
            itemsComponent={WebSourceDropdownItem}
            closeOnItemClick={true}
            width={221}
            itemWrapper={props.itemWrapper}
            onToggle={props.onToggle}
            appendTo={props.appendTo}
            dropdownPopupPlacement={props.dropdownPopupPlacement}
        >
            {contents}
        </FiltersBarDropdown>
    );
};

WebSourceFilter.displayName = "WebSourceFilter";
WebSourceFilter.defaultProps = {
    height: 70,
    width: 166,
    onToggle: (isOpen: boolean) => null,
};

function createButton(icon, text, width, height, disabled) {
    return (
        <FiltersBarDropdownButton key={0} width={width} height={height} disabled={disabled}>
            <div className={"WebSourceFilter-dropdownButton"}>
                <div className="WebSourceFilter-dropdownButton-icon">
                    <SWReactIcons iconName={icon} />
                </div>
                <div className="WebSourceFilter-dropdownButton-text">{text}</div>
            </div>
        </FiltersBarDropdownButton>
    );
}
