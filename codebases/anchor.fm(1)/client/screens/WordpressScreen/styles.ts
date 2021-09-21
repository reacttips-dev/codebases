import styled from '@emotion/styled';
import { CDN_PATH } from '../../components/MarketingPagesShared/constants';
import {
  BREAKPOINT_SMALL,
  COLOR_DARK_PURPLE,
  COLOR_PURPLE,
} from '../../components/MarketingPagesShared/styles';

const PageContainer = styled.div`
  background: ${COLOR_PURPLE};
`;

const ContentContainer = styled.div`
  background: ${COLOR_DARK_PURPLE};
`;

const WaveBackground = styled.div`
  background-color: ${COLOR_DARK_PURPLE};
  background-image: url('${CDN_PATH}/wordpress/bg-dark-purple.svg'),
    linear-gradient(${COLOR_PURPLE} 30px, ${COLOR_PURPLE} 30px);
  background-repeat: repeat-x;
  background-position: right 50% top 170px;
  background-size: 3000px;
  @media (max-width: ${BREAKPOINT_SMALL}px) {
    background-position: right 70% top 295px;
    background-size: 2000px;
  }
`;

export { PageContainer, ContentContainer, WaveBackground };
