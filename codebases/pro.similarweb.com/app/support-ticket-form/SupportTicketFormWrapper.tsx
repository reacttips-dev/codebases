import SupportForm from "@similarweb/support-ticket-form-ui";
import React, { useEffect } from "react";
import styled from "styled-components";
import config from "./config";

const Wrapper = styled.div`
    background-color: white;
    form {
        margin-bottom: 0;
    }
`;

export const SupportTicketFormWrapper = () => {
    const { user } = window.similarweb.settings;
    const categories = window.similarweb.config.categories;
    const serviceUrl = config.supportFormServiceUrl;

    useEffect(() => {
        document.title = "Support Form";
    }, []);

    function getUsername() {
        return user.impersonateSource
            ? `${user.impersonateSource.firstName} ${user.impersonateSource.lastname}`
            : `${user.firstname} ${user.lastname}`;
    }

    function getEmail() {
        return user.impersonateSource ? user.impersonateSource.username : user.username;
    }

    return (
        <Wrapper>
            <SupportForm
                username={getUsername()}
                email={getEmail()}
                categories={categories}
                serviceUrl={serviceUrl}
            />
        </Wrapper>
    );
};
