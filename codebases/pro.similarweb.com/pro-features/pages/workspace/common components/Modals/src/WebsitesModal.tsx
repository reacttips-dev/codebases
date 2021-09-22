import { Autocomplete } from "@similarweb/ui-components/dist/autocomplete";

import { Button } from "@similarweb/ui-components/dist/button";

import { DotsLoader } from "@similarweb/ui-components/dist/search-input";

import { IDropdownItem } from "@similarweb/ui-components/dist/dropdown";

import { ListItemWebsite } from "@similarweb/ui-components/dist/list-item";

import { AutosizeInput } from "@similarweb/ui-components/dist/autosize-input";
import { IAutoCompleteSiteItem } from "autocomplete";
import * as _ from "lodash";
import { isValidURL } from "pages/workspace/common/workspacesUtils";
import * as React from "react";
import { Component } from "react";
import { IAutoCompleteService } from "../../../../../../app/services/autocomplete.service";
import { IOpportunityCapitalized } from "../../../../../../app/services/workspaces/workspaceApi.types";
import { ProModal } from "../../../../../components/Modals/src/ProModal";
import WithTrack from "../../../../../components/WithTrack/src/WithTrack";
import WithTranslation from "../../../../../components/WithTranslation/src/WithTranslation";
import { PrimaryBoxTitle } from "../../../../../styled components/StyledBoxTitle/src/StyledBoxTitle";
import {
    EditOpportuntiesModalTitle,
    Footer,
    SelectedKeysContainer,
    StyledProTipBanner,
    WebsiteModalContainer,
    WebsiteModalHeaderContainer,
    WebsitesModalAutoComplete,
} from "./StyledComponents";
import { WebsiteListItem } from "./WebsiteListItem";
import { AssetsService } from "services/AssetsService";

export interface IWebsiteItem {
    domain: string;
    icon: string;
}

export interface IStyles {
    content?: object;
    overlay?: object;
}

export interface IWebsitesModal {
    initialKeys?: IOpportunityCapitalized[];
    title?: string;
    placeholder?: string;
    modalPlaceholder?: string;
    isOpen: boolean;
    autoCompleteService: IAutoCompleteService;
    listName?: string;
    activeListId?: string;
    sitesResource: {
        GetWebsitesFaviconsPost<T>(params?, payload?, onResolve?): Promise<T>;
    };
    country?: IDropdownItem;
    onSave: any;
    onCloseClick: (opportunities) => void;
    onCancelClick?: (opportunities) => void;
    errors?: {
        DUPLICATE_KEY: string;
        DUPLICATE_KEYS: string;
        EXCEED_ALLOWED_QUOTAS: string;
        SERVER_ERROR: string;
    };
    styles?: IStyles;
    isSaveDisabled?: boolean;
    onListNameChange?: (listNameProps) => void;
}

const defaultErrors = {
    DUPLICATE_KEY: "workspace.websites.modal.error.duplicate.key",
    DUPLICATE_KEYS: "workspace.websites.modal.error.duplicate.keys",
    SERVER_ERROR: "workspace.websites.modal.error.server",
    EXCEED_ALLOWED_QUOTAS: "workspace.websites.modal.error.exceed.allowed.quotas",
};

const defaultStyle = {
    content: {},
    overlay: {
        zIndex: 1060,
    },
};

const websiteModalDefaultStyle = {
    content: {
        marginTop: "73px",
    },
};

