import { colorsPalettes } from "@similarweb/styles";
import { Dropdown, DropdownButton } from "@similarweb/ui-components/dist/dropdown";
import * as React from "react";
import { FunctionComponent, useContext, useEffect, useState } from "react";
import styled from "styled-components";
import { contextTypes } from "../../../../../.pro-features/components/Workspace/Wizard/src/WithContext";
import { IUserSegmentType } from "./SegmentCreationFirstStep";
import { UserSegmentListTypeSelectorItem } from "./UserSegmentListTypeItem";

export interface IUserSegmentListTypeSelectorProps {
    userSegmentTypes: IUserSegmentType[];
    selectedSegmentType?: IUserSegmentType;
    onListTypeSelect: (typeId: IUserSegmentType) => void;
    disabled?: boolean;
    appendTo?: string;
    dropdownPopupPlacement?: string;
    buttonWidth?: number;
    cssClassContainer?: string;
}

const SelectedText = styled.div`
    color: ${colorsPalettes.carbon["400"]};
`;

const DefaultText = styled.div`
    color: ${colorsPalettes.carbon["200"]};
`;

export const UserSegmentListTypeSelector: FunctionComponent<IUserSegmentListTypeSelectorProps> = (
    { ...props },
    context,
) => {
    const { translate, track } = context;
    const [selectedSegmentType, setSelectedSegmentType] = useState(props.selectedSegmentType);
    const prefix = "user.segment.type";

    const onSelect = (segmentType) => {
        track("Drop Down", "click", `Segment List Type/${segmentType.name}`);
        setSelectedSegmentType(segmentType);
        props.onListTypeSelect(segmentType);
    };
    useEffect(() => {
        setSelectedSegmentType(props.selectedSegmentType);
    }, [props.selectedSegmentType]);
    const getDropElements = () => {
        return [
            <DropdownButton disabled={props.disabled} key="segmentListSelectorButton">
                {selectedSegmentType ? (
                    <SelectedText>
                        {translate(`${prefix}.${selectedSegmentType.name}.title`)}
                    </SelectedText>
                ) : (
                    <DefaultText>{translate(`user.segment.type.placeholder`)}</DefaultText>
                )}
            </DropdownButton>,
            ...props.userSegmentTypes.map((segmentType) => {
                return (
                    <UserSegmentListTypeSelectorItem
                        onClick={() => onSelect(segmentType)}
                        closePopupOnClick={true}
                        preventDefault={true}
                        key={segmentType.id}
                        title={translate(`${prefix}.${segmentType.name}.title`)}
                        description={translate(`${prefix}.${segmentType.name}.description`)}
                    />
                );
            }),
        ];
    };
    const render = () => {
        return (
            <Dropdown
                appendTo={props.appendTo}
                cssClassContainer={`DropdownContent-container ${props.cssClassContainer}`}
                dropdownPopupPlacement={props.dropdownPopupPlacement}
                buttonWidth={props.buttonWidth}
            >
                {getDropElements()}
            </Dropdown>
        );
    };

    return render();
};

UserSegmentListTypeSelector.contextTypes = {
    ...contextTypes,
};
