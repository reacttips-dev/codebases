import styled from '@emotion/styled';

export const EditImageContainer = styled.div`
  width: 100%;
  border: none;
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
`;

export const UploadLink = styled.a`
  padding: 12px 0;
  color: #9458fd;
  font-weight: bold;
  text-align: center;
  &:hover {
    font-decoration: underline;
  }
`;
export const AnchorIconContainer = styled.div`
  width: 113px;
`;

export const ImageSquare = styled.div`
  width: 250px;
  height: 250px;
  background-color: #dedfe0;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 6px;
`;

export const ErrorMessage = styled.div`
  padding-bottom: 20px;
`;

export const ImageDisplay = styled.div`
  margin-bottom: 26px;
  height: 250px;
  width: 250px;
  position: relative;
`;

export const SubscriptionLabel = styled.span`
  position: absolute;
  bottom: 0px;
  left: 0px;
  margin: 8px;
  padding: 8px 16px;
  color: white;
  background-color: black;
  border-radius: 16px;
  font-size: 12px;
  font-weight: 900;
  text-transform: uppercase;
  line-height: 12px;
`;
