import { IconButton } from "@similarweb/ui-components/dist/button";
import { PlainTooltip } from "@similarweb/ui-components/dist/plain-tooltip";
import { Injector } from "common/ioc/Injector";
import React from "react";
import reactDOM from "react-dom";
import { allTrackers } from "services/track/track";
import {
    FEED_FEEDBACK_NEGATIVE,
    FEED_FEEDBACK_POSITIVE,
} from "../../../../../app/pages/workspace/common/consts";
import { IWebsiteFeedItemFeedback } from "../../../../../app/pages/workspace/common/types";
import { ICountryObject } from "../../../../../app/services/CountryService";
import { WorkspaceContext } from "../WorkspaceContext";
import { FeedbackActionWrapper, FeedbackWrapper, IconButtonWrapper } from "./elements";
import { FeedFeedbackModal } from "./FeedFeedbackModal";

export interface IFeedbackModal {
    translate: (key) => string;
    site: string;
    country: ICountryObject;
    change: number;
    webSource: string;
    cardTitle: string;
    cardText: string;
    fromMonth: string;
    toMonth: string;
}

const getFeedbackModal = (props: IFeedbackModal): Promise<string> => {
    const swNavigator = Injector.get("swNavigator") as any;
    const current = swNavigator.current().name.replace("Workspace", "");
    allTrackers.trackEvent("Negative Feedback model", "open", current);
    const domEl = document.createElement("div");
    document.body.appendChild(domEl);
    const removeModal = () => {
        setTimeout(() => {
            reactDOM.unmountComponentAtNode(domEl);
        }, 1000);
    };
    return new Promise((resolve) => {
        const onUpdate = (text) => {
            allTrackers.trackEvent("Negative Feedback model", "Submit-ok", current);
            resolve(text);
        };
        const onExit = () => {
            allTrackers.trackEvent("Negative Feedback model", "close", current);
            resolve(String());
        };
        reactDOM.render(
            <FeedFeedbackModal
                onClose={removeModal}
                onExit={onExit}
                onUpdate={onUpdate}
                {...props}
            />,
            domEl,
        );
    });
};

interface IFeedCardFeedbackProps {
    feedbackItem: IWebsiteFeedItemFeedback;
    id: string;
    site: string;
    country: ICountryObject;
    change: number;
    webSource: string;
    cardTitle: string;
    cardText: string;
    fromMonth: string;
    toMonth: string;
}

export const FeedCardFeedback = ({
    feedbackItem,
    id,
    site,
    country,
    change,
    webSource,
    cardTitle,
    cardText,
    fromMonth,
    toMonth,
}: IFeedCardFeedbackProps) => (
    <WorkspaceContext.Consumer>
        {({ translate, setFeedback }) => {
            const setNegativeFeedback = async (id) => {
                allTrackers.trackEvent("Feedback", "click", "Negative");
                const feedbackText = await getFeedbackModal({
                    translate,
                    site,
                    country,
                    change,
                    webSource,
                    cardTitle,
                    cardText,
                    fromMonth,
                    toMonth,
                });
                if (feedbackText) {
                    setFeedback(id, FEED_FEEDBACK_NEGATIVE, feedbackText);
                }
            };
            const setPositiveFeedback = (id) => {
                allTrackers.trackEvent("Feedback", "click", "Positive");
                setFeedback(id, FEED_FEEDBACK_POSITIVE, "");
            };
            const feedbackType = feedbackItem && feedbackItem.Type;
            const isFeedbackNegative = feedbackType === FEED_FEEDBACK_NEGATIVE;
            const isFeedbackPositive = feedbackType === FEED_FEEDBACK_POSITIVE;
            return (
                <FeedbackWrapper>
                    <FeedbackActionWrapper visible={!feedbackType || isFeedbackNegative}>
                        <PlainTooltip
                            tooltipContent={translate("workspace.feed_sidebar.feedback.negative")}
                        >
                            <IconButtonWrapper
                                mirror={true}
                                feedbackSet={!!feedbackType}
                                visible={!feedbackType || isFeedbackNegative}
                            >
                                <IconButton
                                    type="flat"
                                    iconName="thumb-down"
                                    onClick={() => setNegativeFeedback(id)}
                                />
                            </IconButtonWrapper>
                        </PlainTooltip>
                    </FeedbackActionWrapper>
                    <FeedbackActionWrapper visible={!feedbackType || isFeedbackPositive}>
                        <PlainTooltip
                            tooltipContent={translate("workspace.feed_sidebar.feedback.positive")}
                        >
                            <IconButtonWrapper
                                feedbackSet={!!feedbackType}
                                visible={!feedbackType || isFeedbackPositive}
                            >
                                <IconButton
                                    type="flat"
                                    iconName="thumb-up"
                                    onClick={() => setPositiveFeedback(id)}
                                />
                            </IconButtonWrapper>
                        </PlainTooltip>
                    </FeedbackActionWrapper>
                </FeedbackWrapper>
            );
        }}
    </WorkspaceContext.Consumer>
);
