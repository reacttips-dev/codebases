import styled from '@emotion/styled';
import { SM_SCREEN_MAX } from '../../modules/Styleguide';

export const Wrapper = styled.div`
  background-color: #5000b9;
  min-height: calc(100vh - 66px);
`;

export const SwitchToAnchor = styled.div`
  padding: 60px 30px 170px;
  text-align: center;
  background-color: white;
`;

export const PodcastImage = styled.img`
  width: 124px;
  border-radius: 6px;
  margin-bottom: 20px;
  box-shadow: 0px 0px 24px rgba(0, 0, 0, 0.25);
`;

export const OverlayWrapper = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  padding-bottom: 200px;
  max-width: 590px;
  margin: auto;
  @media (max-width: ${SM_SCREEN_MAX}px) {
    padding: 0 8px 200px;
  }
`;

export const Overlay = styled.div`
  width: 100%;
  border-radius: 6px;
  box-shadow: 0px 0px 12px rgba(0, 0, 0, 0.2);
  margin-top: -128px;
`;

export const OverlayHeaderSection = styled.div`
  background-color: #fff;
  border-bottom: 1px solid rgba(0, 0, 0, 0.15);
  border-radius: 6px 6px 0 0;
  padding: 24px 0;
`;

export const OverlayHeader = styled.h2`
  font-size: 28px;
  font-weight: 700;
  text-align: center;
`;

export const OverlayContent = styled.div`
  background-color: #fbfbfb;
  border-radius: 0 0 6px 6px;
  padding: 48px 124px 32px;

  @media (max-width: ${SM_SCREEN_MAX}px) {
    padding: 48px 30px 32px;
  }
  @media (max-width: 364px) {
    padding: 48px 12px 32px;
  }
`;
