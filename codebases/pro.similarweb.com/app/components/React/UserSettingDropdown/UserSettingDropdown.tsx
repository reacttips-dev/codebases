import { SWReactIcons } from "@similarweb/icons";
import { colorsPalettes } from "@similarweb/styles";
import { $warning } from "@similarweb/styles/src/style-guide-colors";
import { Dropdown } from "@similarweb/ui-components/dist/dropdown";
import { IconSidebarItem } from "@similarweb/ui-components/dist/icon-sidebar";
import { PopupClickContainer } from "@similarweb/ui-components/dist/popup-click-container";
import autobind from "autobind-decorator";
import { swSettings } from "common/services/swSettings";
import { SidebarDropDownItem, SidebarDropDownLink } from "components/SideBar/StyledComponents";
import { i18nFilter } from "filters/ngFilters";
import capitalize from "lodash/capitalize";
import { PureComponent } from "react";
import * as React from "react";
import { connect } from "react-redux";
import { TrackWithGuidService } from "services/track/TrackWithGuidService";
import TrialService from "services/TrialService";
import styled from "styled-components";
import { Injector } from "../../../../scripts/common/ioc/Injector";
import UserDataWorker, { IUserDataWorker } from "../../../../single-spa/UserDataWorker";
import { I18nService } from "../../../@types/I18nInterfaces";
import { endImpersonationTooltip } from "../../../actions/impersonateActions";
import I18n from "../Filters/I18n";
import Pill from "../Pill/Pill";
import ImpersonateAuthModal from "../ImpersonateAuth/ImpersonateAuthModal";
import ImpersonateAuthCtrl from "../ImpersonateAuth/ImpersonateAuthCtrl";
import "./UserSettingsDropdown.scss";
import { PlainTooltip } from "@similarweb/ui-components/dist/plain-tooltip";
import { ProModal } from "components/Modals/src/ProModal";
import { ImpersonatePopupReact } from "components/impersonate-popup/ImpersonatePopupReact";
import { LeadLabel } from "pages/lead-generator/lead-generator-exist/components/styles";
import { LegendsLineLoaders } from "pages/website-analysis/audience-overlap/StyledComponents";
import { toggleDevTools } from "services/dev-toggle/devToggle";

declare const SW_ENV: { debug: boolean };
export interface IUserManagementItemProps {
    id: string;
    customComponent: any;
    linkProps: any;
}

const ImpersonateModeButton = styled(SWReactIcons).attrs({
    iconName: "impersonate",
})`
    display: inline-block;
    width: 30px;
    height: 18px;
    cursor: pointer;
    position: relative;
    top: 4px;
`;

export const Button = styled(SWReactIcons).attrs({
    iconName: "usermenu",
})`
    display: inline-block;
    width: 36px;
    height: 36px;
    cursor: pointer;
    position: relative;
    transition: all ease 300ms;
    &:hover {
        path {
            fill: #ffffff;
        }
    }
`;

const InternalPill = styled(Pill)`
    background-color: ${colorsPalettes.blue[400]};
    margin-left: 8px;
`;

export const UserSettingsDropDownItem = styled(SidebarDropDownItem)``;
UserSettingsDropDownItem.displayName = "UserSettingsDropDownItem";

export const UserSettingsDropDownLink = styled(SidebarDropDownLink)``;
UserSettingsDropDownLink.displayName = "UserSettingsDropDownLink";

const UserSettingsDropDownLinkWithPill = styled(UserSettingsDropDownLink)`
    display: flex;
    align-items: center;
`;
UserSettingsDropDownLinkWithPill.displayName = "UserSettingsDropDownLinkWithPill";

const UserSettingsDropDownItemWarning = styled(UserSettingsDropDownItem)`
    color: ${$warning};
    height: auto;
    line-height: inherit;
    cursor: initial;
    &:hover {
        background-color: transparent;
    }
`;
UserSettingsDropDownItemWarning.displayName = "UserSettingsDropDownItemWarning";

export const UserSettingsDropDownItemWarningTrimmed: any = styled(UserSettingsDropDownItemWarning)`
    & > span {
        text-overflow: ellipsis;
        overflow: hidden;
    }
`;
UserSettingsDropDownItemWarningTrimmed.displayName = "UserSettingsDropDownItemWarningTrimmed";

