import { colorsPalettes, rgba } from "@similarweb/styles";
import { setFont } from "@similarweb/styles/src/mixins";
import { IconButton } from "@similarweb/ui-components/dist/button";
import { SliderHeader } from "@similarweb/ui-components/dist/slider";
import styled from "styled-components";

interface ICompetitors {
    numOfCompetitors: number;
}

export const GroupContainer = styled.div`
    margin-bottom: 24px;
    position: relative;
    ${SliderHeader} {
        margin-bottom: 15px;
    }
`;
export const Title = styled.div`
    line-height: 24px;
    ${setFont({ $size: 16, $weight: 400 })};
    color: ${rgba(colorsPalettes.carbon["500"], 1)};
    vertical-align: top;
    margin-bottom: 8px;
`;
export const SubTitle = styled.div`
    line-height: 16px;
    ${setFont({ $size: 14, $weight: 400 })};
    color: ${rgba(colorsPalettes.carbon["500"], 0.8)};
`;
export const TitleContainer = styled.div`
    height: 88px;
`;
export const DeleteButton = styled(IconButton)`
    visibility: hidden;
`;
export const DeleteButtonContainer = styled.div`
    position: relative;
    left: -14px;
`;
export const LegendContainer = styled.div`
    position: absolute;
    top: -4px;
    display: flex;
    &:hover {
        ${DeleteButton} {
            visibility: visible;
        }
    }
`;
export const Competitors = styled.div<ICompetitors>`
    margin-bottom: ${({ numOfCompetitors }: any) => (numOfCompetitors < 2 ? "80px" : "16px")};
`;
export const ButtonContainer = styled.div`
    display: flex;
    justify-content: space-around;
`;
export const LeftButton = styled.span`
    flex-grow: 1;
`;
export const RightButton = styled.span`
    flex-grow: 0;
    & Button:last-child {
        margin-left: 8px;
    }
`;
