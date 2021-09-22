import { showTopNav } from "actions/commonActions";
import * as React from "react";
import { connect } from "react-redux";
import { IKeywordGroup } from "userdata";
import SWReactRootComponent from "../../../../decorators/SWReactRootComponent";
import KeywordGeneratorTool from "../../../keyword-analysis/keyword-generator-tool/KeywordGeneratorTool";
import TranslationProvider from "../../../../../.pro-features/components/WithTranslation/src/TranslationProvider";
import { KeywordGeneratorToolPageModal } from "../../../keyword-analysis/keyword-generator-tool/KeywordGeneratorToolPageModal";
import {
    clearState,
    getStateAndParams,
} from "../../../keyword-analysis/keyword-generator-tool/keywordGeneratorToolService";
import { Injector } from "../../../../../scripts/common/ioc/Injector";
import { i18nFilter } from "../../../../filters/ngFilters";
import { marketingWorkspaceApiService } from "../../../../services/marketingWorkspaceApiService";
import { SwNavigator } from "../../../../../scripts/common/services/swNavigator";
import swLog from "@similarweb/sw-log";
import { marketingWorkspaceGo } from "../MarketingWorkspaceCtrl";
import { clearAllParams, setCountry } from "../../../../actions/keywordGeneratorToolActions";

class MarketingWorkspaceKeywordGeneratorTool extends React.Component<any, any> {
    private swNavigator = Injector.get<any>("swNavigator");
    private i18nFilter = i18nFilter();

    constructor(props, context) {
        super(props, context);
        this.state = {
            isModalOpen: false,
            newlyCreatedGroup: false,
            tableSelectionCurrentGroup: null,
            key: Date.now(),
        };
    }

    public componentDidMount(): void {
        this.props.setCountry(this.props.arenaCountry);
    }

    public render() {
        return (
            <>
                <KeywordGeneratorTool
                    onKeywordsAddedToGroup={this.onKeywordsAddedToGroup}
                    showSuggestionWidgets
                    key={this.state.key}
                />
                <TranslationProvider translate={this.i18nFilter}>
                    <KeywordGeneratorToolPageModal
                        isOpen={this.state.isModalOpen}
                        onCloseClick={this.onModalClose}
                        onViewGroupClick={this.onViewGroupClick}
                        onStartOverClick={this.onStartOverClick}
                        newlyCreatedGroup={this.state.newlyCreatedGroup}
                    />
                </TranslationProvider>
            </>
        );
    }
    private onModalClose = () => {
        this.setState({ isModalOpen: false });
    };
    private onStartOverClick = () => {
        this.props.clearAllParams();
        this.setState({ isModalOpen: false, key: Date.now() });
    };
    private onViewGroupClick = () => {
        this.props.showTopNav();
        const { country, duration } = this.props;
        marketingWorkspaceGo("marketingWorkspace-keywordGroup", {
            keywordGroupId: this.state.groupId,
        });
        clearState();
    };
    private onKeywordsAddedToGroup = async (group: IKeywordGroup, newlyCreatedGroup: boolean) => {
        this.setState({ isModalOpen: true, tableSelectionCurrentGroup: group, newlyCreatedGroup });
        const { workspaceId } = Injector.get<SwNavigator>("swNavigator").getParams();
        try {
            await marketingWorkspaceApiService.linkKeywordGroupToWorkspace(group.Id, workspaceId);
            this.setState({
                groupId: group.Id,
            });
        } catch (e) {
            swLog.error("Error in linking keywords group to workspace: ", e);
        }
    };
}

const mapStateToProps = ({ keywordGeneratorTool: { country, duration, arenaCountry } }) => {
    return {
        country,
        duration,
        arenaCountry,
    };
};
const mapDispatchToProps = (dispatch) => {
    return {
        clearAllParams: () => {
            dispatch(clearAllParams());
        },
        setCountry: (country) => {
            dispatch(setCountry(country));
        },
        showTopNav: () => {
            dispatch(showTopNav());
        },
    };
};
const connected = connect(
    mapStateToProps,
    mapDispatchToProps,
)(MarketingWorkspaceKeywordGeneratorTool);

export default SWReactRootComponent(connected, "MarketingWorkspaceKeywordGeneratorTool");
