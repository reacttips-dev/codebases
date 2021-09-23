import styled from '@emotion/styled';
import { SCREEN_BREAKPOINTS } from '../../constants';

const Section = styled.section`
  margin: 0 auto 100px;
  max-width: 1400px;
  text-align: center;
`;

const Container = styled.div`
  padding: 0 5%;
  h2 {
    font-size: 6rem;
    font-weight: 900;
    line-height: 7rem;
    margin: 0 auto 100px;
    width: 80%;
  }
  @media (max-width: ${SCREEN_BREAKPOINTS.MOBILE}px) {
    h2 {
      font-size: 2.5rem;
      line-height: 3.8rem;
      margin: 0 auto 50px;
      width: 100%;
    }
  }
`;

const GridContainer = styled.div`
  margin: auto;
  max-width: 1240px;
  width: 100%;
  display: grid;
  grid-gap: 80px;
  grid-template-columns: repeat(4, minmax(15%, 250px));
  line-height: 2.6rem;
  @media (max-width: ${SCREEN_BREAKPOINTS.SMALL_DESKTOP}px) {
    grid-gap: 40px;
  }
  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
    grid-gap: 24px;
  }
  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

const SellingPoint = styled.div`
  margin-bottom: 50px;
  svg {
    max-width: 150px;
    width: 100%;
  }
  h3 {
    font-size: 2rem;
    margin: 25px 0 20px;
  }
  p {
    font-size: 1.6rem;
  }
  @media (max-width: 600px) {
    svg {
      max-width: 150px;
    }
  }
`;

export { Container, GridContainer, Section, SellingPoint };
