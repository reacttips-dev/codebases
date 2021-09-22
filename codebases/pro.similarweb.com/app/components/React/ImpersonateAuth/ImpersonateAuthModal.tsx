import React, { useState, useEffect } from "react";
import { colorsPalettes } from "@similarweb/styles";
import { CircularLoader } from "@similarweb/ui-components/dist/circular-loader";
import ImpersonateAuthCard, { Available2faConfig } from "./ImpersonateAuthCard";
import ImpersonateAuthErrorScreen from "./ImpersonateAuthErrorScreen";
import styled from "styled-components";
import controller, { ListResults } from "./ImpersonateAuthCtrl";
import "./impersonate-auth.scss";

const StyledDiv = styled.div`
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    margin: auto;
    background-color: ${colorsPalettes.carbon[500]}b2;
    z-index: 9999;
`;

interface IImpersonateAuthModal {
    onVerify: Function;
    onClose: Function;
}

const ImpersonateAuthModal: React.FunctionComponent<IImpersonateAuthModal> = (props) => {
    const [loaded, setLoaded] = useState(false);
    const [error, setErrorFlag] = useState(false);
    const [authOptions, setAuthOptions] = useState({} as Available2faConfig);
    const [phoneNum, setPhoneNum] = useState("");
    const backDivRef = React.createRef<HTMLDivElement>();

    useEffect(() => {
        //load all available authentication options
        controller
            .listAuthenticationOptions()
            .then((res: Array<ListResults>) => {
                const totp = findOption(res, "okta", "okta", "totp");
                const push = findOption(res, "okta", "okta", "push");
                const sms = findOption(res, "okta", "okta", "sms");
                const phoneNum = !!sms ? sms.Extras.phoneNumber : "";

                setAuthOptions({
                    TOTP: !!totp,
                    Push: !!push,
                    SMS: !!sms,
                });
                setPhoneNum(phoneNum);
                setLoaded(true);
            })
            .catch((err) => {
                console.error(err);
                props.onClose();
            });
    }, []);

    /**
     * Find an available option from a provided
     * list of authentication options.
     *
     * @param {Array<ListResults>} list - A list of available options
     * @param {string} provider - The name of the authentication option provider
     * @param {string} vendor - The name of the authentication option vendor
     * @param {string} type - The name of the authentication option itself
     * @returns {ListResults} - The authentication option if it's available, or null otherwise.
     */
    const findOption = (
        list: Array<ListResults>,
        provider: string,
        vendor: string,
        type: string,
    ) => {
        provider = provider.toLowerCase();
        vendor = vendor.toLowerCase();
        type = type.toLowerCase();

        return list.find((x: ListResults) => {
            let xProvider = x.Provider.toLowerCase();
            let xVendor = x.Vendor.toLowerCase();
            let xType = x.Type.toLowerCase();
            return xProvider === provider && xVendor === vendor && xType === type;
        });
    };

    /**
     * Activate when a server error of some sort occurs.
     */
    const onError = () => {
        setErrorFlag(true);
    };

    /**
     * Activate when the user dismisses the error dialog.
     */
    const dismissErrorDialog = () => {
        setErrorFlag(false);
        if (!loaded) props.onClose();
    };

    return (
        <StyledDiv ref={backDivRef}>
            {loaded ? (
                <ImpersonateAuthCard
                    authOptions={authOptions}
                    phoneNumber={phoneNum}
                    onVerify={props.onVerify}
                    onClose={props.onClose}
                    onError={onError}
                />
            ) : (
                <CircularLoader
                    options={{
                        svg: {
                            stroke: "#dedede",
                            strokeWidth: 4,
                            r: 21,
                            cx: "50%",
                            cy: "50%",
                        },
                        style: {
                            position: "fixed",
                            top: 0,
                            bottom: 0,
                            left: 0,
                            right: 0,
                            margin: "auto",
                            width: 46,
                            height: 46,
                        },
                    }}
                />
            )}
            {error ? (
                <ImpersonateAuthErrorScreen onBack={dismissErrorDialog} onClose={props.onClose} />
            ) : null}
        </StyledDiv>
    );
};

export default ImpersonateAuthModal;
export { Available2faConfig };
