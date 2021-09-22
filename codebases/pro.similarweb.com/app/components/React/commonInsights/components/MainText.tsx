import { I18nStyled } from "./styledComponents";

export const MainText = ({ replacementObject = {}, mainTextKey }) => (
    <I18nStyled dangerouslySetInnerHTML={true} dataObj={replacementObject}>
        {mainTextKey}
    </I18nStyled>
);
