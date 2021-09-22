import { swSettings } from "common/services/swSettings";
import * as queryString from "query-string";

const createOptions = <T extends {}>(data: T): RequestInit => ({
    credentials: "include",
    method: "POST",
    headers: {
        Accept: "application/json",
        "Content-Type": "application/x-www-form-urlencoded",
    },
    body: queryString.stringify(data),
});

export interface IContactUsServiceData {
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
    planId?: string;
    message?: string;
    subject?: string;
    subjectText?: string;
    company?: string;
    formLocationUrl?: string;
}

class ContactUsService {
    public static submit<T extends IContactUsServiceData>(data: T): Promise<Response> {
        return fetch(`${swSettings.swsites.light}/api/forms/contactus`, createOptions(data));
    }

    public static submitHook<T extends IContactUsServiceData>(data: T): Promise<Response> {
        return fetch(`${swSettings.swsites.light}/api/forms/hook`, createOptions(data));
    }
}

export default ContactUsService;
