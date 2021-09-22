import { IconButton } from "@similarweb/ui-components/dist/button";
import { Dropdown, EllipsisDropdownItem } from "@similarweb/ui-components/dist/dropdown";
import * as _ from "lodash";
import React from "react";
import styled from "styled-components";
import { IEllipsisDropdownItemProps } from "@similarweb/ui-components/dist/dropdown/src/items/EllipsisDropdownItem";

const AddOpportunitiesButtonWrapper = styled.div`
    margin-left: 8px;
`;

AddOpportunitiesButtonWrapper.displayName = "AddOpportunitiesButtonWrapper";

export type AddOpportunitiesButtonOption = {
    label: JSX.Element | string;
    action?: () => void;
    key: string;
    ellipsisDropdownItemProps?: IEllipsisDropdownItemProps;
};

export interface IAddOpportunitiesButtonProps {
    buttonLabel: string;
    options: AddOpportunitiesButtonOption[];
    onDropdownToggle?: (isOpen: boolean) => Promise<void>;
    width?: number;
}

const AddOpportunitiesButton: React.FC<IAddOpportunitiesButtonProps> = ({
    options,
    buttonLabel,
    onDropdownToggle,
    width = 180,
}) => {
    const onDropdownComponentClick = ({ id }) => {
        if (_.isFunction(options[id].action)) {
            options[id].action();
        }
    };

    return (
        <AddOpportunitiesButtonWrapper>
            <Dropdown width={width} onClick={onDropdownComponentClick} onToggle={onDropdownToggle}>
                {[
                    <IconButton key={`${buttonLabel}_title`} type="primary" iconName="add">
                        {buttonLabel}
                    </IconButton>,
                    ...options.map(({ label, ellipsisDropdownItemProps }, idx) => (
                        <EllipsisDropdownItem
                            {...ellipsisDropdownItemProps}
                            key={`${idx}_${label}`}
                            id={idx}
                        >
                            {label}
                        </EllipsisDropdownItem>
                    )),
                ]}
            </Dropdown>
        </AddOpportunitiesButtonWrapper>
    );
};

export default AddOpportunitiesButton;
