import { ContactUsDefault as SwContactUsInline } from "@similarweb/contact-us";
import { swSettings } from "common/services/swSettings";
import getUserInfo from "components/React/ContactUs/getContactUsUserInfo";
import { i18nFilter } from "filters/ngFilters";
import * as React from "react";
import { ChilipiperRouter } from "services/chiliPiper/chiliPiper";
import { allTrackers } from "services/track/track";
import {
    ContactUsInlineButton,
    ContactUsInlineContent,
    ContactUsInlineSubtitle,
    ContactUsInlineTitle,
} from "./StyledComponents";

export interface IContactUsInlineProps {
    location: string;
    label: string;
    onClose: () => void;
    customHeader?: JSX.Element;
}

interface IContactUsInlineState {
    submitted: boolean;
}

export default class ContactUsInline extends React.PureComponent<
    IContactUsInlineProps,
    IContactUsInlineState
> {
    private readonly userInfo;
    private readonly translate;
    private readonly category: string;

    constructor(props) {
        super(props);

        this.state = {
            submitted: false,
        };

        this.userInfo = getUserInfo();
        this.translate = i18nFilter();
        this.category = "hook/Contact Us/pop up";
    }

    public render() {
        const { customHeader, location, label } = this.props;
        const { submitted } = this.state;

        const header = customHeader || (
            <ContactUsInlineTitle>
                {this.translate("hook_unlock.contact_us.title")}
            </ContactUsInlineTitle>
        );

        const messagePlaceholder = this.translate("hook_unlock.contact_us.message_placeholder");

        return (
            <ContactUsInlineContent>
                {!submitted && header}
                {!submitted && (
                    <ContactUsInlineSubtitle>
                        {this.translate("hook_unlock.contact_us.subtitle", {
                            name: this.userInfo.firstName,
                        })}
                    </ContactUsInlineSubtitle>
                )}
                <SwContactUsInline
                    apiUrl={swSettings.swsites.light}
                    submitUrl={`${swSettings.swsites.light}/api/forms/hook`}
                    userInfo={this.userInfo}
                    title=""
                    subtitle=""
                    messagePlaceholder={messagePlaceholder}
                    optionalFields={["message"]}
                    track={allTrackers.trackEvent.bind(allTrackers)}
                    trackingCategory={this.category}
                    trackingName={label}
                    hiddenFields={{ formLocationBreadcrumbs: location }}
                    onSubmit={this.handleSubmit}
                    chilipiperRouter={ChilipiperRouter.CU_ROUTER_FRO_HOOKS}
                />
                {submitted && (
                    <ContactUsInlineButton type="flat" onClick={this.handleClose}>
                        {this.translate("hook_unlock.contact_us.close")}
                    </ContactUsInlineButton>
                )}
            </ContactUsInlineContent>
        );
    }

    private handleSubmit = () => {
        this.setState({ submitted: true });
    };

    private handleClose = () => {
        this.track("close");
        this.props.onClose();
    };

    private track = (action: string) => {
        const { label } = this.props;

        if (label) {
            allTrackers.trackEvent(this.category, action, label);
        }
    };
}