const ImpersonateModeTooltip = styled.div``;
ImpersonateModeTooltip.displayName = "ImpersonateModeTooltip";

const PackageNameLabel = styled.div`
    font-size: 12px;
    color: rgba(42, 62, 82, 0.6);
`;

const ImpersonateModeTooltipTitle = styled.div`
    color: ${$warning};
    font-size: 16px;
    font-weight: 500;
    margin-bottom: 4px;
`;
ImpersonateModeTooltipTitle.displayName = "ImpersonateModeTooltipTitle";

const ImpersonateModeTooltipText = styled.div`
    color: rgba(42, 62, 82, 0.8);
    font-size: 14px;
    line-height: 24px;
`;
ImpersonateModeTooltipText.displayName = "ImpersonateModeTooltipText";

export const logout = (worker: IUserDataWorker, loginUrl: string): void => {
    worker.clearCache(() => {
        window.location.href = `${loginUrl}/logout`;
    });
};

class UserSettingDropdown extends PureComponent<any, any> {
    private ref;
    private swSettings = swSettings;
    private loginUrl = this.swSettings.swsites.login;
    private impersonationOrigin: string = this.swSettings.components.Home.resources.ImpersonationOrigin.toString();
    private backToLink =
        `${this.swSettings.swsites.pro}/useridentity/switchidentity?` +
        `name=${encodeURIComponent(this.impersonationOrigin)}&` +
        `redirectTo=${encodeURIComponent(location.href)}`;
    private accountDetailsUrl = `${this.swSettings.swsites.login}/#/details`;
    private subscriptionDetailsUrl = `${this.swSettings.swsites.login}/#/subscription`;
    private supportUrl = `${this.swSettings.swsites.pro}/#/sspa/support`;
    private limitToFilter = Injector.get<any>("limitToFilter");
    private username = this.swSettings.user.username;
    private plan = this.swSettings.user.plan;
    private canImpersonate = this.swSettings.components.Home.resources.CanImpersonate;
    private canPurchaseNoTouch = this.swSettings.components.Home.resources.CanPurchaseNoTouch;
    private claimsOverwritten = this.swSettings.components.Home.resources.ClaimsOverwritten;
    private canViewSubscriptionClaimsPage = this.swSettings.components.Home.resources
        .CanViewSubscriptionClaims;
    private productsOverwritten = this.swSettings.components.Home.resources.ProductsOverwritten;
    private productsOverwrittenName = this.swSettings.components.Home.resources
        .ProductsOverwrittenName;
    private canViewSubscriptionProductsPage = this.swSettings.components.Home.resources
        .CanViewSubscriptionProducts;
    private resetClaims = `${
        this.swSettings.swsites.login
    }/api/claims/reset-overrides?redirectTo=${encodeURIComponent(location.href)}`;
    private workspace: string = new TrialService().getWorkspaceName();
    private worker = new UserDataWorker();

    constructor(props, context) {
        super(props, context);

        this.state = {
            showImpersonateTooltip: this.props.impersonateTooltip,
            showImpersonateAuth: false,
            isOpen: false,
        };
    }

    public componentDidMount(): void {
        if (this.state.showImpersonateTooltip) {
            setTimeout(() => {
                this.closeImpersonationTooltip();
            }, 10 * 1000);
        }
    }

    public componentDidUpdate(): void {
        if (this.state.showImpersonateTooltip && !this.props.impersonateTooltip) {
            if (this.ref && typeof this.ref.closePopup === "function") {
                this.ref.closePopup();
                this.setState({
                    showImpersonateTooltip: false,
                });
            }
        }
    }

    public render(): JSX.Element {
        if (this.state.showImpersonateTooltip) {
            return this.renderTooltip();
        } else {
            return this.renderDropDown();
        }
    }

    @autobind
    public getImpersonateModeTooltip(): JSX.Element {
        return (
            <ImpersonateModeTooltip onClick={this.closeImpersonationTooltip}>
                <ImpersonateModeTooltipTitle>
                    <I18n>usersettingsdropdown.tooltip.title</I18n>
                </ImpersonateModeTooltipTitle>
                <ImpersonateModeTooltipText>
                    <I18n>usersettingsdropdown.warning</I18n>
                </ImpersonateModeTooltipText>
                <ImpersonateModeTooltipText>
                    <I18n dataObj={{ user: this.username }}>usersettingsdropdown.currently</I18n>
                </ImpersonateModeTooltipText>
                <ImpersonateModeTooltipText>
                    <I18n dataObj={{ plan: this.plan }}>usersettingsdropdown.plan</I18n>
                </ImpersonateModeTooltipText>
            </ImpersonateModeTooltip>
        );
    }

