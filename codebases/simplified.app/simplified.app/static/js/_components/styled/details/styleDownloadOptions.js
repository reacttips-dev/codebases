import { Dropdown } from "react-bootstrap";
import styled from "styled-components";
import { white, secondaryColor, md } from "../variable";

export const StyledDropdownHeader = styled(Dropdown.Header)`
  color: rgba(255, 255, 255, 0.8);
  text-transform: uppercase;
  font-size: 12px;
  letter-spacing: 0;
`;

export const StyledDropdownSectionHeader = styled(StyledDropdownHeader)`
  color: ${white};
  font-weight: bold;
  margin-bottom: 0px;
`;

export const StyledDropDownMenu = styled(Dropdown.Menu)`
  right: 0;
  left: unset;
  min-width: 200px;
`;

export const StyledDownloadDropDownMenu = styled(StyledDropDownMenu)`
  @media (max-width: ${md}) {
    margin-right: -72px !important;
  }
`;

export const StyledPreviewPageShareBox = styled(Dropdown.Menu)`
  right: 0;
  left: unset;
  min-width: 200px;
  background-color: ${secondaryColor};
  width: max-content;
  padding: 15px;
`;
