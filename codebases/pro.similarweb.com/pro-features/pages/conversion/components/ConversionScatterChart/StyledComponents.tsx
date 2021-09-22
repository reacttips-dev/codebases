import { SWReactIcons } from "@similarweb/icons";
import { colorsPalettes } from "@similarweb/styles";
import { Box } from "@similarweb/ui-components/dist/box";
import * as React from "react";
import styled from "styled-components";

export const ScatterGraphContainer = styled.div`
    min-height: 250px;
    height: 540px;
    padding: 15px;
    flex-wrap: wrap;
`;
ScatterGraphContainer.displayName = "ScatterGraphContainer";

export const BoxContainer: any = styled(Box)`
    width: 100%;
    max-width: 1368px;
    height: auto;
    margin: auto;
    margin-bottom: 20px;
`;
BoxContainer.displayName = "BoxContainer";

export const TitleContainer: any = styled.div<{ withBorderBottom: boolean }>`
  box-sizing: border-box;
  padding:25px 25px;
  ${({ withBorderBottom }) =>
      withBorderBottom && `border-bottom: 1px solid ${colorsPalettes.carbon["100"]}`}};
`;
TitleContainer.displayName = "TitleContainer";
TitleContainer.defaultProps = {
    withBorderBottom: true,
};

export const DropContainers: any = styled.div`
    display: flex;
    align-items: center;
    justify-content: flex-end;
    padding: 0 0 20px;
`;
DropContainers.displayName = "DropContainers";

export const Vs: any = styled.span`
    display: inline-block;
    padding: 0px 12px;
`;
Vs.displayName = "Vs";

export const CheckboxContainer = styled.div`
    display: inline-block;
    margin-left: 24px;
`;
CheckboxContainer.displayName = "CheckboxContainer";

export const ScatterZoom: any = styled.div`
    &:hover {
        cursor: url(${({ getAssetsUrl }: any) =>
                getAssetsUrl(`/images/scatter/dragtozoom_cursor@3x.svg`)}),
            zoom-in;
    }
    .highcharts-axis-labels {
        cursor: default;
    }
`;
ScatterZoom.displayName = "ScatterZoom";

export const Seperator = styled.div`
    height: 35px;
    width: 1px;
    background-color: ${colorsPalettes.carbon["100"]};
    margin: 0px 20px;
`;

export const Disclaimer = styled.div`
    margin: -25px 0 10px;
    padding: 4px 10px;
    background-color: ${colorsPalettes.sky[100]};
    color: ${colorsPalettes.carbon[400]};
    border-radius: 6px;
`;
