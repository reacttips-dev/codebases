import autobind from "autobind-decorator";
import { swSettings } from "common/services/swSettings";
import dayjs from "dayjs";
import { PureComponent } from "react";
import React from "react";
import { connect } from "react-redux";
import {
    FeedbackSurveyModal,
    IQuestion,
} from "../../../../.pro-features/components/Modals/src/FeedbackSurveyModal";
import { AreYouSureModal } from "../../../../.pro-features/components/OptIn/components/EndWorkspaceTrialModal";
import {
    SelectWorkspaceTrialModal,
    Workspaces,
} from "../../../../.pro-features/components/OptIn/components/SelectWorkspaceTrialModal";
import {
    WorkspaceDismissBubble,
    WorkspaceTryBubble,
} from "../../../../.pro-features/components/OptIn/components/WorkspaceBubbles";
import { WorkspaceEndTrialNotificationBar } from "../../../../.pro-features/components/OptIn/components/WorkspaceEndTrialNotificationBar";
import { WorkspaceTrialInvitationNotificationBar } from "../../../../.pro-features/components/OptIn/components/WorkspaceTrialInvitaionNotificationBar";
import { WorkspaceSurvey } from "../../../../.pro-features/components/OptIn/WorkspaceSurvey";
import AllContexts from "../../../../.pro-features/pages/workspace/common components/AllContexts";
import { Injector } from "../../../../scripts/common/ioc/Injector";
import { SwTrack } from "services/SwTrack";
import { createUserManagementLink, removeUserManagementLink } from "../../../actions/commonActions";
import {
    createWorkspaceEndTrialBubble,
    createWorkspaceTrialBubble,
    createWorkspaceTrialDismissDot,
    createWorkspaceTrialInvitationNotificationBar,
    removeWorkspaceTrialBubble,
    removeWorkspaceTrialInvitationNotificationBar,
    updateUserWorkspaceOptInState,
} from "../../../actions/optInWorkspaceActions";
import { INotificationItem } from "../../../components/React/NotificationBarContainer/NotificationBarContainer";
import SWReactRootComponent from "../../../decorators/SWReactRootComponent";
import { apiFormat } from "../../../services/DurationService";
import { allTrackers } from "../../../services/track/track";
import { ApiAccountService } from "../../account/account/ApiAccountService";
import { i18nFilter } from "../../../filters/ngFilters";
import { ThankYouModal } from "../../../../.pro-features/components/OptIn/components/ThankYouModal";
import { TrialLink } from "../StyledComponent";
import { UserSettingsDropDownItem } from "../../../components/React/UserSettingDropdown/UserSettingDropdown";
import { HasWorkspaceTrialPermission } from "./workspacesUtils";
import { TrackWithGuidService } from "../../../services/track/TrackWithGuidService";
import { PreferencesService } from "services/preferences/preferencesService";

const WORKSPACE_TRIAL_PREFIX = "WorkspaceTrial";
const FEEDBACK_SURVEY = "FeedbackSurvey";
const WORKSPACE_DISMISS_BUBBLE = "WorkspaceDismissBubble";
const WORKSPACE_TRY_BUBBLE = "WorkspaceTryBubble";

export enum WORKSPACE_TRIAL_STATE {
    ClosedInvitation = "ClosedInvitation",
    ClickedInvitation = "ClickedInvitation",
    CreatedWorkspace = "CreatedWorkspace",
    ClickedGoBackToClassicPro = "ClickedGoBackToClassicPro",
    ClosedGoBackToClassicPro = "ClosedGoBackToClassicPro",
    ClosedEndTrialBubble = "ClosedEndTrialBubble",
    ClosedTrialInvitationBubble = "ClosedTrialInvitationBubble",
    SkippedWorkspaceFeedbackSurvey = "SkippedWorkspaceFeedbackSurvey",
    SawWorkspaceFeedbackSurvey = "SawWorkspaceFeedbackSurvey",
}

class OptInManager extends PureComponent<any, any> {
    private closeConfirmationModalProps = {
        title: "workspaces.trial.close.confirmation.modal.title",
        subtitle: "workspaces.trial.close.confirmation.modal.subtitle",
        onCloseClick: this.closeEndTrialConfirmationModal,
        onConfirmationClick: this.goBackToClassicProClick,
    };

