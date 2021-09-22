import { colorsPalettes } from "@similarweb/styles";
import { setFont } from "@similarweb/styles/src/mixins";
import { Button } from "@similarweb/ui-components/dist/button";
import { useFocus } from "custom-hooks/useFocus";
import { i18nFilter } from "filters/ngFilters";
import React from "react";
import styled from "styled-components";
import { buttonTypes } from "UtilitiesAndConstants/Constants/ButtonTypes";

const Input = styled.input`
    width: 86px;
    height: 29px;
    padding-left: 10px;
    border: 1px solid ${colorsPalettes.carbon[100]};
    ${setFont({ $size: 14, $color: colorsPalettes.carbon[500] })}
    &::placeholder {
        ${setFont({ $size: 14, $color: colorsPalettes.carbon[300] })};
    }
`;
const Container = styled.div`
    height: 124px;
`;
const Text = styled.label`
    display: inline-block;
    cursor: inherit;
    width: fit-content;
    ${setFont({ $size: 14, $color: colorsPalettes.carbon[500] })}
`;

const InputsRowContainer = styled.div`
    display: flex;
    padding: 20px 14px;
    justify-content: space-between;
`;
const TextContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
`;

const ButtonsContainer = styled.div`
    padding: 0 14px;
    display: flex;
    justify-content: flex-end;
`;

const ActionButtons = styled(Button)`
    margin-left: 10px;
    button {
        cursor: pointer;
    }
`;

interface IRangeValues {
    fromValue: string;
    toValue: string;
}

interface IRangeFilterProps {
    fromButtonText?: string;
    toButtonText?: string;

    fromPlaceHolder?: string;
    toPlaceHolder?: string;

    submitButtonText?: string;
    clearButtonText?: string;

    initialFromValue?: string;
    initialToValue?: string;

    onClearCallback?: () => void;
    onDoneCallback: (rangeValues: IRangeValues) => void;

    valuesFormatter?: (value: string) => string;
    valuesParser?: (value: string) => string;

    isValidRangeValues?: (fromValue: string, toValue: string) => boolean;
}

export const RangeFilter: React.FC<IRangeFilterProps> = (props) => {
    const {
        fromButtonText,
        toButtonText,
        fromPlaceHolder,
        toPlaceHolder,
        submitButtonText,
        clearButtonText,
        initialFromValue = String(),
        initialToValue = String(),
        onDoneCallback,
        onClearCallback,
        valuesFormatter,
        valuesParser,
        isValidRangeValues,
    } = props;
    const [rangeValues, setRangeValues] = React.useState<IRangeValues>({
        fromValue: initialFromValue,
        toValue: initialToValue,
    });
    const { htmlElementReference, setFocus } = useFocus();

    const { fromValue, toValue } = rangeValues;
    const showClearButton = Boolean(fromValue) || Boolean(toValue);
    const validateHandler = (newRangeValues: IRangeValues) => {
        const { fromValue, toValue } = newRangeValues;
        if (isNaN(Number(fromValue)) || isNaN(Number(toValue))) {
            return;
        }
        if (isValidRangeValues) {
            const isValidRange = isValidRangeValues(fromValue, toValue);
            if (!isValidRange) return;
        }
        setRangeValues(newRangeValues);
    };
    const onFromValueChange = (event) =>
        validateHandler({ fromValue: valuesParser(event.target.value), toValue });
    const onToValueChange = (event) =>
        validateHandler({ fromValue, toValue: valuesParser(event.target.value) });
    const onClearButtonClick = () => {
        setRangeValues({ fromValue: String(), toValue: String() });
        onClearCallback && onClearCallback();
        setFocus();
    };
    const onDoneButtonClick = () => {
        if (toValue && fromValue && Number(toValue) < Number(fromValue)) {
            const newRangeValues = { fromValue: toValue, toValue: fromValue };
            onDoneCallback(newRangeValues);
            setRangeValues(newRangeValues);
            return;
        }
        onDoneCallback(rangeValues);
    };
    React.useEffect(setFocus, []);
    const getInputValue = (value) =>
        initialFromValue || initialToValue ? valuesFormatter(value) : value;

    const onKeyDown = (event) => {
        const { keyCode } = event;
        const ENTER_KEY_CODE = 13;
        if (keyCode === ENTER_KEY_CODE) {
            onDoneButtonClick();
        }
    };
    return (
        <Container className="range-filter" onKeyDown={onKeyDown}>
            <InputsRowContainer>
                <TextContainer>
                    <Text>{fromButtonText}</Text>
                </TextContainer>
                <Input
                    ref={htmlElementReference}
                    placeholder={fromPlaceHolder}
                    value={getInputValue(fromValue)}
                    onChange={onFromValueChange}
                />
                <TextContainer>
                    <Text>{toButtonText}</Text>
                </TextContainer>
                <Input
                    placeholder={toPlaceHolder}
                    value={getInputValue(toValue)}
                    onChange={onToValueChange}
                />
            </InputsRowContainer>
            <ButtonsContainer>
                {showClearButton && (
                    <ActionButtons type={buttonTypes.FLAT} onClick={onClearButtonClick}>
                        {clearButtonText}
                    </ActionButtons>
                )}
                <ActionButtons onClick={onDoneButtonClick}>{submitButtonText}</ActionButtons>
            </ButtonsContainer>
        </Container>
    );
};

const i18n = i18nFilter();

RangeFilter.defaultProps = {
    fromButtonText: i18n("common.from"),
    toButtonText: i18n("common.to"),
    fromPlaceHolder: "0",
    toPlaceHolder: ">1,000,000",
    submitButtonText: i18n("common.done"),
    clearButtonText: i18n("common.clear"),
    valuesFormatter: (value) => value && String(value).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,"),
    valuesParser: (value) => value && value.replace(/,/g, String()),
};
