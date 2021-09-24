import React from 'react';
import { Box, Input, useMultiStyleConfig, useToken } from '@chakra-ui/react';
import CameraLineIcon from 'remixicon-react/CameraLineIcon';
const Edit = ({ variant = 'avatar', onChange, allowedFile, isEmpty, }) => {
    const { upload, icon, edit } = useMultiStyleConfig('ImageUpload', {
        variant,
        isEmpty,
    });
    const [space5] = useToken('space', [5]);
    return (React.createElement(Box, { sx: edit },
        React.createElement(Box, { as: CameraLineIcon, color: "bg.base", sx: icon, size: space5 }),
        React.createElement(Input, { "data-testid": "image-upload-input", type: "file", sx: upload, onChange: onChange, accept: allowedFile })));
};
export default Edit;
//# sourceMappingURL=index.js.map