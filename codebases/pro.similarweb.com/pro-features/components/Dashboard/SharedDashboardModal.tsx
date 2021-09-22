import * as React from "react";
import * as _ from "lodash";
import { ProModal } from "../../../.pro-features/components/Modals/src/ProModal";
import { AutocompleteWithItems } from "@similarweb/ui-components/dist/autocomplete";
import { Button } from "@similarweb/ui-components/dist/button";
import {
    Dropdown,
    SimpleDropdownItem,
    DropdownButton,
} from "@similarweb/ui-components/dist/dropdown";
import { Checkbox } from "@similarweb/ui-components/dist/checkbox";
import { Textarea, ITextareaProps } from "@similarweb/ui-components/dist/textarea";
import { UserChipItem } from "@similarweb/ui-components/dist/chip";
import { ListItemUser } from "@similarweb/ui-components/dist/list-item";
import { ButtonLabel } from "@similarweb/ui-components/dist/button";
import { DotsLoader } from "@similarweb/ui-components/dist/search-input";
import styled from "styled-components";
import I18n from "../WithTranslation/src/I18n";
import TranslationProvider from "../WithTranslation/src/TranslationProvider";
import { mixins } from "@similarweb/styles";
import autobind from "autobind-decorator";
import * as Fuse from "fuse.js";
import { ButtonGroup } from "../ButtonsGroup/src/ButtonsGroup";
import { SharingService } from "sharing/SharingService";
import { SwTrack } from "services/SwTrack";

export enum ShareDashboardType {
    All = "all",
    Specific = "specific",
}

const ShareDashboardTypeI18n = {
    [ShareDashboardType.All]: (isShared) =>
        isShared
            ? "dashboard.shareDashboard.dropdown.shared.with.all"
            : "dashboard.shareDashboard.dropdown.share.with.all",
    [ShareDashboardType.Specific]: (isShared) =>
        isShared
            ? "dashboard.shareDashboard.dropdown.shared.with.specific"
            : "dashboard.shareDashboard.dropdown.share.with.specific",
};

//explicitly setting z-index for component encapsulation
const zIndex = {
    modal: 1100,
    dropdown: 1101,
};
const proModalProps: any = {
    customStyles: {
        content: {
            padding: "24px",
            width: "580px",
        },
        overlay: {
            zIndex: zIndex.modal,
        },
    },
};
export const ProTextarea = styled(Textarea)<ITextareaProps>`
    margin-bottom: 20px;
    textarea {
        box-shadow: none;
        height: 45px;
    }
`;
export const Header = styled.h2`
    ${mixins.setFont({ $size: 16, $weight: 500 })};
    margin: 0 0 24px 0;
    line-height: 19px;
`;
export const ConfirmationFreeText = styled.p`
    ${mixins.setFont({ $size: 14, color: "rgba(42, 62, 82, 0.8)" })};
    line-height: 22px;
    margin-bottom: 30px;
    margin-top: -12px;
`;
export const ShareDashboardModalWrap = styled.div`
    position: relative;
    .DropdownContent-container {
        z-index: ${zIndex.dropdown};
    }
`;
export const ShareDashboardMessage = styled.p`
    padding: 12px;
    background-color: rgba(78, 140, 249, 0.2);
    ${mixins.setFont({ $size: 14, color: "rgba(42, 62, 82, 0.8)" })};
    border-radius: 3px;
`;
export const FreeText = styled.p`
    ${mixins.setFont({ $size: 12 })};
    color: rgba(42, 62, 82, 0.4);
    margin: 7px 0 21px;
    line-height: 18px;
`;
export const CheckboxWrap = styled.div`
    margin: 20px 0;
`;

const AutocompleteWrapper = styled.div`
    max-height: 185px;
    z-index: 1000;
    position: relative;
    margin-top: 11px;
    .autoCompleteContainer {
        padding: 7px 0 10px 0;
    }
`;

interface ISharedDashboardModalServices {
    ShareDashboardService: any;
}

interface ISharedDashboardModalProps {
    onCloseClick: () => void;
    dashboardId: string;
    dashboardTitle: string;
    setDashboardShared: (users?: any[], message?: string) => void;
    setDashboardUnshared: () => void;
    isOpen: boolean;
    isShared: boolean;
    selectedShareDashboardType: ShareDashboardType;
    services: ISharedDashboardModalServices;
    translate: (val: string) => string;
    sharedWithUsers: any;
}

