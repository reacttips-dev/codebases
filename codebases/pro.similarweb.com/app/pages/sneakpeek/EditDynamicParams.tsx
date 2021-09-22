import {
    CheckableDropdownItem,
    ConfigDropDown,
    DropdownButton,
} from "@similarweb/ui-components/dist/dropdown";
import React, { FC } from "react";
import InputBox from "./components/InputBox";
import { SUPPORTED_SQL_TYPES } from "./dynamicParams";
import {
    ConfigureParamType,
    DropdownWrapper,
    EditParamsTitle,
    Label,
    ParamDescription,
    ParamLabel,
    ParamsLabelContainer,
    ParamTypeLabel,
    RowContainer,
    RowsSection,
} from "./StyledComponents";

// appears in create query page
export const ConfigureDynamicParams: FC<any> = ({
    dynamicParams,
    onParamValueChange,
    onParamTypeChange,
    onParamDescriptionChange,
}) => {
    return (
        <>
            {Object.entries<any>(dynamicParams).map(([paramName, paramObject]) => {
                return (
                    <RowContainer key={paramName}>
                        <ParamsLabelContainer withMaxWidth>
                            <ParamLabel name={paramName} />
                        </ParamsLabelContainer>
                        <InputBox
                            onChange={(val) => onParamValueChange(paramName, val)}
                            value={paramObject.value}
                        >
                            Value
                        </InputBox>
                        <ConfigureParamType>
                            <Label>Type</Label>
                            <DropdownWrapper>
                                <ConfigDropDown
                                    items={SUPPORTED_SQL_TYPES}
                                    selectedItemId={paramObject.type.id}
                                    ItemComponent={CheckableDropdownItem}
                                    ButtonComponent={DropdownButton}
                                    width={180}
                                    onClick={({ id: paramId }) =>
                                        onParamTypeChange(
                                            paramName,
                                            SUPPORTED_SQL_TYPES.find(({ id }) => id === paramId),
                                        )
                                    }
                                />
                            </DropdownWrapper>
                        </ConfigureParamType>
                        <InputBox
                            onChange={(description) =>
                                onParamDescriptionChange(paramName, description)
                            }
                            value={paramObject.description}
                        >
                            Description
                        </InputBox>
                    </RowContainer>
                );
            })}
        </>
    );
};

// appears in result page
export const CollectDynamiParamsValues: FC<any> = ({ dynamicParams, onParamValueChange }) => {
    return (
        <>
            <EditParamsTitle>Parameters Values</EditParamsTitle>
            <RowsSection>
                {Object.entries<any>(dynamicParams).map(([paramName, paramObject]) => {
                    const { description } = paramObject;
                    return (
                        <RowContainer key={paramName}>
                            <ParamsLabelContainer>
                                <ParamLabel name={paramName} />
                                <ParamTypeLabel type={paramObject.type.children} />
                                <ParamDescription description={description} />
                            </ParamsLabelContainer>
                            <InputBox
                                onChange={(val) => onParamValueChange(paramName, val)}
                                value={paramObject.value}
                            >
                                Value
                            </InputBox>
                        </RowContainer>
                    );
                })}
            </RowsSection>
        </>
    );
};
