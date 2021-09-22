import * as React from "react";

import {Button, Input, hasPostalCodeChars, ButtonAppearance, ButtonApperanceEnum} from "@bbyca/bbyca-components";
import {classname, classIf} from "../../../utils/classname";

import {validatePostalCode} from "Decide/utils/validatePostalCode";
import * as styles from "./style.css";

export interface PostalCodeSubmitProps {
    postalCode?: string;
    label?: string;
    helperText?: string;
    placeholder?: string;
    buttonAppearance?: ButtonAppearance;
    ctaText?: string;
    className?: string;
    errorMessage?: string;
    minPostalCodeLength?: number;
    validateCompletePostalCode?: boolean;
    inputRef?: any;
    error?: boolean;
    buttonType?: string;
    handleSyncChange?: (id: string, val: string, error: boolean) => void;
    handleAsyncChange?: (id: string, val: string, error: boolean) => void;
    handlePostalCodeSubmit: () => void;
}

export const MIN_POSTAL_CODE_LENGTH = 3;

export const PostalCodeSubmit: React.FC<PostalCodeSubmitProps> = ({
    label,
    helperText,
    placeholder,
    buttonAppearance = ButtonApperanceEnum.Tertiary,
    ctaText,
    errorMessage,
    minPostalCodeLength = MIN_POSTAL_CODE_LENGTH,
    validateCompletePostalCode = false,
    postalCode,
    error = false,
    inputRef,
    className,
    buttonType = "button",
    handlePostalCodeSubmit,
    handleSyncChange,
    handleAsyncChange,
}) => {
    return (
        <div className={classname([styles.inputContainer, className])}>
            <Input
                className={styles.postalCodeInput}
                label={label}
                helperTxt={helperText}
                asyncValidators={[hasPostalCodeChars]}
                error={error}
                errorMsg={errorMessage}
                formatter={"*** ***"}
                name="postalCode"
                validators={[(val) => validatePostalCode(val, minPostalCodeLength, validateCompletePostalCode)]}
                value={postalCode}
                extraAttrs={{"data-automation": "enter-postal-code-input"}}
                placeholder={placeholder}
                ref={inputRef}
                handleSyncChange={handleSyncChange}
                handleAsyncChange={handleAsyncChange}
            />
            <Button
                type={buttonType}
                appearance={buttonAppearance}
                className={classname([styles.searchButton, classIf(styles.buttonMargin, !!label)])}
                extraAttrs={{"data-automation": "enter-postal-code-button"}}
                onClick={handlePostalCodeSubmit}>
                {ctaText}
            </Button>
        </div>
    );
};

export default PostalCodeSubmit;
