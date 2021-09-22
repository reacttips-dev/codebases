import React, { StatelessComponent } from "react";
import { PlainTooltip } from "components/React/Tooltip/PlainTooltip/PlainTooltip";
import * as _ from "lodash";
import { IconContainer } from "../../../../../../components/React/PopularPagesFilters/PopularPagesFilters";
import { SWReactIcons } from "@similarweb/icons";
import styled from "styled-components";

const AdsIconInfoContainer = styled(IconContainer)`
    top: 3px;
    position: relative;
    margin-left: 3px;
`;

const Filter: StatelessComponent<any> = ({ fieldName, style = {}, children, tooltip = "" }) => {
    return (
        <div
            style={{
                flexGrow: 1,
                marginRight: "1.57%",
                maxWidth: 160,
                marginBottom: 12,
                ...style,
            }}
        >
            <div className={`field-selector`}>
                <span>
                    {fieldName}
                    {tooltip && (
                        <PlainTooltip
                            cssClass="plainTooltip-element"
                            text={tooltip}
                            placement="top"
                        >
                            <AdsIconInfoContainer>
                                <SWReactIcons iconName="info" size="xs" />
                            </AdsIconInfoContainer>
                        </PlainTooltip>
                    )}
                </span>
            </div>
            <div className={`u-flex-row u-flex-center field-selector-${_.kebabCase(fieldName)}`}>
                {children}
            </div>
        </div>
    );
};

export default Filter;
