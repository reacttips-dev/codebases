import * as React from "react";
import styled, { keyframes, css } from "styled-components";
import art1 from "./art/DashboardTemplateConfigArt1";
import art2 from "./art/DashboardTemplateConfigArt2";
import art3 from "./art/DashboardTemplateConfigArt3";
import art4 from "./art/DashboardTemplateConfigArt4";
import art5 from "./art/DashboardTemplateConfigArt5";
import { StatelessComponent } from "react";

const arts = [art1, art2, art3, art4, art5];

export type artStep = number | "last";

interface IDashboardTemplatesConfigArtProps {
    step: artStep;
}

export const DashboardTemplatesConfigArt: StatelessComponent<IDashboardTemplatesConfigArtProps> = ({
    step,
}) => {
    const Component = step == "last" ? arts[arts.length - 1] : arts[step];
    return <Component />;
};

DashboardTemplatesConfigArt.defaultProps = {
    step: 0,
};
