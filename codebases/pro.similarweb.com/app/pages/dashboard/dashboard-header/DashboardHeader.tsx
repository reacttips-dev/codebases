import { colorsPalettes } from "@similarweb/styles";
import { AutosizeInput } from "@similarweb/ui-components/dist/autosize-input";
import { Button, ButtonLabel, IconButton } from "@similarweb/ui-components/dist/button";
import { EllipsisDashboardHeaderContainer } from "@similarweb/ui-components/dist/side-nav";
import autobind from "autobind-decorator";
import I18n from "components/React/Filters/I18n";
import { TRIAL_BANNER_HEIGHT } from "components/React/TrialBanner/TrialBanner";
import SWReactRootComponent from "decorators/SWReactRootComponent";
import { i18nFilter } from "filters/ngFilters";
import noop from "lodash/noop";
import * as React from "react";
import { connect } from "react-redux";
import TrialService from "services/TrialService";
import styled from "styled-components";
import { NotificationButton } from "../../../../.pro-features/components/Buttons/src/NotificationButton";
import { ShareDashboardButton } from "../../../../.pro-features/components/Buttons/src/ShareDashboardButton";
import { ConfirmationTextModal } from "../../../../.pro-features/components/Modals/src/ConfirmationTextModal";
import TranslationProvider from "../../../../.pro-features/components/WithTranslation/src/TranslationProvider";
import { Injector } from "../../../../scripts/common/ioc/Injector";
import { showErrorToast } from "../../../actions/toast_actions";
import { setSharedWithMeDashboards } from "../DashboardSideNavActions";
import SharedDashboardHeaderButtonTooltipWrap from "../ShareDashboardHeaderButtonTooltipWrap";
import { ShareDashboardService } from "../ShareDashboardService";
import SharedDashboardWithMe from "../SharedDashboardWithMe";
import userEngagementResource from "../../../../scripts/common/resources/userEngagementResource";
import { EllipsisDropdownItem, Dropdown } from "@similarweb/ui-components/dist/dropdown";
import { TrackWithGuidService } from "services/track/TrackWithGuidService";
import { swSettings } from "common/services/swSettings";
import { SwTrack } from "services/SwTrack";

const DASHBOARD_NOTIFICATIONS_ENG_TYPE = "dashboard_notifications_initial";
const CTA_BAR_HEIGHT = 112;

const DashboardTitle = styled.h1`
    height: 32px;
    color: ${colorsPalettes.carbon["500"]};
    font-family: Roboto;
    font-size: 24px;
    line-height: 32px;
    font-weight: 400;
    margin: 3px 0px;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
`;

const DashboardButtons = styled.div`
    display: flex;
    /* max-width: 42%; */
    min-width: 420px;
    width: 515px;
    align-items: center;
    flex-direction: row-reverse;
    & > * {
        float: right;
        margin-right: 0px;
    }
    & > *:nth-child(2) {
        margin-left: 12px;
        margin-right: 8px;
    }
`;

interface IContainerProps {
    isTrial?: boolean;
    isSolutions2Cta?: boolean;
}

const getBannerHeight = (isTrail: boolean, isSolutions2Cta: boolean): number => {
    if (isTrail) {
        return TRIAL_BANNER_HEIGHT;
    }
    if (isSolutions2Cta) {
        return CTA_BAR_HEIGHT;
    }
    return 0;
};

const DashboardHeaderContainer: any = styled.div`
    width: calc(100% - 329px);
    max-width: 1366px;
    display: inline-flex;
    align-items: center;
    justify-content: space-between;
    position: fixed;
    top: ${({ isTrial, isSolutions2Cta }: IContainerProps) =>
        `${getBannerHeight(isTrial, isSolutions2Cta)}px`};
    height: 104px;
    padding: 53px 10px 13px 0;
    box-sizing: border-box;
    z-index: 3;
    background-color: ${colorsPalettes.bluegrey["100"]};
    margin-left: auto;
    margin-right: auto;
    border-bottom: 0px;
    @media (max-width: 1200px) {
        width: calc(100% - 78px);
    }
    &.layout-is-scrolled {
        border-bottom: 1px solid ${colorsPalettes.carbon["100"]};
        transition: all ease 200ms;
    }
    transition: all ease 200ms;
    &:before {
        content: "";
        width: 3px;
        height: 100%;
        background-color: ${colorsPalettes.bluegrey["100"]};
        position: absolute;
        left: -3px;
    }
    &:after {
        content: "";
        width: 3px;
        height: 100%;
        background-color: ${colorsPalettes.bluegrey["100"]};
        position: absolute;
        right: -3px;
    }
`;

const EllipsisIconContainer = styled.div`
    width: 37px;
    height: 100%;
    display: inline-block;
    .SWReactIcons {
        display: inline-flex;
        width: 24px;
        svg {
            width: 100%;
            height: 100%;
        }
    }
`;