export class SharedDashboardModal extends React.PureComponent<ISharedDashboardModalProps, any> {
    private services: ISharedDashboardModalServices;
    private accountUsers = [];
    private scrollAreaElement: any;

    constructor(props) {
        super(props);
        this.services = this.props.services;
        this.state = this.getInitialState(props);
    }

    private getInitialState = (props) => {
        return {
            sharedType: props.selectedShareDashboardType,
            user_message: "",
            fade: false,
            selectedUsers: props.sharedWithUsers,
            isFocused: false,
            isNotifyChecked: false,
            isModified: false,
            isMessageVisible: false,
            isNotifyDisabled: true,
            notifyI18n: "dashboard.shareDashboard.Shared.notify.label",
            isCtaDisabled: false,
            isConfirmation: false,
            confirmationI18n: "",
            confirmationTitleI18n: "",
            messageI18n: "",
            ctaI18n: props.isShared
                ? "dashboard.shareDashboard.Wizard.doneButton"
                : "dashboard.shareDashboard.Wizard.shareButton",
        };
    };

    public async componentDidUpdate(prevProps) {
        if (this.props !== prevProps) {
            await this.setStateAsync(this.getInitialState(this.props));
            await this.applyStateChanges();
        }
    }

    private onNotifyClick = async () => {
        SwTrack.all.trackEvent(
            "share dashboard",
            "click",
            `Notify users/${!this.state.isNotifyChecked}`,
        );
        await this.setStateAsync({ isNotifyChecked: !this.state.isNotifyChecked });
    };
    onTextAreaChange = (user_message) => {
        this.setState({ user_message });
    };
    getChips = () => {
        return this.state.selectedUsers.map((user) => {
            return (
                <UserChipItem
                    text={`${user.FirstName} ${user.LastName}`}
                    onCloseItem={this.onChipItemClick(user.Id)}
                ></UserChipItem>
            );
        });
    };

    getUsersAutoCompleteItems = async (query) => {
        await this.getUsersAutoCompleteRequest();
        const options = {
            keys: ["FirstName", "LastName", "Email"],
        };
        let users = this.accountUsers;
        if (query) {
            const fuse: any = new Fuse(this.accountUsers, options);
            users = fuse.search(query);
        }
        return users
            .filter(
                (user) =>
                    !this.state.selectedUsers.find((selectedUser) => selectedUser.Id === user.Id),
            )
            .slice(0, 5)
            .map((user) => {
                return (
                    <ListItemUser
                        key={user.Id.toString()}
                        email={user.Email}
                        name={`${user.FirstName} ${user.LastName}`}
                        onClick={this.addUser(user)}
                    >
                        {user.Email}
                    </ListItemUser>
                );
            });
    };
    getUsersAutoCompleteRequest = async () => {
        if (this.accountUsers.length == 0) {
            const { users } = await SharingService.getAccountUsers();
            this.accountUsers = users.sort((a, b) => (a.LastName > b.LastName ? 1 : -1));
            return this.accountUsers;
        } else {
            return Promise.resolve(this.accountUsers);
        }
    };
    private setStateAsync = (newState) => {
        return new Promise<void>((resolve, reject) => {
            this.setState(newState, resolve);
        });
    };

    onCloseClick = (name: string) => async () => {
        SwTrack.all.trackEvent("share dashboard", "click", `close by ${name}`);
        if (name === "cancel" && this.state.isModified) {
            await this.revertChanges();
            await this.setStateAsync({ isModified: false });
        } else {
            this.props.onCloseClick();
        }
    };

