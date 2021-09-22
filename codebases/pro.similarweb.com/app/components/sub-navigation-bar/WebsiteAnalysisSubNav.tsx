import autobind from "autobind-decorator";
import PageTitle from "components/React/PageTitle/PageTitle";
import { PureComponent } from "react";
import { connect } from "react-redux";
import { Injector } from "../../../scripts/common/ioc/Injector";
import SWReactRootComponent from "../../decorators/SWReactRootComponent";
import WebsiteAnalysisFilters from "../../pages/website-analysis/WebsiteAnalysisFilters";
import WebsiteQueryBar from "../compare/WebsiteQueryBar";
import { SubNav } from "./SubNav";
import SubNavBackButton from "./SubNavBackButton";
import { SwNavigator } from "common/services/swNavigator";
import { EducationContainer } from "components/educationbar/educationContainer";
import { PreferencesService } from "services/preferences/preferencesService";
import { EDUCATION_BAR_PREFERENCES_KEY } from "components/educationbar/educationHook";

declare const window;

interface IWebsiteAnalysisSubNavState {
    numberOfComparedItems?: number;
    hideEducationComponent?: boolean;
}
class WebsiteAnalysisSubNav extends PureComponent<any, IWebsiteAnalysisSubNavState> {
    private services;

    constructor(props, context) {
        super(props, context);
        this.services = {
            chosenSites: Injector.get<any>("chosenSites"),
            swNavigator: Injector.get<SwNavigator>("swNavigator"),
        };
        this.state = this.getState();
    }

    public render() {
        const pageStateObj = this.services.swNavigator.current();
        const backStateUrl = this.services.swNavigator.href(pageStateObj.homeState, null);
        if (pageStateObj.name === "websites_root-home") {
            return null;
        } else if (pageStateObj.getSubNav) {
            const { numberOfComparedItems } = this.state;
            return pageStateObj.getSubNav(numberOfComparedItems, backStateUrl);
        }
        const educationData = window.education?.[pageStateObj.name];
        const onCloseEducationComponent = () => {
            PreferencesService.add({ [EDUCATION_BAR_PREFERENCES_KEY]: true });
            this.setState({ hideEducationComponent: true });
        };
        const onEducationIconClick = () => {
            if (this.state.hideEducationComponent) {
                PreferencesService.add({ [EDUCATION_BAR_PREFERENCES_KEY]: false });
                this.setState({ hideEducationComponent: false });
            }
        };

        return (
            <SubNav
                backButton={<SubNavBackButton backStateUrl={backStateUrl} />}
                topLeftComponent={<WebsiteQueryBar />}
                numberOfComparedItems={this.state.numberOfComparedItems}
                bottomRightComponent={<WebsiteAnalysisFilters />}
                bottomLeftComponent={
                    <PageTitle
                        showEducationIcon={educationData && this.state.hideEducationComponent}
                        onEducationIconClick={onEducationIconClick}
                    />
                }
                education={
                    !this.state.hideEducationComponent && (
                        <EducationContainer onCloseEducationComponent={onCloseEducationComponent} />
                    )
                }
            />
        );
    }
    @autobind
    private getState() {
        return {
            numberOfComparedItems: this.services.chosenSites.get().length,
            hideEducationComponent: PreferencesService.get(EDUCATION_BAR_PREFERENCES_KEY) || false,
        };
    }
}
function mapStateToProps({ routing }) {
    return {
        routing,
    };
}
export default SWReactRootComponent(
    connect(mapStateToProps, undefined)(WebsiteAnalysisSubNav),
    "WebsiteAnalysisSubNav",
);
