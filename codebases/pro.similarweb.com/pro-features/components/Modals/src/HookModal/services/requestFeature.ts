import { swSettings } from "common/services/swSettings";
import getUserInfo from "components/React/ContactUs/getContactUsUserInfo";
import ContactUsService from "services/ContactUsService";

export const requestFeature = (hookId: string): void => {
    const formLocationUrl = window.location.href;
    const { firstName, lastName, email, phone } = getUserInfo();

    ContactUsService.submitHook({
        firstName,
        lastName,
        email,
        phone,
        planId: swSettings.user.plan,
        message: "",
        subject: `Contact Sales: ${hookId}`,
        company: "",
        formLocationUrl,
    });
};