    private thankYouModalProps = {
        title: "workspaces.trial.feedback.thank.you.modal.title",
        subtitle: "workspaces.trial.feedback.thank.you.modal.subtitle",
        closeLabel: "workspaces.trial.feedback.thank.you.modal.close.label",
        onCloseClick: this.closeThankYouModal,
    };
    private services;
    public constructor(props, context) {
        super(props, context);
        this.services = {
            swNavigator: Injector.get<any>("swNavigator"),
            swSettings,
            apiAccountService: new ApiAccountService(),
            i18n: Injector.get<any>("i18nFilter"),
        };
        this.state = {
            createWorkspaceTrialModalIsOpen: false,
            EndTrialConfirmationModalIsOpen: false,
            feedbackSurveyModalIsOpen: false,
            thankYouModalIsOpen: false,
        };

        if (!this.isWorkspaceTrialAllowed()) {
            return;
        }
        this.props.updateUserWorkspaceOptInState(this.getWorkspacesTrialState());
    }
    public render() {
        const {
            createWorkspaceTrialModalIsOpen,
            EndTrialConfirmationModalIsOpen,
            feedbackSurveyModalIsOpen,
            thankYouModalIsOpen,
        } = this.state;
        return (
            <div>
                <AllContexts
                    trackWithGuid={TrackWithGuidService.trackWithGuid}
                    translate={this.services.i18n}
                    track={allTrackers.trackEvent.bind(allTrackers)}
                    linkFn={this.services.swNavigator.href.bind(this.services.swNavigator)}
                >
                    <SelectWorkspaceTrialModal
                        createWorkspaceClick={this.createWorkspacesTrial}
                        isOpen={createWorkspaceTrialModalIsOpen}
                        onCloseClick={this.closeCreateWorkSpaceTrialModal}
                    />
                    <AreYouSureModal
                        isOpen={EndTrialConfirmationModalIsOpen}
                        {...this.closeConfirmationModalProps}
                    />
                    <FeedbackSurveyModal
                        isOpen={feedbackSurveyModalIsOpen}
                        onCloseClick={this.closeFeedbackSurveyModal}
                        onSubmitClick={this.onSubmitFeedbackSurveyModal}
                        onNextClick={this.onNextFeedbackSurveyModal}
                        surveyQuestions={WorkspaceSurvey}
                        onSkipSurveyClick={this.onSkipFeedbackSurveyModalClick}
                    />
                    <ThankYouModal isOpen={thankYouModalIsOpen} {...this.thankYouModalProps} />
                </AllContexts>
            </div>
        );
    }

    @autobind
    public closeThankYouModal() {
        SwTrack.all.trackEvent("Close", "close", "feedback thank you modal");
        this.setState({
            ...this.state,
            thankYouModalIsOpen: false,
        });
    }

    @autobind
    public async onSubmitFeedbackSurveyModal(question: IQuestion, answer) {
        this.setState({
            ...this.state,
            thankYouModalIsOpen: true,
            feedbackSurveyModalIsOpen: false,
        });
        this.onNextFeedbackSurveyModal(question, answer);
    }

    @autobind
    public async onNextFeedbackSurveyModal(question: IQuestion, answer) {
        await PreferencesService.add({
            [`${WORKSPACE_TRIAL_PREFIX}/${FEEDBACK_SURVEY}/${question.id}`]: {
                question: question.subtitle,
                answer,
            },
        });
    }

    @autobind
    public async onSkipFeedbackSurveyModalClick() {
        await PreferencesService.add({
            [`${WORKSPACE_TRIAL_PREFIX}`]: {
                startDate: dayjs().format(apiFormat),
                state: WORKSPACE_TRIAL_STATE.SkippedWorkspaceFeedbackSurvey,
            },
        });
        this.setState({
            ...this.state,
            feedbackSurveyModalIsOpen: false,
        });
    }

    @autobind
    public closeFeedbackSurveyModal() {
        this.setState({
            ...this.state,
            feedbackSurveyModalIsOpen: false,
        });
    }

    @autobind
    public async openFeedbackSurveyModal() {
        this.setState({
            ...this.state,
            feedbackSurveyModalIsOpen: true,
        });
        await PreferencesService.add({
            [`${WORKSPACE_TRIAL_PREFIX}`]: {
                startDate: dayjs().format(apiFormat),
                state: WORKSPACE_TRIAL_STATE.SawWorkspaceFeedbackSurvey,
            },
        });
    }

    @autobind
    public closeCreateWorkSpaceTrialModal() {
        this.setState({
            ...this.state,
            createWorkspaceTrialModalIsOpen: false,
        });
    }

