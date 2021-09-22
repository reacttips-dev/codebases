import React, { useState } from "react";
import styled from "styled-components";
import { colorsPalettes } from "@similarweb/styles";
import { Box } from "@similarweb/ui-components/dist/box";
import { Button } from "@similarweb/ui-components/dist/button";
import { Checkbox } from "@similarweb/ui-components/dist/checkbox";
import { PlainTooltip } from "@similarweb/ui-components/dist/plain-tooltip";
import { SWReactIcons } from "@similarweb/icons";
import { i18nFilter } from "filters/ngFilters";
import { AssetsService } from "services/AssetsService";
import ImpersonateAuthOption from "./ImpersonateAuthOption";
import controller from "./ImpersonateAuthCtrl";
import ImpersonateAuthOptionScreen from "./ImpersonateAuthOptionScreen";
import { swSettings } from "common/services/swSettings";
import useLocalStorage from "custom-hooks/useLocalStorage";

const i18n = i18nFilter();
const StyledBox = styled(Box)`
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    margin: auto;
    width: 378px;
    height: 425px;
    box-shadow: 0 10px 16px 0 rgba(14, 30, 62, 0.3);
`;

const Container = styled.div`
    margin: 4px;
`;

const TitleDiv = styled.div`
    margin-left: 20px;
    margin-top: 20px;
    text-align: left;
`;

const Title = styled.h6`
    display: inline-block;
    font-size: 24px;
    font-weight: 500;
    color: ${colorsPalettes.carbon[500]};
`;

const InfoIconContainer = styled.span`
    .SWReactIcons {
        float: right;
        margin-left: 10px;
    }
`;

const Subtitle = styled.h2`
    text-align: left;
    font-size: 13px;
    margin: -13px 0 25px 20px;
    font-weight: 400;
    color: ${colorsPalettes.carbon[400]};
`;

const VerificationOption = styled(ImpersonateAuthOption)`
    margin-top: 20px;
`;

const SettingsButton = styled.a`
    position: absolute;
    left: 24px;
    bottom: 20px;
    font-size: 10px;
    line-height: 16px;
    font-weight: 500;
    text-decoration: underline;
    color: ${colorsPalettes.blue[400]};
`;

const CloseButton = styled(Button)`
    position: absolute;
    right: 5px;
    bottom: 10px;
    font-size: 14px;
    font-weight: bolder;
    color: ${colorsPalettes.blue[400]};
`;

const RememberSelectionCheckbox = styled(Checkbox)`
    margin-left: 18px;
    color: ${colorsPalettes.carbon[500]};

    label {
        font-size: 13px;
        margin-top: 2px;
    }
`;

interface Available2faConfig {
    TOTP: boolean;
    Push: boolean;
    SMS: boolean;
}

interface IImpersonateAuthCard {
    authOptions: Available2faConfig;
    phoneNumber: string;
    onVerify: Function;
    onClose: Function;
    onError: Function;
}

