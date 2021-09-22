import BoxSubtitle from "components/BoxSubtitle/src/BoxSubtitle";
import * as React from "react";
import { connect } from "react-redux";
import CountryService from "services/CountryService";
import DurationService from "services/DurationService";
import StyledBoxSubtitle from "styled components/StyledBoxSubtitle/src/StyledBoxSubtitle";

const WidgetSubtitleInner = (props) => {
    const { country: countryCode, duration } = props.routing.params;
    const webSource = props.webSource ? props.webSource : props.routing.params.webSource;
    const countryName = CountryService.getCountryById(countryCode)?.text;
    const { from, to } = DurationService.getDurationData(duration).forAPI;
    const subtitleFilters = [
        {
            filter: "date",
            value: {
                from,
                to,
            },
        },
        {
            filter: "country",
            countryCode,
            value: countryName,
        },
        {
            filter: "webSource",
            value: webSource,
        },
    ];
    return (
        <StyledBoxSubtitle>
            <BoxSubtitle filters={subtitleFilters} />
        </StyledBoxSubtitle>
    );
};

const widgetSubtitleMapStateToProps = (props) => ({ ...props });

export const WidgetSubtitle = connect(widgetSubtitleMapStateToProps)(WidgetSubtitleInner);
