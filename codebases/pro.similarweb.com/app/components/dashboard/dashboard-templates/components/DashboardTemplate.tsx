import { SWReactIcons } from "@similarweb/icons";
import { colorsPalettes } from "@similarweb/styles";
import { setFont } from "@similarweb/styles/src/mixins";
import { $primaryBlue } from "@similarweb/styles/src/style-guide-colors";
import { Button } from "@similarweb/ui-components/dist/button";
import * as React from "react";
import { StatelessComponent } from "react";
import { FlexColumn } from "styled components/StyledFlex/src/StyledFlex";
import styled, { css } from "styled-components";
import { NewDataLabel } from "../../../../pages/lead-generator/lead-generator-all/components/elements";

interface IDashboardTemplateBoxProps {
    locked?: boolean;
    onClick?: () => void;
    id?: number | string;
}

const transitionDuration = ".2s";
const transitionEasing = "ease-in-out";

export const DashboardTemplateBoxPreview = styled.div`
    background-color: ${colorsPalettes.bluegrey["100"]};
    height: 196px;
    position: relative;
`;

const DashboardTemplateBlankPreview = styled(DashboardTemplateBoxPreview)`
    background-color: transparent;
`;

const DashboardTemplateBlankImage = styled.div`
    width: 289px;
    height: 150px;
    border: 2px dashed #d0d5da;
    border-radius: 6px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translateX(-50%) translateY(-50%);
    transition: background-color ${transitionDuration} ${transitionEasing};
    &:before {
        content: "+";
        color: #aab2ba;
        font-size: 24px;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translateX(-50%) translateY(-50%);
    }
`;
export const DashboardTemplateBoxImage = styled.img`
    transform: scale(0.9) translateX(-50%) translateY(-50%);
    transform-origin: 0 0;
    transition: transform ${transitionDuration} ${transitionEasing};
    position: absolute;
    top: 50%;
    left: 50%;
`;
export const DashboardTemplateBoxDetails = styled.div`
    padding: 18px 25px 0;
    height: 141px;
`;
export const DashboardTemplateBoxTitle = styled.div`
    ${setFont({ $weight: 500, $size: 18, $color: $primaryBlue })};
    margin-bottom: 12px;
    display: flex;
    align-items: center;
    ${NewDataLabel} {
        position: relative;
        top: 2px;
    }
`;
export const DashboardTemplateBoxDescription = styled.div`
    ${setFont({ $weight: 400, $size: 14, $color: "rgba(42,62,82,0.8)" })};
    line-height: 22px;
`;

const DashboardTemplateButton = styled(Button)`
    position: absolute;
    top: 80px;
    left: 124px;
    opacity: 0;
    transition: opacity ${transitionDuration} ${transitionEasing}, background-color 0.2s ease-out;
`;

const DashboardTemplateButtonLocked = styled(DashboardTemplateButton)`
    background-color: ${colorsPalettes.green["s100"]};

    &:hover {
        background-color: ${colorsPalettes.green["s100"]};
    }
`;

const DashboardTemplateLockIcon = styled(SWReactIcons).attrs({
    iconName: "locked",
})`
    width: 16px;
    height: 16px;
    display: inline-block;
    margin-left: 4px;
    svg {
        path {
            fill: ${colorsPalettes.green["s100"]};
            fill-opacity: 1;
        }
    }
`;

export const DashboardTemplateBox = styled.a.attrs<IDashboardTemplateBoxProps>((props) => ({
    "data-automation-dashboard-template": props.id,
}))<IDashboardTemplateBoxProps>`
    display: inline-block;
    width: 337px;
    height: 337px;
    box-sizing: border-box;
    overflow: hidden;
    cursor: pointer;
    border-radius: 6px;
    border: 1px solid rgba(208, 213, 218, 0.4);
    transition: border-color ${transitionDuration} ${transitionEasing};
    &:hover {
        border-color: ${({ locked }) => (locked ? colorsPalettes.green["s100"] : $primaryBlue)};
        box-shadow: 0 3px 6px 0 rgba(14, 30, 62, 0.08);
        ${DashboardTemplateBoxImage} {
            transform: scale(0.95) translateX(-50%) translateY(-50%);
        }
        ${DashboardTemplateButton} {
            opacity: 1;
        }
        ${DashboardTemplateBlankImage} {
            background-color: #fcfcfc;
            &:before {
                content: "";
            }
        }
    }
`;

interface IDashboardTemplateProps {
    title: string;
    description: string;
    image: string;
    locked?: boolean;
    empty?: boolean;
    onClick?: () => void;
    id: string | number;
    isNew: boolean;
}
export const DashboardTemplate: StatelessComponent<IDashboardTemplateProps> = ({
    title,
    description,
    image,
    locked,
    empty,
    onClick,
    id,
    isNew,
}) => {
    const ButtonComponent = locked ? (
        <DashboardTemplateButtonLocked>upgrade</DashboardTemplateButtonLocked>
    ) : (
        <DashboardTemplateButton>+ select</DashboardTemplateButton>
    );
    return (
        <DashboardTemplateBox locked={locked} onClick={onClick} id={id.toString()}>
            {empty ? (
                <DashboardTemplateBlankPreview>
                    <DashboardTemplateBlankImage />
                    {ButtonComponent}
                </DashboardTemplateBlankPreview>
            ) : (
                <DashboardTemplateBoxPreview>
                    <DashboardTemplateBoxImage src={image} />
                    {ButtonComponent}
                </DashboardTemplateBoxPreview>
            )}

            <DashboardTemplateBoxDetails>
                <DashboardTemplateBoxTitle>
                    {title}
                    {locked ? <DashboardTemplateLockIcon /> : null}
                    {isNew ? <NewDataLabel>NEW</NewDataLabel> : null}
                </DashboardTemplateBoxTitle>
                <DashboardTemplateBoxDescription>{description}</DashboardTemplateBoxDescription>
            </DashboardTemplateBoxDetails>
        </DashboardTemplateBox>
    );
};
