import styled from "styled-components";
import { StyledCommonTransitionedElement } from "../../styles";

export const CONTENT_TRANSITION_CLASSNAMES_PREFIX = "filters-panel-content";

export const StyledPanelContent = styled(StyledCommonTransitionedElement)`
    flex-grow: 1;
    overflow-y: scroll;
    margin-bottom: 70px;
    padding-bottom: 16px;
`;
