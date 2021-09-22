import autobind from "autobind-decorator";
import { AppsQueryBar } from "components/compare/AppsQueryBar/AppsQueryBar";
import PageTitle from "components/React/PageTitle/PageTitle";
import { AppAnalysisFilters } from "pages/app-analysis/AppAnalysisFilter";
import * as React from "react";
import { PureComponent } from "react";
import { connect } from "react-redux";
import { Injector } from "../../../scripts/common/ioc/Injector";
import SWReactRootComponent from "../../decorators/SWReactRootComponent";
import { SubNav } from "./SubNav";
import SubNavBackButton from "./SubNavBackButton";
import { SwNavigator } from "common/services/swNavigator";
import { chosenItems } from "common/services/chosenItems";
import { EducationContainer } from "components/educationbar/educationContainer";
import { PreferencesService } from "services/preferences/preferencesService";
import { EDUCATION_BAR_PREFERENCES_KEY } from "components/educationbar/educationHook";

interface IAppAnalysisSubNavState {
    numberOfComparedItems?: number;
    hideEducationBar?: boolean;
}

declare const window;

class AppAnalysisSubNav extends PureComponent<any, IAppAnalysisSubNavState> {
    private services;

    constructor(props, context) {
        super(props, context);
        this.services = {
            swNavigator: Injector.get<SwNavigator>("swNavigator"),
        };
        this.state = this.getState();
    }

    public componentWillUpdate(nextProps) {
        if (this.props.routing.currentPage !== nextProps.routing.currentPage) {
            const hideBar =
                (PreferencesService.get(EDUCATION_BAR_PREFERENCES_KEY) &&
                    !!window.education?.[nextProps.routing.currentPage]) ||
                false;
            this.setState({ hideEducationBar: hideBar });
        }
    }

    private onEducationIconClick = async () => {
        await PreferencesService.add({ [EDUCATION_BAR_PREFERENCES_KEY]: false });
        this.setState({ hideEducationBar: false });
    };
    private onCloseEducationBar = async () => {
        await PreferencesService.add({ [EDUCATION_BAR_PREFERENCES_KEY]: true });
        this.setState({ hideEducationBar: true });
    };

    public render() {
        const pageStateObj = this.services.swNavigator.current();
        const backStateUrl = this.services.swNavigator.href(pageStateObj.homeState, null);
        if (pageStateObj.name === "apps-home") {
            return null;
        } else if (pageStateObj.getSubNav) {
            const { numberOfComparedItems } = this.state;
            return pageStateObj.getSubNav(numberOfComparedItems, backStateUrl);
        }
        return (
            <SubNav
                backButton={<SubNavBackButton backStateUrl={backStateUrl} />}
                topLeftComponent={
                    this.props.AppsQueryBarProps.showHeader && (
                        <AppsQueryBar {...this.props.AppsQueryBarProps} />
                    )
                }
                numberOfComparedItems={this.state.numberOfComparedItems}
                bottomRightComponent={
                    <AppAnalysisFilters
                        hideDurationSelector={
                            this.props.AppAnalysisFiltersProps.hideDurationSelector
                        }
                        hideCountrySelector={this.props.AppAnalysisFiltersProps.hideCountrySelector}
                    />
                }
                bottomLeftComponent={
                    <PageTitle
                        showEducationIcon={this.state.hideEducationBar}
                        onEducationIconClick={this.onEducationIconClick}
                    />
                }
                education={
                    !this.state.hideEducationBar && (
                        <EducationContainer onCloseEducationComponent={this.onCloseEducationBar} />
                    )
                }
            />
        );
    }

    @autobind
    private getState() {
        return {
            numberOfComparedItems: chosenItems.length,
            hideEducationBar:
                (PreferencesService.get(EDUCATION_BAR_PREFERENCES_KEY) &&
                    !!window.education?.[this.props.routing.currentPage]) ||
                false,
        };
    }
}

function mapStateToProps({ routing }) {
    return {
        routing,
    };
}

export default SWReactRootComponent(
    connect(mapStateToProps, undefined)(AppAnalysisSubNav),
    "AppAnalysisSubNav",
);