    @autobind
    public getImpersonateDropdownContent(): JSX.Element {
        return null;
    }

    @autobind
    public setRef(ref): void {
        this.ref = ref;
    }

    @autobind
    private openImpersonatePopUp(): void {
        this.setState({ showImpersonateAuth: true });

        ImpersonateAuthCtrl.shouldAuthenticate()
            .then((res) => {
                if (!res) {
                    this.setState({ showImpersonateAuth: false });
                    this.onImpersonateVerification();
                }
            })
            .catch((err) => console.log(err));
    }

    @autobind
    private onImpersonateVerification(): void {
        this.setState({ showImpersonateAuth: false, showImpersonateModal: true });
    }

    @autobind
    private onImpersonateClose() {
        this.setState({ showImpersonateAuth: false });
    }

    private renderTooltip(): JSX.Element {
        const popupConfig = {
            placement: "bottom",
            cssClass:
                "Popup-element-wrapper-triangle deleteConfirmation--tooltip impersonateModeDropDown",
            cssClassContent: "Popup-content impersonateModeDropDown-content",
            width: 297,
            defaultOpen: true,
            onToggle: (isOpen: boolean, isOutsideClick: boolean, evt?: any): void => {
                if (!isOpen) {
                    this.closeImpersonationTooltip();
                }
            },
        };
        return (
            <PopupClickContainer
                content={this.getImpersonateModeTooltip}
                config={popupConfig}
                ref={this.setRef}
            >
                <div style={{ display: "inline-flex" }}>
                    <ImpersonateModeButton />
                </div>
            </PopupClickContainer>
        );
    }

    private renderDropDown(): JSX.Element {
        const dropdownClasses =
            `DropdownContent-container UserSettingsDropDownContent-container` +
            `${
                this.props.impersonateMode
                    ? `UserSettingsDropDownContent-container-impersonate`
                    : ``
            }`;
        return (
            <div>
                <Dropdown
                    width={270}
                    dropdownPopupHeight={400}
                    buttonWidth={"auto"}
                    appendTo={"body"}
                    onClick={this.onClick}
                    onToggle={this.onToggle}
                    dropdownPopupPlacement="right"
                    cssClassContainer={dropdownClasses}
                >
                    {[
                        <IconSidebarItem
                            key={"user-setting-dropdown-button"}
                            icon={this.props.impersonateMode ? "impersonate" : "settings"}
                            title={i18nFilter()("usersettingsdropdown.settings")}
                            onItemClick={() => {
                                this.trackClick("Toggle User Settings Dropdown");
                                this.props.onClick();
                            }}
                        />,
                        ...this.getDropDownContent(),
                    ]}
                </Dropdown>
                {this.state.showImpersonateAuth ? (
                    <ImpersonateAuthModal
                        onVerify={this.onImpersonateVerification}
                        onClose={this.onImpersonateClose}
                    />
                ) : null}
                {this.state.showImpersonateModal && (
                    <ProModal
                        isOpen={true}
                        shouldCloseOnOverlayClick={true}
                        onCloseClick={() => {
                            this.setState({ showImpersonateModal: false });
                        }}
                        className="modal sw-user-modal sw-user-modal-impersonate"
                        customStyles={{
                            content: {
                                top: "70px",
                                marginTop: "0",
                                width: "650px",
                            },
                        }}
                    >
                        <ImpersonatePopupReact />
                    </ProModal>
                )}
            </div>
        );
    }

    // private getDropDownButton() {
    //     if (this.productsOverwritten) {
    //         return <DemoPill text={"DEMO"}/>;
    //     } else if (this.props.impersonateMode) {
    //         return <ImpersonateModeButton key="btn"/>;
    //     } else if (this.claimsOverwritten) {
    //         return <ChangedClaimsButton/>;
    //     } else {
    //         const button = <div>
    //             <Button key="btn"/>
    //             {this.canPurchaseNoTouch && <NotificationDot/>}
    //         </div>;
    //         if (!this.state.isOpen) {
    //             return <PlainTooltip key="btn" tooltipContent={this.i18nFilter("topbar.icons.tooltip.usersettings")}
    //                                  placement={"bottom-right"}>
    //                 {button}
    //             </PlainTooltip>;
    //         } else {
    //             return button;
    //         }
    //     }
    // }

