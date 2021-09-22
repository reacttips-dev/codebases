import * as React from "react";
import * as PropTypes from "prop-types";
import { Injector } from "common/ioc/Injector";
import DurationService from "services/DurationService";
import I18n from "../Filters/I18n";
import { StatelessComponent } from "react";
import CountryService from "services/CountryService";

export type componentSubTitleProps = {
    webSource: string;
    duration: string;
    country: string;
    className?: string;
};

const ComponentSubTitle: StatelessComponent<componentSubTitleProps> = ({
    country,
    duration,
    webSource,
    className,
}) => {
    const { forWidget: title } = DurationService.getDurationData(duration, "", "");
    const { text: countryText, parent: parentCountryCode } = CountryService.countriesById[country];
    if (parentCountryCode) {
        country = parentCountryCode;
    }
    let webSourceTextKey = "",
        webSourceIconClass = "";
    switch (webSource) {
        case "Desktop":
            webSourceTextKey = "toggler.title.desktop";
            webSourceIconClass = "icon-desktop";
            break;
        case "MobileWeb":
            webSourceTextKey = "toggler.title.mobile";
            webSourceIconClass = "icon-mobile-web";
            break;
    }
    return (
        <div className={`component-subtitle u-flex-row ${className}`}>
            <span>{title}</span>
            <span className={`country-icon  country-icon-${country}`} />
            <span className={`country-text`}>{countryText}</span>
            <span className={`websource-icon icon ${webSourceIconClass}`} />
            <I18n className={`websource-text`}>{webSourceTextKey}</I18n>
        </div>
    );
};

ComponentSubTitle.propTypes = {
    country: PropTypes.string.isRequired,
    duration: PropTypes.string.isRequired,
    webSource: PropTypes.string.isRequired,
    className: PropTypes.string,
};

ComponentSubTitle.defaultProps = {
    className: "",
};

export default ComponentSubTitle;