    private onChangeShareType = async (item) => {
        SwTrack.all.trackEvent("share dashboard", "change", `Share with ${item.id}`);
        await this.setStateAsync({ sharedType: item.id });
        await this.applyStateChanges();
    };
    onChipItemClick = (id) => async () => {
        const initialScrollContainerHeight = this.scrollAreaElement.computeSizes().containerHeight;
        const users = this.state.selectedUsers.slice(0);
        const index = _.findIndex(users, { Id: id });
        if (index !== -1) {
            SwTrack.all.trackEvent("share dashboard", "click", `User remove/${id}`);
            users.splice(index, 1);
            await this.setStateAsync({
                selectedUsers: users,
            });
        }
        await this.applyStateChanges();
        setTimeout(() => {
            const newScrollContainerHeight = this.scrollAreaElement.computeSizes().containerHeight;
            const newScrollRealHeight = this.scrollAreaElement.computeSizes().realHeight;
            if (
                newScrollRealHeight > newScrollContainerHeight &&
                newScrollContainerHeight != initialScrollContainerHeight
            ) {
                this.scrollAreaElement.scrollTop();
                this.scrollAreaElement.scrollBottom();
                this.scrollAreaElement.handleWindowResize();
            }
        });
    };
    addUser = (user) => async () => {
        const scrollHeight = this.scrollAreaElement && this.scrollAreaElement.content.offsetHeight;
        SwTrack.all.trackEvent("share dashboard", "click", `User select/${user.Id}`);
        await this.setStateAsync({
            selectedUsers: [...this.state.selectedUsers, user],
        });
        await this.applyStateChanges();
        this.scrollAreaElement.scrollBottom();
    };

    private async applyStateChanges() {
        const isModified = this.isStateModified();
        //Handle isNotifyDisabled
        let isNotifyDisabled = true;
        if (
            this.state.sharedType === ShareDashboardType.Specific &&
            this.state.selectedUsers.length > 0 &&
            this.isNewUsersAdded() &&
            this.isUsersModified() &&
            !this.isUsersRemoved()
        )
            isNotifyDisabled = false;
        if (
            this.state.sharedType === ShareDashboardType.All &&
            (!this.props.isShared ||
                this.props.selectedShareDashboardType === ShareDashboardType.Specific)
        )
            isNotifyDisabled = false;
        let { notifyI18n } = this.getInitialState(this.props);
        if (this.isNewUsersAdded())
            notifyI18n = "dashboard.shareDashboard.Shared.notify.new.users.label";
        let isNotifyChecked = this.state.isNotifyChecked;
        if (this.state.isNotifyDisabled === false && isNotifyDisabled) {
            isNotifyChecked = false;
        }
        //Handle isNotifyDisabled - end

        //Handle isCtaDisabled
        let isCtaDisabled = false;
        if (
            this.props.selectedShareDashboardType !== ShareDashboardType.Specific &&
            this.state.sharedType === ShareDashboardType.Specific &&
            this.state.selectedUsers.length === 0
        )
            isCtaDisabled = true;
        //Handle isCtaDisabled - end

        //Handle message and cta
        let { isMessageVisible, messageI18n } = this.state;
        let { ctaI18n } = this.getInitialState(this.props);
        const saveButtonKey = "dashboard.shareDashboard.Wizard.saveButton";
        if (isModified && this.props.isShared) ctaI18n = saveButtonKey;
        if (
            this.props.isShared &&
            this.state.sharedType === ShareDashboardType.Specific &&
            this.isUsersRemoved() &&
            this.props.selectedShareDashboardType === ShareDashboardType.Specific
        ) {
            isMessageVisible = true;
            messageI18n = "dashboard.shareDashboard.message.save";
            ctaI18n = saveButtonKey;
        }
        if (
            this.props.isShared &&
            this.state.sharedType === ShareDashboardType.Specific &&
            this.props.selectedShareDashboardType === ShareDashboardType.Specific &&
            this.state.selectedUsers.length === 0
        ) {
            isMessageVisible = true;
            messageI18n = "dashboard.shareDashboard.message.revoke";
            ctaI18n = "dashboard.shareDashboard.Shared.revokeButton";
        }
        //Handle message - end
        await this.setStateAsync({
            isModified,
            isNotifyDisabled,
            isCtaDisabled,
            isMessageVisible,
            messageI18n,
            ctaI18n,
            notifyI18n,
            isNotifyChecked,
        });
    }

    private isUsersModified() {
        return (
            this.state.selectedUsers.map((user) => user.Id).join() !==
            this.props.sharedWithUsers.map((user) => user.Id).join()
        );
    }

    private isNewUsersAdded() {
        const initialUserIds = this.props.sharedWithUsers.map((user) => user.Id);
        return (
            this.state.selectedUsers.map((user) => initialUserIds.indexOf(user.Id) === -1).length >
            0
        );
    }