    @autobind
    private onClick(item): void {
        if (item.id === "impersonate") {
            this.openImpersonatePopUp();
        }
        if (item.onClick) {
            item.onClick();
        }
        this.props.onChildClick();
    }

    @autobind
    private onToggle(isOpen, isOutsideClick, e): void {
        this.setState({ isOpen });
        this.props.onToggle(isOpen, isOutsideClick, e);
    }

    @autobind
    private logoutClick(): void {
        this.trackClick("Logout");
        logout(this.worker, this.loginUrl);
    }

    @autobind
    private backTo(): void {
        this.worker.clearCache(() => {
            window.location.href = this.backToLink;
        });
    }

    @autobind
    private toggleDevTools(): void {
        toggleDevTools();
        window.location.reload();
    }

    @autobind
    private getDropDownContent(): JSX.Element[] {
        let items = [
            <UserSettingsDropDownItem key="ddItem1">
                <UserSettingsDropDownLink
                    preventDefault={true}
                    href={
                        this.canPurchaseNoTouch
                            ? `${this.subscriptionDetailsUrl}?returnToProUrl=${encodeURIComponent(
                                  location.href,
                              )}`
                            : `${this.accountDetailsUrl}?returnToProUrl=${encodeURIComponent(
                                  location.href,
                              )}`
                    }
                >
                    <I18n>Usermanagement.Account.Title</I18n>
                    {this.canPurchaseNoTouch && (
                        <PackageNameLabel>
                            <I18n>{`Usermanagement.Account.NoTouchPackage.${capitalize(
                                this.workspace,
                            )}`}</I18n>
                        </PackageNameLabel>
                    )}
                </UserSettingsDropDownLink>
            </UserSettingsDropDownItem>,
            <UserSettingsDropDownItem key="ddItem2">
                <UserSettingsDropDownLink preventDefault={true} onClick={this.logoutClick}>
                    <I18n>shared.branding.signout</I18n>
                </UserSettingsDropDownLink>
            </UserSettingsDropDownItem>,
        ];

        if (this.props.impersonateMode) {
            items.unshift(
                <UserSettingsDropDownItemWarning key="warning">
                    <I18n>usersettingsdropdown.warning</I18n>
                </UserSettingsDropDownItemWarning>,
                <UserSettingsDropDownItemWarning key="user-name">
                    <I18n dataObj={{ user: this.username }}>usersettingsdropdown.currently</I18n>
                </UserSettingsDropDownItemWarning>,
                <UserSettingsDropDownItemWarning key="plan" style={{ marginBottom: 4 }}>
                    <I18n dataObj={{ plan: this.plan }}>usersettingsdropdown.plan</I18n>
                </UserSettingsDropDownItemWarning>,
                <UserSettingsDropDownItem key={1}>
                    <UserSettingsDropDownLink preventDefault={true} onClick={this.backTo}>
                        Back to {this.limitToFilter(this.impersonationOrigin, 15)}
                    </UserSettingsDropDownLink>
                </UserSettingsDropDownItem>,
                <UserSettingsDropDownItem key={2} id="impersonate">
                    <I18n>usersettingsdropdown.impersonatedifferentuser</I18n>
                    <InternalPill text={i18nFilter()("Usermanagement.Internal.Title")} />
                </UserSettingsDropDownItem>,
                this.getSupportMenuItem(),
            );
        } else if (this.canImpersonate) {
            items.unshift(
                <UserSettingsDropDownItem key={0} id="impersonate">
                    <I18n>Usermanagement.Impersonate.Title</I18n>
                    <InternalPill text={i18nFilter()("Usermanagement.Internal.Title")} />
                </UserSettingsDropDownItem>,
                this.getSupportMenuItem(),
            );
        }

        if (SW_ENV.debug) {
            items.unshift(
                <UserSettingsDropDownItem key="devtoggle" id="devtoggle">
                    <UserSettingsDropDownLink preventDefault={true} onClick={this.toggleDevTools}>
                        toggle dev tools
                    </UserSettingsDropDownLink>
                    <InternalPill text="dev only" />
                </UserSettingsDropDownItem>,
            );
        }

        if (this.claimsOverwritten || this.productsOverwritten) {
            const claimsItems = [
                <UserSettingsDropDownItemWarning key="claimsoverwritten">
                    <I18n>usersettingsdropdown.claimsoverwritten.warning</I18n>
                </UserSettingsDropDownItemWarning>,
            ];
            if (this.productsOverwritten && this.productsOverwrittenName) {
                claimsItems.push(
                    <PlainTooltip
                        cssClass={"plainTooltip-element PlainTooltip--tableCell"}
                        placement={"top"}
                        tooltipContent={this.productsOverwrittenName}
                        enabled={this.productsOverwrittenName != ""}
                    >
                        <UserSettingsDropDownItemWarningTrimmed key="claimsoverwritten2">
                            <I18n dataObj={{ package: this.productsOverwrittenName }}>
                                Usermanagement.UserDetails.Profile.PackageName
                            </I18n>
                        </UserSettingsDropDownItemWarningTrimmed>
                    </PlainTooltip>,
                );
            } else {
                claimsItems.push(
                    <UserSettingsDropDownItemWarning key="claimsoverwritten2">
                        <I18n>usersettingsdropdown.claimsoverwritten.warning2</I18n>
                    </UserSettingsDropDownItemWarning>,
                );
            }
            if (this.claimsOverwritten && this.canViewSubscriptionClaimsPage) {
                claimsItems.push(
                    <UserSettingsDropDownItem>
                        <UserSettingsDropDownLink
                            key="subscription_manipulation"
                            preventDefault={true}
                            href={`${this.swSettings.swsites.login}/#/subscription-claims`}
                            onClick={() => this.trackClick("Subscription Manipulation")}
                        >
                            <I18n>usersettingsdropdown.subscription.manipulation</I18n>
                        </UserSettingsDropDownLink>
                    </UserSettingsDropDownItem>,
                );
            }
            if (this.productsOverwritten && this.canViewSubscriptionProductsPage) {
                claimsItems.push(
                    <UserSettingsDropDownItem>
                        <UserSettingsDropDownLink
                            key="package_demo_tool"
                            preventDefault={true}
                            href={`${this.swSettings.swsites.login}/#/subscription-products`}
                            onClick={() => this.trackClick("Package Demo Tool")}
                        >
                            <I18n>usersettingsdropdown.subscription.demotool</I18n>
                        </UserSettingsDropDownLink>
                    </UserSettingsDropDownItem>,
                );
            }
            claimsItems.push(
                <UserSettingsDropDownItem>
                    <UserSettingsDropDownLink
                        key="reset_claims"
                        preventDefault={true}
                        href={this.resetClaims}
                        onClick={() => this.trackClick("reset to my default subscription")}
                    >
                        <I18n>usersettingsdropdown.reset.claims</I18n>
                    </UserSettingsDropDownLink>
                </UserSettingsDropDownItem>,
            );
            items.unshift(...claimsItems);
        }

        if (this.props.userManagementLinksContainer?.length > 0) {
            items = this.props.userManagementLinksContainer.concat(items);
        }

        return items;
    }

    @autobind
    private closeImpersonationTooltip(): void {
        this.props.endImpersonationTooltip();
    }

    private trackClick = (name: string): void => {
        TrackWithGuidService.trackWithGuid(
            "solutions2.sidebar.menu.userSettings.dropdown",
            "click",
            { name },
        );
    };

    private getSupportMenuItem = (): JSX.Element => (
        <UserSettingsDropDownItem id="support" key="support">
            <UserSettingsDropDownLinkWithPill
                key="support"
                preventDefault={true}
                href={this.supportUrl}
            >
                <I18n>Usermanagement.ContactSupport.Title</I18n>
                <InternalPill text={i18nFilter()("Usermanagement.Internal.Title")} />
            </UserSettingsDropDownLinkWithPill>
        </UserSettingsDropDownItem>
    );
}

function mapStateToProps({ impersonation, common }) {
    return {
        impersonateMode: impersonation.impersonateMode,
        impersonateTooltip: impersonation.impersonateTooltip,
        userManagementLinksContainer: common.userManagementLinksContainer,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        endImpersonationTooltip: () => {
            dispatch(endImpersonationTooltip());
        },
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(UserSettingDropdown);
