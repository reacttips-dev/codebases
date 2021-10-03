import styled from "styled-components";
import {
  primary,
  placeholderColor,
  lightInactive,
  trInputBackground,
  greyDark,
  secondaryColor,
  accent,
  white,
} from "../variable";
import { Field } from "formik";

export const StyledWorkSpaceFormField = styled(Field)`
  background-color: ${trInputBackground};
  border: 0px;
  color: ${lightInactive};
  height: 48px;
  border-radius: 4px;
  padding-left: 1rem;
  font-size: 1rem;
  letter-spacing: 0.08px;
  line-height: 28px;
  margin-top: 1rem;

  &::placeholder {
    font-size: 1rem;
    letter-spacing: 0.08px;
    line-height: 28px;
  }

  &:-ms-input-placeholder {
    background-color: ${trInputBackground} !important;
    color: ${placeholderColor};
    font-size: 1rem;
    letter-spacing: 0.08px;
    line-height: 28px;
  }

  &::-ms-input-placeholder {
    background-color: ${trInputBackground} !important;
    color: ${placeholderColor};
    font-size: 1rem;
    letter-spacing: 0.08px;
    line-height: 28px;
  }

  .input {
    background-color: ${trInputBackground} !important;
    color: ${placeholderColor} !important;
    font-size: 1rem !important;
    letter-spacing: 0.08px !important;
    line-height: 28px !important;
    outline: none;
  }

  :focus {
    background-color: ${trInputBackground} !important;
    color: ${placeholderColor};
  }
  :hover {
    border: 2px ${primary} solid !important;
  }
`;

export const StyledSumoActivationPage = styled.div`
  width: 100%;
  min-height: 100vh;
  position: relative;
  background: url("https://assets.simplified.co/images/sumo-landing-bg.png")
    no-repeat center center;
  background-size: cover;

  .appsumo-box {
    width: 365px;
    height: 560px;
    position: absolute;
    top: 20%;
    left: 50%;
    transform: translate(-50%, -20%);

    .appsumo-simplified-logo {
      text-align: center;
      font-size: 35px;
      margin-bottom: 0 !important;
      font-weight: 300;

      svg {
        path {
          fill: ${accent};
        }
      }
    }

    .appsumo-card-body {
      border-radius: 8px;
      border: 0px;
      background-color: ${secondaryColor};
      color: ${white};
      -webkit-box-shadow: 0 0 40px 0 rgba(0, 0, 0, 0.5);
      -moz-box-shadow: 0 0 40px 0 rgba(184, 154, 154, 0.5);
      box-shadow: 0 0 40px 0 rgba(0, 0, 0, 0.5);
      flex: 1 1 auto;
      min-height: 1px;
      padding: 1.25rem;

      .heading {
        font-family: Rubik;
        font-style: normal;
        font-weight: 500;
        font-size: 22px;
      }

      .title {
        margin: 1.25rem 0rem 0.25rem 0rem;
        font-family: Rubik;
        font-style: normal;
        font-weight: normal;
        font-size: 18px;
      }

      .email-message {
        margin-top: 2px;
        margin-bottom: 0 !important;
        font-family: Rubik;
        font-style: normal;
        font-weight: normal;
        font-size: small;
      }

      .form-button {
        width: 100%;
        height: 48px;
      }

      .center {
        text-align: center;
      }
    }
  }
`;
