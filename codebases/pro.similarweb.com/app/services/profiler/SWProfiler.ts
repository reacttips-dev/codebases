import angular from "angular";
import { PAGE_NAME_MAP } from "./pageNameMap.const";
import swLog from "@similarweb/sw-log";
/**
 * Profiling UI
 */
export default class SWProfiler {
    static $inject = ["$window", "swNavigator"];

    constructor(private _$window, private _swNavigator) {}

    /**
     * Monitor UI render time after data returned - to be executed in the AJAX callback function
     * @param componentName
     */
    startEndOnNextTick(componentName) {
        let _componentName = componentName;
        let _newInteraction;
        if (this.checkForInteractionAvailability()) {
            _newInteraction = this.startInteraction(_componentName);
            setTimeout(() => {
                requestAnimationFrame(() => {
                    this.endInteraction(_newInteraction);
                });
            });
        }
    }

    /**
     * Starts new browser interaction with given component name
     * @param interactionId
     * @param componentName
     * @returns {any}
     */
    startInteraction(interactionName, attributes?: any) {
        let _interactionName = interactionName;
        let _interactionId = Math.random() + _interactionName;
        let _newInteraction = this.interactionInit();

        //Break if no interaction created!
        if (!_newInteraction) return false;
        //////////////////////////////////

        _newInteraction.setName(_interactionName);
        _newInteraction.save();
        this.setInteractionDefaultAttributes(_newInteraction, attributes);

        return _newInteraction;
    }

    /**
     * End current interaction under setTimeout in order to execute after any code in current stack
     */
    endInteraction(interaction) {
        try {
            let _currentInteraction = interaction;
            _currentInteraction.end();
        } catch (e) {
            swLog.error(`_currentInteraction.end() exception`);
        }
    }

    /**
     * Sets default parameters for given interation object.
     * @param interaction
     */
    setInteractionDefaultAttributes(interaction, attributes?: any) {
        let _moduleName = this._swNavigator.getCurrentModule();
        let _pageTitle = PAGE_NAME_MAP[this._swNavigator.current().name];
        let _userName = this._$window.GTM.user.name;
        let _subscriptionProductName = this._$window.GTM.user.subscriptionProductName;
        let _userId = this._$window.GTM.user.id;
        let _url = this._$window.location.href;
        if (this.checkForInteractionAvailability()) {
            interaction.setAttribute("Pro-Module", _moduleName);
            interaction.setAttribute("Pro-Page", _pageTitle);
            interaction.setAttribute("UserName", _userName);
            interaction.setAttribute("subscriptionProductName", _subscriptionProductName);
            interaction.setAttribute("UserId", _userId);
            interaction.setAttribute("FullUrl", _url);
            if (attributes) {
                const keys = Object.keys(attributes);
                for (let key in keys) {
                    interaction.setAttribute(keys[key], attributes[keys[key]]);
                }
            }
            interaction.save();
        }
    }

    /**
     * Checks if the monitoring tool is available on window (currently NewRelic).
     * @returns {any}
     */
    checkForInteractionAvailability() {
        return this._$window.newrelic;
    }

    /**
     * Return new interaction for the monitoring tool (currently NewRelic).
     * @returns {any}
     */
    interactionInit() {
        if (this._$window.newrelic) {
            return this._$window.newrelic.interaction();
        } else {
            return false;
        }
    }

    /**
     * Set current route name to in NewRelic interaction.
     * @param name
     */
    setCurrentRouteName(name) {
        if (this._$window.newrelic) {
            this._$window.newrelic.setCurrentRouteName(name);
        }
    }
}
angular.module("sw.common").service("swProfiler", SWProfiler);
