import * as numeral from "numeral";
import * as PropTypes from "prop-types";
import * as React from "react";
import { StatelessComponent } from "react";
import StyledLink from "../../../../styled components/StyledLink/src/StyledLink";
import { NumberRow } from "./StyledComponents";

const CoreNumberCell: StatelessComponent<ICoreNumberCellProps> = ({
    value,
    row,
    format,
    getLink,
    onTrack,
    bold,
    highlighted,
    prefix = "",
    suffix = "",
}) => {
    const result = value ? prefix + numeral(value).format(format) + suffix : "N/A";
    return getLink ? (
        <NumberRow>
            <StyledLink href={getLink(row)} onClick={() => onTrack(row)}>
                {result}
            </StyledLink>
        </NumberRow>
    ) : (
        <NumberRow bold={bold} highlighted={highlighted}>
            {result}
        </NumberRow>
    );
};
CoreNumberCell.displayName = "CoreNumberCell";

CoreNumberCell.propTypes = {
    value: PropTypes.number,
    row: PropTypes.object,
    format: PropTypes.string,
    getLink: PropTypes.func,
    onTrack: PropTypes.func,
    bold: PropTypes.bool,
    prefix: PropTypes.string,
    suffix: PropTypes.string,
    highlighted: PropTypes.bool,
};

interface ICoreNumberCellProps {
    value: number;
    row?: any;
    format?: string;
    getLink?: (row) => string;
    onTrack?: (a?, b?, c?, d?) => void;
    bold?: boolean;
    prefix?: string;
    suffix?: string;
    highlighted?: boolean;
}

export default CoreNumberCell;
