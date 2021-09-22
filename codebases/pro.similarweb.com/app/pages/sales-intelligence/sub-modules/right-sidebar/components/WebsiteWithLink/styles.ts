import styled from "styled-components";
import { colorsPalettes } from "@similarweb/styles";

export const StyledDomainContainer = styled.div`
    line-height: 26px;
    margin-top: 3px;
    max-width: 260px;

    & span {
        display: inline-block;
        max-width: 100%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
`;

export const StyledWebSiteLink = styled.a`
    padding-left: 5px;
    && svg,
    &&:hover svg {
        path {
            fill: ${colorsPalettes.carbon["0"]};
        }
    }
`;

export const StyledWebSite = styled.div`
    display: flex;
    align-items: center;
    color: ${colorsPalettes.carbon["0"]};
    .ItemIcon.ItemIcon--website {
        width: 24px;
        height: 24px;
        margin-right: 8px;
    }
`;
