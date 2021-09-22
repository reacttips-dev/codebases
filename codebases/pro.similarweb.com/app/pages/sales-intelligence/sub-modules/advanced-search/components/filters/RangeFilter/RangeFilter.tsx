import React from "react";
import { StyledRangeFilter } from "./styles";
import { RangeFixedValues } from "@similarweb/ui-components/dist/slider";

type RangeFilterProps = {
    name?: string;
    values: readonly number[];
    currentValue: readonly number[];
    initialValue: readonly number[];
    onAfterChange(value: readonly number[]): void;
    renderValue?(value: readonly number[]): React.ReactNode;
};

const RangeFilter = (props: RangeFilterProps) => {
    const { name, values, currentValue, initialValue, onAfterChange, renderValue } = props;
    const [value, setValue] = React.useState(initialValue);
    const isInInitialState = value[0] === initialValue[0] && value[1] === initialValue[1];

    const getDescription = () => {
        if (typeof renderValue === "function") {
            return renderValue(value);
        }

        const [from, to] = value;

        return `${from}-${to}`;
    };

    React.useEffect(() => {
        if (currentValue[0] !== value[0] || currentValue[1] !== value[1]) {
            setValue(currentValue);
        }
    }, [currentValue]);

    return (
        <StyledRangeFilter isInInitialState={isInInitialState}>
            <RangeFixedValues
                title={name}
                pushable={1}
                value={value}
                allowCross={false}
                onChange={setValue}
                fixedValues={values}
                onAfterChange={onAfterChange}
                description={getDescription()}
            />
        </StyledRangeFilter>
    );
};

export default RangeFilter;
