import React, { KeyboardEventHandler, useEffect, useState } from "react";
import classNames from "classnames";
import styled, { css } from "styled-components";
import { FlexRow } from "styled components/StyledFlex/src/StyledFlex";

const Field: any = styled.span<{ isActive?: boolean }>`
    display: inline;
    ${({ isActive }) =>
        isActive &&
        css`
            display: none;
        `}
`;
const Input = styled.input<{ isActive?: boolean }>`
    display: none;
    outline: none;
    ${({ isActive }) =>
        isActive &&
        css`
            display: inline-block;
        `}
`;

export const InPlaceEditReact: React.FC<any> = ({
    onFinishEditing,
    value,
    inputClass,
    className,
}) => {
    const [state, setState] = useState(value);
    const originalState = React.useRef(state);
    const [active, setActive] = useState(false);
    const inputRef = React.useRef<HTMLInputElement>();
    useEffect(() => {
        // auto focus the input when edit mode is active
        if (active) {
            inputRef.current.focus();
        }
    }, [active]);
    const onChange = (e) => {
        setState(e.target.value);
    };
    const edit = () => {
        setActive(true);
    };
    const onBlur = () => {
        setActive(false);
        onFinishEditing(state, originalState.current);
    };
    const onKeyPress: KeyboardEventHandler = (event) => {
        console.log(event.key);
        if (event.key === "Enter") {
            setActive(false);
            event.preventDefault();
        }
    };
    const inputClassNames = classNames("sw-in-place-edit-input", inputClass, {
        "sw-in-place-edit-active": active,
    });
    return (
        <FlexRow className={className}>
            <Field isActive={active} className="sw-in-place-edit-value" onClick={edit}>
                {state}
            </Field>
            <Input
                ref={inputRef}
                isActive={active}
                onKeyPress={onKeyPress}
                onBlur={onBlur}
                className={inputClassNames}
                value={state}
                onChange={onChange}
            />

            {!active && (
                <i
                    className="customCategoriesWizard-editor-edit-domain-icon customCategoriesWizard-icon sw-icon-edit"
                    onClick={edit}
                ></i>
            )}
        </FlexRow>
    );
};

InPlaceEditReact.defaultProps = {
    inputClass: "",
    onFinishEditing: () => null,
};
