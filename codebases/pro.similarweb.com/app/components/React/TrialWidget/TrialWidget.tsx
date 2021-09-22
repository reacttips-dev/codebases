import { Button, ButtonLabel } from "@similarweb/ui-components/dist/button";
import { swSettings } from "common/services/swSettings";
import { ProModal } from "components/Modals/src/ProModal";
import { proModalStyles } from "components/Modals/src/TrialHookModal/TrialHookModal";
import TrialWidgetModal from "components/Modals/src/TrialWidgetModal";
import { MonthlySubscriptionsModal, NoTouchHook } from "components/NoTouch";
import SWReactRootComponent from "decorators/SWReactRootComponent";
import { i18nFilter } from "filters/ngFilters";
import { isNumber } from "lodash";
import { func } from "prop-types";
import * as React from "react";
import ABService from "services/ABService";
import { openUnlockModal } from "services/ModalService";
import { allTrackers } from "services/track/track";
import TrialService from "services/TrialService";
import styled from "styled-components";
import LocationService from "../../../../.pro-features/components/Modals/src/UnlockModal/LocationService";
import { PreferencesService } from "services/preferences/preferencesService";

const TrialWidgetContent = styled.div`
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 130px;
    height: 100%;
    background-color: #111b42;
    // TODO: Remove after small screen state implementation
    @media (max-width: 1279px) {
        display: none;
    }
    .rtgTopBar--impersonate & {
        background-color: #212121;
    }
`;

const TrialWidgetText = styled.div`
    overflow: hidden;
    width: 100%;
    font-size: 13px;
    font-weight: 500;
    color: #fff;
    line-height: 1.4;
    white-space: nowrap;
    text-align: center;
    text-transform: lowercase;
    text-overflow: ellipsis;
    margin-bottom: 4px;
    b {
        color: #e95f5f;
    }
`;

const TrialWidgetNoTouchLink = styled.a`
    line-height: 1;
`;

const TrialWidgetButton = styled(Button)`
    min-width: 100px;
    justify-content: center;
    ${ButtonLabel} {
        font-size: 11px;
        line-height: 1.4;
    }
`;

const TRIAL_MODAL_CLOSED_1ST = "trialModalClosed1st";
const TRIAL_MODAL_CLOSED_2ND = "trialModalClosed2nd";
const ONBOARD_ARENA_CREATED = "onboardArenaCreated";
const NO_TOUCH_VISITS_COUNT = "noTouchVisitsCount";
const MONTHLY_SUBSCRIPTIONS_MODAL_COUNT = "monthlySubscriptionsModalCount";

interface ITrialWidgetState {
    isTrialModalOpen: boolean;
    isMonthlySubscriptionsModalOpen: boolean;
}

class TrialWidget extends React.PureComponent<any, ITrialWidgetState> {
    public static contextTypes = {
        translate: func,
        track: func,
    };

    private readonly swSettings: any;
    private readonly trialService: any;
    private readonly workspaceName: string;
    private readonly userName: string;
    private readonly daysLeft: number;
    private readonly isNoTouch: boolean;
    private readonly vwoNewGeneralHookPopup: boolean;
    private readonly isMarketingWithoutArena: boolean;
    private timer;
    private readonly timeout: number;

    constructor(props) {
        super(props);

        this.swSettings = swSettings;
        this.trialService = new TrialService();
        this.timer = null;
        this.timeout = 5 * 60 * 1000;

        this.workspaceName = this.trialService.getWorkspaceName();
        this.daysLeft = this.trialService.getDaysLeft();
        this.isNoTouch = this.swSettings.components.Home.resources.CanPurchaseNoTouch;
        this.userName = this.swSettings.user.firstname;
        this.vwoNewGeneralHookPopup = ABService.getFlag("vwoNewGeneralHookPopup");

        const onboardArenaCreated = PreferencesService.get(`${ONBOARD_ARENA_CREATED}`) || false;
        this.isMarketingWithoutArena = this.workspaceName === "marketing" && !onboardArenaCreated;

        this.state = {
            isTrialModalOpen:
                !this.isMarketingWithoutArena && !PreferencesService.get(this.getPreferenceKey()),
            isMonthlySubscriptionsModalOpen: false,
        };
    }

    public componentDidMount() {
        if (this.state.isTrialModalOpen) {
            const reason = this.daysLeft > 3 ? "first visit" : `${this.daysLeft} day(s) left`;
            allTrackers.trackEvent("upgrade widget", "open", `new workspace feature/${reason}`);
        }
        this.displayMonthlySubscriptionsModal();
    }

    public componentWillUnmount(): void {
        if (this.timer) {
            clearTimeout(this.timer);
            this.timer = null;
        }
    }

