import { colorsPalettes } from "@similarweb/styles";
import { Button } from "@similarweb/ui-components/dist/button";
import { Injector } from "common/ioc/Injector";
import { GridBox, ILegendProps } from "components/React/Legends/styledComponents";
import SWReactRootComponent from "decorators/SWReactRootComponent";
import React from "react";
import { TrackWithGuidService } from "services/track/TrackWithGuidService";
import styled from "styled-components";
import { CHART_COLORS } from "../../../constants/ChartColors";
import { i18nFilter } from "../../../filters/ngFilters";
import { Legends } from "./Legends";

const AutoCompareWrapper = styled.div`
    position: relative;
    display: flex;
    flex-wrap: wrap;
    padding-left: 18px;
    border: 1px solid ${colorsPalettes.carbon[100]};
    border-radius: 6px;
    height: 68px;
`;

const Competitors = styled.div`
    opacity: 0.7;
    padding: 8px 0;
`;

const VS = styled.div`
    background-color: ${colorsPalettes.carbon[0]};
    height: 12px;
    font-size: 11px;
    margin: 6px 3px 6px 6px;
`;

const Circle = styled.div`
    width: 24px;
    height: 24px;
    position: absolute;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 50%;
    left: -12px;
    top: 21px;
    line-height: normal;
    text-align: right;
    text-transform: uppercase;
    border: 1px solid ${colorsPalettes.carbon[100]};
    background: ${colorsPalettes.carbon[0]};
`;

const CompareButtonWrapper = styled.div`
    margin: auto;
    margin-right: 19px;
`;

const AutoCompareLegends: React.FunctionComponent<ILegendProps> = ({
    legendItems,
    toggleSeries,
}) => {
    const maxWebsitesPerRow = 4;
    const colors = CHART_COLORS.compareMainColors;

    const mainSite = [];
    const itemsAmount = legendItems.length;
    const repeatAmount = Math.min(itemsAmount, maxWebsitesPerRow);

    // extract the main site from the list
    mainSite.push(legendItems[0]);

    // extract the competitors from the list
    const competitors = legendItems.slice(1);
    competitors.map((item, index) => (item.color = colors[index + (1 % colors.length)]));

    const onCompareClick = () => {
        TrackWithGuidService.trackWithGuid("wwo.visits.over.time.compare.button", "click");
        const $modal = Injector.get<any>("$modal");
        const $scope = Injector.get<any>("$rootScope").$new();
        $scope.competitorsList = competitors;
        // competitors.map(item => $scope.competitorsList.push(item.id));
        $modal.open({
            templateUrl: "/partials/websites/modal-compare.html",
            controller: "ModalCompareInstanceCtrl",
            controllerAs: "ctrl",
            scope: $scope,
        });
    };
    return (
        <GridBox>
            <Legends legendItems={mainSite} toggleSeries={toggleSeries} />
            <AutoCompareWrapper>
                <Circle>
                    <VS>VS.</VS>
                </Circle>
                <Competitors>
                    <Legends legendItems={competitors} toggleSeries={toggleSeries} />
                </Competitors>
                <CompareButtonWrapper>
                    <Button onClick={onCompareClick} type={"outlined"}>
                        {i18nFilter()("analysis.header.btn")}
                    </Button>
                </CompareButtonWrapper>
            </AutoCompareWrapper>
        </GridBox>
    );
};

SWReactRootComponent(AutoCompareLegends, "AutoCompareLegends");
