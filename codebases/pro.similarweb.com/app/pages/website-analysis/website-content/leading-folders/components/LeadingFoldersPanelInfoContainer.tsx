import autobind from "autobind-decorator";
import SWReactRootComponent from "decorators/SWReactRootComponent";
import * as React from "react";
import { PureComponent } from "react";
import { connect } from "react-redux";
import { allTrackers } from "services/track/track";
import { AllContexts } from "../../../../../../.pro-features/pages/Leading Folders/src/AllContexts";
import { LeadingFoldersInfoPanel } from "../../../../../../.pro-features/pages/Leading Folders/src/LeadingFoldersInfoPanel";
import { LeadingFoldersInfoPanelInProgress } from "../../../../../../.pro-features/pages/Leading Folders/src/LeadingFoldersInProgressInfoPanel";
import { LeadingFoldersSuccessInfoPanel } from "../../../../../../.pro-features/pages/Leading Folders/src/LeadingFoldersSuccessInfoPanel";
import { Injector } from "../../../../../../scripts/common/ioc/Injector";
import UIComponentStateService from "../../../../../services/UIComponentStateService";
import { TrackWithGuidService } from "../../../../../services/track/TrackWithGuidService";

export interface ILeadingFoldersPanelInfoContainer {
    translate: (key) => string;
    track: (a?, b?, c?, d?) => void;
    leadingFolderPage: any;
}

const STATUS = {
    GotIt: "done",
    InProgress: "inProgress",
};

export default class LeadingFoldersPanelInfoContainer extends PureComponent<
    ILeadingFoldersPanelInfoContainer,
    any
> {
    public i18n: any;
    public uiComponentState: any;
    public swNavigator: any;

    constructor(props, context) {
        super(props, context);
        this.i18n = Injector.get<any>("i18nFilter");
        this.swNavigator = Injector.get<any>("swNavigator");
        this.uiComponentState = UIComponentStateService;
        this.state = {
            loading: true,
            isFolderAnalysisSupported: false,
            mainSite: this.swNavigator.getParams().key,
        };
    }

    public componentDidUpdate(prevProps) {
        if (this.props.leadingFolderPage.leadingFolderHeader) {
            const leadingFolderHeader = this.props.leadingFolderPage.leadingFolderHeader;
            this.setState({
                loading: false,
                isFolderAnalysisSupported:
                    leadingFolderHeader.IsFolderAnalysisSupported &&
                    leadingFolderHeader.IsFolderAnalysisSupported[leadingFolderHeader.MainSite],
                mainSite: leadingFolderHeader.MainSite,
            });
        } else {
            this.setState({
                loading: true,
                isFolderAnalysisSupported: false,
                mainSite: this.swNavigator.getParams().key,
            });
        }
    }

    @autobind
    private getSavedKeyStatus(domain) {
        return this.uiComponentState.getItem(domain || this.state.mainSite, "localStorage", true);
    }

    @autobind
    private setKeyStatus(status) {
        this.uiComponentState.setItem(this.state.mainSite, "localStorage", status, true);
    }

    @autobind
    public setKeyStatusInprogress() {
        this.setState({
            ...this.state,
            status: STATUS.InProgress,
        });
        return this.setKeyStatus(STATUS.InProgress);
    }

    @autobind
    public setKeyStatusGotIt() {
        this.setState({
            ...this.state,
            status: STATUS.GotIt,
        });
        return this.setKeyStatus(STATUS.GotIt);
    }

    public render() {
        const { isFolderAnalysisSupported, mainSite, loading } = this.state;
        const status = this.getSavedKeyStatus(mainSite);
        return loading ? (
            <div />
        ) : (
            <div style={{ marginBottom: "24px" }}>
                <AllContexts
                    translate={this.i18n}
                    track={allTrackers.trackEvent.bind(allTrackers)}
                    trackWithGuid={TrackWithGuidService.trackWithGuid}
                >
                    {/*{!status && !isFolderAnalysisSupported &&
                        <LeadingFoldersInfoPanel whitelistButtonClick={this.setKeyStatusInprogress} domain={mainSite}/>}*/}
                    {status === STATUS.InProgress && !isFolderAnalysisSupported && (
                        <LeadingFoldersInfoPanelInProgress domain={mainSite} />
                    )}
                    {status !== STATUS.GotIt && isFolderAnalysisSupported && (
                        <LeadingFoldersSuccessInfoPanel
                            domain={mainSite}
                            gotItButtonClick={this.setKeyStatusGotIt}
                        />
                    )}
                </AllContexts>
            </div>
        );
    }
}

function mapStateToProps(store) {
    const leadingFolderPage = store.leadingFolderPage;
    return {
        leadingFolderPage,
    };
}

SWReactRootComponent(
    connect(mapStateToProps, null)(LeadingFoldersPanelInfoContainer),
    "LeadingFoldersPanelInfoContainer",
);
