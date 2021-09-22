import * as React from "react";
import { Cookie, CookieUtils } from "../utils/cookies";
import { NPSSurveyModal } from "./NPSSurveyModal";
const ONE_YEAR_IN_SECONDS = 31536000;
const npsCookieName = "nps";
export class NPSSurvey extends React.Component {
    constructor() {
        super(...arguments);
        this.getNpsCookie = () => {
            const npsCookie = CookieUtils.getCookie(npsCookieName);
            return npsCookie ? JSON.parse(npsCookie.value) : undefined;
        };
        this.setNpsCookie = (npsCookie) => {
            const { npsCookieConfigs } = this.props;
            const cookie = new Cookie(npsCookieName, JSON.stringify(npsCookie));
            cookie.maxAge = npsCookieConfigs.maxAge;
            cookie.domain = npsCookieConfigs.domain;
            CookieUtils.setCookie(cookie);
            return npsCookie;
        };
        /**
         * Replaces current values of the stored NPS cookie, creates one if it does not already exist
         */
        this.updateNpsCookie = () => {
            const npsCookie = this.getNpsCookie();
            const isNewVisit = !npsCookie || this.isNewVisit(npsCookie);
            const resetSurveyDisplayed = !npsCookie || this.isPastSurveyInternal(npsCookie);
            const newNpsCookie = Object.assign(Object.assign({}, npsCookie), { currentUrlPath: location.pathname, hasSurveyBeenDisplayed: resetSurveyDisplayed ? false : npsCookie.hasSurveyBeenDisplayed, heartBeat: this.getCurrentUnixTime(), isInSampling: isNewVisit ? this.getUpdatedIsInSampling() : npsCookie.isInSampling, pageViewCount: this.getUpdatedPageViewCount(isNewVisit), surveyLastDisplayed: resetSurveyDisplayed
                    ? this.getInitialSurveyLastDisplayed()
                    : npsCookie.surveyLastDisplayed });
            return this.setNpsCookie(newNpsCookie);
        };
        this.getUpdatedPageViewCount = (reset) => {
            const npsCookie = this.getNpsCookie();
            if (!npsCookie || !npsCookie.pageViewCount || reset) {
                return this.isExcludedPage() ? 0 : 1;
            }
            else if (location.pathname !== npsCookie.currentUrlPath) {
                return this.isExcludedPage() ? npsCookie.pageViewCount : npsCookie.pageViewCount + 1;
            }
            else {
                return npsCookie.pageViewCount;
            }
        };
        this.getInitialSurveyLastDisplayed = () => {
            return this.getCurrentUnixTime() + ONE_YEAR_IN_SECONDS;
        };
        this.markNpsSurveyDisplayed = () => {
            this.updateNPSSurveyDisplayed(true, this.getCurrentUnixTime());
        };
        this.updateNPSSurveyDisplayed = (hasSurveyBeenDisplayed, surveyLastDisplayed) => {
            const npsCookie = this.getNpsCookie();
            const newNpsCookie = Object.assign(Object.assign({}, npsCookie), { hasSurveyBeenDisplayed,
                surveyLastDisplayed });
            return this.setNpsCookie(newNpsCookie);
        };
        this.isNewVisit = (npsCookie) => {
            const { npsConfigs } = this.props;
            return (!npsCookie.hasSurveyBeenDisplayed &&
                this.getCurrentUnixTime() - npsCookie.heartBeat > npsConfigs.idleBeforeNewVisitInSeconds);
        };
        this.isPastSurveyInternal = (npsCookie) => {
            const { npsConfigs } = this.props;
            return this.getCurrentUnixTime() - npsCookie.surveyLastDisplayed > npsConfigs.intervalBetweenSurveysInSeconds;
        };
        /**
         * Used to randomly select customer if they fall within the percentage selected for NPS survey
         * returns true if within samplingPercentage false o/w
         *
         * @param samplingPercentage    percentage as integer
         */
        this.getUpdatedIsInSampling = () => {
            const { npsConfigs } = this.props;
            const sampling = Math.random() * 100;
            return sampling <= npsConfigs.samplingPercentage;
        };
        this.isExcludedPage = () => {
            const { npsConfigs } = this.props;
            return npsConfigs.excludedPaths.some((excludedPath) => location.pathname === excludedPath);
        };
        this.getCurrentUnixTime = () => {
            return Math.floor(Date.now() / 1000);
        };
    }
    render() {
        if (typeof document === "undefined") {
            return null;
        }
        const { npsConfigs, npsModalConfigs, optIn } = this.props;
        const npsCookie = this.updateNpsCookie();
        if (!this.isExcludedPage() &&
            npsCookie &&
            npsCookie.isInSampling &&
            npsCookie.pageViewCount >= npsConfigs.pageViewCountLimit &&
            !npsCookie.hasSurveyBeenDisplayed) {
            return (React.createElement(NPSSurveyModal, { baseSurveyUrl: npsConfigs.baseSurveyUrl, pageViewCountLimit: npsConfigs.pageViewCountLimit, language: npsModalConfigs.language, modalClassName: npsModalConfigs.modalClassName, onOptOutClick: this.markNpsSurveyDisplayed, onOptInClick: this.markNpsSurveyDisplayed, isOptIn: optIn, optInToggle: this.props.optInToggle }));
        }
        return null;
    }
}
export default NPSSurvey;
//# sourceMappingURL=NPSSurvey.js.map