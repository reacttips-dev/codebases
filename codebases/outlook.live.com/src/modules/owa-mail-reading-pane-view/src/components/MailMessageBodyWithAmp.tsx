import * as React from 'react';
import { observer } from 'mobx-react';
import { AMPViewer, AMPValidator } from 'owa-amp';
import MailMessageBody, { MailMessageBodyProps } from './MailMessageBody';
import AmpViewState, { AMPAvailability } from 'owa-mail-amp-store/lib/store/schema/AmpViewState';
import updateAmpAvailability from 'owa-mail-reading-pane-store/lib/actions/updateAmpAvailability';
import type Message from 'owa-service/lib/contract/Message';
import { Spinner, SpinnerSize } from '@fluentui/react/lib/Spinner';
import { PerformanceDatapoint } from 'owa-analytics';
import isAmpEnabled from 'owa-mail-amp-store/lib/utils/isAmpEnabled';
import getAmpSender from 'owa-mail-amp-store/lib/utils/getAmpSender';

// Track how much time users spend on a message.
// It will be a measurement from component mount to unmount really very rough measurement
// CustomData: message type (amp | html), ampEnabled, preferAmp, ampAvailability
const DATAPOINT_RPITEMREAD = 'RPItemRead';

// The component will be in only one of following state
// None - nothing is rendered
// ValidateAmp - validating Amp
// Html - render html
// Amp - render AMP
enum AmpRenderState {
    None = 'none',
    ValidateAmp = 'validateAmp',
    Html = 'html',
    Amp = 'amp',
}

export interface MailMessageBodyWithAmpProps extends MailMessageBodyProps {
    ampViewState: AmpViewState;
    measureReadTime: boolean;
}

@observer
export default class MailMessageBodyWithAmp extends React.Component<
    MailMessageBodyWithAmpProps,
    {}
> {
    private readTimeDatapoint: PerformanceDatapoint = null;
    private lastRenderState: AmpRenderState = AmpRenderState.None;

    componentDidMount() {
        // What we want to measure here is from after message body loads (whether amp or none-amp) towards
        // users switching away (component unmount) -- that is *strictly* message read time excluding the time spending
        // on validation (amp has an extra valiation stage) and loading
        // The problem here is that users may toggle on/off amp to switch in-between amp and html. The switch won't trigger
        // componentUnmount as it happens inside component. To account for that scenario, we need to hook into both componentDidMount
        // and componentDidUpdate, and trigger starting/restarting data point only when some certains conditions are met
        this.evaluateAndMeasureReadTime();
    }

    componentDidUpdate() {
        this.evaluateAndMeasureReadTime();
    }

    componentWillUnmount() {
        this.finishMeasureReadTime();
    }

    render() {
        const {
            messageBody,
            copyAllowed,
            printAllowed,
            isLoading,
            className,
            item,
            undoDarkMode,
            actionableMessageCardInItemViewState,
            ampViewState,
        } = this.props;

        const message = item as Message;
        const sender = getAmpSender(message);

        const renderState = calculateAmpRenderState(ampViewState);
        if (renderState == AmpRenderState.ValidateAmp) {
            return (
                <div className={className}>
                    <Spinner size={SpinnerSize.medium} />
                    <AMPValidator
                        content={message.AmpHtmlBody}
                        sender={sender}
                        onPass={this.onPass}
                        onFail={this.onFail}
                    />
                </div>
            );
        } else if (renderState == AmpRenderState.Amp) {
            return (
                <div className={className}>
                    <AMPViewer sender={sender} content={message.AmpHtmlBody} />
                </div>
            );
        } else {
            /* not to use amp or validation failed */
            return (
                <MailMessageBody
                    className={className}
                    messageBody={messageBody}
                    item={item}
                    copyAllowed={copyAllowed}
                    printAllowed={printAllowed}
                    isLoading={isLoading}
                    undoDarkMode={undoDarkMode}
                    actionableMessageCardInItemViewState={actionableMessageCardInItemViewState}
                />
            );
        }
    }

    evaluateAndMeasureReadTime() {
        // measureReadTime is set from parent to indicate if measuring is needed. For the moment, it is only set
        // for item view and single message conversation view
        const { measureReadTime, ampViewState } = this.props;
        const isCandidate = measureReadTime && ampViewState.ampAvailability != AMPAvailability.None;
        if (isCandidate) {
            // We're essentially looking at following conditions where some measuring actions are required
            // 1) From a measuring state to a non-measuring state -- measuring should be stopped
            // 2) Transition in-between Amp to Html - measuring should be restarted
            // 3) Transition from a non-measuring state (none or ValidateAmp) to a measuring state (Amp or Html) - measuring should be started
            const currentRenderState = calculateAmpRenderState(ampViewState);
            const currentRequireMeasure = renderStateRequireMeasure(currentRenderState);
            const lastRequireMeasure = renderStateRequireMeasure(this.lastRenderState);

            let shouldStartMeasure = false;
            if (lastRequireMeasure) {
                if (!currentRequireMeasure) {
                    // Condition 1) - From measuring to non-measuring
                    this.finishMeasureReadTime();
                } else if (this.lastRenderState != currentRenderState) {
                    // Condition 2) - Transition in-between Html and Amp
                    shouldStartMeasure = true;
                }
            } else if (currentRequireMeasure) {
                // Condition 3) - from non-measuring to measuring
                shouldStartMeasure = true;
            }

            if (shouldStartMeasure) {
                // Given initial volume for amp will be very low, if we use default sampling, we will get almost nothing
                // Let's start by logging every sample for amp and adjust sampling later on
                this.finishMeasureReadTime();
                this.readTimeDatapoint = new PerformanceDatapoint(DATAPOINT_RPITEMREAD, {
                    logEvery: 1,
                });
                this.readTimeDatapoint.addCustomData([
                    currentRenderState,
                    isAmpEnabled() ? '1' : '0',
                    ampViewState.preferAmp ? '1' : '0',
                    ampViewState.ampAvailability,
                ]);
            }

            // Update the last render state
            this.lastRenderState = currentRenderState;
        }
    }

    finishMeasureReadTime() {
        if (this.readTimeDatapoint) {
            this.readTimeDatapoint.end();
            this.readTimeDatapoint = null;
        }
    }

    onPass = () => {
        updateAmpAvailability(this.props.ampViewState, AMPAvailability.AmpValidated);
    };

    onFail = () => {
        updateAmpAvailability(this.props.ampViewState, AMPAvailability.AmpValidationFailed);
    };
}

// Calculate AmpRenderState based on view state
function calculateAmpRenderState(ampViewState: AmpViewState): AmpRenderState {
    const { preferAmp, ampAvailability } = ampViewState;
    const useAmp = ampAvailability != AMPAvailability.None && isAmpEnabled() && preferAmp;
    if (useAmp) {
        if (ampAvailability == AMPAvailability.AmpNotValidated) {
            return AmpRenderState.ValidateAmp;
        } else if (ampAvailability == AMPAvailability.AmpValidated) {
            return AmpRenderState.Amp;
        }
    }
    return AmpRenderState.Html;
}

// Only two states require measure: Amp and Html
function renderStateRequireMeasure(renderState: AmpRenderState): boolean {
    return renderState == AmpRenderState.Amp || renderState == AmpRenderState.Html;
}
