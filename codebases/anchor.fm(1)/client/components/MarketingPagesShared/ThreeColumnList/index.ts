import styled from '@emotion/styled';
import { BREAKPOINT_SMALL } from '../styles';

const Title = styled.h2`
  font-size: 6.4rem;
  line-height: 1.2;
  font-weight: 800;
  width: 80%;
  margin: 200px 0 100px 0;

  @media (max-width: ${BREAKPOINT_SMALL}px) {
    margin: 50px 0;
    width: auto;
    font-size: 4rem;
  }
`;

const List = styled.ul`
  list-style-type: none;
  margin: 0;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 60px;

  @media (max-width: ${BREAKPOINT_SMALL}px) {
    grid-template-columns: 1fr;
    grid-gap: 45px;
  }
`;

const Header = styled.h3`
  font-size: 2rem;
  line-height: 1.2;
  font-weight: bold;
  border-bottom: 2px solid white;
  margin: 0 0 15px 0;
  padding: 0 0 15px 0;
`;

const SecondaryText = styled.p`
  font-weight: normal;
  font-size: 2rem;
  line-height: 1.4;
  color: white;
`;

export { Title, List, Header, SecondaryText };
