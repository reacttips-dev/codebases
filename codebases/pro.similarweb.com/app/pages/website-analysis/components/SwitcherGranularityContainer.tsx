/**
 * Created by eyal.albilia on 11/19/17.
 */
import { PlainTooltip } from "@similarweb/ui-components/dist/plain-tooltip";
import { CircleSwitcherItem, Switcher } from "@similarweb/ui-components/dist/switcher";
import SWReactRootComponent from "decorators/SWReactRootComponent";
import { i18nFilter } from "filters/ngFilters";
import * as React from "react";
import styled from "styled-components";

export const SwitcherItemWrapperForTooltip = styled.div<{ disabled: boolean }>`
    ${({ disabled }) => (disabled ? "cursor: not-allowed;" : "")}
`;

interface ISwitcherGranularityContainer {
    selectedIndex: number;
    itemList: Array<{
        tooltipText?: React.ReactChild;
        title: string;
        disabled?: boolean;
    }>;
    onItemClick: (newIndex: number) => void;
    className?: string;
    customClass?: string;
}

@SWReactRootComponent
export class SwitcherGranularityContainer extends React.PureComponent<
    ISwitcherGranularityContainer
> {
    private i18n = i18nFilter();

    public onItemClick = (value) => {
        this.props.onItemClick(value);
    };

    public render(): JSX.Element {
        if (!Array.isArray(this.props.itemList) || this.props.itemList.length === 0) {
            return null;
        }

        const switcherItems = this.props.itemList.map((item, index) => {
            const selected = index === this.props.selectedIndex;
            if (item.tooltipText) {
                return (
                    <SwitcherItemWrapperForTooltip disabled={item.disabled}>
                        <PlainTooltip
                            tooltipContent={
                                typeof item.tooltipText === "string"
                                    ? this.i18n(item.tooltipText)
                                    : item.tooltipText
                            }
                        >
                            <div>
                                <CircleSwitcherItem
                                    key={`${item.title}${index}`}
                                    disabled={item.disabled}
                                    selected={selected}
                                >
                                    {this.i18n(item.title)}
                                </CircleSwitcherItem>
                            </div>
                        </PlainTooltip>
                    </SwitcherItemWrapperForTooltip>
                );
            } else {
                return (
                    <CircleSwitcherItem
                        key={`${item.title}${index}`}
                        disabled={item.disabled}
                        className={index === this.props?.itemList.length ? "last" : ""}
                        selected={selected}
                    >
                        {this.i18n(item.title)}
                    </CircleSwitcherItem>
                );
            }
        });
        return (
            <Switcher
                selectedIndex={this.props.selectedIndex}
                customClass={this.props.customClass}
                onItemClick={this.onItemClick}
                className={this.props.className}
            >
                {switcherItems}
            </Switcher>
        );
    }
}
