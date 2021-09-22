import * as React from "react";
import { StatelessComponent } from "react";
import Header from "../../../common components/Header";
import WithAllContexts from "../../../common components/WithAllContexts";
import { CategoriesList } from "./CategoriesList";
import EmptyAudienceInterestsSection from "./EmptyAudienceInterestsSection";
import LoadingAudienceInterestsSection from "./LoadingAudienceInterestsSection";
import { AudienceContainer } from "./StyledComponents";

const AudienceInterestsSection: StatelessComponent<any> = ({ loading, data }) => {
    return (
        <WithAllContexts>
            {({ translate, filters }) => {
                if ((filters.store || "").toLowerCase() === "apple") {
                    return null;
                }
                if (loading) {
                    return <LoadingAudienceInterestsSection />;
                }
                if (!data || !data.length) {
                    return <EmptyAudienceInterestsSection />;
                }
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
                    <AudienceContainer data-automation-audience-container={true}>
                        <Header
                            title={translate("app.performance.audience.title")}
                            tooltip={translate("app.performance.audience.tooltip")}
                            subtitleFilters={subtitleFilters}
                        />
                        <CategoriesList data={data} />
                    </AudienceContainer>
                );
            }}
        </WithAllContexts>
    );
};
AudienceInterestsSection.displayName = "AudienceInterestsSection";
export default AudienceInterestsSection;
