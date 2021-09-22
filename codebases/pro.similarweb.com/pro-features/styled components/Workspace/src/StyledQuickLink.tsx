import { SWReactIcons } from "@similarweb/icons";
import styled from "styled-components";

export const QuickLinkContainer = styled.a`
    cursor: pointer;
    display: flex;
    flex-direction: row;
    padding: 16px 12px;
    outline: 0;
    text-decoration: none;
    border: 0;
    width: 100%;
`;

export const Icon: any = styled(SWReactIcons)`
    svg {
        path {
            fill: #4f8df9;
        }
    }
`;

export const IconContainer = styled.div`
    width: 32px;
    height: 32px;
`;

export const LeftIcon = styled.div`
    order: 0;
    flex: 0 1 auto;
    align-self: auto;
    padding-right: 12px;
`;

export const Content = styled.div`
    order: 0;
    flex: 0 1 auto;
    align-self: auto;
    width: 100%;
`;

export const LinkTitle = styled.div`
    font-size: 16px;
    color: #2a3e52;
    font-weight: 500;
    margin: 8px 0;
    letter-spacing: 0.5px;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
`;

export const LinkText = styled.div`
    font-size: 14px;
    color: #546474;
    margin-bottom: 5px;
    letter-spacing: 0.4px;
    text-overflow: ellipsis;
    overflow: hidden;
`;

export const DownloadLeftIcon = styled(LeftIcon)`
    padding-top: 4px;
    position: relative;
    left: 5px;
`;
