import * as React from "react";
import { InjectableComponent } from "../InjectableComponent/InjectableComponent";
import { connect } from "react-redux";
import { RadioSwitcher } from "../switcher/RadioSwitcher";
import { Checkbox } from "../Checkbox/Checkbox";
import * as actions from "actions/popularPagesActions";
import { radioItems } from "./popularPagesFilters.config";
import SWReactRootComponent from "decorators/SWReactRootComponent";
import { PlainTooltip } from "../Tooltip/PlainTooltip/PlainTooltip";
import { SWReactIcons } from "@similarweb/icons";
import styled from "styled-components";
import * as _ from "lodash";
import { SwTrack } from "services/SwTrack";

export const IconContainer = styled.span`
    display: inline-block;
`;

SWReactRootComponent(IconContainer, "IconContainer");

class PopularPagesFilters extends InjectableComponent {
    protected i18n;
    protected radioItems = radioItems;

    constructor(props) {
        super(props);
        this.radioClicked = this.radioClicked.bind(this);
        this.checkboxClicked = this.checkboxClicked.bind(this);
        this.i18n = this.injector.get("i18nFilter");
    }

    render() {
        const { selectedFilter, checkboxIsSelected, isFetching } = this.props;
        return (
            <div className="widget-filter-container u-flex-column u-justifyCenter">
                <span className="u-flex-row u-flex-center">
                    <RadioSwitcher
                        onChange={this.radioClicked}
                        items={this.radioItems}
                        selectedValue={selectedFilter}
                        className="radio-switcher-container"
                    />
                    <span className="utm-checkbox">
                        <Checkbox
                            label={this.i18n("checkbox.utm.label")}
                            onClick={this.checkboxClicked}
                            selected={checkboxIsSelected}
                        />
                    </span>

                    <PlainTooltip
                        text={this.i18n("checkbox.utm.tooltip")}
                        placement="bottom"
                        maxWidth={350}
                        cssClass="PlainTooltip-element plainTooltip-white"
                    >
                        <IconContainer>
                            <SWReactIcons iconName="info" size="xs" />
                        </IconContainer>
                    </PlainTooltip>
                </span>
            </div>
        );
    }

    radioClicked(item) {
        const trackingObject = _.filter(this.radioItems, (radioItem) => {
            return radioItem.value === item;
        });
        const trackingId = trackingObject[0].tracking;
        SwTrack.all.trackEvent("Filter", "click", trackingId);
        this.props.radioClicked(item);
    }

    checkboxClicked() {
        SwTrack.all.trackEvent(
            "Check box",
            this.props.checkboxIsSelected ? "remove" : "click",
            "campaign(utm)",
        );
        this.props.checkboxClicked(this.props.checkboxIsSelected);
    }
}

function mapDispatchToProps(dispatch) {
    return {
        radioClicked: (item) => {
            dispatch(actions.popularPagesRadioButtonClicked(item));
        },
        checkboxClicked: (checkboxIsSelected) => {
            dispatch(actions.popularPagesCheckboxChanged(checkboxIsSelected));
        },
    };
}

function mapStateToProps({ popularPages: { popularPagesFiltersState } }) {
    const { selectedFilter, checkboxIsSelected, isFetching } = popularPagesFiltersState;
    return {
        selectedFilter,
        checkboxIsSelected,
        isFetching,
    };
}

const component = connect(mapStateToProps, mapDispatchToProps)(PopularPagesFilters);

SWReactRootComponent(component, "PopularPagesFilters");

export default component;
