import styled from "styled-components";
import { UseCaseBodyListHeaderWrapper } from "@similarweb/ui-components/dist/homepages/use-case/src/StyledComponents";
import { SubTitleWrapper } from "@similarweb/ui-components/dist/homepages/common/CommonStyledComponents";

export const StyledFindLeadsPage = styled.div`
    ${UseCaseBodyListHeaderWrapper} {
        margin-bottom: 0;
    }

    ${SubTitleWrapper} > span {
        font-size: 16px;
    }
`;
