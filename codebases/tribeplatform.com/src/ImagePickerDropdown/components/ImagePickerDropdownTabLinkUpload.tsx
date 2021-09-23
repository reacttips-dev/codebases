import React, { useCallback, useState } from 'react';
import axios from 'axios';
import { Trans, useTranslation } from 'tribe-translation';
import { Button } from '../../Button';
import { Input } from '../../Input';
import { Text } from '../../Text';
import { useToast } from '../../Toast';
import staticProps from '../staticProps';
const ImagePickerDropdownTabLinkUpload = ({ close, onLinkUpload, }) => {
    const { t } = useTranslation();
    const [link, setLink] = useState('');
    const toast = useToast();
    const handleInputChange = useCallback((event) => {
        var _a;
        setLink((_a = event === null || event === void 0 ? void 0 : event.target) === null || _a === void 0 ? void 0 : _a.value);
    }, []);
    const handleLinkSubmit = useCallback(async () => {
        var _a;
        try {
            const url = new URL(link);
            const response = await axios.get(url === null || url === void 0 ? void 0 : url.href, {
                responseType: 'blob',
            });
            if ((response === null || response === void 0 ? void 0 : response.status) >= 200 && (response === null || response === void 0 ? void 0 : response.status) < 300) {
                const blob = response === null || response === void 0 ? void 0 : response.data;
                const fileName = (_a = url === null || url === void 0 ? void 0 : url.href) === null || _a === void 0 ? void 0 : _a.split('/').slice(-1)[0];
                const file = new File([blob], fileName, {
                    type: blob.type,
                });
                onLinkUpload === null || onLinkUpload === void 0 ? void 0 : onLinkUpload(file);
                setLink('');
                close();
            }
            else {
                throw new Error();
            }
        }
        catch (error) {
            toast({
                title: t('common:uploadFailed', 'Upload failed'),
                description: typeof error.response === 'undefined'
                    ? t('common:uploadThisImageAsFile', 'Upload this image as a file instead of pasting the link.')
                    : t('common:pleaseCheckTheLink', 'Please check the link is correct or try again with a different one.'),
                status: 'error',
                isClosable: true,
            });
        }
    }, [close, link, onLinkUpload, t, toast]);
    return (React.createElement(React.Fragment, null,
        React.createElement(Input, { onChange: handleInputChange, placeholder: t('common:pasteAnImageLink', 'Paste an image link...'), size: "md", value: link }),
        React.createElement(Button, Object.assign({ mt: 4, onClick: handleLinkSubmit }, staticProps.buttonProps),
            React.createElement(Trans, { i18nKey: "common:submit", defaults: "Submit" })),
        React.createElement(Text, { color: "label.secondary", textStyle: "regular/medium", mt: 4, textAlign: "center" },
            React.createElement(Trans, { i18nKey: "common:worksWithAnyImageFromTheWeb", defaults: "Works with any image from the web." }))));
};
export default ImagePickerDropdownTabLinkUpload;
//# sourceMappingURL=ImagePickerDropdownTabLinkUpload.js.map