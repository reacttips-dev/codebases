import React from "react";
import { PlainTooltip } from "@similarweb/ui-components/dist/plain-tooltip";
import { ContactsDepartments } from "pages/sales-intelligence/sub-modules/contacts/store/types";
import { useTranslation } from "components/WithTranslation/src/I18n";
import {
    StyledContact,
    StyledContactName,
    StyledDepartment,
    StyledIconChecked,
    StyledRole,
} from "./styles";

type ContactType = {
    name: string;
    position: string;
    departments: string;
    unlocked: boolean;
};

const Contact: React.FC<ContactType> = ({ name, position, departments, unlocked }) => {
    const translate = useTranslation();
    const tooltipContent = translate("si.sidebar.contacts.contacts_revealed");
    return (
        <StyledContact>
            <StyledContactName>
                {name}
                {unlocked && (
                    <PlainTooltip tooltipContent={tooltipContent}>
                        <div>
                            <StyledIconChecked size="xs" iconName="checked-circle-unfilled" />
                        </div>
                    </PlainTooltip>
                )}
            </StyledContactName>
            <StyledRole>{position}</StyledRole>
            {departments.split(",").map((department) => (
                <StyledDepartment
                    key={department.toUpperCase().trim()}
                    name={department.toUpperCase().trim() as ContactsDepartments}
                >
                    {department}
                </StyledDepartment>
            ))}
        </StyledContact>
    );
};

export default Contact;
