import styled from '@emotion/styled';

const Container = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
`;

const ScrollableSection = styled.div<{ scrollBarColor?: string }>`
  padding: 10px 0;
  width: 100%;
  height: 100%;
  overflow-y: auto;
  scrollbar-color: ${({ scrollBarColor }) => scrollBarColor} #dfe0e1;
  scrollbar-width: thin;
  &::-webkit-scrollbar {
    width: 4px;
    background-color: #dfe0e1;
    border-radius: 2.3px;
  }
  &::-webkit-scrollbar-thumb {
    width: 4px;
    background-color: ${({ scrollBarColor }) => scrollBarColor};
    border-radius: 2.3px;
  }
`;

const FadeElement = styled.div`
  position: absolute;
  height: 10px;
  left: 0;
  width: calc(100% - 12px);
`;

const FadeElementTop = styled(FadeElement)`
  top: 0;
  background: linear-gradient(to bottom, #ffffff, rgba(255, 255, 255, 0));
`;

const FadeElementBottom = styled(FadeElement)`
  bottom: 0;
  background: linear-gradient(to top, #ffffff, rgba(255, 255, 255, 0));
`;

export { Container, ScrollableSection, FadeElementTop, FadeElementBottom };