const DashboardTitleContainer = styled.div`
    width: calc(100% - 520px);
    display: flex;
    align-items: center;
`;

class DashboardHeader extends React.Component<any, any> {
    private elipsisMenuItems;
    private exportMenuItems;
    private readonly isTrial: boolean;
    private readonly isSolutions2Cta: boolean;

    constructor(props) {
        super(props);
        this.elipsisMenuItems = this.getElipsisMenuItem(props);
        this.exportMenuItems = this.getExportMenuItems(props);
        this.state = {
            deletePopUpIsOpen: false,
            isModalOpen: false,
            promotionTooltip: false,
            tmpName: props.text,
        };
        this.isTrial = new TrialService().isTrial();
        this.isSolutions2Cta = this.props.solution2CtaBarShown;
    }

    public static defaultProps = {
        solution2CtaBarShown: false,
    };

    public componentDidUpdate(prevProps) {
        this.elipsisMenuItems = this.getElipsisMenuItem(this.props);
        this.exportMenuItems = this.getExportMenuItems(this.props);
        if (
            prevProps.text !== this.props.text ||
            this.props.widgetsLoaded !== prevProps.widgetsLoaded
        ) {
            this.setState({ tmpName: this.props.text });
        }
    }

    public componentDidMount() {
        this.shouldExposeUserToTemplates();
    }

    private renderExportMenuButton = (): JSX.Element => {
        return (
            <Dropdown
                onClick={this.onExportMenuItemClick}
                onToggle={noop}
                itemsComponent={EllipsisDropdownItem}
                dropdownPopupPlacement="bottom-right"
                autoPlacement={false}
                width={220}
                buttonWidth={106}
                appendTo="body"
                cssClassContainer="DropdownContent-container DropdownContent-container--ellipsis-dashboard-header"
            >
                {this.exportMenuItems}
            </Dropdown>
        );
    };

    private renderElipsisMenuButton = (): JSX.Element => {
        return (
            <EllipsisDashboardHeaderContainer
                onCancel={this.onCancel}
                onConfirm={this.onConfirm}
                isSharedByMe={this.props.isSharedByMe}
                deletePopupIsOpen={this.state.deletePopUpIsOpen}
                onToggle={noop}
                onClick={this.onElipsisMenuItemClick}
            >
                {this.state.deletePopUpIsOpen ? (
                    <EllipsisIconContainer>
                        <IconButton type="flat" iconName="dots-more" />
                    </EllipsisIconContainer>
                ) : (
                    this.elipsisMenuItems
                )}
            </EllipsisDashboardHeaderContainer>
        );
    };

    private renderShareButton = (): JSX.Element => {
        return this.getHeaderButton(
            "share button",
            <TranslationProvider translate={i18nFilter()}>
                <ShareDashboardButton
                    isDisabled={this.props.readOnly || !this.props.widgetsLoaded}
                    onClick={this.openShareDashboardModal}
                    dashboardViewers={this.props.dashboardViewers}
                    sharedWithAccounts={this.props.sharedWithAccounts}
                />
            </TranslationProvider>,
        );
    };

    private renderAddMetricButton = (): JSX.Element => {
        return this.getHeaderButton(
            "add metric button",
            <Button
                isDisabled={this.props.readOnly}
                onClick={this.props.openMetricsGallery}
                type="flat"
            >
                <ButtonLabel>
                    <I18n>home.dashboards.add.widget.2</I18n>
                </ButtonLabel>
            </Button>,
        );
    };

    private renderHeaderTitle = (): JSX.Element => {
        return this.props.isSharedWithMe ? (
            <DashboardTitleContainer>
                <DashboardTitle>{this.props.text}</DashboardTitle>
                {this.props.isDuplicatingEnabled && (
                    <SharedDashboardWithMe
                        onClick={this.props.duplicateDashboard}
                        ownerName={this.props.ownerName}
                    />
                )}
            </DashboardTitleContainer>
        ) : (
            <DashboardTitleContainer>
                <AutosizeInput
                    placeholder={i18nFilter()("dashboard.template.title.placeholder")}
                    onChange={(event) => this.setState({ tmpName: event.target.value })}
                    onApply={this.renameDashboard}
                    onCancel={this.revertDashboardName}
                    value={this.state.tmpName}
                    maxLength={100}
                />
            </DashboardTitleContainer>
        );
    };

    public render() {
        return (
            <DashboardHeaderContainer
                className="dashboard-header"
                isTrial={this.isTrial}
                isSolutions2Cta={this.isSolutions2Cta}
            >
                {this.renderHeaderTitle()}
                <DashboardButtons>
                    {this.renderElipsisMenuButton()}
                    {this.renderExportMenuButton()}
                    {this.props.isSharingEnabled && this.renderShareButton()}
                    {this.renderSubscribeButton()}
                    {this.renderSubscribeConfirmModal()}
                    {this.renderAddMetricButton()}
                </DashboardButtons>
            </DashboardHeaderContainer>
        );
    }

