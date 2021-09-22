import styled, { css } from "styled-components";
import { colorsPalettes } from "@similarweb/styles";
import { IconButton } from "@similarweb/ui-components/dist/button";
import { Input } from "@similarweb/ui-components/dist/boolean-search";
import { Spinner } from "components/Loaders/src/Spinner";
import { AssetsService } from "services/AssetsService";

export const ModalTitle = styled.div`
    font-size: 20px;
    line-height: 24px;
    font-weight: 500;
    color: ${colorsPalettes.carbon[500]};
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    margin-bottom: 10px;
`;

export const ModalFooter = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
`;

export const SectionTitle = styled.div`
    font-size: 16px;
    line-height: 20px;
    font-weight: 500;
    color: ${colorsPalettes.carbon[400]};
    margin: 12px 0;
`;

export const SectionBody = styled.div`
    font-size: 14px;
    line-height: 20px;
    color: ${colorsPalettes.carbon[500]};
    margin-bottom: 12px;

    a {
        font-weight: bold;
        cursor: pointer;
        white-space: nowrap;

        .SWReactIcons {
            display: inline-block;
            vertical-align: baseline;

            svg {
                margin-bottom: -2px;
                &,
                & path {
                    fill: ${colorsPalettes.blue[400]};
                }
            }
        }
    }
`;

export const CSVFileDropZoneContainer = styled.div`
    margin: 24px 0;
`;

export const CSVFileDropZoneBoxContainer = styled.div<{
    isOver: boolean;
    isProcessing: boolean;
    isError: boolean;
}>`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 16px;
    box-sizing: border-box;
    min-height: 120px;
    border-radius: 2px;
    border: 1px dashed
        ${({ isProcessing, isError }) =>
            isProcessing
                ? colorsPalettes.carbon[200]
                : isError
                ? colorsPalettes.red["s100"]
                : colorsPalettes.sky[500]};
    background: ${({ isOver, isProcessing }) =>
        isProcessing
            ? colorsPalettes.carbon[25]
            : isOver
            ? colorsPalettes.sky[100]
            : colorsPalettes.bluegrey[100]};
    transition: background 0.2s;
`;

export const CSVFileDropZoneText = styled.div`
    font-size: 14px;
    line-height: 20px;

    a {
        font-weight: bold;
        cursor: pointer;
        white-space: nowrap;
    }
`;

export const CSVFileDropZoneImage = styled.div`
    width: 65px;
    height: 65px;
    margin: 0 auto;
    background: url(${AssetsService.assetUrl("/images/upload-cloud.svg")}) top center no-repeat;
`;

export const ImportIconButton = styled(IconButton).attrs({
    iconName: "download",
})`
    margin-top: 12px;

    .SWReactIcons {
        transform: rotate(180deg);
    }
`;

export const ProcessingSpinner = styled(Spinner)`
    display: inline-block;
    vertical-align: baseline;
    margin-right: 0.5em;
    width: 0.8em;
    height: 0.8em;
`;

export const ErrorMessage = styled.div`
    font-size: 12px;
    line-height: 16px;
    color: ${colorsPalettes.red[400]};
`;

export const CSVFileSuccessImage = styled.div`
    width: 100px;
    height: 120px;
    margin: 0 auto;
    background: url(${AssetsService.assetUrl("/images/file-success.svg")}) top center no-repeat;
    background-size: contain;
`;

export const UploadedFileBox = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    border: 1px solid ${colorsPalettes.navigation["ICON_BAR_BACKGROUND"]};
    border-radius: 2px;
    padding: 12px;

    a {
        font-size: 14px;
        font-weight: 500;
        cursor: pointer;
    }
`;

export const UploadedFileName = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    font-size: 14px;
    line-height: 18px;
    color: ${colorsPalettes.carbon[300]};

    .SWReactIcons {
        margin-right: 0.7em;
        vertical-align: baseline;
        width: 1.5em;
        height: 1.5em;
    }
`;

export const UploadedFileStats = styled.div`
    font-size: 12px;
    line-height: 16px;
    color: ${colorsPalettes.carbon[300]};
    padding: 6px 4px;

    .SWReactIcons {
        display: inline-block;
        margin-right: 0.7em;
        vertical-align: baseline;
        width: 0.8em;
        height: 0.8em;

        svg {
            &,
            & path {
                fill: ${colorsPalettes.carbon[300]};
            }
        }
    }
`;

const flexScrollableArea = css`
    display: flex;
    flex-direction: column;
    flex-wrap: nowrap;
    flex: auto;
    overflow: hidden;

    & > * {
        flex: none;
    }
`;

export const ModalContentWrapper = styled.div`
    ${flexScrollableArea};
    overflow: visible;
    height: 100%;

    & > .bodyList {
        margin: 0 -24px -12px;
        padding: 0 12px;
        ${flexScrollableArea};

        & > .ScrollArea {
            flex: auto;
            margin-right: -10px;
        }
    }
`;

export const SearchFilterContainer = styled.div`
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    position: relative;

    ${Input} {
        flex: auto;
        padding: 14px 6px 14px 32px;
        margin-bottom: 4px;
        border-bottom: 1px solid ${colorsPalettes.carbon[200]};
        transition: border 0.2s;

        &:focus {
            border-bottom: 1px solid ${colorsPalettes.blue[400]};
        }
    }

    .SWReactIcons {
        position: absolute;
        top: 0;
        left: 0;
        margin: 12px 4px;
    }
`;

export const StringItem = styled.div.attrs({
    isControllerRow: false,
})<{ isControllerRow: boolean }>`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    padding: 12px 12px 12px 0;

    span {
        flex: auto;
        font-size: 14px;
        line-height: 16px;
        font-weight: ${({ isControllerRow }) => (isControllerRow ? 500 : 400)};
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    a {
        cursor: pointer;
        margin: 0 4px;

        svg {
            &,
            & path {
                fill: ${colorsPalettes.carbon[200]};
                transition: fill 0.2s;
            }
        }

        &:hover {
            svg {
                &,
                & path {
                    fill: ${colorsPalettes.carbon[300]};
                }
            }
        }
    }
`;

export const BulkOperationBar = styled.div`
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    align-items: center;
    justify-content: space-between;
    background: ${colorsPalettes.blue[400]};
    color: ${colorsPalettes.carbon[0]};
    font-size: 14px;
    line-height: 18px;
    font-weight: 500;
    padding: 12px 16px;
    margin: 12px -25px -25px -25px;
    border-radius: 0 0 6px 6px;

    a {
        cursor: pointer;
        color: ${colorsPalettes.carbon[0]};
        text-transform: uppercase;
    }
`;
