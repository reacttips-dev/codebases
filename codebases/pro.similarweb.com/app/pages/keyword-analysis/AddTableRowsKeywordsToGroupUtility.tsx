import { TableSelectionGroupKeywordComponent } from "../../../.pro-features/components/TableSelection/src/TableSelectionGroupKeywordComponent";
import * as _ from "lodash";
import { KeywordGeneratorToolPageModal } from "pages/keyword-analysis/keyword-generator-tool/KeywordGeneratorToolPageModal";
import * as React from "react";
import { connect } from "react-redux";
import { TableSelection } from "../../../.pro-features/components/TableSelection/src/TableSelection";
import { ETableSelectionNewGroupDropdownMode } from "../../../.pro-features/components/TableSelection/src/TableSelectionNewGroupDropdown";
import TrackProvider from "../../../.pro-features/components/WithTrack/src/TrackProvider";
import TranslationProvider from "../../../.pro-features/components/WithTranslation/src/TranslationProvider";
import { Injector } from "../../../scripts/common/ioc/Injector";
import { SwNavigator } from "../../../scripts/common/services/swNavigator";
import { showSuccessToast } from "../../actions/toast_actions";
import { getToastItemComponent } from "../../components/React/Toast/ToastItem";
import { i18nFilter } from "../../filters/ngFilters";
import { allTrackers } from "../../services/track/track";
import { ITitleValidation, KeywordGroupEditorHelpers } from "./KeywordGroupEditorHelpers";
import { TrackWithGuidService } from "../../services/track/TrackWithGuidService";
import { keywordsGroupsService } from "pages/keyword-analysis/KeywordGroupsService";

class AddTableRowsKeywordsToGroupUtility extends React.PureComponent<
    any,
    {
        showNewGroup: boolean;
        isLoading: boolean;
        mode: ETableSelectionNewGroupDropdownMode;
        currentGroup?: string;
        isCreateNewListModalOpen: boolean;
        isModalOpen: boolean;
        newlyCreatedGroup: boolean;
        groupName: string;
        workspaceId: string;
    } & ITitleValidation
