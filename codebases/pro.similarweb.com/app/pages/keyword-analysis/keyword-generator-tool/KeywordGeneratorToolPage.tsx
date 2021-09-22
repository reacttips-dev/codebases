import * as React from "react";
import { connect } from "react-redux";
import { IKeywordGroup } from "userdata";
import TranslationProvider from "../../../../.pro-features/components/WithTranslation/src/TranslationProvider";
import { Injector } from "../../../../scripts/common/ioc/Injector";
import SWReactRootComponent from "../../../decorators/SWReactRootComponent";
import { i18nFilter } from "../../../filters/ngFilters";
import KeywordGeneratorTool from "./KeywordGeneratorTool";
import { KeywordGeneratorToolPageModal } from "./KeywordGeneratorToolPageModal";
import { clearState, getStateAndParams } from "./keywordGeneratorToolService";
import { clearAllParams } from "../../../actions/keywordGeneratorToolActions";

class KeywordGeneratorToolPage extends React.Component<any, any> {
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

    public render() {
        return (
            <>
                <KeywordGeneratorTool
                    onKeywordsAddedToGroup={this.onKeywordsAddedToGroup}
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
        const { country, duration } = this.props;
        this.swNavigator.go(
            ...getStateAndParams(this.state.tableSelectionCurrentGroup, { country, duration }),
        );
        clearState();
    };
    private onKeywordsAddedToGroup = (
        group: IKeywordGroup,
        newlyCreatedGroup: boolean,
        workspaceId?: string,
    ) => {
        this.setState({
            isModalOpen: true,
            tableSelectionCurrentGroup: group,
            newlyCreatedGroup,
            workspaceId,
        });
    };
}
const mapStateToProps = ({ keywordGeneratorTool: { country, duration } }) => {
    return {
        country,
        duration,
    };
};
const mapDispatchToProps = (dispatch) => {
    return {
        clearAllParams: () => {
            dispatch(clearAllParams());
        },
    };
};
const connected = connect(mapStateToProps, mapDispatchToProps)(KeywordGeneratorToolPage);

export default SWReactRootComponent(connected, "KeywordGeneratorToolPage");
