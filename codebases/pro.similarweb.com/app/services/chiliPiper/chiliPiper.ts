/* eslint-disable @typescript-eslint/camelcase */
import isFunction from "lodash/isFunction";

import getUserInfo from "components/React/ContactUs/getContactUsUserInfo";

/**
 *  @see https://support.chilipiper.com/article/76-inbound-router-snippet-and-api
 */
interface IChiliPiper {
    submit: (
        domain: string,
        router: string,
        options?: {
            lead: { [key: string]: string | number };
            handleSubmit?: boolean;
            formId?: string;
            debug?: boolean;
            map?: boolean;
            domain?: string;
            router?: string;
            title?: string;
            titleStyle?: string;
            onSuccess?: () => void;
            onError?: () => void;
            onClose?: () => void;
            onRouted?: () => void;
            closeOnOutside?: boolean;
            dynamicRedirectLink?: string;
            mobileRedirectLink?: string;
            injectRootCss?: boolean;
            locale?: string;
            webHook?: string; // (url)
        },
    ) => void;
}

declare const window: { ChiliPiper?: IChiliPiper };

export enum ChilipiperRouter {
    CU_ROUTER = "cu_router",
    CU_ROUTER_FRO_HOOKS = "cu_router_fro_hooks",
}

interface IOpenChiliPiperArgs {
    userInfo?: {
        firstName: string;
        lastName: string;
        email: string;
        employeesMin: number;
        employeesMax: number;
    };
    onError?: () => void;
    onSuccess?: () => void;
    onClose?: () => void;
    router?: ChilipiperRouter;
}

export const openChiliPiper = (
    {
        //
        userInfo = getUserInfo(),
        onError,
        onSuccess,
        onClose,
        router = ChilipiperRouter.CU_ROUTER_FRO_HOOKS,
    }: IOpenChiliPiperArgs = { userInfo: getUserInfo() },
): void => {
    const { ChiliPiper } = window;

    if (ChiliPiper) {
        const { firstName, lastName, email, employeesMin, employeesMax } = userInfo;

        ChiliPiper.submit("similarweb", router, {
            lead: {
                FirstName: firstName,
                LastName: lastName,
                Email: email,
                Employees_Min__c: employeesMin,
                Employees_Max__c: employeesMax,
            },
            map: true,
            closeOnOutside: true,
            onError,
            onSuccess,
            onClose,
        });
    } else {
        console.error(
            `window.ChiliPiper is ${ChiliPiper}. Cannot proceed with chilipiper. Was called for: `,
            userInfo,
        );
        if (isFunction(onError)) {
            onError();
        }
    }
};