    private isUsersRemoved() {
        const initialUserIds = this.props.sharedWithUsers.map((user) => user.Id);
        return (
            this.state.selectedUsers.filter((user) => initialUserIds.indexOf(user.Id) === -1)
                .length === 0 && this.state.selectedUsers.length < initialUserIds.length
        );
    }

    private isStateModified() {
        return (
            this.state.sharedType !== this.props.selectedShareDashboardType ||
            this.isUsersModified()
        );
    }

    private async revertChanges() {
        const { ctaI18n } = this.getInitialState(this.props);
        await this.setStateAsync({
            sharedType: this.props.selectedShareDashboardType,
            selectedUsers: this.props.sharedWithUsers,
            isMessageVisible: false,
            ctaI18n,
        });
        await this.applyStateChanges();
    }

    private save = async () => {
        if (!this.props.isShared || (this.props.isShared && this.state.isModified)) {
            if (
                this.state.selectedUsers.length === 0 &&
                this.state.sharedType === ShareDashboardType.Specific
            ) {
                this.confirm(ShareDashboardType.Specific)();
            } else {
                const users =
                    this.state.sharedType === ShareDashboardType.Specific
                        ? this.state.selectedUsers
                        : [];
                this.props.setDashboardShared(users, this.state.user_message);
            }
        } else {
            this.onCloseClick("done")();
        }
        //reset components
        await this.setStateAsync({
            isModified: false,
            isNotifyChecked: false,
            isMessageVisible: false,
        });
    };

    private confirm = (confirmFrom) => async () => {
        const confirmationI18n =
            confirmFrom === ShareDashboardType.All
                ? "dashboard.shareDashboard.confirmation.message.all"
                : "dashboard.shareDashboard.confirmation.message.specific";
        const confirmationTitleI18n =
            confirmFrom === ShareDashboardType.All
                ? "dashboard.shareDashboard.confirmation.title.all"
                : "dashboard.shareDashboard.confirmation.title.specific";
        await this.setStateAsync({ isConfirmation: true, confirmationI18n, confirmationTitleI18n });
    };

    private onConfirmationCancel = async () => {
        await this.setStateAsync({ isConfirmation: false });
    };

    @autobind
    private setScrollAreaRef(ref) {
        this.scrollAreaElement = ref;
    }

