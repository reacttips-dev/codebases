import * as React from "react";
import { Button, Modal, Survey } from "../../";
import { analytics } from "../../utils/Analytics";
import { ConfirmitURLBuilder } from "./ConfirmitURLBuilder";
import * as styles from "./style.css";
import { en, fr } from "./translations";
export class NPSSurveyModal extends React.Component {
    constructor(props) {
        super(props);
        this.onOptInClick = (surveyUrl) => {
            // In ecomm-webapp part of the render occurs on the server side which doesn't contain the window object
            if (typeof window !== "undefined") {
                window.open(surveyUrl);
                analytics.eventToAppEventData({ event: "NPS_Survey_Begin_Survey" });
                if (this.props.onOptInClick) {
                    this.props.onOptInClick();
                }
            }
            this.setState({
                open: false,
            });
        };
        this.onModalClose = () => {
            analytics.eventToAppEventData({ event: "NPS_Survey_No_Thanks" });
            this.setState({
                open: false,
            });
            if (this.props.onOptOutClick) {
                this.props.onOptOutClick();
            }
        };
        this.state = { open: false };
    }
    componentDidMount() {
        this.setState({
            open: true,
        }, () => {
            analytics.eventToAppEventData({ event: "NPS_Survey_Popup" });
        });
    }
    render() {
        const urlProps = {
            baseUrl: this.props.baseSurveyUrl,
            locale: this.props.language,
            pageView: this.props.pageViewCountLimit,
        };
        const surveyUrl = ConfirmitURLBuilder.buildConfirmitURL(urlProps);
        const classNames = this.props.isOptIn ? styles.bubbleModalContainer : styles.feedbackModalContainer;
        const messages = this.props.language === "en" ? en : fr;
        return (React.createElement("div", { className: styles.npsSurveyModal },
            React.createElement(Modal, { visible: this.state.open, closeIcon: false, theme: "toaster", className: `${classNames} ${styles.npsContainer} ${this.props.modalClassName}` }, this.props.isOptIn ? (React.createElement("div", { onClick: () => this.onOptInClick(surveyUrl), "data-automation": "nps-survey-content-surveyURL-container" },
                React.createElement(Survey, { className: styles.surveyIcon }),
                React.createElement("div", { className: styles.bubbleText }, messages.beginSurvey))) : (React.createElement(React.Fragment, null,
                React.createElement("div", { className: styles.npsSurveyContentOuterContainer, "data-automation": "nps-survey-content-outer-container" },
                    React.createElement("div", { className: styles.npsSurveyContentInnerContainer },
                        React.createElement("h2", { className: styles.npsSurveyHeading }, messages.headingText),
                        React.createElement("p", { className: styles.questionText }, messages.infoText),
                        React.createElement("p", { className: styles.infoText }, messages.questionText))),
                React.createElement("div", { className: styles.npmSurveyButtonContainer },
                    React.createElement(Button, { appearance: "transparent", className: styles.optOutButton, onClick: () => this.onModalClose(), extraAttrs: { "data-automation": "opt-out-button" } }, messages.optOutButton),
                    React.createElement(Button, { appearance: "primary", className: styles.optInButton, onClick: () => this.props.optInToggle(), extraAttrs: { "data-automation": "opt-in-button" } }, messages.optInButton)))))));
    }
}
export default NPSSurveyModal;
//# sourceMappingURL=NPSSurveyModal.js.map