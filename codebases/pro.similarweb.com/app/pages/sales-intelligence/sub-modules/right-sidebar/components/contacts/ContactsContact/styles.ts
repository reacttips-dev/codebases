import styled from "styled-components";
import { SWReactIcons } from "@similarweb/icons";
import { colorsPalettes } from "@similarweb/styles";
import {
    getContactsDepartmentsBackground,
    getContactsDepartmentsColor,
} from "../../../helpers/contacts";
import { ContactsDepartments } from "pages/sales-intelligence/sub-modules/contacts/store/types";

export const StyledContact = styled.div`
    padding-left: 16px;
`;

export const StyledContactName = styled.div`
    color: ${colorsPalettes.carbon[300]};
    display: flex;
    font-size: 12px;
    line-height: 16px;
`;

export const StyledRole = styled.div`
    font-size: 14px;
    font-weight: 500;
    line-height: 20px;
`;

export const StyledDepartment = styled.div<{ name: ContactsDepartments }>`
    display: inline-block;
    font-size: 10px;
    font-weight: 500;
    line-height: 20px;
    text-transform: uppercase;
    background: ${({ name }) => getContactsDepartmentsBackground(name)};
    border-radius: 12px;
    color: ${({ name }) => getContactsDepartmentsColor(name)};
    padding: 0 6px;
    margin-top: 5px;
    margin-right: 8px;
`;

export const StyledIconChecked = styled(SWReactIcons)`
    margin-left: 8px;
`;