    @autobind
    public openCreateWorkSpaceTrialModal() {
        SwTrack.all.trackEvent("Top bar", "open", "Try workspace");
        this.setState({
            ...this.state,
            createWorkspaceTrialModalIsOpen: true,
        });
    }

    @autobind
    public openEndTrialConfirmationModal() {
        SwTrack.all.trackEvent("Top bar", "open", "First screen");
        this.setState({
            ...this.state,
            EndTrialConfirmationModalIsOpen: true,
        });
    }

    @autobind
    public closeEndTrialConfirmationModal() {
        SwTrack.all.trackEvent("Top bar", "close", "First screen");
        this.setState({
            ...this.state,
            EndTrialConfirmationModalIsOpen: false,
        });
    }

    public componentDidUpdate(prevProps) {
        const state = this.props.userWorkspaceOptInState
            ? this.props.userWorkspaceOptInState.state
            : "";
        if (this.props.userWorkspaceOptInState !== prevProps.userWorkspaceOptInState) {
            if (this.isWorkspaceTrialEnded(state)) {
                this.openFeedbackSurveyModal();
                return;
            }
            switch (state) {
                case WORKSPACE_TRIAL_STATE.ClickedInvitation:
                    this.createWorkspaceTrialNotification();
                    break;
                case WORKSPACE_TRIAL_STATE.CreatedWorkspace:
                    this.createWorkspaceEndTrialNotification();
                    break;
                case WORKSPACE_TRIAL_STATE.ClosedGoBackToClassicPro:
                    this.props.createWorkspaceTrialDismissDot();
                    this.createWorkspaceEndTrialBubble();
                    break;
                case WORKSPACE_TRIAL_STATE.ClosedTrialInvitationBubble:
                    this.props.createWorkspaceTrialDismissDot();
                    break;
                case WORKSPACE_TRIAL_STATE.ClosedEndTrialBubble:
                    this.props.createWorkspaceTrialDismissDot();
                    break;
                case WORKSPACE_TRIAL_STATE.ClosedInvitation:
                    this.props.createWorkspaceTrialDismissDot();
                    this.createWorkspaceTrialBubble();
                    break;
                case WORKSPACE_TRIAL_STATE.SawWorkspaceFeedbackSurvey:
                case WORKSPACE_TRIAL_STATE.SkippedWorkspaceFeedbackSurvey:
                case WORKSPACE_TRIAL_STATE.ClickedGoBackToClassicPro:
                    // TODO: should be removed when releasing
                    if (this.services.swSettings.user.plan === "Market Intelligence Package") {
                        return;
                    }
                default:
                    this.createWorkspaceTrialNotification();
                    break;
            }
        }
        if (this.isWorkspaceTrialAllowed() && !this.isWorkspaceTrialEnded(state)) {
            this.createUserManagementLink(state);
        } else {
            this.props.removeWorkspaceTrialUserManagementLink(WORKSPACE_TRIAL_PREFIX);
        }
    }

    public removeWSNotification() {
        this.props.removeWorkspaceTrialInvitationNotificationBar({ id: WORKSPACE_TRIAL_PREFIX });
    }

    @autobind
    public async closeWorkspaceEndTrialNotificationInvitation() {
        this.removeWSNotification();
        this.props.updateUserWorkspaceOptInState({
            state: WORKSPACE_TRIAL_STATE.ClosedGoBackToClassicPro,
        });
        await PreferencesService.add({
            [`${WORKSPACE_TRIAL_PREFIX}`]: {
                startDate: dayjs().format(apiFormat),
                state: WORKSPACE_TRIAL_STATE.ClosedGoBackToClassicPro,
            },
        });
        SwTrack.all.trackEvent("Top bar", "close", `Try workspace`);
    }

    @autobind
    public async closeWorkspaceTrialNotificationInvitation() {
        this.removeWSNotification();
        this.props.updateUserWorkspaceOptInState({ state: WORKSPACE_TRIAL_STATE.ClosedInvitation });
        await PreferencesService.add({
            [`${WORKSPACE_TRIAL_PREFIX}`]: {
                startDate: dayjs().format(apiFormat),
                state: WORKSPACE_TRIAL_STATE.ClosedInvitation,
            },
        });
        SwTrack.all.trackEvent("Top bar", "close", `Try workspace expiration`);
    }

