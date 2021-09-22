import { colorsPalettes } from "@similarweb/styles";
import { Button } from "@similarweb/ui-components/dist/button";
import _ from "lodash";
import React from "react";
import styled, { css } from "styled-components";
import {
    IProModalCustomStyles,
    ProModal,
} from "../../../../.pro-features/components/Modals/src/ProModal";
import { Tab } from "../../../../.pro-features/pages/workspace/common components/WebsiteHeader";
import { FlexRow } from "../../../../.pro-features/styled components/StyledFlex/src/StyledFlex";
import { i18nFilter } from "../../../filters/ngFilters";
import { allTrackers } from "../../../services/track/track";
import { LIST_SETTING_FEED, LIST_SETTING_INFO } from "./consts";
import { FeedCountriesModal } from "./FeedCountriesModal";
import { ListFeedTab } from "./ListFeedTab";
import { ListInfoTab } from "./ListInfoTab";
import { IListSettings } from "./modals_creators";
import { IOpportunityListItem } from "./types";
import ListSettings from "./ListSettings";

const Top = styled.div<{ mode: string }>`
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    padding: 0 24px 24px 24px;
    margin: 0;
    box-sizing: border-box;
    box-shadow: ${(props) => (props.mode === "edit" ? "0 1px 0 0 #e5e7ea" : "none")};
`;
const ButtonContainer = styled.div`
    text-transform: uppercase;
`;
const Title = styled.div`
    color: ${colorsPalettes.carbon["500"]};
    font-size: 16px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 480px;
    margin: 24px 0 24px 24px;
`;

const Form = styled.form`
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    height: 100%;
    position: relative;
    margin: 0;

    .DropdownButton {
        background-color: #fff;
        color: rgba(42, 62, 82, 0.8);
    }
`;

const Bottom = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    padding: 16px;
    align-items: center;
`;

export const SettingsTab = styled(Tab)`
    color: ${(props) => (props.selected ? colorsPalettes.blue[400] : colorsPalettes.carbon[500])};
    ${(props) =>
        props.selected &&
        css`
            && {
                opacity: 1;
                box-shadow: 0 3px ${colorsPalettes.blue[400]};
            }
        `}
`;

const SettingsTabsContainer = styled(FlexRow)`
    width: 100%;
    box-sizing: border-box;
    justify-content: flex-start;
`;

const SettingsTopContainer = styled.div<{ isEdit: boolean }>`
    border-bottom: ${(props) => (props.isEdit ? "1px" : 0)} solid #e5e7ea;
