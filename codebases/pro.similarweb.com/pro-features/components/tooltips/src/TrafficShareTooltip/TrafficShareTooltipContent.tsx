import * as PropTypes from "prop-types";
import * as React from "react";
import { StatelessComponent } from "react";
import {
    TooltipContainer,
    Title,
    SiteContainer,
    SiteBullet,
    SiteShare,
    SiteName,
} from "./StyledComponents";
import { ITrafficShareBarProps } from "../../../../styled components/StyledTrafficShare/src/StyledTrafficShare";
import { Legend } from "../../../Legends/src/LegendBase/Legend";

interface ITrafficShareTooltipContentProps {
    trafficShareProps: ITrafficShareBarProps[];
    title: string;
}

export const TrafficShareTooltipContent: StatelessComponent<ITrafficShareTooltipContentProps> = ({
    title,
    trafficShareProps,
}) => {
    return (
        <TooltipContainer>
            {title && <Title>{title}</Title>}
            {trafficShareProps.map((item) => {
                if (item.width > 0) {
                    return (
                        <SiteContainer>
                            <Legend isMain={false} color={item.backgroundColor} name={item.name} />
                            <SiteShare>{item.tooltipText ? item.tooltipText : item.text}</SiteShare>
                        </SiteContainer>
                    );
                }
            })}
        </TooltipContainer>
    );
};

TrafficShareTooltipContent.propTypes = {
    title: PropTypes.string,
    trafficShareProps: PropTypes.arrayOf(
        PropTypes.shape({
            color: PropTypes.string,
            backgroundColor: PropTypes.string,
            width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
            text: PropTypes.string,
            name: PropTypes.string,
        }),
    ).isRequired,
};
TrafficShareTooltipContent.displayName = "TrafficShareTooltipContent";