    public createWorkspaceTrialNotification() {
        this.props.createWorkspaceTrialInvitationNotificationBar({
            id: WORKSPACE_TRIAL_PREFIX,
            onClose: this.closeWorkspaceTrialNotificationInvitation,
            customComponent: WorkspaceTrialInvitationNotificationBar,
            tryWorkspacesClick: this.tryWorkspaceClick.bind(this),
        });
    }

    public createWorkspaceEndTrialNotification() {
        this.props.createWorkspaceTrialInvitationNotificationBar({
            id: WORKSPACE_TRIAL_PREFIX,
            onClose: this.closeWorkspaceEndTrialNotificationInvitation,
            customComponent: WorkspaceEndTrialNotificationBar,
            goBackClick: this.openEndTrialConfirmationModal,
        });
    }

    public createUserManagementLink(state) {
        const linkText = this.isWorkspaceTrialMode(state)
            ? "Usermanagement.optIn.workspace.dismiss.Title"
            : "Usermanagement.optIn.workspace.try.Title";
        const linkOnClick = this.isWorkspaceTrialMode(state)
            ? this.openEndTrialConfirmationModal
            : this.openCreateWorkSpaceTrialModal;
        const linkComponent = (
            <UserSettingsDropDownItem>
                <TrialLink onClick={linkOnClick}>{i18nFilter()(linkText)}</TrialLink>
            </UserSettingsDropDownItem>
        );
        this.props.createWorkspaceTrialUserManagementLink(linkComponent);
    }

    private isWorkspaceTrialMode(state) {
        return (
            /*this.isWorkspaceTrialAllowed() &&*/ state ===
                WORKSPACE_TRIAL_STATE.CreatedWorkspace ||
            state === WORKSPACE_TRIAL_STATE.ClosedGoBackToClassicPro ||
            state === WORKSPACE_TRIAL_STATE.ClosedEndTrialBubble
        );
    }

    private isWorkspaceTrialEnded(state) {
        return (
            state === WORKSPACE_TRIAL_STATE.ClickedGoBackToClassicPro ||
            (this.isWorkspaceTrialMode(state) &&
                !this.services.swSettings.components.Workspaces.isAllowed)
        );
    }

    @autobind
    public async goBackToClassicProClick() {
        const { apiAccountService, swNavigator } = this.services;
        await apiAccountService.userWorkspaceSwitch(false);
        await PreferencesService.add({
            [`${WORKSPACE_TRIAL_PREFIX}`]: {
                startDate: dayjs().format(apiFormat),
                state: WORKSPACE_TRIAL_STATE.ClickedGoBackToClassicPro,
            },
        });
        this.removeWSNotification();
        this.closeEndTrialConfirmationModal();
        SwTrack.all.trackEvent(
            "Try workspace expiration wizard",
            "click",
            `First screen/go back to classic pro`,
        );
        const redirectUrl = swNavigator.getStateUrl("home");
        window.location.href = redirectUrl;
        window.location.reload();
    }

    public createWorkspaceEndTrialBubble() {
        this.props.createWorkspaceEndTrialBubble({
            id: WORKSPACE_DISMISS_BUBBLE,
            customComponent: WorkspaceDismissBubble,
            bubbleProps: {
                isOpen: true,
                onClose: () => this.removeWorkspaceEndTrialBubble(),
            },
        });
    }
    public createWorkspaceTrialBubble() {
        this.props.createWorkspaceTrialBubble({
            id: WORKSPACE_TRY_BUBBLE,
            customComponent: WorkspaceTryBubble,
            bubbleProps: {
                isOpen: true,
                onClose: () => this.removeWorkspaceTrialBubble(),
            },
        });
    }

    public async removeWorkspaceEndTrialBubble() {
        this.props.removeWorkspaceTrialBubble({ id: WORKSPACE_DISMISS_BUBBLE });
        await PreferencesService.add({
            [`${WORKSPACE_TRIAL_PREFIX}`]: {
                startDate: dayjs().format(apiFormat),
                state: WORKSPACE_TRIAL_STATE.ClosedEndTrialBubble,
            },
        });
    }

    public async removeWorkspaceTrialBubble() {
        this.props.removeWorkspaceTrialBubble({ id: WORKSPACE_TRY_BUBBLE });
        await PreferencesService.add({
            [`${WORKSPACE_TRIAL_PREFIX}`]: {
                startDate: dayjs().format(apiFormat),
                state: WORKSPACE_TRIAL_STATE.ClosedTrialInvitationBubble,
            },
        });
    }

