import React, { useCallback, useState } from 'react';
import { HStack } from '@chakra-ui/react';
import { Trans } from 'tribe-translation';
import { Button } from '../Button';
import { Text } from '../Text';
export const FileUpload = ({ accept, buttonProps, buttonText, onFileChange, shouldDisplayPreview = true, }) => {
    const [preview, setPreview] = useState('');
    const hiddenFileInput = React.useRef(null);
    const onClick = () => {
        hiddenFileInput.current.click();
    };
    const onChange = useCallback(event => {
        var _a;
        const file = (_a = event.target.files) === null || _a === void 0 ? void 0 : _a[0];
        if (file) {
            setPreview(file === null || file === void 0 ? void 0 : file.name);
        }
        if (typeof onFileChange === 'function') {
            onFileChange(file);
        }
    }, [onFileChange]);
    return (React.createElement(HStack, null,
        React.createElement(Button, Object.assign({ variant: "ghost", size: "sm", onClick: onClick }, buttonProps), buttonText || (React.createElement(Trans, { i18nKey: "common:chooseFile", defaults: "Choose file" }))),
        React.createElement("input", { type: "file", ref: hiddenFileInput, onChange: onChange, accept: accept, hidden: true, "data-testid": "file-upload" }),
        shouldDisplayPreview && (React.createElement(Text, null, preview || (React.createElement(Trans, { i18nKey: "upload.empty", defaults: "No file chosen" }))))));
};
export default FileUpload;
//# sourceMappingURL=FileUpload.js.map