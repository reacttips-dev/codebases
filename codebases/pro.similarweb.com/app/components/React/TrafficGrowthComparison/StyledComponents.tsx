import { SWReactIcons } from "@similarweb/icons";
import { colorsPalettes } from "@similarweb/styles";
import * as React from "react";
import styled from "styled-components";

export const DropdownContainer: any = styled.div`
  width: 165px;
  position: relative;
  display: flex;
  .DropdownButton{
    background: ${colorsPalettes.carbon["0"]};
  }
    .DropdownButton-text{
      color: ${colorsPalettes.carbon["0"]};
    }
  }
  .DropdownButton-text{
    color: ${colorsPalettes.carbon["400"]};
  }
`;
DropdownContainer.displayName = "DropdownContainer";
export const AvgContainer = styled.div`
    font-size: 16px;
    height: 22px;
    margin-right: 3px;
`;
AvgContainer.displayName = "AvgContainer";
export const ChartUtils = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 13px;
    ${DropdownContainer} {
        margin-right: 15px;
    }
`;
ChartUtils.displayName = "ChartUtils";
export const LeftUtils = styled.div`
    display: flex;
    align-items: center;
`;
export const RightUtils = styled.div`
    display: flex;
    align-items: center;
`;
export const DropDownText = styled.div`
    height: 24px;
    font-size: 14px;
    margin-right: 4px;
`;
export const InfoIcon: any = styled(SWReactIcons)`
    line-height: 1.4;
    width: 15px;
    height: 15px;
`;
export const TooltipContainer = styled.div`
    margin-left: 8px;
`;
