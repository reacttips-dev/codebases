import * as React from "react";
import { StatelessComponent } from "react";
import { NoData } from "../../../../../../components/NoData/src/NoData";
import Header from "../../../common components/Header";
import WithAllContexts from "../../../common components/WithAllContexts";
import { AudienceLoadersContainer, NoDataContainer } from "./StyledComponents";

const EmptyAudienceInterestsSection: StatelessComponent<any> = () => (
    <WithAllContexts>
        {({ translate, filters }) => {
            const subtitleFilters = [
                {
                    filter: "date",
                    value: {
                        from: filters.from,
                        to: filters.to,
                    },
                },
                {
                    filter: "country",
                    countryCode: filters.country,
                    value: filters.countryName,
                },
            ];
            return (
                <AudienceLoadersContainer data-automation-audience-container={true}>
                    <Header
                        title={translate("app.performance.audience.title")}
                        tooltip={translate("app.performance.audience.tooltip")}
                        subtitleFilters={subtitleFilters}
                    />
                    <NoDataContainer>
                        <NoData />
                    </NoDataContainer>
                </AudienceLoadersContainer>
            );
        }}
    </WithAllContexts>
);
EmptyAudienceInterestsSection.displayName = "EmptyAudienceInterestsSection";
export default EmptyAudienceInterestsSection;
