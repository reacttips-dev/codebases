import UserVoiceNpsLightningCallout from './UserVoiceNpsLightningCallout';
import { LightningId } from 'owa-lightning-v2';
import { isFeatureEnabled } from 'owa-feature-flags';
import getUserConfiguration from 'owa-session-store/lib/actions/getUserConfiguration';
import { TargetedAdsV3Prompt } from 'owa-gdpradsv3tcf-optin';
import { TargetedAdsLgpdPrompt } from 'owa-lgpd-optin';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import SuiteNpsLightningCallout from './SuiteNpsLightningCallout';
import { OptionsPaneLaunch } from './OptionsPaneLaunch';
import { owaDate, addDays } from 'owa-datetime';
import { lazyIsNpsSurveyPolicyEnabled } from 'owa-ocps-policy-store';

const primaryViewContainer = document.createElement('div');
primaryViewContainer.id = 'lpv';

function LightningPrimaryView(props: { isOcpsNpsPolicyEnabled: boolean }) {
    const onNpsLightUp = lightup => {
        const { PolicySettings, UserOptions, IsConsumerChild } = getUserConfiguration();
        let isInReactFor7Days = true;
        if (
            UserOptions?.FirstOWAReactMailLogon &&
            !isNaN(Date.parse(UserOptions.FirstOWAReactMailLogon)) &&
            owaDate() <=
                addDays(
                    owaDate('UTC', new Date(UserOptions.FirstOWAReactMailLogon).toISOString()),
                    7
                )
        ) {
            isInReactFor7Days = false;
        }
        if (
            isFeatureEnabled('usv-nps') &&
            PolicySettings?.NpsSurveysEnabled &&
            isInReactFor7Days &&
            props.isOcpsNpsPolicyEnabled &&
            !IsConsumerChild
        ) {
            setTimeout(() => lightup(), 1000);
        }
    };
    const onSuiteNpsLightUp = lightup => {
        const { PolicySettings, IsConsumerChild } = getUserConfiguration();
        if (
            isFeatureEnabled('office-suite-nps') &&
            PolicySettings?.NpsSurveysEnabled &&
            props.isOcpsNpsPolicyEnabled &&
            !IsConsumerChild
        ) {
            lightup();
        }
    };

    const onOptionsPaneLightup = lightup => {
        const userConfig = getUserConfiguration();
        if (
            isFeatureEnabled('fwk-edgeEnabledThemes') &&
            !isFeatureEnabled('fwk-suiteThemes') &&
            userConfig.UserOptions &&
            userConfig.UserOptions.ThemeStorageId?.indexOf('edge') == -1 &&
            !userConfig.UserOptions.IsDarkModeTheme
        ) {
            lightup();
        }
    };
    return (
        <>
            <TargetedAdsLgpdPrompt />
            <TargetedAdsV3Prompt />
            <UserVoiceNpsLightningCallout
                lid={LightningId.UserVoiceSatisfactionFirstRun} // lightning id
                when={onNpsLightUp}
                isFirstSurvey={true}
            />
            <UserVoiceNpsLightningCallout
                lid={LightningId.UserVoiceSatisfactionSecondRun} // lightning id
                when={onNpsLightUp}
                isFirstSurvey={false}
            />
            <SuiteNpsLightningCallout
                isFirstSurvey={true}
                lid={LightningId.SuiteNps} // Suite Nps lightning id
                when={onSuiteNpsLightUp}
            />
            <OptionsPaneLaunch
                lid={LightningId.OptionsPaneLaunch} // Options pane lightning id
                when={onOptionsPaneLightup}
                series={[LightningId.OptionsPaneLaunch, LightningId.ThemeOfTheDay]}
            />
        </>
    );
}

export default async function loadLightningPrimaryView() {
    const isOcpsNpsPolicyEnabled = await lazyIsNpsSurveyPolicyEnabled.importAndExecute();
    document.body.appendChild(primaryViewContainer);
    ReactDOM.render(
        <React.StrictMode>
            <LightningPrimaryView isOcpsNpsPolicyEnabled={isOcpsNpsPolicyEnabled} />
        </React.StrictMode>,
        primaryViewContainer
    );
}
