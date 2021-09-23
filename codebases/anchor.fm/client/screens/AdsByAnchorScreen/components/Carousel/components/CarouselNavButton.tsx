import styled from '@emotion/styled';
import { SCREEN_BREAKPOINTS } from '../../../constants';

export const CarouselNavButton = styled.button`
  position: absolute;
  top: 50%;
  transform: translate(0, -50%);
  z-index: 1;
  &[data-type='prev'] {
    left: -5%;
  }
  &[data-type='next'] {
    right: -5%;
    &::before {
      border-color: transparent transparent transparent #e8f524;
      border-width: 10px 0 10px 15px;
    }
  }
  &::before {
    border-color: transparent #e8f524 transparent transparent;
    border-style: solid;
    border-width: 10px 15px 10px 0;
    content: '';
    display: inline-block;
    height: 0;
    vertical-align: middle;
    width: 0px;
  }
  @media (max-width: ${SCREEN_BREAKPOINTS.MOBILE}px) {
    height: 100%;
    width: 50px;
    &::before {
      border: none;
    }
  }
`;