const ImpersonateAuthCard: React.FunctionComponent<IImpersonateAuthCard> = (props) => {
    const storage2faOptionKey = `2fa-method:${swSettings.user.username}`;
    const [mainScreen, setMainScreenFlag] = useState(true);
    const [lastOptionType, setLastOptionType] = useState("");
    const [memorizedSelection, setMemorizedSelection] = useLocalStorage(storage2faOptionKey);
    const [rememberSelectionFlag, setRememberSelectionFlag] = useState(!!memorizedSelection);

    React.useEffect(() => {
        //automatically select the remembered option
        if (memorizedSelection) selectOption(memorizedSelection);
    }, []);

    React.useEffect(() => {
        //remove remembered selection
        if (!rememberSelectionFlag) setMemorizedSelection("");
    }, [rememberSelectionFlag]);

    /**
     * Activate when an option is selected.
     *
     * @param {string} type - The type of authentication method
     */
    const selectOption = (type: string) => {
        if (rememberSelectionFlag) setMemorizedSelection(type);
        setLastOptionType(type);
        setMainScreenFlag(false);
    };

    /**
     * Activate when the close button is pressed.
     */
    const onCardClose = () => {
        controller.abort();
        props.onClose();
    };

    /**
     * @param {string} phoneNum - The phone number to encode
     * @returns {string} A phone number with only its 4 last digits revealed.
     */
    const getEncodedPhoneNumber = (phoneNum) => {
        if (!phoneNum) return null;

        const phoneLen = phoneNum.length;

        if (phoneLen > 7 && phoneNum[0] === "+") {
            const prefix = phoneNum.substr(0, 4);
            const suffix = phoneNum.substr(phoneLen - 4, 4);
            return `${prefix} XX-XXX-${suffix}`;
        } else return null;
    };

    /**
     * Activate when the back button is pressed.
     */
    const onOptionScreenBack = () => {
        setMainScreenFlag(true);
    };

    /**
     * Activate when the 'Remember my selection' checkbox is checked.
     */
    const onRememberSelectionCheck = () => {
        setRememberSelectionFlag(!rememberSelectionFlag);
    };

    /**
     * Activate when a server error of some sort occurs.
     */
    const onSceenError = () => {
        onOptionScreenBack();
        props.onError();
    };

    const renderOptionsScreen = () => {
        //check if there exists a single available option
        for (let option of Object.keys(props.authOptions))
            if (!!props.authOptions[option]) return renderOptions();

        const NoOpContent = styled.div`
            height: 70%;
        `;

        const NoOpImg = styled.img`
            display: block;
            margin: 46px auto 16px auto;
            pointer-events: none;
        `;

        const NoOpTitle = styled.h1`
            margin: auto;
            font-size: 16px;
            font-weight: 500;
            line-height: 20px;
            text-align: center;
            width: 80%;
            color: ${colorsPalettes.carbon[500]};
        `;

        const NoOpSubtitle = styled.h2`
            margin: 2px auto;
            font-size: 12px;
            font-weight: 400;
            line-height: 20px;
            text-align: center;
            color: ${colorsPalettes.midnight[200]};
        `;

        //no available options
        return (
            <NoOpContent>
                <NoOpImg src={AssetsService.assetUrl(`/images/ImpersonateAuth/cactus.svg`)} />
                <NoOpTitle>{i18n("impersonate.auth.noOptions")}</NoOpTitle>
                <NoOpSubtitle>
                    <a href="https://similarweb.okta.com/enduser/settings" target="_blank">
                        {i18n("impersonate.auth.clickHere")}
                    </a>
                    &nbsp;{i18n("impersonate.auth.toEnable")}
                </NoOpSubtitle>
            </NoOpContent>
        );
    };

    /**
     * Render the authentiocation options boxes.
     */
    const renderOptions = () => {
        const encodedPhone = getEncodedPhoneNumber(props.phoneNumber);
        const phoneName = encodedPhone ? encodedPhone : "your phone";
        const options = [
            {
                type: "TOTP",
                enabled: props.authOptions.TOTP,
                onClick: props.authOptions.TOTP ? () => selectOption("TOTP") : () => {},
                title: i18n("impersonate.auth.totp.title"),
                subtitle: props.authOptions.TOTP ? i18n("impersonate.auth.totp.subtitle") : "",
            },
            {
                type: "Push",
                enabled: props.authOptions.Push,
                onClick: props.authOptions.Push ? () => selectOption("PUSH") : () => {},
                title: i18n("impersonate.auth.push.title"),
                subtitle: props.authOptions.Push ? i18n("impersonate.auth.push.subtitle") : "",
            },
            {
                type: "SMS",
                enabled: props.authOptions.SMS,
                onClick: props.authOptions.SMS ? () => selectOption("SMS") : () => {},
                title: `Get SMS with code to ${phoneName}`,
                subtitle: props.authOptions.SMS ? i18n("impersonate.auth.sms.subtitle") : "",
            },
        ];

        return (
            <div>
                <Subtitle>{i18n("impersonate.auth.selectOption")}</Subtitle>
                <div style={{ marginTop: "-12px" }}>
                    {options.map((x) => {
                        return (
                            <div
                                key={x.type}
                                style={{ cursor: x.enabled ? "pointer" : "not-allowed" }}
                            >
                                <VerificationOption
                                    title={x.title}
                                    text={x.subtitle}
                                    onClick={x.onClick}
                                    disabled={!x.enabled}
                                />
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    };

    /**
     * Render the main screen, where the authentication options are listed.
     */
    const renderMainScreen = () => {
        return (
            <div>
                <TitleDiv>
                    <Title>
                        {i18n("impersonate.auth.title")}
                        <PlainTooltip
                            placement="top"
                            tooltipContent={i18n("impersonate.auth.titleTooltip")}
                        >
                            <InfoIconContainer>
                                <SWReactIcons iconName="info" size="xs" />
                            </InfoIconContainer>
                        </PlainTooltip>
                    </Title>
                </TitleDiv>
                {renderOptionsScreen()}
                <RememberSelectionCheckbox
                    label={i18n("impersonate.auth.remember_selection")}
                    onClick={onRememberSelectionCheck}
                    selected={rememberSelectionFlag}
                />
                <SettingsButton href="https://similarweb.okta.com/enduser/settings" target="_blank">
                    {i18n("impersonate.auth.settings")}
                </SettingsButton>
                <CloseButton className="clickable unselectable" type="flat" onClick={onCardClose}>
                    {i18n("impersonate.auth.close")}
                </CloseButton>
            </div>
        );
    };

    return (
        <StyledBox className="modal-card">
            <Container>
                {mainScreen ? (
                    renderMainScreen()
                ) : (
                    <ImpersonateAuthOptionScreen
                        type={lastOptionType}
                        onBack={onOptionScreenBack}
                        onVerify={props.onVerify}
                        onError={onSceenError}
                    />
                )}
            </Container>
        </StyledBox>
    );
};

export default ImpersonateAuthCard;
export { Available2faConfig };
