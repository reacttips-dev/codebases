import { colorsPalettes } from "@similarweb/styles";
import { setFont } from "@similarweb/styles/src/mixins";
import { Title } from "@similarweb/ui-components/dist/title";
import styled from "styled-components";

export const MainBox = styled.div`
    border-radius: 6px;
    background-color: ${colorsPalettes.carbon["0"]};
`;

export const ButtonBox = styled.div`
    display: flex;
    justify-content: flex-end;

    button:first-child {
        margin-right: 8px;
    }
`;

export const CustomTitle = styled.div`
    ${setFont({ $size: 16, $color: colorsPalettes.carbon[500], $weight: "bold" })};
    font-stretch: normal;
    font-style: normal;
    line-height: 1.5;
    letter-spacing: 0.25px;
    padding-bottom: 32px;
`;

export const Subtitle: any = styled(Title)`
    ${setFont({ $size: 14, $color: colorsPalettes.carbon[500], $weight: "normal" })};
    font-stretch: normal;
    font-style: normal;
    line-height: 1.43;
    letter-spacing: normal;
    padding-bottom: 32px;
`;