    private shouldExposeUserToTemplates = async () => {
        const userEngagements = await userEngagementResource.getAll();
        const didUserExposed = userEngagements.hasOwnProperty(DASHBOARD_NOTIFICATIONS_ENG_TYPE);
        this.setState({ promotionTooltip: !didUserExposed });
        if (!didUserExposed) {
            userEngagementResource.logEngagement({
                engType: DASHBOARD_NOTIFICATIONS_ENG_TYPE,
            });
        }
    };

    private getExportMenuItems(props) {
        const hasAccessToPptExport = swSettings.user.hasPptExport;

        const menuButton = (
            <div key={"main-item"}>
                <IconButton type="primary" iconName="upload">
                    <ButtonLabel>
                        <I18n>home.dashboards.export.button</I18n>
                    </ButtonLabel>
                </IconButton>
            </div>
        );

        const menuItems = hasAccessToPptExport
            ? [
                  {
                      id: "pdf",
                      key: "pdf",
                      iconName: "pdf",
                      disabled: !props.widgetsLoaded,
                      text: i18nFilter()("dashboard.header.export.pdf"),
                  },
                  {
                      id: "ppt",
                      key: "ppt",
                      iconName: "ppt",
                      disabled: !props.widgetsLoaded,
                      text: i18nFilter()("dashboard.header.export.ppt"),
                  },
              ]
            : [
                  {
                      id: "pdf",
                      key: "pdf",
                      iconName: "pdf",
                      disabled: !props.widgetsLoaded,
                      text: i18nFilter()("dashboard.header.export.pdf"),
                  },
              ];

        return [menuButton, ...menuItems];
    }

    private getElipsisMenuItem(props) {
        return [
            <div key={"main-item"}>
                <EllipsisIconContainer key={"dashboardHeaderEllipsis"}>
                    <IconButton
                        key={"dashboardHeaderEllipsisButton"}
                        type="flat"
                        iconName="dots-more"
                    />
                </EllipsisIconContainer>
            </div>,
            {
                id: "duplicate",
                key: "duplicate",
                iconName: "copy",
                disabled: !props.isDuplicatingEnabled,
                text: i18nFilter()("dashboard.header.ellipsis.duplicate"),
            },
            {
                id: "erase",
                key: "erase",
                iconName: "delete",
                disabled: props.isSharedWithMe,
                text: i18nFilter()("dashboard.header.ellipsis.delete"),
            },
        ];
    }

    private onExportMenuItemClick = (item) => {
        switch (item.id) {
            case "ppt":
                TrackWithGuidService.trackWithGuid("dashboard.export.ppt", "click");
                SwTrack.all.trackEvent("Dashboard", "click", "Dashboard Header/PPT");
                this.props.exportToPpt();
                break;

            case "pdf":
                TrackWithGuidService.trackWithGuid("dashboard.export.pdf", "click");
                SwTrack.all.trackEvent("Dashboard", "click", "Dashboard Header/PDF");
                this.props.downloadPdf();
                break;
        }
    };

    private onElipsisMenuItemClick = (item) => {
        switch (item.id) {
            case "duplicate":
                SwTrack.all.trackEvent("Duplicate Report", "click", "Dashboard Header/Duplicate");
                this.props.duplicateDashboard();
                break;

            case "erase":
                SwTrack.all.trackEvent("Dashboard", "click", "Dashboard Header/Delete");
                this.setState({ deletePopUpIsOpen: true });
                break;
        }
    };

    @autobind
    private openShareDashboardModal() {
        SwTrack.all.trackEvent("Dashboard", "click", "Dashboard Header/Share");
        this.props.shareDashboard();
    }

    @autobind
    /**
     * Return a button component wrapped with tooltip in case the dashboard is shared with me,
     * suggest user to duplicate
     */
    private getHeaderButton(type, buttonComponent) {
        if (this.props.isSharedWithMe) {
            return this.props.isDuplicatingEnabled ? (
                <SharedDashboardHeaderButtonTooltipWrap
                    onClick={this.props.duplicateDashboard}
                    ownerName={this.props.ownerName}
                    type={type}
                >
                    <div>{buttonComponent}</div>
                </SharedDashboardHeaderButtonTooltipWrap>
            ) : null;
        } else {
            return buttonComponent;
        }
    }

    @autobind
    private async renameDashboard() {
        const dashboardService: any = Injector.get("dashboardService");
        if (this.state.tmpName !== this.props.text) {
            if (this.state.tmpName.trim() === "") {
                this.revertDashboardName();
            } else {
                try {
                    await dashboardService.renameDashboard({
                        id: this.props.dashboardId,
                        title: this.state.tmpName,
                    });
                    this.props.setSideNavItems();
                } catch (e) {
                    this.props.showErrorToast(i18nFilter()("dashboard.rename.failed.toast"));
                    this.revertDashboardName();
                }
            }
        }
    }