`;

export type TSelectedTab = "info" | "feed" | "recommendations" | "analysis";

export interface IListSettingsProps extends IListSettings {
    selectedTab?: TSelectedTab;
    editFeedGeos?: boolean;
    onClose();
    onUpdate(args);
    variant?: "old" | "new";
}

export interface IListSettingsState {
    isOpen: boolean;
    error: boolean;
    editFeedGeos: boolean;
    selectedTab: TSelectedTab;
    listInEdit: IOpportunityListItem;
}

export const emptyListTemplate = (): IOpportunityListItem => ({
    friendlyName: "",
    opportunityListId: "",
    opportunities: [],
    country: 0,
    settings: {
        alerts: {
            banned_domains: [],
            countries: [],
            metrics: [],
        },
    },
    isSubscriptionActive: false,
});

const settingsModalStyle = (mode) => ({
    content: {
        width: "540px",
        height: mode === "create" ? "254px" : "auto",
        padding: "0",
        marginTop: "83px",
    },
});

const countriesModalStyled = {
    content: {
        width: "540px",
        minHeight: "284px",
        display: "flex",
        padding: "0",
        marginTop: "83px",
    },
};

export class ListSettingsModal extends React.Component<IListSettingsProps, IListSettingsState> {
    public static defaultProps = {
        mode: "create",
        selectedTab: LIST_SETTING_INFO,
        editFeedGeos: false,
        list: {},
        variant: "new",
    };
    public state = {
        isOpen: true,
        error: false,
        listInEdit: _.merge({}, emptyListTemplate(), this.props.list),
        selectedTab: this.props.selectedTab,
        editFeedGeos: this.props.editFeedGeos,
    };

    public closeModal = () => {
        allTrackers.trackEvent("pop up/list modal setting", "close", "list from side bar");
        this.setState({
            isOpen: false,
        });
    };

    public onSubmit = (e) => {
        e.preventDefault();
        const { friendlyName } = this.state.listInEdit;
        if (!friendlyName.trim()) {
            return this.setState({
                error: true,
            });
        }
        this.closeModal();
        this.props.onUpdate({ action: "update", list: this.state.listInEdit });
        allTrackers.trackEvent("pop up/list modal setting", "submit-ok", `${friendlyName}`);
    };

    public onDelete = (e) => {
        const { friendlyName } = this.state.listInEdit;
        this.closeModal();
        e.preventDefault();
        this.props.onUpdate({ action: "delete", list: this.state.listInEdit });
        allTrackers.trackEvent("pop up/list modal setting", "click", `delete/${friendlyName}`);
    };

    public componentDidUpdate(prevProps, prevState, prevContext) {
        if (!this.state.isOpen) {
            this.props.onClose();
        }
    }

    public getTexts = () => {
        switch (this.props.mode) {
            case "create":
                return {
                    title: i18nFilter()("workspaces.investors.opportunity-lists.create.title"),
                    namePlaceHolder: i18nFilter()(
                        "workspaces.investors.opportunity-lists.create.placeholder",
                    ),
                    ButtonText: i18nFilter()(
                        "workspaces.investors.opportunity-lists.create.button",
                    ),
                };
            case "edit":
                return {
                    title: i18nFilter()("workspaces.investors.opportunity-lists.edit.title", {
                        listName: `<b>${this.state.listInEdit.friendlyName}</b>`,
                    }),
                    namePlaceHolder: i18nFilter()(
                        "workspaces.investors.opportunity-lists.create.placeholder",
                    ),
                    ButtonText: i18nFilter()("workspaces.investors.opportunity-lists.edit.button"),
                };
        }
    };

    public selectTab = (selectedTab: TSelectedTab) => {
        allTrackers.trackEvent("list model setting", "switch", selectedTab);
        this.setState({ selectedTab });
    };

    public onListNameChanged = (friendlyName) => {
        const { listInEdit } = this.state;
        this.setState({
            listInEdit: {
                ...listInEdit,
                friendlyName,
            },
            error: false,
        });
    };

    public renderFeedGeos = () => {
        return (
            <FeedCountriesModal
                feedCountries={this.state.listInEdit.settings.alerts.countries}
                onCancel={this.onFeedCountriesChangeCancel}
                onSave={this.onFeedCountriesChangeSave}
            />
        );
    };

    public onFeedCountriesChangeSave = (countries) => {
        const { listInEdit } = this.state;
        this.setState({
            editFeedGeos: false,
            listInEdit: {
                ...listInEdit,
                settings: {
                    ...listInEdit.settings,
                    alerts: {
                        ...listInEdit.settings.alerts,
                        countries,
                    },
                },
            },
        });
    };

    public onFeedCountriesChangeCancel = () => {
        this.setState({
            editFeedGeos: false,
        });
    };

    public openFeedCountriesModal = () => {
        allTrackers.trackEvent("list model setting", "open", "country List");
        this.setState({
            editFeedGeos: true,
        });
    };

    public onFeedMetricsChanged = (metrics) => {
        const { listInEdit } = this.state;
        this.setState({
            listInEdit: {
                ...listInEdit,
                settings: {
                    ...listInEdit.settings,
                    alerts: {
                        ...listInEdit.settings.alerts,
                        metrics,
                    },
                },
            },
        });
    };

    public renderSettingSalesBenchmarks = () => {
        const { mode } = this.props;
        const { listInEdit, error } = this.state;
        const { title, ButtonText, namePlaceHolder } = this.getTexts();
        return (
            <Form onSubmit={this.onSubmit}>
                <SettingsTopContainer isEdit={false}>
                    <Title dangerouslySetInnerHTML={{ __html: title }} />
                </SettingsTopContainer>
                <Top mode={mode}>
                    <ListSettings
                        namePlaceHolder={namePlaceHolder}
                        listName={listInEdit.friendlyName}
                        mode={mode}
                        error={error}
                        onDelete={this.onDelete}
                        onListNameChanged={this.onListNameChanged}
                        onFeedMetricsChanged={this.onFeedMetricsChanged}
                        feedSettings={listInEdit.settings.alerts}
                    />
                </Top>
                <Bottom>
                    <ButtonContainer>
                        <Button
                            type="primary"
                            buttonHtmlType="submit"
                            dataAutomation="list-settings-modal-save-button"
                        >
                            {ButtonText}
                        </Button>
                    </ButtonContainer>
                </Bottom>
            </Form>
        );
    };

    public renderSetting = () => {
        const { title, namePlaceHolder, ButtonText } = this.getTexts();
        const { selectedTab, listInEdit, error } = this.state;
        const { mode, unsupportedFeatures } = this.props;
        return (
            <Form onSubmit={this.onSubmit}>
                <SettingsTopContainer isEdit={mode === "edit"}>
                    <Title dangerouslySetInnerHTML={{ __html: title }} />
                    {mode === "edit" && (
                        <SettingsTabsContainer>
                            <SettingsTab
                                selected={selectedTab === LIST_SETTING_INFO}
                                onClick={() => this.selectTab(LIST_SETTING_INFO)}
                            >
                                list info
                            </SettingsTab>
                            {!unsupportedFeatures.has(LIST_SETTING_FEED) && (
                                <SettingsTab
                                    selected={selectedTab === LIST_SETTING_FEED}
                                    onClick={() => this.selectTab(LIST_SETTING_FEED)}
                                >
                                    feed
                                </SettingsTab>
                            )}
                        </SettingsTabsContainer>
                    )}
                </SettingsTopContainer>
                <Top mode={mode}>
                    {selectedTab === LIST_SETTING_INFO && (
                        <ListInfoTab
                            namePlaceHolder={namePlaceHolder}
                            listName={listInEdit.friendlyName}
                            mode={mode}
                            error={error}
                            onDelete={this.onDelete}
                            onListNameChanged={this.onListNameChanged}
                        />
                    )}
                    {selectedTab === LIST_SETTING_FEED && (
                        <ListFeedTab
                            feedSettings={listInEdit.settings.alerts}
                            onEditFeedCountriesClicked={this.openFeedCountriesModal}
                            onFeedMetricsChanged={this.onFeedMetricsChanged}
                        />
                    )}
                </Top>
                <Bottom>
                    <ButtonContainer>
                        <Button
                            type="primary"
                            buttonHtmlType="submit"
                            dataAutomation="list-settings-modal-save-button"
                        >
                            {ButtonText}
                        </Button>
                    </ButtonContainer>
                </Bottom>
            </Form>
        );
    };

    public renderListSettings = () => {
        const { variant } = this.props;

        if (this.state.editFeedGeos) {
            return this.renderFeedGeos();
        }

        return variant === "new" ? this.renderSettingSalesBenchmarks() : this.renderSetting();
    };

    public render() {
        const { editFeedGeos } = this.state;

        return (
            <ProModal
                customStyles={
                    (editFeedGeos
                        ? countriesModalStyled
                        : settingsModalStyle(this.props.mode)) as IProModalCustomStyles
                }
                onCloseClick={this.closeModal}
                isOpen={this.state.isOpen}
                shouldCloseOnOverlayClick={!editFeedGeos}
                showCloseIcon={!editFeedGeos}
            >
                {this.renderListSettings()}
            </ProModal>
        );
    }
}
