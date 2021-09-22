import swLog from "@similarweb/sw-log";
import { allTrackers } from "../track/track";
import { Injector } from "common/ioc/Injector";
import { ISwSettings } from "../../@types/ISwSettings";
import * as _ from "lodash";

export function isWERunning() {
    return _.isObject(window["webengage"]);
}

export function openSurvey(surveyId, force) {
    // invoking webengage.survey.render with specific survey id
    return (
        isWERunning() &&
        window["webengage"].survey.render({
            surveyId: surveyId,
            forcedRender: force,
            skipRules: force,
        })
    );
}

export function registerSurveyListeners() {
    if (!isWERunning()) {
        return;
    }

    let survey = window["webengage"].survey;
    survey.onOpen(function () {
        swLog.debug("survey open");
        allTrackers.trackEvent("Pop Up", "open", "NPS survey");
    });

    survey.onClose(function () {
        swLog.debug("survey closed");
        allTrackers.trackEvent("Pop Up", "close", "NPS survey");
    });

    survey.onComplete(function () {
        swLog.debug("survey complete");
    });

    survey.onSubmit(function (data) {
        swLog.debug("Submitted Survey: " + data);

        // send data to marketo
        try {
            const marketoData = {
                NPS_Score__c: _.get(
                    _.find(data.questionResponses, { value: { "@class": "score" } }),
                    "value.value",
                ),
                NPS_Survey_Date__c: new Date().toISOString(),
                NPS_Additional_Details__c: _.get(
                    _.find(data.questionResponses, { value: { "@class": "text" } }),
                    "value.text",
                ),
            };
            allTrackers.trackEvent("Pop Up", "submit-ok", "NPS survey/" + marketoData.NPS_Score__c);
        } catch (e) {
            swLog.serverLogger("error submitting webengage survey", e);
        }
    });

    try {
        survey.options("defaultRender", false);
        window["webengage"].onReady(function () {
            window["webengage"].survey.render();
        });
    } catch (e) {
        swLog.error("error rendering webengage survey", e);
    }
}