    @autobind
    private revertDashboardName() {
        this.setState({ tmpName: this.props.text });
    }

    @autobind
    private async deleteDashboard() {
        const swNavigator: any = Injector.get("swNavigator");
        const dashboardService: any = Injector.get("dashboardService");
        const success = () => {
            if (dashboardService.dashboards.length) {
                const dashboard = dashboardService.getFirstDashboard();
                if (dashboard.name && dashboard.name === "newdashboard") {
                    swNavigator.go("dashboard-new"); // if the last item is the "add dashboard" button
                } else {
                    swNavigator.go("dashboard-exist", {
                        dashboardId: dashboard.id,
                    });
                    setTimeout(() => this.props.setSideNavItems());
                }
            } else {
                swNavigator.go("dashboard-new");
            }
        };

        try {
            if (this.props.isSharedByMe) {
                const { err, success } = await ShareDashboardService.unShare({
                    dashboardId: this.props.dashboardId,
                });
                if (err || !success) {
                    fail();
                    return;
                }
            }
            await dashboardService.deleteDashboard({ id: this.props.dashboardId });
            success();
        } catch (e) {
            fail();
        }
    }

    @autobind
    private onConfirm() {
        SwTrack.all.trackEvent("Dashboard", "click", "Dashboard Header/Delete/Yes");
        this.setState({ deletePopUpIsOpen: false });
        this.deleteDashboard();
    }

    @autobind
    private onCancel() {
        SwTrack.all.trackEvent("Dashboard", "click", "Dashboard Header/Delete/No");
        this.setState({ deletePopUpIsOpen: false });
    }

    private renderSubscribeConfirmModal = (): JSX.Element => {
        return (
            <ConfirmationTextModal
                isOpen={this.state.isModalOpen}
                onCloseClick={this.onConfirmationCloseClick}
                onCancelClick={this.onConfirmationCloseClick}
                onApproveClick={this.onConfirmationApproveClick}
                cancelButtonText={i18nFilter()(
                    "dashboard.dashboardSubscription.ConfirmationModal.cancelButtonText",
                )}
                approveButtonText={i18nFilter()(
                    "dashboard.dashboardSubscription.ConfirmationModal.approveButtonText",
                )}
                headerText={i18nFilter()(
                    "dashboard.dashboardSubscription.ConfirmationModal.headerText",
                )}
                contentText={i18nFilter()(
                    "dashboard.dashboardSubscription.ConfirmationModal.contentText",
                )}
            />
        );
    };

    private renderSubscribeButton = (): JSX.Element => {
        const primaryToolTipText = i18nFilter()(
            "dashboard.dashboardSubscription.subscribeButton.tooltip",
        );
        const activatedToolTipText = i18nFilter()(
            "dashboard.dashboardSubscription.unsubscribeButton.tooltip",
        );
        if (this.props.isNotificationAllowed) {
            if (this.props.isSubscriptionOn) {
                return (
                    <NotificationButton
                        isActivated={true}
                        onClick={this.openModal}
                        toolTipText={activatedToolTipText}
                    />
                );
            } else {
                return (
                    <NotificationButton
                        promotionTooltip={this.state.promotionTooltip}
                        toolTipText={primaryToolTipText}
                        onClick={this.onSubscription}
                    />
                );
            }
        } else {
            return <NotificationButton isDisabled={true} />;
        }
    };

    @autobind
    private onSubscription() {
        SwTrack.all.trackEvent("Dashboard subscription", "click", "subscribe");
        this.props.onSubscription();
        this.setState({ promotionTooltip: false });
    }

    @autobind
    private openModal() {
        SwTrack.all.trackEvent("Dashboard subscription", "click", "unsubscribe");
        this.setState({ isModalOpen: true });
    }

    @autobind
    private onConfirmationCloseClick() {
        SwTrack.all.trackEvent("Dashboard subscription", "click", "popup/cancel");
        this.setState({ isModalOpen: false });
    }

    @autobind
    private onConfirmationApproveClick() {
        SwTrack.all.trackEvent("Dashboard subscription", "unsubscribe", "unsubscribe");
        this.props.onUnsubscription();
        this.setState({ isModalOpen: false });
    }
}

function mapDispatchToProps(dispatch) {
    return {
        setSideNavItems: () => {
            dispatch(setSharedWithMeDashboards());
        },
        showErrorToast: (text?: string) => dispatch(showErrorToast(text)),
    };
}

SWReactRootComponent(connect(null, mapDispatchToProps)(DashboardHeader), "DashboardHeader");
