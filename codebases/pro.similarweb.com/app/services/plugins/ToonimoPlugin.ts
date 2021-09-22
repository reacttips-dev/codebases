import swLog from "@similarweb/sw-log";
import { allTrackers } from "../track/track";

export function registerToonimoListeners() {
    let toonimo = window["Toonimo"];
    if (!toonimo) {
        return $("#toonimo-script-tag").on("load", function () {
            swLog.info("TMO Tag loaded");
            registerToonimoListeners();
        });
    }
    toonimo &&
        toonimo.Loader &&
        toonimo.Loader.registerEventsCallback(function (eventType, elementName, actionType, args) {
            swLog.debug("A new event from Toonimo: " + eventType, args);
            const action = "Toonimo/" + (args && args.walkthrough_id);
            switch (eventType) {
                case "WT_STARTED_PLAYING":
                    // started playing
                    allTrackers.trackEvent("Wizard", action, "open");
                    break;
                case "GUI_CLOSE":
                    // closed ui
                    allTrackers.trackEvent("Wizard", action, "close");
                    break;
                case "TREE_BRANCH_FINISHED":
                    // WT finished
                    allTrackers.trackEvent("Wizard", action, "finished");
                    break;
            }
        });
}
