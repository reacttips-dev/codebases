import React, { useCallback } from 'react';
import { Trans, useTranslation } from 'tribe-translation';
import { FileUpload } from '../../FileUpload';
import { Text } from '../../Text';
import staticProps from '../staticProps';
const ImagePickerDropdownTabImageUpload = ({ close, onFileUpload, }) => {
    const { t } = useTranslation();
    const handleFileChange = useCallback((files) => {
        onFileUpload === null || onFileUpload === void 0 ? void 0 : onFileUpload(files);
        close();
    }, [close, onFileUpload]);
    return (React.createElement(React.Fragment, null,
        React.createElement(FileUpload, { accept: "image/*", buttonText: t('common:uploadAnImage', 'Upload an image'), buttonProps: staticProps.buttonProps, onFileChange: handleFileChange, shouldDisplayPreview: false }),
        React.createElement(Text, { color: "label.secondary", textStyle: "regular/medium", mt: 4, textAlign: "center" },
            React.createElement(Trans, { i18nKey: "common:recommendedSize", defaults: "Recommended size of 280 x 280px." })),
        React.createElement(Text, { color: "label.secondary", textStyle: "regular/medium", mt: 4, textAlign: "center" },
            React.createElement(Trans, { i18nKey: "common:maximumFileSize", defaults: "The maximum file size is 10 MB." }))));
};
export default ImagePickerDropdownTabImageUpload;
//# sourceMappingURL=ImagePickerDropdownTabImageUpload.js.map