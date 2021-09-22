import { colorsPalettes } from "@similarweb/styles";
import { setFont } from "@similarweb/styles/src/mixins";
import { Title } from "@similarweb/ui-components/dist/title";
import { AssetsService } from "services/AssetsService";
import styled from "styled-components";

export const MainBox = styled.div`
    border-radius: 6px;
    background-color: ${colorsPalettes.carbon["0"]};
`;

export const HeaderBox = styled.div`
    height: 206px;
    background: #e4f2fe url(${AssetsService.assetUrl(`/images/email-illustration.svg`)}) no-repeat
        center center;
    -webkit-box-shadow: inset 0 -5px 5px 0 rgba(0, 0, 0, 0.1);
    box-shadow: inset 0 -5px 5px 0 rgba(0, 0, 0, 0.1);
`;

export const FooterBox = styled.div`
    height: 183px;
    margin-top: 25px;
`;

export const CustomTitle: any = styled(Title)`
    ${setFont({ $size: 24, $color: colorsPalettes.carbon[500], $weight: 500 })};
    padding: 0 0 8px 0;
    text-align: center;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.17;
    letter-spacing: -0.4px;
    text-align: center;
    color: #2a3e52;
`;

export const Subtitle: any = styled(Title)`
    ${setFont({ $size: 14, $color: colorsPalettes.carbon[500], $weight: "normal" })};
    font-stretch: normal;
    font-style: normal;
    line-height: 1.43;
    letter-spacing: normal;
    text-align: center;
    padding-bottom: 25px;
    width: 80%;
    margin: 0 auto;
    span {
        font-weight: normal;
    }
`;

export const ButtonBox = styled.div`
    display: flex;
    justify-content: center;
    marginL 0 10px 0 0;

    button:first-child {
        margin-right: 8px;
    }
`;