    public async tryWorkspaceClick(selectedWorkspace: string) {
        await PreferencesService.add({
            [`${WORKSPACE_TRIAL_PREFIX}`]: {
                startDate: dayjs().format(apiFormat),
                state: WORKSPACE_TRIAL_STATE.ClickedInvitation,
            },
        });
        this.openCreateWorkSpaceTrialModal();
        SwTrack.all.trackEvent("Top bar", "click", `Try workspace`);
    }

    private isUserRoleInTrial(userCustomData: any): boolean {
        if (!(userCustomData && (userCustomData.quiz || userCustomData.roles))) {
            return false;
        }
        if (userCustomData.quiz) {
            return (
                Array.isArray(userCustomData.quiz) &&
                userCustomData.quiz.filter((role: string) =>
                    role
                        .toLowerCase()
                        .match("((marketing)|(cmo)|(acquisition)|(seo)|(ppc)|(affiliate))"),
                )
            );
        } else if (userCustomData.roles) {
            return (
                Array.isArray(userCustomData.roles) &&
                userCustomData.roles.filter((role: string) =>
                    role
                        .toLowerCase()
                        .match("((marketing)|(cmo)|(acquisition)|(seo)|(ppc)|(affiliate))"),
                )
            );
        }
        return false;
    }

    private isWorkspaceTrialAllowed() {
        return (
            HasWorkspaceTrialPermission() &&
            this.services.swSettings.user.plan === "Market Intelligence Package" &&
            this.isUserRoleInTrial(this.services.swSettings.user.customData)
        );
    }

    private getWorkspacesTrialState() {
        const workspaceStatus = PreferencesService.get(`${WORKSPACE_TRIAL_PREFIX}`);
        return workspaceStatus;
    }

    @autobind
    private async createWorkspacesTrial(selectedWorkspace: { name: string; id: number }) {
        const { apiAccountService, swNavigator } = this.services;
        await apiAccountService.userWorkspaceSwitch(true);
        await PreferencesService.add({
            [`${WORKSPACE_TRIAL_PREFIX}`]: {
                startDate: dayjs().format(apiFormat),
                state: WORKSPACE_TRIAL_STATE.CreatedWorkspace,
            },
        });
        this.closeCreateWorkSpaceTrialModal();
        const selectedState =
            selectedWorkspace.name === Workspaces.marketing.name
                ? "marketingWorkspace-home"
                : selectedWorkspace.name === Workspaces.sales.name
                ? "salesWorkspace"
                : "investorsWorkspace";
        SwTrack.all.trackEvent(
            "Market Intelligence Package",
            "click",
            `Second screen/create workspace${selectedWorkspace}`,
        );
        const redirectUrl = swNavigator.getStateUrl(selectedState);
        window.location.href = redirectUrl;
        window.location.reload();
    }
}

function mapStateToProps({ userData }) {
    const { userWorkspaceOptInState, dismissNotificationDot } = userData.workspaceOptIn;
    return {
        userWorkspaceOptInState,
        dismissNotificationDot,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        removeWorkspaceTrialInvitationNotificationBar: (notification: INotificationItem) => {
            dispatch(removeWorkspaceTrialInvitationNotificationBar(notification));
        },
        removeWorkspaceTrialBubble: (dismissNotification) => {
            dispatch(removeWorkspaceTrialBubble(dismissNotification));
        },
        removeWorkspaceTrialUserManagementLink: (linkId) => {
            dispatch(removeUserManagementLink(linkId));
        },
        createWorkspaceTrialInvitationNotificationBar: (notification: INotificationItem) => {
            dispatch(createWorkspaceTrialInvitationNotificationBar(notification));
        },
        createWorkspaceEndTrialBubble: (dismissNotification) => {
            dispatch(createWorkspaceEndTrialBubble(dismissNotification));
        },
        createWorkspaceTrialBubble: (tryNotification) => {
            dispatch(createWorkspaceTrialBubble(tryNotification));
        },
        createWorkspaceTrialDismissDot: () => {
            dispatch(createWorkspaceTrialDismissDot());
        },
        createWorkspaceTrialUserManagementLink: (link) => {
            dispatch(createUserManagementLink(link));
        },
        updateUserWorkspaceOptInState: (userOptInState: WORKSPACE_TRIAL_STATE) => {
            dispatch(updateUserWorkspaceOptInState(userOptInState));
        },
    };
}

SWReactRootComponent(connect(mapStateToProps, mapDispatchToProps)(OptInManager), "OptInManager");

export default OptInManager;
