import React from "react";
import styled from "styled-components";
import { colorsPalettes } from "@similarweb/styles";
import { Button } from "@similarweb/ui-components/dist/button";
import { SWReactIcons } from "@similarweb/icons";
import controller from "./ImpersonateAuthCtrl";
import ImpersonateAuthOptionContent from "./ImpersonateAuthOptionContent";
import { AssetsService } from "services/AssetsService";
import { i18nFilter } from "filters/ngFilters";

const i18n = i18nFilter();
const ArrowIconContainer = styled.span`
    margin-right: 5px;

    .SWReactIcons {
        float: right;
        margin-left: 5px;
    }
`;

const BackButton = styled(Button)`
    margin: 15px 0 0 12px;
    font-size: 14px;
    font-weight: bolder;
    padding-left: 5px;
    color: ${colorsPalettes.blue[400]};
`;

const ImpersonateAuthOptionScreen = ({ type, onBack, onVerify, onError }) => {
    /**
     * Create a promise that verifies an authentication code.
     *
     * @param {string} provider - The name of the code provider
     * @param {string} vendor - The name of the code vendor
     * @param {string} type - The type of the code
     */
    const createCodeVerifyHandler = (provider: string, vendor: string, type: string) => {
        return async (code: string) => {
            return new Promise((resolve, reject) => {
                controller
                    .verify(provider, vendor, type, "", code)
                    .then((verified) => {
                        if (verified) onVerify();
                        resolve(verified);
                    })
                    .catch(() => reject);
            });
        };
    };

    /**
     * Render the screen at which the user should enter a TOTP code.
     */
    const renderTOTPScreen = () => {
        return (
            <ImpersonateAuthOptionContent
                message={i18n("impersonate.auth.totp.content")}
                codeField={true}
                onVerifyClick={createCodeVerifyHandler("okta", "okta", "totp")}
                onError={onError}
            />
        );
    };

    /**
     * Render the screen at which the user is notified about a push message sent to him.
     */
    const renderPushScreen = () => {
        const handlePush = () => {
            return controller.pushNotification().then((success) => {
                if (success) onVerify();
            });
        };

        const PushMessage = styled.span`
            display: table;
            margin: auto;
            margin-top: -100px;
            font-size: 16px;
            font-weight: 500;
            color: ${colorsPalettes.carbon[500]};
        `;

        return (
            <ImpersonateAuthOptionContent
                message=""
                sendAgainMessage={i18n("impersonate.auth.push.resendMsg")}
                codeSenderFunc={handlePush}
                onError={onError}
            >
                <img
                    src={AssetsService.assetUrl(`/images/ImpersonateAuth/balloon.svg`)}
                    style={{
                        marginTop: "-40px",
                        pointerEvents: "none",
                    }}
                />
                <PushMessage>{i18n("impersonate.auth.push.outcome")}</PushMessage>
            </ImpersonateAuthOptionContent>
        );
    };

    /**
     * Render the screen at which the user should enter the code he received via SMS.
     */
    const renderSMSScreen = () => {
        return (
            <ImpersonateAuthOptionContent
                message={i18n("impersonate.auth.sms.content")}
                codeField={true}
                sendAgainMessage={i18n("impersonate.auth.sms.resendMsg")}
                codeSenderFunc={controller.sendSMS}
                onVerifyClick={createCodeVerifyHandler("okta", "okta", "sms")}
                onError={onError}
            />
        );
    };

    /**
     * Render an authentication screen.
     *
     * @param {string} type - The type of authentication option
     */
    const renderContent = (type: string) => {
        switch (type) {
            case "TOTP":
                return renderTOTPScreen();
            case "PUSH":
                return renderPushScreen();
            case "SMS":
                return renderSMSScreen();
            default:
                return <div>Error</div>;
        }
    };

    return (
        <div>
            <BackButton className="clickable unselectable" type="flat" onClick={onBack}>
                <ArrowIconContainer>
                    <SWReactIcons iconName="arrow-left" size="xs" />
                </ArrowIconContainer>
                {i18n("impersonate.auth.back")}
            </BackButton>
            {renderContent(type)}
        </div>
    );
};

export default ImpersonateAuthOptionScreen;
