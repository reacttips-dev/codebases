import React from "react";
import dateTimeService from "services/date-time/dateTimeService";
import { commonWebSources } from "components/filters-bar/utils";
import { StyledInfoSection } from "./styles";
import { useSalesSettingsHelper } from "../../../../../services/salesSettingsHelper";
import OpportunityListPageContext from "../../../context/OpportunityListPageContext";

const InfoSection = () => {
    const {
        list: { country },
    } = React.useContext(OpportunityListPageContext);
    const settingsHelper = useSalesSettingsHelper();
    const lastSnapshotDate = settingsHelper.getLastSnapshotDate();
    const trafficSourceText = React.useMemo(() => {
        const source = settingsHelper.getTrafficSourceForCountryId(country);

        return commonWebSources[source]?.()?.text ?? "";
    }, [country]);
    const formattedDate = React.useMemo(() => {
        return dateTimeService.formatWithMoment(lastSnapshotDate, "MMMM YYYY");
    }, [lastSnapshotDate]);

    return (
        <StyledInfoSection>
            <span>{formattedDate}</span>
            {trafficSourceText && <span>,&nbsp;{trafficSourceText}</span>}
        </StyledInfoSection>
    );
};

export default InfoSection;
