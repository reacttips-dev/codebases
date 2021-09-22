import React from "react";
import {
    StyledContactsListEmptyItem,
    StyledEmptyDepartment,
    StyledEmptyImage,
    StyledEmptyName,
    StyledEmptyPosition,
    StyledEmptyPrivateDate,
} from "./styles";

const ContactsItemLoading = () => {
    return (
        <StyledContactsListEmptyItem>
            <StyledEmptyImage />
            <StyledEmptyPrivateDate>
                <StyledEmptyName />
                <StyledEmptyPosition />
                <StyledEmptyDepartment />
            </StyledEmptyPrivateDate>
        </StyledContactsListEmptyItem>
    );
};

export default ContactsItemLoading;
