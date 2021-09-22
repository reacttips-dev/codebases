import { Box } from "@similarweb/ui-components/dist/box";
import styled from "styled-components";
import { StyledPrimaryTitle } from "../../../../../../styled components/StyledBoxTitle/src/StyledBoxTitle";
import {
    ChangeValueWrapper,
    StyledFlexWrapper,
    Title,
} from "../../../../../../components/Chart/src/components/PointValueAndChange";

export const TitleContainer = styled.div`
    box-sizing: border-box;
    padding: 25px 0 0 25px;
    ${StyledPrimaryTitle} {
        font-size: 16px;
        font-weight: normal;
        color: #2a3e52;
    }
`;

TitleContainer.displayName = "TitleContainer";

export const ContentContainer = styled.div`
  box-sizing: border-box;
  padding:0 25px 25px 25px;
  display: flex;
  flex-grow: 1;
  flex-direction: column;
  justify-content: center;
  ${ChangeValueWrapper}, ${ChangeValueWrapper} .ChangeValue,${Title}{
    font-size: 20px;
    line-height: normal;
    .ChangeValue-arrow {
      width:9px;
      height:14px;
      transform: initial;
    }
  }
  ${Title}{
    font-weight: 500;
  }
  ${StyledFlexWrapper}{
    margin-top:17px;
  }
`;

ContentContainer.displayName = "ContentContainer";

export const BoxContainer = styled(Box)`
    font-family: Roboto;
    height: auto;
    margin: 0;
    height: 280px;
    border-radius: 0;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    min-width: 304px;
    flex-grow: 1;
    flex-basis: 0;
    box-shadow: 1px 1px 0 0 #e5e7ea inset;
    :first-child {
        box-shadow: 0 1px 0 0 #e5e7ea inset;
    }
    :last-child {
        box-shadow: 1px 1px 0 0 #e5e7ea inset;
    }
    @media (max-width: 1601px) {
        :last-child {
            box-shadow: 0 1px 0 0 #e5e7ea inset;
        }
    }
    @media (max-width: 1297px) {
        :last-child {
            box-shadow: 1px 1px 0 0 #e5e7ea inset;
        }
        :nth-child(3) {
            box-shadow: 0 1px 0 0 #e5e7ea inset;
        }
    }
    @media (max-width: 1200px) {
        :nth-child(3) {
            box-shadow: 1px 1px 0 0 #e5e7ea inset;
        }
        :last-child {
            box-shadow: 0 1px 0 0 #e5e7ea inset;
        }
    }
    @media (max-width: 997px) {
        :nth-child(3) {
            box-shadow: 0 1px 0 0 #e5e7ea inset;
        }
        :last-child {
            box-shadow: 1px 1px 0 0 #e5e7ea inset;
        }
    }
    @media (max-width: 693px) {
        box-shadow: 0 1px 0 0 #e5e7ea inset;
    }
`;

BoxContainer.displayName = "BoxContainer";
