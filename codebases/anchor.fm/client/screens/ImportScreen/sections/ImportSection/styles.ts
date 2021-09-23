import styled from '@emotion/styled';
import {
  BREAKPOINT_SMALL,
  MarketingSection,
} from '../../../../components/MarketingPagesShared/styles';
import { SM_SCREEN_MAX } from '../../../../modules/Styleguide';

const SearchSection = styled(MarketingSection)`
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding-bottom: 115px;

  @media (max-width: ${BREAKPOINT_SMALL}px) {
    padding-bottom: 50px;
  }
`;

const SearchSectionBackground = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
`;

const SearchContent = styled.div`
  width: 100%;
  max-width: 880px;
`;

const SearchHeading = styled.h1`
  color: white;
  font-size: 3.6rem;
  font-weight: 800;
  margin-bottom: 50px;

  @media (max-width: ${SM_SCREEN_MAX}px) {
    font-size: 2.8rem;
    font-weight: bold;
  }
`;

export { SearchSection, SearchSectionBackground, SearchContent, SearchHeading };
