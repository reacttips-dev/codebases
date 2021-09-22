/**
 * Created by eyal.albilia on 11/19/17.
 */
import { PlainTooltip } from "@similarweb/ui-components/dist/plain-tooltip";
import { CircleSwitcherItem, Switcher } from "@similarweb/ui-components/dist/switcher";
import SWReactRootComponent from "decorators/SWReactRootComponent";
import * as PropTypes from "prop-types";
import * as React from "react";
import I18n from "../../../components/React/Filters/I18n";

@SWReactRootComponent
export class PercentsNumberSwitcher extends React.PureComponent<any, any> {
    public static propTypes = {
        itemList: PropTypes.arrayOf(PropTypes.object).isRequired,
    };

    constructor(props) {
        super(props);
        this.state = {
            selected: this.props.selectedIndex,
        };
    }

    public componentDidUpdate(prevProps) {
        if (this.props.selectedIndex !== prevProps.selectedIndex) {
            this.setState(
                {
                    selected: this.props.selectedIndex,
                },
                () => {
                    this.props.onItemClick(this.state.selected);
                },
            );
        }
    }

    public onItemClick = (value) => {
        this.setState({ selected: this.props.itemList[value].value }, () => {
            this.props.onItemClick(this.state.selected);
        });
    };

    public render(): JSX.Element {
        const selectedIndex = this.props.itemList.indexOf(
            this.props.itemList.find((item) => item.value === this.state.selected),
        );
        const switcherItems = this.props.itemList.map((item, index) => {
            if (item.tooltipText) {
                return (
                    <PlainTooltip tooltipContent={item.tooltipText} key={`${item.title}${index}`}>
                        <div>
                            <CircleSwitcherItem disabled={item.disabled}>
                                <I18n>{item.title}</I18n>
                            </CircleSwitcherItem>
                        </div>
                    </PlainTooltip>
                );
            } else {
                return (
                    <CircleSwitcherItem key={`${item.title}${index}`} disabled={item.disabled}>
                        <I18n>{item.title}</I18n>
                    </CircleSwitcherItem>
                );
            }
        });
        return (
            <Switcher
                className={this.props.className}
                selectedIndex={selectedIndex}
                customClass={this.props.customClass}
                onItemClick={this.onItemClick}
            >
                {switcherItems}
            </Switcher>
        );
    }
}
