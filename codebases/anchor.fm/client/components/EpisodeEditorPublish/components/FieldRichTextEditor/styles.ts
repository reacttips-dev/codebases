import styled from '@emotion/styled';
import { SM_SCREEN_MAX } from 'modules/Styleguide';

export const Label = styled.label`
  width: 100%;
  margin-bottom: 0;
`;

export const HeaderContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
  @media (max-width: 320px) {
    align-items: flex-start;
    flex-direction: column;
  }
`;

export const ToggleWrapper = styled.div`
  @media (max-width: 320px) {
    margin: 6px 0;
  }
`;
export const ModeToggleText = styled.button`
  color: #7f8287;
  font-weight: bold;
  font-size: 16px;
  @media (max-width: ${SM_SCREEN_MAX}) {
    font-size: 14px;
  }
`;

export const Textarea = styled.textarea`
  padding: 15px;
  width: 100%;
  color: #292f36;
  font-weight: normal;
  font-size: 16px;
  line-height: 20px;
  border: 2px solid #dedfe0;
  border-radius: 6px;
  -webkit-appearance: none;
  &:focus {
    outline: 0;
    border-color: #5000b9;
  }
  &::placeholder {
    color: #7f8287;
    font-weight: normal;
    font-size: 16px;
  }
`;

export const TextEditorWrapper = styled.div(
  (props: { isShowingFocusStyles: boolean; isShowingError: boolean }) => `
    border: 2px solid;
    border-radius: 6px;
    border-color: ${
      props.isShowingFocusStyles
        ? '#5000b9 !important'
        : props.isShowingError
        ? '#d0021b'
        : '#dedfe0'
    };
    overflow: hidden;
    outline: 0;
  
  .public-DraftEditorPlaceholder-root {
    position: absolute;
    color: #7f8287;
    font-weight: normal;
    font-size: 16px;
    padding: 0;
    pointer-events: none;
  }
  .public-DraftEditor-content {
    min-height: 272px;
  }
`
);

export const ErrorText = styled.div`
  color: #d0021b;
  visibility: ${(props: { isShowingError: boolean }) =>
    props.isShowingError ? 'visible' : 'hidden'};
`;

export const RightAddons = styled.span`
  color: #7f8287;
`;

export const Addons = styled.div`
  display: flex;
  justify-content: space-between;
`;
export const Header = styled.span`
  color: #292f36;
  font-size: 1.6rem;
  font-weight: normal;
`;

export const Root = styled.div`
  width: 100%;
`;
