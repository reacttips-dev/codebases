import { createGlobalStyle } from "styled-components";
import { ColumnsPickerFooter } from "@similarweb/ui-components/dist/columns-picker/src/StyledComponents";

export const PICKER_HEIGHT = 427;
export const CUSTOM_MODAL_STYLES = {
    content: { padding: 0, width: 600 },
};

export const StyledModalGlobal = createGlobalStyle`
    ${ColumnsPickerFooter} {
        padding: 16px;
    }
`;