> {
    private dropdownRef;
    private maxKeywordsInGroup = KeywordGroupEditorHelpers.getMaxGroupCount();
    private i18n = i18nFilter();
    private keywordGroupState;

    constructor(props) {
        super(props);
        this.state = {
            showNewGroup: false,
            isLoading: false,
            isValid: true,
            errorMessage: null,
            mode: ETableSelectionNewGroupDropdownMode.GROUP_LIST,
            isCreateNewListModalOpen: false,
            isModalOpen: false,
            groupName: "",
            workspaceId: "",
            newlyCreatedGroup: false,
        };
        this.keywordGroupState = this.props.isSearchTrends
            ? "marketresearch_keywordmarketanalysis_total"
            : "keywordAnalysis_overview";
    }

    public render() {
        const key = `table.selection.keywords${
            this.props.selectedRows.length > 1 ? ".multiple" : ""
        }`;
        const selectedText = this.i18n(key, { count: this.props.selectedRows.length.toString() });
        const tableSelectionVisible =
            Array.isArray(this.props.selectedRows) && this.props.selectedRows.length > 0;
        return (
            <>
                <TranslationProvider translate={this.i18n}>
                    <TrackProvider
                        track={allTrackers.trackEvent.bind(allTrackers)}
                        trackWithGuid={TrackWithGuidService.trackWithGuid}
                    >
                        <TableSelection
                            isVisible={tableSelectionVisible}
                            groupSelectorElement={this.getDropdown()}
                            addToGroupLabel={this.i18n("table.selection.keywords.addto")}
                            onCloseClick={this.onCloseClick}
                            selectedText={selectedText}
                            tooltipText={this.i18n("table.selection.clear.tooltip")}
                            showSeparator={false}
                        />
                    </TrackProvider>
                </TranslationProvider>
                <KeywordGeneratorToolPageModal
                    isOpen={this.state.isModalOpen}
                    onCloseClick={this.onModalClose}
                    onViewGroupClick={this.onViewGroupClick}
                    onStartOverClick={this.onStartOverClick}
                    newlyCreatedGroup={this.state.newlyCreatedGroup}
                />
            </>
        );
    }
    private onModalClose = () => {
        this.setState({ isModalOpen: false });
    };

    private onViewGroupClick = () => {
        const swNavigator = Injector.get<SwNavigator>("swNavigator");
        const { country, duration } = swNavigator.getParams();
        const { groupName } = this.state;
        swNavigator.go(this.keywordGroupState, {
            country,
            duration,
            keyword: `*${groupName}`,
        });
    };

    private onStartOverClick = () => {
        this.props.clearAllSelectedRows();
        this.setState({ isModalOpen: false });
    };

    private setRef = (ref) => {
        this.dropdownRef = ref;
    };

    private getDropdown = () => {
        return (
            <TableSelectionGroupKeywordComponent
                ref={this.setRef}
                groups={keywordsGroupsService.groupsToDropDown()}
                onSubmit={this.onSubmit}
                isLoading={this.state.isLoading}
                error={!this.state.isValid}
                errorMessage={this.state.errorMessage}
                onGroupClick={this.onGroupClick}
                onNewListButtonClick={this.onNewListButtonClick}
                mode={this.state.mode}
                isCreateNewListModalOpen={this.state.isCreateNewListModalOpen}
                onCancel={this.onCancel}
                groupIconName="keyword-group"
                count={this.maxKeywordsInGroup}
                newGroupNameLabel={this.i18n("table.selection.newgroup.keywords.title")}
                trackingCategory="add to keyword group"
                allItemsExistsMessage="table.selection.keywords.exists"
                maxItemsMessage="table.selection.keywords.max.keywords"
            />
        );
    };
    protected onNewListButtonClick = () => {
        this.setState({ isCreateNewListModalOpen: true });
    };

    private onCloseClick = () => {
        allTrackers.trackEvent("add to keyword group", "close", "toolbar");
        this.props.clearAllSelectedRows();
    };

    private onCancel = () => {
        if (this.state.mode === ETableSelectionNewGroupDropdownMode.NEW_GROUP) {
            allTrackers.trackEvent(
                "add to keyword group",
                "click",
                "Create New Keyword Group/Cancel",
            );
        }
        this.setState({
            mode: ETableSelectionNewGroupDropdownMode.GROUP_LIST,
            isValid: true,
            errorMessage: null,
            isCreateNewListModalOpen: false,
        });
    };

    /**
     * Create new group
     * @param name
     * @returns {Promise<void>}
     */
    private onSubmit = async (name) => {
        const validation = KeywordGroupEditorHelpers.validateTitle(name);
        if (!validation.isValid) {
            this.setState({
                ...validation,
            });
        } else {
            await this.toggleLoading();
            const group = KeywordGroupEditorHelpers.keywordGroupFromList({
                title: name,
                items: this.props.selectedRows.map((keyword) => {
                    return { text: keyword };
                }),
            });
            allTrackers.trackEvent(
                "add to keyword group",
                "submit-ok",
                `Create New Keyword Group/Save/${name};${group.Keywords.length}`,
            );
            const result = await keywordsGroupsService.update(group);
            if (result) {
                const createdGroup = result.find((record) => record.Name === name);
                this.setState({
                    groupName: createdGroup.Id,
                });
                await this.toggleLoading();
                this.props.clearAllSelectedRows();
                this.setState({
                    mode: ETableSelectionNewGroupDropdownMode.GROUP_LIST,
                    isValid: true,
                    errorMessage: null,
                    isCreateNewListModalOpen: false,
                    isModalOpen: true,
                    newlyCreatedGroup: true,
                });
            } else {
                // error
                this.dropdownRef.close();
            }
        }
    };

    private onGroupClick = async (item) => {
        // click on new group
        if (!item.id) {
            this.onNewGroupClick(item);
        }
        // click on existing group
        else {
            this.onExistingGroupClick(item);
        }
    };

    private onNewGroupClick = (item) => {
        allTrackers.trackEvent("add to keyword group", "click", "create new group");
        if (this.props.selectedRows.length > KeywordGroupEditorHelpers.getMaxGroupCount()) {
            this.setState({
                mode: ETableSelectionNewGroupDropdownMode.MAX_ITEMS,
            });
        } else {
            this.setState({
                mode: ETableSelectionNewGroupDropdownMode.NEW_GROUP,
            });
        }
    };

    private onExistingGroupClick = async (item) => {
        const currentGroup = keywordsGroupsService.findGroupById(item.id);
        const currentKeywords = currentGroup.Keywords.map((keyword) => {
            return { text: keyword };
        });
        const newKeywords = this.props.selectedRows.map((keyword) => {
            return { text: keyword };
        });
        const withoutDuplications = _.uniqWith(
            [...currentKeywords, ...newKeywords],
            (crr, other) => crr.text === other.text,
        );
        const newKeywordsCount = withoutDuplications.length - currentKeywords.length;
        // if no new keywords was added
        if (newKeywordsCount === 0) {
            this.setStateAsync({
                mode: ETableSelectionNewGroupDropdownMode.ALL_ITEMS_EXISTS,
                currentGroup: currentGroup.Name,
            });
            this.dropdownRef.openWarning();
        }
        // new keywords added
        else {
            const group = KeywordGroupEditorHelpers.keywordGroupFromList(
                {
                    title: currentGroup.Name,
                    items: withoutDuplications,
                },
                currentGroup,
            );
            allTrackers.trackEvent(
                "add to keyword group",
                "click",
                `Edit Keyword Group/Save/${group.Name};${group.Keywords.length}`,
            );
            // check number of keywords in group
            if (group.Keywords.length > this.maxKeywordsInGroup) {
                this.setState({
                    mode: ETableSelectionNewGroupDropdownMode.MAX_ITEMS,
                });
            } else {
                const result = await keywordsGroupsService.update(group);
                if (result) {
                    this.showGroupLinkToast(
                        currentGroup.Id,
                        this.i18n("table.selection.keywords.groupupdated", {
                            count: newKeywordsCount.toString(),
                        }),
                        this.i18n("table.selection.keywords.seegroup"),
                    );
                    this.props.clearAllSelectedRows();
                    this.setState({
                        mode: ETableSelectionNewGroupDropdownMode.GROUP_LIST,
                        isValid: true,
                        errorMessage: null,
                    });
                }
            }
        }
    };

    private toggleLoading = () => {
        return this.setStateAsync({
            isLoading: !this.state.isLoading,
        });
    };

    private showGroupLinkToast = (name, text, label, workspaceId?: string) => {
        const swNavigator = Injector.get<SwNavigator>("swNavigator");
        const { country, duration } = swNavigator.getParams();
        let linkToGroup;
        if (workspaceId) {
            linkToGroup = swNavigator.href("marketingWorkspace-keywordGroup", {
                keywordGroupId: name,
                workspaceId,
            });
        } else {
            linkToGroup = swNavigator.href(this.keywordGroupState, {
                country,
                duration,
                keyword: `*${name}`,
            });
        }
        this.dropdownRef.close();
        this.props.showToast(linkToGroup, text, label);
    };

    private setStateAsync = (state) => {
        return new Promise<void>((resolve) => {
            this.setState(state, resolve);
        });
    };
}

const mapStateToProps = (state, ownProps) => {
    const { stateKey } = ownProps;
    return {
        selectedRows: (state.tableSelection[stateKey] || []).map(({ SearchTerm }) => SearchTerm),
    };
};

const mapDispatchToProps = (dispatch, ownProps) => {
    const { clearAllSelectedRows } = ownProps;
    return {
        clearAllSelectedRows: () => {
            dispatch(clearAllSelectedRows());
        },
        showToast: (href, text, label) => {
            dispatch(
                showSuccessToast(
                    getToastItemComponent({
                        text,
                        linkText: label,
                        href,
                        onClick: allTrackers.trackEvent.bind(
                            allTrackers,
                            "add to keyword group",
                            "click",
                            "internal link/keywordAnalysis.overview",
                        ),
                    }),
                ),
            );
        },
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(AddTableRowsKeywordsToGroupUtility);
