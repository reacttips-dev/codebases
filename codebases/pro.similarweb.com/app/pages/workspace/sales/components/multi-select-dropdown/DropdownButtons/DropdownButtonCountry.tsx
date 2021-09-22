import React from "react";
import { StyledDropdownButtonCountry, StyledText } from "./styles";
import { StyledIcon } from "../styles";

type DropdownButtonCountryProps = {
    id: number;
    text: string;
};

const DropdownButtonCountry: React.FC<DropdownButtonCountryProps> = (props) => {
    const { id, text } = props;

    return (
        <StyledDropdownButtonCountry>
            <StyledIcon className={`country-icon-${id}`} />
            <StyledText>{text}</StyledText>
        </StyledDropdownButtonCountry>
    );
};

export default DropdownButtonCountry;
