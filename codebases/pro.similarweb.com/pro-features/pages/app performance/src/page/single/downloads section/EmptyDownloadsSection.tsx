import * as React from "react";
import { StatelessComponent } from "react";
import { NoData } from "../../../../../../components/NoData/src/NoData";
import Header from "../../../common components/Header";
import WithAllContexts from "../../../common components/WithAllContexts";
import { EmptyDownloadsContainer, NoDataContainer } from "./StyledComponents";

const EmptyDownloadsSection: StatelessComponent<any> = () => (
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
                <EmptyDownloadsContainer data-automation-downloads-container={true}>
                    <Header
                        title={translate("app.performance.downloads.title")}
                        tooltip={translate("app.performance.downloads.tooltip")}
                        subtitleFilters={subtitleFilters}
                    />
                    <NoDataContainer>
                        <NoData />
                    </NoDataContainer>
                </EmptyDownloadsContainer>
            );
        }}
    </WithAllContexts>
);
EmptyDownloadsSection.displayName = "EmptyDownloadsSection";
export default EmptyDownloadsSection;
