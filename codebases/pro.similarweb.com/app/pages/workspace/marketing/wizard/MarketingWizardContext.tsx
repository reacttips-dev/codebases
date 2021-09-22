import { contextTypes } from "../../../../../.pro-features/components/Workspace/Wizard/src/WithContext";
import * as React from "react";
import { allTrackers } from "../../../../services/track/track";
import { i18nFilter } from "filters/ngFilters";
export class MarketingWizardContext extends React.Component<any, any> {
    getChildContext() {
        return {
            translate: i18nFilter(),
            track: allTrackers.trackEvent.bind(allTrackers),
        };
    }

    render() {
        return this.props.children;
    }

    public static childContextTypes = contextTypes;
}
