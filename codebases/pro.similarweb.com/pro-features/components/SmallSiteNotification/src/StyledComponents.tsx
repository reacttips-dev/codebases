import { colorsPalettes, mixins, rgba } from "@similarweb/styles";
import styled from "styled-components";

import { AssetsService } from "services/AssetsService";
import { ButtonGroup } from "../../ButtonsGroup/src/ButtonsGroup";

export const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: -16px;
    width: 415px;
`;

export const Content = styled.div`
    padding: 32px 32px 32px 24px;
`;

export const Title = styled.div`
    ${mixins.setFont({
        $size: 16,
        $color: colorsPalettes.carbon[500],
        $weight: 500,
    })};
    margin-bottom: 16px;
    text-align: left;
    overflow: hidden;
    text-overflow: ellipsis;
    width: 360px;
    line-height: 1.25;
`;

export const Text = styled.div`
    width: 360px;
    height: 72px;
    ${mixins.setFont({
        $size: 14,
        $color: rgba(colorsPalettes.carbon[500], 0.8),
    })};
    text-align: left;
    line-height: 1.71;
`;

export const CustomButtonsGroup = styled(ButtonGroup)`
    text-transform: uppercase;
    border-top: 1px solid ${colorsPalettes.carbon[50]};
    width: 415px;
    height: 48px;
`;
