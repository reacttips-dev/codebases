import * as PropTypes from "prop-types";
import { StatelessComponent } from "react";
import * as React from "react";
import { allTrackers } from "../../../../../../app/services/track/track";
import { MarketingWorkspaceOnboardingWelcome } from "../MarketingWorkspaceOnboardingWelcome";
import { MarketingWorkspaceWelcome } from "../MarketingWorkspaceWelcome";
import { contextTypes, WithContext } from "../WithContext";
import { WizardContext } from "../Wizard";
import { TrackWithGuidService } from "services/track/TrackWithGuidService";

export interface IWelcomeStepProps {
    user?: string;
    onWorkspaceNameChange?: (e) => void;
    workspaceNameEnabled?: boolean;
    onNextStep?: (e) => void;
    isOnboarding: boolean;
}

interface IWelcomeStepState {
    fadeOut: boolean;
}

export class WelcomeStep extends React.PureComponent<IWelcomeStepProps, IWelcomeStepState> {
    public state = {
        fadeOut: false,
    };

    public static defaultProps = {
        isOnboarding: false,
    };

    public static contextTypes = {
        ...contextTypes,
        goToStep: PropTypes.func.isRequired,
    };

    private onClick = (goToStep) => (e) => {
        setTimeout(() => goToStep(0), 500);
        this.setState({ fadeOut: true });
        TrackWithGuidService.trackWithGuid("workspace.marketing.new", "click", {
            onboarding: this.props.isOnboarding ? "/onboarding" : null,
        });
        if (!this.props.isOnboarding) {
            this.props.onNextStep(e);
        }
    };

    private onWorkspaceChange = (e) => {
        this.props.onWorkspaceNameChange(e);
    };

    public render() {
        return (
            <WizardContext>
                {({ goToStep }) =>
                    this.props.isOnboarding ? (
                        <MarketingWorkspaceOnboardingWelcome
                            fadeOut={this.state.fadeOut}
                            onClick={this.onClick(goToStep)}
                        />
                    ) : (
                        <MarketingWorkspaceWelcome
                            fadeOut={this.state.fadeOut}
                            user={this.props.user}
                            onClick={this.onClick(goToStep)}
                            onChange={this.onWorkspaceChange}
                            workspaceNameEnabled={this.props.workspaceNameEnabled}
                        />
                    )
                }
            </WizardContext>
        );
    }
}

const track = (category: string, action: string, name: string, label?: string) => {
    allTrackers.trackEvent(category, action, name);
};
