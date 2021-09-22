import ContactUsLink from "components/React/ContactUs/ContactUsLink";
import * as React from "react";

const ContactUsItemWrap = ({ children }) => (
    <ContactUsLink label="Drop Down">{children}</ContactUsLink>
);

export default ContactUsItemWrap;
