import styled from "styled-components";
import { rgba, colorsPalettes } from "@similarweb/styles";
import { getIconColor } from "pages/sales-intelligence/sub-modules/right-sidebar/helpers/contacts";

export const StyledContactsDetailsButton = styled.div<{
    loading: boolean;
    hasPhone: boolean;
    hasEmail: boolean;
    hasMobile: boolean;
}>`
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 96px;
    height: 32px;
    padding: 0 14px;
    background-color: ${({ loading }) =>
        loading ? colorsPalettes.carbon[200] : colorsPalettes.blue[400]};
    border-radius: 50px;
    box-sizing: border-box;

    .email {
        svg {
            path {
                fill: ${({ loading, hasEmail }) => getIconColor(loading, hasEmail)};
            }
        }
    }
    .phone {
        svg {
            path {
                stroke: ${({ loading, hasPhone }) => getIconColor(loading, hasPhone)};
            }
        }
    }

    .mobile-web {
        svg {
            path {
                fill: ${({ loading, hasMobile }) => getIconColor(loading, hasMobile)};
            }
        }
    }

    &:hover {
        background-color: ${({ loading }) =>
            loading ? colorsPalettes.carbon[200] : colorsPalettes.blue[500]};
    }

    & > .email {
        width: 20px;
        height: 20px;
    }
`;

export const StyledLinkedin = styled.div`
    & > a {
        height: 40px;
        width: 40px;
        border-radius: 50%;
        display: flex;
        justify-content: center;
        align-items: center;
        margin-left: 8px;
        cursor: pointer;
        &:hover {
            background-color: ${rgba(colorsPalettes.carbon[200], 0.2)};
        }
    }

    .SWReactIcons {
        height: 18px;
        width: 18px;
    }
`;

export const StyledContactsDetailsCopy = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    height: 32px;
    width: 32px;
    border-radius: 50%;
    margin-left: 5px;

    &:hover {
        background-color: ${rgba(colorsPalettes.carbon[200], 0.2)};
    }
`;

const StyledContactsDetailsItemIcon = styled.div`
    width: 20px;
    height: 20px;
    margin-right: 10px;
    margin-top: 4px;
`;

export const StyledContactsDetailsPhoneIcon = styled(StyledContactsDetailsItemIcon)`
    .SWReactIcons {
        width: 16px;
        height: 16px;
    }
`;

export const StyledContactsDetailsEmailIcon = styled(StyledContactsDetailsItemIcon)`
    .SWReactIcons {
        width: 20px;
        height: 20px;
    }
`;

export const StyledContactsDetailsItem = styled.div`
    display: flex;
    align-items: center;
    &:not(:first-child) {
        margin-top: 4px;
    }
`;

export const StyledContactsDetailsItemValue = styled.div``;

export const StyledContactsDetailsInfo = styled.div``;

export const StyledWrapperContactsDetailsInfo = styled.div`
    background: ${colorsPalettes.carbon[25]};
    margin: 0 16px 15px 16px;
    border-radius: 6px;
    padding: 4px 21px 8px;
`;

export const StyledContactsDetailsInfoHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
`;

export const StyledContactsDetailsInfoContent = styled.div`
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    font-size: 14px;
    line-height: 20px;
    color: ${colorsPalettes.carbon[400]};
`;

export const StyledContactsDetailsInfoTitle = styled.div`
    font-size: 14px;
    line-height: 20px;
    color: ${colorsPalettes.carbon[400]};
`;
