import { NoData } from "pages/keyword-analysis/KeywordsOverviewPage/Components/UtilityComponents";
import { Button } from "@similarweb/ui-components/dist/button";
import styled from "styled-components";
import { i18nFilter } from "filters/ngFilters";
import { Injector } from "common/ioc/Injector";
import { SwNavigator } from "common/services/swNavigator";

const ButtonContainer = styled.div`
    display: flex;
    justify-content: center;
    padding-bottom: 33px;
`;

export const NoSegments = () => {
    const onBuildSegment = () => {
        Injector.get<SwNavigator>("swNavigator").go("segments-wizard");
    };
    return (
        <>
            <NoData
                noDataTitleKey={"competitive.tracker.autocomplete.no.segments.title"}
                noDataSubTitleKey={"competitive.tracker.autocomplete.no.segments.content"}
                paddingBottom={"15px"}
                paddingTop={"40px"}
            />
            <ButtonContainer>
                <Button onClick={onBuildSegment}>
                    {i18nFilter()("competitive.tracker.autocomplete.no.segments.create")}
                </Button>
            </ButtonContainer>
        </>
    );
};
