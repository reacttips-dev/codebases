import React from "react";
import { FileDropZone } from "@similarweb/ui-components/dist/file-drop-zone";
import { HiddenFileInput } from "@similarweb/ui-components/dist/hidden-file-input";
import { i18nFilter } from "filters/ngFilters";
import {
    CSVFileDropZoneContainer,
    CSVFileDropZoneBoxContainer,
    CSVFileDropZoneImage,
    CSVFileDropZoneText,
    ProcessingSpinner,
    ErrorMessage,
} from "./styledComponents";

interface ICSVFileDropZone {
    handleFiles: Function;
    acceptFile?: string;
    error?: string;
}

export const CSVFileDropZone: React.FC<ICSVFileDropZone> = ({ handleFiles, acceptFile, error }) => {
    const [isProcessing, setIsProcessing] = React.useState(false);

    const processFiles = React.useCallback(
        async (...args) => {
            setIsProcessing(true);
            try {
                await handleFiles(...args);
            } finally {
                setIsProcessing(false);
            }
        },
        [handleFiles],
    );

    return (
        <CSVFileDropZoneContainer>
            <FileDropZone onDragDrop={processFiles} isDisabled={isProcessing}>
                {({ isOver }) => (
                    <CSVFileDropZoneBox
                        handleFiles={processFiles}
                        isOver={isOver}
                        isProcessing={isProcessing}
                        isError={!!error}
                        acceptFile={acceptFile}
                    />
                )}
            </FileDropZone>
            {error && <ErrorMessage>{error}</ErrorMessage>}
        </CSVFileDropZoneContainer>
    );
};

const CSVFileDropZoneBox = ({ handleFiles, isOver, isProcessing, isError, acceptFile }) => {
    const services = React.useMemo(
        () => ({
            i18n: i18nFilter(),
        }),
        [],
    );

    const renderDropZoneText = () => {
        if (isProcessing) {
            return (
                <CSVFileDropZoneText>
                    <ProcessingSpinner />
                    {services.i18n("segmentWizard.csvModal.uploading")}
                </CSVFileDropZoneText>
            );
        }
        if (isOver) {
            return (
                <CSVFileDropZoneText>
                    <a>{services.i18n("segmentWizard.csvModal.dropHere")}</a>
                </CSVFileDropZoneText>
            );
        }
        return (
            <CSVFileDropZoneText>
                <HiddenFileInput onFileChange={handleFiles} accept={acceptFile}>
                    <a>{services.i18n("segmentWizard.csvModal.upload.part1")}</a>
                </HiddenFileInput>
                &nbsp;{services.i18n("segmentWizard.csvModal.upload.part2")}
            </CSVFileDropZoneText>
        );
    };

    return (
        <CSVFileDropZoneBoxContainer isOver={isOver} isProcessing={isProcessing} isError={isError}>
            {!isProcessing && <CSVFileDropZoneImage />}
            {renderDropZoneText()}
        </CSVFileDropZoneBoxContainer>
    );
};
