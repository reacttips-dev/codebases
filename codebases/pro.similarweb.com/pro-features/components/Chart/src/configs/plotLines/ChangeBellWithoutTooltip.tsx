import ReactDOMServer from "react-dom/server";
import React from "react";
import styled from "styled-components";
import { colorsPalettes } from "@similarweb/styles";
import { SWReactIcons } from "@similarweb/icons";
import { CenteredFlexRow } from "styled components/StyledFlex/src/StyledFlex";

export const Marker = styled(CenteredFlexRow)`
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background-color: ${colorsPalettes.blue[400]};
`;

export const StyledAlertIcon = styled(SWReactIcons)`
    path {
        fill: white;
    }

    height: 12px;
    width: 12px;
`;

export default (changeStartDate) => {
    return {
        xAxis: {
            plotLines: [
                {
                    color: "#7F8B97",
                    width: 1,
                    dashStyle: "Dash",
                    value: changeStartDate,
                    id: "plotLine-mw-algochange",
                    left: 11,
                    zIndex: 4,
                    label: {
                        text: ReactDOMServer.renderToString(
                            <Marker>
                                <StyledAlertIcon iconName="alerts" />
                            </Marker>,
                        ),
                        useHTML: true,
                        x: -10,
                        y: 0,
                        rotation: 0,
                        verticalAlign: "bottom",
                    },
                },
            ],
        },
    };
};