    public render() {
        const { isOpen, selectedShareDashboardType, isShared, translate } = this.props;
        const { sharedType, notifyI18n } = this.state;
        return (
            <TranslationProvider translate={this.props.translate}>
                <ProModal isOpen={isOpen} onCloseClick={this.onCloseClick("x")} {...proModalProps}>
                    {this.state.isConfirmation ? (
                        <ShareDashboardModalWrap className="ShareDashboardModalWrap">
                            <Header>
                                <I18n>{this.state.confirmationTitleI18n}</I18n>
                            </Header>
                            <ConfirmationFreeText>
                                <I18n>{this.state.confirmationI18n}</I18n>
                            </ConfirmationFreeText>
                            <ButtonGroup>
                                <Button
                                    type="flat"
                                    className="first"
                                    onClick={this.onConfirmationCancel}
                                >
                                    <ButtonLabel>
                                        <I18n>dashboard.shareDashboard.Wizard.cancelButton</I18n>
                                    </ButtonLabel>
                                </Button>
                                <Button
                                    type="primary"
                                    onClick={this.props.setDashboardUnshared}
                                    isDisabled={this.state.isCtaDisabled}
                                >
                                    <ButtonLabel>
                                        <I18n>dashboard.shareDashboard.Shared.revokeButton</I18n>
                                    </ButtonLabel>
                                </Button>
                            </ButtonGroup>
                        </ShareDashboardModalWrap>
                    ) : (
                        <ShareDashboardModalWrap className="ShareDashboardModalWrap">
                            <Header>
                                <I18n>dashboard.shareDashboard.Wizard.Header</I18n>
                            </Header>
                            <Dropdown
                                appendTo=".ShareDashboardModalWrap"
                                selectedIds={{ [sharedType]: true }}
                                dropdownPopupPlacement="ontop-left"
                                onClick={this.onChangeShareType}
                            >
                                <DropdownButton>
                                    {translate(
                                        ShareDashboardTypeI18n[sharedType](
                                            sharedType === selectedShareDashboardType && isShared,
                                        ),
                                    )}
                                </DropdownButton>
                                <SimpleDropdownItem id={ShareDashboardType.All}>
                                    {translate(
                                        ShareDashboardTypeI18n[ShareDashboardType.All](
                                            selectedShareDashboardType === ShareDashboardType.All &&
                                                isShared,
                                        ),
                                    )}
                                </SimpleDropdownItem>
                                <SimpleDropdownItem id={ShareDashboardType.Specific}>
                                    {translate(
                                        ShareDashboardTypeI18n[ShareDashboardType.Specific](
                                            selectedShareDashboardType ===
                                                ShareDashboardType.Specific && isShared,
                                        ),
                                    )}
                                </SimpleDropdownItem>
                            </Dropdown>
                            <FreeText>
                                <I18n>
                                    {isShared
                                        ? sharedType === ShareDashboardType.All
                                            ? "dashboard.shareDashboard.freeText.shared"
                                            : "dashboard.shareDashboard.freeText.specific.shared"
                                        : sharedType === ShareDashboardType.All
                                        ? "dashboard.shareDashboard.freeText"
                                        : "dashboard.shareDashboard.freeText.specific"}
                                </I18n>
                            </FreeText>
                            {sharedType === ShareDashboardType.Specific && (
                                <AutocompleteWrapper>
                                    <AutocompleteWithItems
                                        selectedItems={this.getChips()}
                                        getListItems={this.getUsersAutoCompleteItems}
                                        placeholder={translate(
                                            "dashboard.shareDashboard.withspecific.placeholder",
                                        )}
                                        loadingComponent={<DotsLoader />}
                                        searchIcon="add"
                                        isFocused={this.state.isFocused}
                                        debounce={400}
                                        onFocus={() => {
                                            this.setState({ isFocused: true });
                                        }}
                                        onBlur={() => {
                                            this.setState({ isFocused: false });
                                        }}
                                        scrollAreaRef={this.setScrollAreaRef}
                                    />
                                </AutocompleteWrapper>
                            )}
                            <CheckboxWrap>
                                <Checkbox
                                    isDisabled={this.state.isNotifyDisabled}
                                    label={translate(notifyI18n)}
                                    onClick={this.onNotifyClick}
                                    selected={this.state.isNotifyChecked}
                                />
                            </CheckboxWrap>
                            {this.state.isNotifyChecked && (
                                <ProTextarea
                                    showCounter={false}
                                    onChange={this.onTextAreaChange}
                                    placeholder={translate(
                                        "dashboard.shareDashboard.Wizard.placeholder",
                                    )}
                                />
                            )}
                            {this.state.isMessageVisible && (
                                <ShareDashboardMessage>
                                    {translate(this.state.messageI18n)}
                                </ShareDashboardMessage>
                            )}
                            <ButtonGroup>
                                {isShared &&
                                !this.state.isModified &&
                                sharedType === ShareDashboardType.All ? (
                                    <Button
                                        type="flatWarning"
                                        className="first"
                                        onClick={this.confirm(ShareDashboardType.All)}
                                    >
                                        <ButtonLabel>
                                            <I18n>
                                                dashboard.shareDashboard.Shared.revokeButton
                                            </I18n>
                                        </ButtonLabel>
                                    </Button>
                                ) : (
                                    <Button
                                        type="flat"
                                        className="first"
                                        onClick={this.onCloseClick("cancel")}
                                    >
                                        <ButtonLabel>
                                            <I18n>
                                                dashboard.shareDashboard.Wizard.cancelButton
                                            </I18n>
                                        </ButtonLabel>
                                    </Button>
                                )}
                                <Button
                                    type="primary"
                                    onClick={this.save}
                                    isDisabled={this.state.isCtaDisabled}
                                >
                                    <ButtonLabel>
                                        <I18n>{this.state.ctaI18n}</I18n>
                                    </ButtonLabel>
                                </Button>
                            </ButtonGroup>
                        </ShareDashboardModalWrap>
                    )}
                </ProModal>
            </TranslationProvider>
        );
    }
}
