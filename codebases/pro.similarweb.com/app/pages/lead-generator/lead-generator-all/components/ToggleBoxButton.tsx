import * as React from "react";
import { StatelessComponent } from "react";
import { IconButton } from "@similarweb/ui-components/dist/button";
import { ToggleBoxContainer } from "./elements";

interface IToggleBoxButtonProps {
    isOpen: boolean;
    onClickToggle: () => void;
}

const ToggleBoxButton: StatelessComponent<IToggleBoxButtonProps> = ({ isOpen, onClickToggle }) => {
    return (
        <ToggleBoxContainer isOpen={isOpen}>
            <IconButton type="flat" iconName="chev-right" onClick={onClickToggle} />
        </ToggleBoxContainer>
    );
};

export default ToggleBoxButton;
