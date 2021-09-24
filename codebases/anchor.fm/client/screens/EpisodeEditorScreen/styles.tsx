import styled from '@emotion/styled';

const AddMusicIconWrapper = styled.div`
  width: 30px;
  height: 24px;
`;

const MenuItemIconWrapper = styled.div`
  height: 18px;
  width: 18px;
  margin-right: 28px;
  display: flex;
  align-items: center;
`;

const BackgroundMusicIconWrapper = styled.div`
  width: 14px;
  height: 14px;
  transform: translateY(-28px);
  padding-left: 4px;
`;

type ButtonWrapperProps = { backgroundColor: string };
const ButtonWrapper = styled.button<ButtonWrapperProps>`
  height: 50px;
  width: 50px;
  display: grid;
  place-content: center;
  border-radius: 100%;
  flex: 0 0 50px;
  padding: 14px;
  background-color: ${({ backgroundColor }) => backgroundColor};
  > *,
  svg {
    height: 100%;
  }
`;

export const StopButton = styled.div<{ iconSize?: number }>`
  background-color: #fff;
  width: ${({ iconSize }) => (iconSize ? `${iconSize}px` : '10px')};
  height: ${({ iconSize }) => (iconSize ? `${iconSize}px` : '10px')};
`;

export const LearnMoreLink = styled.a`
  font-size: 1.6rem;
  color: #5f6369;
  display: block;
  text-decoration: none;
  &:hover {
    text-decoration: none;
    color: #5f6369;
  }
`;

export {
  AddMusicIconWrapper,
  MenuItemIconWrapper,
  BackgroundMusicIconWrapper,
  ButtonWrapper,
};

export const CancelButton = styled.button`
  font-size: 1.6rem;
  color: #5f6369;
  display: block;
  padding: 0;
  border: 0;
  font-weight: bold;
  margin: 24px auto 0 auto;
  &:focus {
    color: #292f36;
  }
`;
