import styled from "styled-components";
import { Button, IconButton } from "@similarweb/ui-components/dist/button";
import { colorsPalettes } from "@similarweb/styles";
import { Textarea, ITextareaProps } from "@similarweb/ui-components/dist/textarea";
/*
 * This section is mostly for AddEditPanel
 */
export const AddEditPanelContainer = styled.div`
    margin: 12px 16px;
    min-width: 277px;
`;
export const AddEditBody = styled.div``;
export const AddEditPanelHeader = styled.div`
    display: flex;
    color: ${colorsPalettes.carbon[200]};
    margin: 12px 0px;
`;
export const BackButton = styled.div`
    display: inline-flex;
    cursor: pointer;
    flex: 0 0 auto;
    margin-left: 12px;
    margin-right: 20px;
    padding: 0px;
    transition: opacity 200ms ease-in-out;
    &:hover {
        .SWReactIcons {
            display: flex;
            justify-content: center;
            align-items: center;
            flex: 0 0 auto;
            svg {
                path {
                    fill: ${colorsPalettes.blue["400"]} !important;
                    fill-opacity: 1;
                    transition: fill 200ms ease-out;
                }
            }
        }
    }
`;
export const HeaderTextPanel = styled.div`
    display: inline-block;
    font-size: 12px;
    line-height: 16px;
`;
export const AddEditPanelContent = styled.div``;
export const AddEditTextarea = styled(Textarea)<ITextareaProps>`
    padding: 12px 8px 20px 16px;
    border: 1px solid ${colorsPalettes.blue["400"]};
    box-sizing: border-box;
    box-shadow: 0px 3px 5px rgba(42, 62, 82, 0.12);
    border-radius: 3px;
    textarea {
        // color: #3a5166;
        // font-size: 14px;
        // line-height: 16px;
        padding: 0px;
    }
`;
export const ActionBarContainer = styled.div`
    display: flex;
    justify-content: flex-end;
    align-items: center;
    margin-top: 18px;
`;
export const ActionBarEditContainer = styled(ActionBarContainer)`
    justify-content: space-between;
`;
export const AnnotationDeleteButton = styled(Button)`
    min-width: unset;
    cursor: default;
    &:hover {
        cursor: pointer;
    }
    & > div {
        color: ${colorsPalettes.red["s100"]} !important;
        font-weight: bold !important;
        font-size: 14px;
        line-height: 20px;
    }
`;
export const AnnotationButton = styled(Button)`
    & > div {
        font-weight: bold !important;
    }
`;
/*
 * This section is mostly for AnnotationsPanel
 */
export const AnnotationsPanelContainer = styled.div`
    & .ScrollArea-content:not(:only-child) {
        margin-right: 19px;
    }
    margin: 12px 13px 12px 16px;
    min-width: 277px;
`;
export const AnnotationsPanelHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: ${colorsPalettes.carbon[200]};
    margin: 12px 0px;
`;
export const CloseIconButton = styled(IconButton)`
    margin-left: 10px;
`;
export const AnnotationCardEditButton = styled(Button)`
    min-width: unset;
    padding: 0px;
    height: 16px !important;
    opacity: 0;
    cursor: default;
    & > div {
        font-size: 12px;
        line-height: 16px;
    }
`;
export const AnnotationCard = styled.div`
    background: ${colorsPalettes.carbon[25]};
    border-radius: 4px;
    color: ${colorsPalettes.carbon[500]};
    &:hover {
        background: ${colorsPalettes.carbon[50]};
        ${AnnotationCardEditButton} {
            opacity: 1;
            cursor: pointer;
        }
    }
    &:not(:first-child) {
        margin-top: 12px;
    }
`;
export const AnnotationCardHeader = styled.div`
    display: flex;
    justify-content: space-between;
    padding: 8px;
`;
export const AnnotationCardHeaderLeftPanel = styled.div`
    display: inline-block;
    line-height: 16px;
    font-size: 12px;
`;
export const AnnotationCardContent = styled.div`
    display: flex;
    padding: 0px 8px 8px;
    line-height: 18px;
    font-size: 14px;
`;
/*
 * This section is for CircularProgress
 */
export const LoaderContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    position: absolute;
    z-index: 1073;
`;
/*
 * This section is mostly for AnnotationHOC
 */
export const CalloutInnerContainer = styled.div`
    position: relative;
`;
/*
 * This is for add annotation button style that follow mouse move
 */
export const AddIconButton = styled(IconButton)`
    margin-left: 0px;
    &,
    &:hover,
    &:active {
        background-color: ${colorsPalettes.carbon[0]};
        box-shadow: 0px 8px 24px rgba(9, 37, 64, 0.08), 0px 16px 32px rgba(9, 37, 64, 0.08);
        border-radius: 40px;
    }
`;
export const AddButtonContainer = styled.div`
    position: absolute;
    z-index: 1;
    &, &:hover, &:active {
        .SWReactIcons {
            svg {
              path {
                fill: ${colorsPalettes.blue[400]};
              }
            }
          }
        }
    }
`;
