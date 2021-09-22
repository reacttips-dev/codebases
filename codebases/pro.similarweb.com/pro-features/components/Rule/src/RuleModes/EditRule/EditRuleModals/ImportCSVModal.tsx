import React, { MouseEventHandler } from "react";
import { SWReactIcons } from "@similarweb/icons";
import { i18nFilter } from "filters/ngFilters";
import { AssetsService } from "services/AssetsService";
import { IProModalCustomStyles, ProModal } from "components/Modals/src/ProModal";
import { CSVFileDropZone } from "./CSVFileDropZone";
import {
    ModalTitle,
    ModalFooter,
    SectionTitle,
    SectionBody,
    ImportIconButton,
    CSVFileSuccessImage,
    UploadedFileBox,
    UploadedFileName,
    UploadedFileStats,
} from "./styledComponents";
import * as _ from "lodash";

const allowedFileTypes = {
    ext: [".csv", ".txt"],
    mime: ["text/csv", "text/plain"],
};

const proModalStyles: IProModalCustomStyles = {
    content: {
        width: "420px",
        padding: "24px",
    },
};

interface IImportCSVModalProps {
    isOpen?: boolean;
    onImportSuccess: (customStrings: string[], uploadedFile: File) => void;
    onImportFailure?: (error: string, uploadedFiles: File[]) => void;
    onClose: () => void;
    onDownloadSampleCsvClick: any;
    modalTitle?: string;
}

export const ImportCSVModal: React.FC<IImportCSVModalProps> = (props) => {
    const {
        isOpen = false,
        onImportSuccess,
        onImportFailure,
        onClose,
        onDownloadSampleCsvClick = _.noop(),
        modalTitle,
    } = props;

    const services = React.useMemo(
        () => ({
            i18n: i18nFilter(),
        }),
        [],
    );

    const [uploadedFile, setUploadedFile] = React.useState<File>(null);
    const [uploadError, setUploadError] = React.useState<string>(null);
    const [importedStrings, setImportedStrings] = React.useState<string[]>(null);
    const [isImporting, setIsImporting] = React.useState<boolean>(false);

    const reset = () => {
        setUploadedFile(null);
        setUploadError(null);
        setImportedStrings(null);
        setIsImporting(false);
    };

    // reset state on open
    React.useEffect(() => {
        if (isOpen) {
            reset();
        }
    }, [isOpen]);

    const handleError = (error, uploadedFiles) => {
        setUploadError(error);
        if (onImportFailure) {
            onImportFailure(error, uploadedFiles);
        }
    };

    const handleFiles = React.useCallback(async (files) => {
        setUploadError(null);

        // only a single file is allowed to be imported
        if (files.length > 1) {
            handleError("segmentWizard.csvModal.error.multipleFiles", files);
            return;
        }
        const file = files[0];

        // check if mimetype or extension of the file is allowed
        const lastPeriodPos = file.name.lastIndexOf(".");
        const fileExt = lastPeriodPos !== -1 ? file.name.slice(lastPeriodPos) : null;
        if (!allowedFileTypes.mime.includes(file.type) && !allowedFileTypes.ext.includes(fileExt)) {
            handleError("segmentWizard.csvModal.error.invalidFileType", files);
            return;
        }

        // read the file contents
        let contents;
        try {
            contents = await file.text();
        } catch {
            handleError("segmentWizard.csvModal.error.invalidStructure", files);
            return;
        }

        // extract strings from file contents
        const strings = contents
            .split(/\n|\r|\r\n/)
            .map((str) =>
                decodeURIComponent(str)
                    ?.replace("http://www.", "")
                    ?.replace("https://www.", "")
                    ?.replace("http://", "")
                    ?.replace("https://", "")
                    ?.trim(),
            )
            .filter((str) => str);

        // check file is not empty
        if (strings.length === 0) {
            handleError("segmentWizard.csvModal.error.emptyStrings", files);
            return;
        }

        // set uploaded file and its extracted strings
        setImportedStrings(strings);
        setUploadedFile(file);
    }, []);

    const resetImport = React.useCallback(() => {
        reset();
    }, []);

    const importStrings = React.useCallback(async () => {
        setIsImporting(true);
        await onImportSuccess(importedStrings, uploadedFile);
        setIsImporting(false);
        onClose();
    }, [importedStrings, uploadedFile]);

    const acceptFile = React.useMemo(
        () => [...allowedFileTypes.ext.map((ext) => `.${ext}`), ...allowedFileTypes.mime].join(","),
        [],
    );

    const uploadErrorText = React.useMemo(() => uploadError && services.i18n(uploadError), [
        uploadError,
    ]);

    const renderUploadFile = () => (
        <>
            <CSVFileDropZone
                handleFiles={handleFiles}
                error={uploadErrorText}
                acceptFile={acceptFile}
            />
            <SectionTitle>{services.i18n("segmentWizard.csvModal.section.optional")}</SectionTitle>
            <SectionBody>
                <a
                    onClick={onDownloadSampleCsvClick}
                    href={AssetsService.assetUrl("/images/segments/files/bulk_upload_sample.csv")}
                >
                    <SWReactIcons iconName="download" size="xs" />
                    &nbsp;{services.i18n("segmentWizard.csvModal.downloadCSV.part1")}
                </a>
                &nbsp;{services.i18n("segmentWizard.csvModal.downloadCSV.part2")}
            </SectionBody>
        </>
    );

    const renderUploadSuccess = () => (
        <>
            <CSVFileSuccessImage />
            <UploadedFileBox>
                <UploadedFileName>
                    <SWReactIcons iconName="opportunities" size="xs" />
                    {uploadedFile.name}
                </UploadedFileName>
                <a onClick={resetImport}>
                    {services.i18n("segmentWizard.csvModal.uploadedFile.clear")}
                </a>
            </UploadedFileBox>
            <UploadedFileStats>
                <SWReactIcons iconName="checked" size="xs" />
                {services.i18n("segmentWizard.csvModal.uploadedFile.stats.foundStringsCount", {
                    count: importedStrings.length,
                })}
            </UploadedFileStats>
        </>
    );

    return (
        <ProModal isOpen={isOpen} onCloseClick={onClose} customStyles={proModalStyles}>
            <ModalTitle>
                {services.i18n(
                    uploadedFile
                        ? "segmentWizard.csvModal.title.stringsSuccessfullyUploaded"
                        : modalTitle,
                )}
            </ModalTitle>
            {uploadedFile ? renderUploadSuccess() : renderUploadFile()}
            <ModalFooter>
                <ImportIconButton
                    onClick={importStrings}
                    isDisabled={!uploadedFile || isImporting}
                    iconSize="xs"
                >
                    {services.i18n("segmentWizard.csvModal.importStrings")}
                </ImportIconButton>
            </ModalFooter>
        </ProModal>
    );
};
