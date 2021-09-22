import * as React from "react";
import { Component } from "react";
import { InjectableComponent } from "components/React/InjectableComponent/InjectableComponent";
import { connect } from "react-redux";
import { dashboardWizardWidgetTypeChanged } from "../actions/dashboardWizardActionCreators";
import SWReactRootComponent from "decorators/SWReactRootComponent";
import { TubeSwitcherItem, Switcher } from "@similarweb/ui-components/dist/switcher";
import * as classNames from "classnames";
import * as _ from "lodash";
import { i18nFilter } from "filters/ngFilters";
import { PlainTooltip } from "components/React/Tooltip/PlainTooltip/PlainTooltip.tsx";
import styled from "styled-components";
import { colorsPalettes } from "@similarweb/styles";
import { Injector } from "common/ioc/Injector";
import { allTrackers } from "services/track/track";
import I18n from "components/React/Filters/I18n";
import { StatefullIconSwitcher } from "./StatefullIconSwitcher";

const SwitcherItemStyled: any = styled(TubeSwitcherItem)`
    &.selected {
        &:before {
            color: ${colorsPalettes.blue[500]};
        }
    }
`;

class DashboardWizardTypeSwitcher extends InjectableComponent {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <div>
                <div className="chartSwitcher">
                    <h4>
                        <I18n>home.dashboards.wizard.preview.title</I18n>
                    </h4>
                    <h5>
                        <I18n>home.dashboards.wizard.visualization.title</I18n>
                    </h5>
                    <StatefullIconSwitcher
                        items={this.props.dashboardWizard.availableWidgetTypes}
                        selected={this.props.dashboardWizard.selectedWidgetType}
                        onItemClicked={(item) =>
                            this.props.changeWidgetType(item, this.props.dashboardWizard)
                        }
                        clickedItemProperty={this.clickedItemProperty}
                        clickItemTracking={this.clickItemTracking}
                    />
                </div>
            </div>
        );
    }

    clickedItemProperty = (item) => item;
    clickItemTracking = (item) => {
        allTrackers.trackEvent(
            "Capsule Button",
            "switch",
            `Visualization/${this.props.dashboardWizard.availableWidgetTypes[item].id}`,
        );
    };
}

function mapDispatchToProps(dispatch) {
    return {
        changeWidgetType: (newType, customDashboard) => {
            dispatch(dashboardWizardWidgetTypeChanged(customDashboard, newType));
        },
    };
}

function mapStateToProps({ customDashboard: { dashboardWizard } }) {
    return {
        dashboardWizard,
    };
}

let connectedComponent = connect(mapStateToProps, mapDispatchToProps)(DashboardWizardTypeSwitcher);

SWReactRootComponent(connectedComponent, "DashboardWizardTypeSwitcher");

export default connectedComponent;