    public render() {
        return (
            <>
                <TrialWidgetContent>
                    <TrialWidgetText>{this.renderText()}</TrialWidgetText>
                    {this.isNoTouch ? (
                        this.renderTrialWidgetButtonNoTouch()
                    ) : (
                        <TrialWidgetButton type="trial" height="24px" onClick={this.onCtaClick}>
                            {i18nFilter()("trial_widget.button.text")}
                        </TrialWidgetButton>
                    )}
                    <TrialWidgetModal
                        workspace={this.workspaceName}
                        isOpen={this.state.isTrialModalOpen}
                        onCloseClick={() => {
                            if (this.state.isTrialModalOpen) {
                                PreferencesService.add({
                                    [`${this.getPreferenceKey()}`]: true,
                                });
                                allTrackers.trackEvent(
                                    "upgrade widget",
                                    "close",
                                    "new workspace feature",
                                );
                            }
                            this.setState({
                                isTrialModalOpen: false,
                            });
                        }}
                        onCtaClick={() => {
                            this.onTrialModalCtaClick();
                            allTrackers.trackEvent("upgrade widget", "click", "talk to us");
                        }}
                    />
                </TrialWidgetContent>
                {this.vwoNewGeneralHookPopup ? (
                    <ProModal
                        isOpen={this.state.isMonthlySubscriptionsModalOpen}
                        shouldCloseOnOverlayClick={false}
                        customStyles={proModalStyles}
                        onCloseClick={() => {
                            this.setState({
                                isMonthlySubscriptionsModalOpen: false,
                            });
                            allTrackers.trackEvent("nt pushed popup", "click", "close");
                        }}
                    >
                        <NoTouchHook />
                    </ProModal>
                ) : (
                    <MonthlySubscriptionsModal
                        isOpen={this.state.isMonthlySubscriptionsModalOpen}
                        workspace={this.workspaceName}
                        purchaseUrl={`${this.swSettings.swsites.login}/purchase?workspace=${this.workspaceName}`}
                        onClose={() => {
                            this.setState({
                                isMonthlySubscriptionsModalOpen: false,
                            });
                        }}
                    />
                )}
            </>
        );
    }

    private onTrialModalCtaClick = () => {
        this.setState(
            {
                isTrialModalOpen: false,
            },
            () => {
                openUnlockModal(
                    {
                        modal: "Default",
                        slide: "Default",
                    },
                    `${LocationService.getCurrentLocation()}/TrialWidget`,
                );
            },
        );
    };

    private onCtaClick = () => {
        if (this.isNoTouch) {
            openUnlockModal(
                {
                    modal: "Default",
                    slide: "Default",
                    isNoTouch: this.isNoTouch,
                },
                `${LocationService.getCurrentLocation()}/TrialWidget`,
                false,
            );
            allTrackers.trackEvent("upgrade widget", "click", "nt hook");
        } else {
            if (this.workspaceName) {
                this.setState({
                    isTrialModalOpen: true,
                });
            } else {
                this.onTrialModalCtaClick();
            }
        }
        allTrackers.trackEvent("upgrade widget", "click", "new workspace feature");
    };

    private renderText() {
        if (this.daysLeft < 1) {
            return <b>{i18nFilter()("trial_widget.text.expired")}</b>;
        } else {
            const text = i18nFilter()(
                `trial_widget.text.${this.daysLeft > 1 ? "plural" : "single"}`,
                { number: this.daysLeft },
            );

            if (this.daysLeft <= 3) {
                return (
                    <div
                        dangerouslySetInnerHTML={{
                            __html: text.replace(`${this.daysLeft}`, `<b>${this.daysLeft}</b>`),
                        }}
                    />
                );
            }

            return text;
        }
    }

    private renderTrialWidgetButtonNoTouch = () => {
        return (
            <TrialWidgetNoTouchLink
                href={`${this.swSettings.swsites.login}/purchase?workspace=${this.workspaceName}`}
                target="_blank"
                onClick={() => {
                    allTrackers.trackEvent(
                        "nt hook",
                        "click",
                        `Buy NT/go to payment page/${this.workspaceName}`,
                    );
                }}
            >
                <TrialWidgetButton type="trial" height="24px">
                    {i18nFilter()("trial_widget.button.text.no_touch")}
                </TrialWidgetButton>
            </TrialWidgetNoTouchLink>
        );
    };

    private getPreferenceKey(): string {
        return this.daysLeft > 3 ? TRIAL_MODAL_CLOSED_1ST : TRIAL_MODAL_CLOSED_2ND;
    }

    private displayMonthlySubscriptionsModal() {
        if (this.isNoTouch && !this.isMarketingWithoutArena) {
            let renderCount: any = PreferencesService.get(MONTHLY_SUBSCRIPTIONS_MODAL_COUNT);
            let visitsCount: any = PreferencesService.get(NO_TOUCH_VISITS_COUNT);
            renderCount = isNumber(renderCount) ? renderCount + 1 : 1;
            visitsCount = isNumber(visitsCount) ? visitsCount + 1 : 1;

            if (renderCount <= 3) {
                if (visitsCount !== 2) {
                    this.timer = setTimeout(() => {
                        this.setState(
                            {
                                isMonthlySubscriptionsModalOpen: true,
                            },
                            () => {
                                PreferencesService.add({
                                    [`${MONTHLY_SUBSCRIPTIONS_MODAL_COUNT}`]: renderCount,
                                });
                            },
                        );
                    }, this.timeout);
                } else {
                    this.setState(
                        {
                            isMonthlySubscriptionsModalOpen: true,
                        },
                        () => {
                            PreferencesService.add({
                                [`${MONTHLY_SUBSCRIPTIONS_MODAL_COUNT}`]: renderCount,
                            });
                        },
                    );
                }
                PreferencesService.add({ [`${NO_TOUCH_VISITS_COUNT}`]: visitsCount });
            }
        }
    }
}

SWReactRootComponent(TrialWidget, "TrialWidget");
