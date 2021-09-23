import styled from '@emotion/styled';
import { BREAKPOINT_SMALL } from '../styles';

const Title = styled.h2`
  font-size: 3.6rem;
  font-weight: 800;
  margin: 0;

  @media (max-width: ${BREAKPOINT_SMALL}px) {
    font-size: 2.4rem;
    font-weight: bold;
  }
`;

const DualColumns = styled.div`
  display: grid;
  grid-template-columns: max-content auto;
  grid-gap: 60px;

  @media (max-width: ${BREAKPOINT_SMALL}px) {
    grid-template-columns: 1fr;
    grid-gap: 30px;
  }
`;

const List = styled.ul`
  border-top: 4px solid white;
  list-style-type: none;
  padding: 25px 0 0;

  @media (max-width: ${BREAKPOINT_SMALL}px) {
    border-top: 2px solid white;
  }
`;

const ListItem = styled.li`
  border-bottom: 1px solid rgba(255, 255, 255, 0.3);
  padding: 0 0 50px 0;
  margin: 0 0 50px 0;

  @media (max-width: ${BREAKPOINT_SMALL}px) {
    &:last-of-type {
      border-bottom: none;
    }
  }
`;

const ListHeader = styled.h3`
  font-size: 3.6rem;
  font-weight: bold;
  line-height: 1.2;
  margin: 0 0 20px 0;
`;

const ListSubHeader = styled.h4`
  font-size: 1.6rem;
  line-height: 2.4rem;
`;

const ListText = styled.p`
  color: white;
  font-size: 2.2rem;
  line-height: 1.4;
`;

export {
  ListHeader,
  ListText,
  ListItem,
  Title,
  DualColumns,
  List,
  ListSubHeader,
};