export const getDomain = (url) => {
    const domainRegex = /^(?:https?\:\/\/)?(?:www\.)?([^\/?#\\]+)(?:[\/?#\\]|$)/i;
    const match = url.match(domainRegex);
    return match?.[1]?.toLowerCase();
};

const LIST_ID_OVERVIEW = "overview";

export class WebsitesModal extends Component<IWebsitesModal, any> {
    public static defaultProps = {
        styles: defaultStyle,
        errors: defaultErrors,
        initialKeys: [],
        title: "",
    };

    private track;
    private translate;

    constructor(props) {
        super(props);

        const userClosedProTipBanner = JSON.parse(
            localStorage.getItem("websites.modal.pro_tip_banner_shown"),
        );

        this.state = {
            showProTipBanner: userClosedProTipBanner !== true,
            activeListId: props.listName,
            listName: props.listName,
            errorMsg: null,
            isAutoCompleteLoading: false,
            country: this.props.country,
            selectedKeys: [] as IWebsiteItem[],
            itemsToRender: [],
            isLoading: false,
        };
    }

    public componentDidUpdate(prevProps: Readonly<IWebsitesModal>): void {
        if (this.props.listName !== prevProps.listName) {
            this.setState({ listName: this.props.listName });
            this.setState({ activeListId: this.props.activeListId });
        }

        // Reset listName in state after closing modal
        if (this.props.isOpen !== prevProps.isOpen && !this.props.isOpen) {
            this.setState({ listName: this.props.listName });
        }
    }

    onCloseProTipBanner = () => {
        this.setState({ showProTipBanner: false });
        localStorage.setItem("websites.modal.pro_tip_banner_shown", JSON.stringify(true));
    };

    public render() {
        return (
            <WithTranslation>
                {(translate) => {
                    this.translate = translate;

                    return (
                        <WithTrack>
                            {(track) => {
                                this.track = track;
                                return (
                                    <ProModal
                                        isOpen={this.props.isOpen}
                                        customStyles={_.merge(
                                            {},
                                            websiteModalDefaultStyle,
                                            this.props.styles,
                                        )}
                                        onCloseClick={this.onCloseClick}
                                    >
                                        <div>
                                            <WebsiteModalHeaderContainer>
                                                <PrimaryBoxTitle>
                                                    {this.props.listName !== "" ? (
                                                        this.props.listName
                                                    ) : (
                                                        <AutosizeInput
                                                            maxLength={100}
                                                            value={this.state.listName}
                                                            placeholder={translate(
                                                                this.props.modalPlaceholder,
                                                            )}
                                                            onChange={this.onListNameChange}
                                                            autoFocus={true}
                                                            data-automation-textfield="list-settings-modal-title-text-field"
                                                        />
                                                    )}
                                                </PrimaryBoxTitle>
                                            </WebsiteModalHeaderContainer>
                                            <EditOpportuntiesModalTitle>
                                                {translate(
                                                    "workspace.websitemodal.editopportuntiestitle",
                                                )}
                                            </EditOpportuntiesModalTitle>
                                            <WebsitesModalAutoComplete
                                                isError={!!this.state.errorMsg}
                                            >
                                                <Autocomplete
                                                    isError={!!this.state.errorMsg}
                                                    errorMsg={this.state.errorMsg}
                                                    placeholder={translate(this.props.placeholder)}
                                                    onBlur={() =>
                                                        this.setState({
                                                            itemsToRender: [],
                                                        })
                                                    }
                                                    onPaste={this.onPaste}
                                                    searchIcon={"globe"}
                                                    loadingComponent={<DotsLoader />}
                                                    isLoading={this.state.isAutoCompleteLoading}
                                                    numOfSelectedItems={
                                                        this.state.selectedKeys.length
                                                    }
                                                    maxResults={6}
                                                    resetValueOnSelect={true}
                                                    debounce={400}
                                                    getListItems={this.getData}
                                                    autoFocus={this.props.listName !== ""}
                                                />
                                            </WebsitesModalAutoComplete>
                                            <SelectedKeysContainer
                                                isDropDownOpen={!!this.state.itemsToRender.length}
                                            >
                                                <WebsiteModalContainer>
                                                    {this.renderSelectedKeys()}
                                                </WebsiteModalContainer>
                                            </SelectedKeysContainer>
                                            {this.state.showProTipBanner && (
                                                <StyledProTipBanner
                                                    onCloseClick={this.onCloseProTipBanner}
                                                    title={`${translate(
                                                        "workspace.sales.websites.modal.banner.title",
                                                    )}:`}
                                                    subtitle={translate(
                                                        "workspace.sales.websites.modal.banner.subtitle",
                                                    )}
                                                    iconImagePath={AssetsService.assetUrl(
                                                        "/images/workspace/pro-tip-banner/pro-tip-banner-icon.png",
                                                    )}
                                                    iconImageHeight={64}
                                                    iconImageWidth={64}
                                                />
                                            )}
                                            <Footer>
                                                <Button
                                                    label={translate("global.cancel")}
                                                    onClick={this.onCancelClick}
                                                    dataAutomation="websites-modal-cancel-button"
                                                    type="flat"
                                                />
                                                <Button
                                                    label={translate("global.save")}
                                                    onClick={this.onSave}
                                                    isDisabled={
                                                        this.props.isSaveDisabled ||
                                                        this.state.selectedKeys.length === 0 ||
                                                        this.state.listName.length === 0 ||
                                                        this.state.isLoading
                                                    }
                                                    isLoading={this.state.isLoading}
                                                    dataAutomation="websites-modal-save-button"
                                                    type="primary"
                                                />
                                            </Footer>
                                        </div>
                                    </ProModal>
                                );
                            }}
                        </WithTrack>
                    );
                }}
            </WithTranslation>
        );
    }

    private onPaste = async (event) => {
        this.setState({ isAutoCompleteLoading: true });

        const pastedKeys = event.clipboardData.getData("text");
        const domains = pastedKeys
            .replace(/[\t\r\n]/g, ",")
            .split(",")
            .map((domain) => domain.replace(/\s/g, ""))
            .filter(isValidURL);

        // valid domain is counted as a minimum 4 characters (spaces & web standards removed)
        const domainsWithPossibleDuplicates: string[] = domains
            .map(getDomain)
            .filter((domain) => domain?.length > 3);
        const domainsWithDuplicatesRemoved = Array.from(new Set(domainsWithPossibleDuplicates));

        await this.props.sitesResource.GetWebsitesFaviconsPost(
            {
                domains: domainsWithDuplicatesRemoved.join(),
            },
            (favicons) => {
                this.setState({ isAutoCompleteLoading: false });
                this.onKeySelected(
                    domainsWithPossibleDuplicates.map((domain) => ({
                        domain,
                        icon: favicons[domain],
                    })),
                );
            },
        );
    };

    private renderSelectedKeys() {
        return this.state.selectedKeys.map((key) => {
            return <WebsiteListItem key={key.domain} {...key} onClick={this.onKeyRemove} />;
        });
    }

    private getData = async (query) => {
        if (typeof query === "string" && query !== "") {
            this.setState({ isAutoCompleteLoading: true });
            const autoCompleteItems = await this.props.autoCompleteService.getAutoCompleteSuggestions(
                query,
                "WEBSITE",
            ).promise;
            const itemsToRender = (autoCompleteItems as IAutoCompleteSiteItem[])
                .filter(
                    (autoCompleteItem) =>
                        !this.state.selectedKeys.find((key) => key.name === autoCompleteItem.name),
                )
                .map((item, index) => (
                    <ListItemWebsite
                        img={item.image}
                        key={index}
                        onClick={() =>
                            this.onKeySelected([{ domain: item.name, icon: item.image }])
                        }
                        text={item.name}
                    />
                ));
            this.setState({ isAutoCompleteLoading: false, itemsToRender });
            return itemsToRender;
        } else {
            return [];
        }
    };

    private onKeySelected = (domains) => {
        const existingKeys = this.state.selectedKeys
            .map((key) => ({ ...key, Domain: key.domain }))
            .concat(this.props.initialKeys);
        const keysToAdd = [];
        const keysToAddTrack = [];
        let errorMsg = null;
        let duplicatesNum = 0;

        domains.forEach((domain) => {
            if (
                existingKeys.some((key) => key.Domain === domain.domain) ||
                keysToAdd.some(({ domain: DomainToBeAdded }) => DomainToBeAdded === domain.domain)
            ) {
                duplicatesNum++;
            } else {
                keysToAdd.push(domain);
                keysToAddTrack.push(domain.domain);
            }
        });
        if (duplicatesNum === 1) {
            errorMsg = this.translate(this.props.errors.DUPLICATE_KEY);
        } else if (duplicatesNum > 1) {
            errorMsg = this.translate(this.props.errors.DUPLICATE_KEYS, {
                duplicatesNum: duplicatesNum.toString(),
            });
        }

        if (keysToAddTrack.length > 1) {
            this.track("Websites Modal", "Pasted domains", `${keysToAddTrack.length}`);
        } else {
            this.track("Websites Modal", "Add domain", `${keysToAddTrack[0]}`);
        }

        this.setState({
            errorMsg,
            selectedKeys: this.state.selectedKeys.concat(keysToAdd),
        });
    };

    private onKeyRemove = (name) => {
        const keyIndex = _.findIndex(
            this.state.selectedKeys,
            (key: IWebsiteItem) => key.domain === name,
        );
        const selectedKeys = this.state.selectedKeys
            .slice(0, keyIndex)
            .concat(this.state.selectedKeys.slice(keyIndex + 1)); // remove item from list
        this.track("Websites Modal", "remove domain", name);
        this.setState({ selectedKeys });
    };

    private onCloseClick = () => {
        this.track("Websites Modal", "click", "close");
        this.props.onCloseClick && this.props.onCloseClick(this.props.initialKeys.length);
        this.setState({ listName: this.props.listName });
        this.modalReset();
    };

    private onCancelClick = () => {
        this.track("Websites Modal", "click", "cancel");
        this.props.onCancelClick && this.props.onCancelClick(this.props.initialKeys.length);
        this.setState({ listName: this.props.listName });
        this.modalReset();
    };

    private onSave = async () => {
        this.setState({ isLoading: true });
        const eventName =
            this.state.activeListId === LIST_ID_OVERVIEW ? "Add websites" : "Add existing leads";

        this.track("Websites Modal", "submit-ok", `${eventName}/${this.state.selectedKeys.length}`);
        const listName = this.state.listName;
        const opportunities = this.state.selectedKeys.map((opportunity) => ({
            Domain: opportunity.domain,
        }));
        (await this.props.onSave) && (await this.props.onSave(opportunities, listName));
        this.modalReset();
    };

    private modalReset = () => {
        this.setState({
            errorMsg: null,
            isAutoCompleteLoading: false,
            country: this.props.country,
            selectedKeys: [] as IWebsiteItem[],
            isLoading: false,
        });
    };

    private onListNameChange = (e) => {
        if (typeof this.props.onListNameChange === "function") {
            this.props.onListNameChange(e.target.value);
        }

        this.setState({
            listName: e.target.value,
        });
    };
}
