import styled from '@emotion/styled';
import {
  BREAKPOINT_MEDIUM,
  BREAKPOINT_SMALL,
  COLOR_GREEN,
} from 'client/components/MarketingPagesShared/styles';

const Section = styled.section`
  background: ${COLOR_GREEN};
`;

const Container = styled.div`
  padding: 50px 5%;
  max-width: 1440px;
  width: 100%;
  margin: auto;
  display: flex;
  align-items: center;
  img,
  picture {
    flex: 0 0 431px;
  }
  @media (max-width: ${BREAKPOINT_MEDIUM}px) {
    flex-direction: column;
    img,
    picture {
      flex: 0 0 320px;
    }
  }
  @media (max-width: 600px) {
    padding-bottom: 60px;
    img,
    picture {
      width: 100%;
    }
  }
`;

const TextContainer = styled.div`
  margin-right: 124px;
  color: white;
  h2 {
    font-size: 3.6rem;
    font-weight: 900;
    margin: 0;
  }
  p {
    font-size: 1.8rem;
    color: white;
    margin: 24px 0 0 0;
  }
  @media (max-width: ${BREAKPOINT_MEDIUM}px) {
    max-width: 654px;
    width: 100%;
    margin: auto;
    margin-bottom: 50px;
  }
  @media (max-width: ${BREAKPOINT_SMALL}px) {
    h2 {
      font-size: 2.8rem;
    }
  }
`;

export { Container, Section, TextContainer };
