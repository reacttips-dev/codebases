import { Button } from "@similarweb/ui-components/dist/button";
import * as React from "react";
import { StatelessComponent } from "react";
import { FooterLayout, LearnMore } from "../page/StyledComponents";

const Footer: StatelessComponent<any> = ({ text, href, onClick }) => {
    return (
        <FooterLayout>
            <LearnMore href={href}>
                <Button type="flat" onClick={onClick}>
                    {text.toUpperCase()}
                </Button>
            </LearnMore>
        </FooterLayout>
    );
};
Footer.displayName = "Footer";
export default Footer;
