import styled from '@emotion/styled';

const JumpToContent = styled.a`
  z-index: 3;
  position: absolute;
  display: grid;
  place-content: center;
  padding: 16px;
  width: 187px;
  height: 53px;
  background: #ffffff;
  border: 2px solid #5000b9;
  box-sizing: border-box;
  border-radius: 6px;
  text-decoration: underline;
  top: 20px;
  left: 20px;
  transform: translatex(-210px);
  transition: transform 0.1s;
  transition-timing-function: ease-out;
  &:focus {
    transform: translatex(0px);
  }
  @media (max-width: 880px) {
    top: 12px;
    left: 12px;
  }
`;

export { JumpToContent };
