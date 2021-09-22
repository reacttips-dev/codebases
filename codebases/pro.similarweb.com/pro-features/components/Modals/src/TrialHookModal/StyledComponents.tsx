import { SWReactIcons } from "@similarweb/icons";
import { colorsPalettes } from "@similarweb/styles";
import { calcRemFontSize } from "@similarweb/styles/src/mixins";
import { IconButton } from "@similarweb/ui-components/dist/button";
import { Button, ButtonLabel, IButtonProps } from "@similarweb/ui-components/dist/button";
import { CloseIconWrapper } from "../../../../components/Modals/src/ProModal";
import { TrialHookModalSteps } from "../../../../components/Modals/src/TrialHookModal/TrialHookModal";
import * as React from "react";
import styled from "styled-components";

interface ITrialHookModalStyledProps {
    isTwoStep?: boolean;
}

export const TrialHookModalCloseIcon = styled(CloseIconWrapper)`
    display: flex;
    justify-content: center;
    align-items: center;
    ${SWReactIcons} {
        display: block;
        width: 16px;
        height: 16px;
    }
`;

export const TrialHookModalContainer = styled.div`
    display: flex;
    width: 620px;
    border-radius: 6px;
    box-shadow: 0 8px 8px 0 rgba(0, 0, 0, 0.24), 0 0 8px 0 rgba(0, 0, 0, 0.12);
    background-color: #fff;
`;

export const TrialHookModalContent = styled.div`
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    flex-shrink: 0;
    width: 360px;
    padding: 40px;
    border-radius: 6px 0 0 6px;
`;

export const TrialHookModalFormWrap = styled.div`
    box-sizing: border-box;
    flex-shrink: 1;
    flex-basis: 100%;
    padding: 40px 40px 20px;
    border-radius: 0 6px 6px 0;
    .cu-button {
        padding: 0 15px;
        background: #7975f2;
        font-size: 0.875rem;
        font-weight: bold;
        line-height: 37px;
        &:hover {
            background: #625ed9;
            box-shadow: none;
            transform: none;
        }
    }
`;

export const TrialHookModalFormText = styled.p`
    margin: 0 0 4px;
    ${calcRemFontSize(12)};
    line-height: 1.17;
    color: rgba(42, 62, 82, 0.6);
    text-align: center;
`;

export const TrialHookModalTitle = styled.div`
    ${calcRemFontSize(24)};
    font-weight: 700;
    color: #2a3e52;
    line-height: normal;
`;

interface ITrialHookModalImageProps {
    hasShadow?: boolean;
    trialHookImgHeight?: string;
}

export const TrialHookModalImage = styled.img`
    align-self: center;
    flex-shrink: 0;
    max-width: 100%;
    ${({ trialHookImgHeight }: ITrialHookModalImageProps) =>
        trialHookImgHeight
            ? `
  height: ${trialHookImgHeight};
  `
            : null};
    margin-bottom: 20px;
    border-radius: 4px;
    box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.13);
`;

export const TrialHookModalText = styled.p`
    margin: 5px 0 0;
    ${calcRemFontSize(14)};
    line-height: 1.43;
    color: #2a3e52;
    a {
        cursor: pointer;
        color: #7975f2;
    }
    br + a {
        display: inline-block;
        margin-top: 16px;
        font-weight: 700;
    }
`;

export const TrialHookModalSidebar = styled.div`
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    flex-shrink: 0;
    width: 260px;
    padding: 40px 25px;
    background-color: #edf2f7;
    border-radius: 0 6px 6px 0;
`;

interface ITrialHookModalFigureProps {
    trialHookFigureImgHeight?: string;
}

export const TrialHookModalFigure = styled.figure`
  margin: 0 0 16px;
  img {
    max-width: 100%;
    margin-bottom: 8px;
    ${({ trialHookFigureImgHeight }: ITrialHookModalFigureProps) =>
        trialHookFigureImgHeight
            ? `
     height: ${trialHookFigureImgHeight};
    `
            : null};
}

  }
  figcaption {
    margin: 0;
    ${calcRemFontSize(12)};
    color: #7f8b97;
    line-height: 1.5;
    text-align: center;
  }
`;

interface IButtonWrapperProps extends IButtonProps {
    children?: string | JSX.Element;
    step?: TrialHookModalSteps;
}

const ButtonTrialWrapper = (props: IButtonWrapperProps) => (
    <Button type="trial" {...props}>
        {props.children}
    </Button>
);

const ButtonTrial = styled(ButtonTrialWrapper)``;

const ButtonOutlinedWrapper = (props: IButtonWrapperProps) => (
    <Button type="outlined" {...props}>
        {props.children}
    </Button>
);

const ButtonOutlined = styled(ButtonOutlinedWrapper)`
    border-color: ${colorsPalettes.indigo[300]};
    line-height: normal;
    ${ButtonLabel} {
        color: ${colorsPalettes.indigo[300]};
        line-height: normal;
    }
    &:hover {
        border-color: ${colorsPalettes.indigo[400]};
        ${ButtonLabel} {
            color: ${colorsPalettes.indigo[400]};
        }
    }
`;

export const TrialHookModalFormButton = styled(ButtonOutlined)`
    min-width: 194px;
    margin-top: 8px;
`;

export const TrialHookModalCloseButton = styled(ButtonTrial)`
    display: block;
    margin: 0 auto 60px;
`;

export const TrialHookModalBackButton = styled(IconButton)`
    margin-bottom: 5px;
    line-height: normal;
`;
