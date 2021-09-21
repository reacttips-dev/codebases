import styled from '@emotion/styled';

const Details = styled.details`
  max-width: 790px;
  width: 100%;
  margin-bottom: 50px;
  padding-left: 30px;
  font-size: 1.8rem;
  line-height: 30px;
  svg {
    margin-right: 15px;
    position: absolute;
    top: 8px;
    left: -28px;
  }
  summary {
    position: relative;
    cursor: pointer;
    font-weight: bold;
    &::-webkit-details-marker {
      display: none;
    }
  }
`;

const Container = styled.section`
  padding: 50px 5%;
  margin: 0 auto;
  max-width: 1440px;
  width: 100%;
  h2 {
    margin: 0 0 50px;
    font-size: 3.6rem;
  }
`;

export { Details, Container };
