import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { colorsPalettes } from "@similarweb/styles";
import { Textfield } from "@similarweb/ui-components/dist/textfield";
import { Button } from "@similarweb/ui-components/dist/button";
import { i18nFilter } from "filters/ngFilters";

const i18n = i18nFilter();
const ContentDiv = styled.div`
    position: absolute;
    margin: auto;
    left: 0;
    right: 0;
    width: 90%;
    height: 82%;
`;

const CodeField = styled(Textfield)`
    margin: auto;
    width: 97%;
`;

const StyledMessage = styled.p`
    margin: 10px auto 30px 5px;
    font-size: 13px;
    line-height: 16px;
    color: ${colorsPalettes.carbon[400]};
`;

const ChildrenDiv = styled.div`
    height: 70%;
`;

const ResendDiv = styled.div`
    margin: 10px 0 0 5px;
`;

const ResendMessage = styled.span`
    margin-right: 7px;
    font-size: 14px;
    vertical-align: bottom;
`;

const VerifyButton = styled(Button)`
    position: absolute;
    bottom: 0;
    right: 0;
    font-size: 14px;
    font-weight: bolder;
    color: ${colorsPalettes.blue[400]};
`;

const FlatButton = styled.button`
    font-size: 14px;
    font-family: "Roboto";
    text-align: left;
    padding: 0;
    border: none;
    background: none;
    outline: none;
    margin: 0 auto;
    color: ${colorsPalettes.blue[400]};

    &:hover {
        outline: none;
    }

    &:active {
        color: ${colorsPalettes.blue[500]};
    }
`;

interface Content {
    message: string;
    codeField?: boolean;
    sendAgainMessage?: string;
    codeSenderFunc?: Function;
    onVerifyClick?: Function;
    onError?: Function;
}

const ImpersonateAuthOptionContent: React.FunctionComponent<Content> = (props) => {
    const [code, setCode] = useState("");
    const [showError, setErrorFlag] = useState(false);
    const [resendCooldown, setResendCooldown] = useState(false);
    const [verifyingFlag, setVerifyingFlag] = useState(false);
    const inputElRef = React.useRef(null);

    useEffect(() => sendCode(), []);
    useEffect(() => {
        inputElRef.current?.focus();
    }, [inputElRef]);

    /**
     * Send an authentication code to the user.
     */
    const sendCode = () => {
        if (resendCooldown) return;

        props.codeSenderFunc
            ?.call(this)
            .then(() => {
                setResendCooldown(true);
                setTimeout(() => setResendCooldown(false), 3000);
            })
            .catch(() => {
                props.onError?.call(this);
            });
    };

    /**
     * Activate when a code is being written in the code field.
     *
     * @param value - The code field's entire value
     */
    const codeTypeHandler = (value: string) => {
        let input = value.replace(/ /g, "").replace(/\D/g, "");

        //format code string
        if (input.length) {
            let format = input.match(/.{1,3}/g);
            if (format) input = format.join(" ");
        }

        const inputEl = inputElRef.current;
        inputEl?.setValue(input);

        //save clean code
        setCode(input.replace(/ /g, ""));
    };

    /**
     * Activate when the verify button is pressed.
     */
    const verifyButtonHandler = () => {
        setVerifyingFlag(true);

        props.onVerifyClick
            ?.call(this, code)
            .then((res) => {
                if (res) setErrorFlag(false);
                else {
                    setErrorFlag(true);
                    setTimeout(() => setErrorFlag(false), 5000);
                }
            })
            .catch((err) => {
                console.error(err);
                props.onError?.call(this);
            })
            .finally(() => setVerifyingFlag(false));
    };

    /**
     * Activate when the enter key is pressed.
     *
     * @param ev - Default event parameter
     */
    const onKeyDown = (ev) => {
        if (code.length && ev.keyCode === 13) verifyButtonHandler();
    };

    return (
        <ContentDiv>
            {props.message.length ? <StyledMessage>{props.message}</StyledMessage> : null}
            {props.codeField ? (
                <CodeField
                    onChange={codeTypeHandler}
                    placeholder={i18n("impersonate.auth.code_placeholder")}
                    ref={inputElRef}
                    error={showError}
                    errorMessage={i18n("impersonate.auth.invalidCode")}
                    onKeyDown={onKeyDown}
                />
            ) : null}
            {props.children ? <ChildrenDiv>{props.children}</ChildrenDiv> : null}
            {props.sendAgainMessage ? (
                <ResendDiv>
                    <ResendMessage>{i18n("impersonate.auth.resend")}</ResendMessage>
                    <FlatButton onClick={sendCode}>{props.sendAgainMessage}</FlatButton>
                </ResendDiv>
            ) : null}
            {props.onVerifyClick ? (
                <VerifyButton
                    className="clickable unselectable"
                    type="primary"
                    onClick={verifyButtonHandler}
                    isDisabled={!code.length || verifyingFlag}
                >
                    {i18n("impersonate.auth.verify")}
                </VerifyButton>
            ) : null}
        </ContentDiv>
    );
};

export default ImpersonateAuthOptionContent;
