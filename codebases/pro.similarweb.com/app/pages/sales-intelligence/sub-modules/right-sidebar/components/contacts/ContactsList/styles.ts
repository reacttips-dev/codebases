import styled from "styled-components";
import { colorsPalettes } from "@similarweb/styles";
import { StyledIcon } from "pages/sales-intelligence/sub-modules/right-sidebar/components/contacts/ContactstImage/styles";

export const StyledContactsList = styled.div`
    display: flex;
    flex-direction: column;
    height: calc(100% - 25px);
    width: 100%;
`;

export const StyledWrapperContactsItem = styled.div`
    flex-grow: 1;
    overflow-y: scroll;
    height: 100%;
    padding-bottom: 24px;
`;

export const StyledContactsListWrapperItem = styled.div`
    border-bottom: 1px solid ${colorsPalettes.carbon[50]};
`;

export const StyledContactsListItemContact = styled.div`
    display: flex;
    flex: 0 0 70%;
    box-sizing: border-box;
    align-items: center;
    padding-left: 16px;
`;

export const StyledContactsListItemContactDetails = styled.div<{ clicked: boolean }>`
    display: ${({ clicked }) => (clicked ? "flex" : "none")};
    flex: 0 0 30%;
    box-sizing: border-box;
    align-items: center;
    justify-content: center;
    padding-left: 10px;
`;

export const StyledContactsListItem = styled.div<{ extend: boolean }>`
    display: flex;
    min-height: 80px;
    padding: 8px 0;
    box-sizing: border-box;

    &:hover {
        background-color: ${({ extend }) =>
            extend ? colorsPalettes.carbon[0] : colorsPalettes.carbon[25]};
        ${StyledContactsListItemContactDetails} {
            display: flex;
        }
        ${StyledIcon} {
            width: 58px;
            height: 58px;
            border: 2px solid ${colorsPalettes.carbon[0]};
        }
    }
`;

export const StyledContactsListEmptyItem = styled.div`
    display: flex;
    align-items: center;
    width: 100%;
    height: 80px;
    border-bottom: 1px solid ${colorsPalettes.carbon[50]};
    padding-left: 16px;
`;

export const StyledEmptyImage = styled.div`
    width: 62px;
    height: 62px;
    border-radius: 50%;
    background: linear-gradient(to right, #f6f7f9 0%, #eff2f6 100%);
`;

export const StyledEmptyPrivateDate = styled.div`
    margin-left: 16px;
`;

export const StyledEmptyName = styled.div`
    height: 14px;
    width: 182px;
    background: linear-gradient(to right, #f6f7f9 0%, #eff2f6 100%);
`;

export const StyledEmptyPosition = styled.div`
    height: 10px;
    width: 76px;
    margin: 8px 0;
    background: linear-gradient(#f6f7f9 0%, #eff2f6 100%);
`;
export const StyledEmptyDepartment = styled.div`
    height: 10px;
    width: 109px;
    background: linear-gradient(#f6f7f9 0%, #eff2f6 100%);
`;

export const StyledContactsListHeader = styled.div`
    height: 32px;
    background-color: ${colorsPalettes.carbon[25]};
    font-size: 12px;
    line-height: 32px;
    font-weight: 500;
    box-sizing: border-box;
    color: ${colorsPalettes.carbon[300]};
    padding-left: 10px;
    border-bottom: 1px solid ${colorsPalettes.carbon[50]};
`;

export const StyledInfinityLoader = styled.div`
    height: 80px;
`;

export const StyledContactsLoadingList = styled.div`
    width: 100%;
`;
