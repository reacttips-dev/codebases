import { colorsPalettes } from "@similarweb/styles";
import { respondTo, setFont } from "@similarweb/styles/src/mixins";
import { AutosizeInput, IAutosizeInputProps } from "@similarweb/ui-components/dist/autosize-input";
import { Injector } from "common/ioc/Injector";
import * as PropTypes from "prop-types";
import * as React from "react";
import { FunctionComponent } from "react";
import styled, { css } from "styled-components";
import SWReactRootComponent from "../../../../decorators/SWReactRootComponent";

const DashboardWizardTitleStyled = styled.div`
    ${({ galleryOpen }: ITrialHookModalImageProps) =>
        galleryOpen
            ? `
  width: 1164px;
  text-align: left;
  color: ${colorsPalettes.carbon[500]};
  ${setFont({ $size: "25px" })};
  letter-spacing: -0.2px;
  margin: 0 auto !important;
  ${respondTo(
      "mediumScreen",
      css`
          width: 1015px;
          padding: 0;
      `,
  )};
  ${respondTo(
      "desktop",
      css`
          width: 905px;
          padding: 0 83px;
      `,
  )};`
            : `
    width: 1164px;
    text-align: left;
    color: ${colorsPalettes.carbon[500]};
    ${setFont({ $size: "25px" })};
    letter-spacing: -0.2px;
    margin-left: 35px;
    `};
`;

const SubTitleStyled = styled.div`
    font-size: 16px;
    line-height: 1.1;
    padding: 15px 0 0;
`;

const AutosizeInputStyled = styled(AutosizeInput)<IAutosizeInputProps>`
    position: relative;
    top: 3px;
`;

interface ITrialHookModalImageProps {
    galleryOpen?: boolean;
}

interface IDashboardWizardTitleProps {
    title?: string;
    subTitle?: string;
    editable?: boolean;
    onChange?: (evt) => void;
    galleryOpen?: boolean;
}

const isTitleValid = (title) => title.trim() !== "";

export const DashboardWizardTitle: FunctionComponent<IDashboardWizardTitleProps> = ({
    subTitle,
    title,
    editable,
    onChange,
    galleryOpen,
}) => {
    const i18n: (key: string) => string = Injector.get("i18nFilter");

    return (
        <DashboardWizardTitleStyled galleryOpen={galleryOpen}>
            {editable ? (
                <AutosizeInputStyled
                    placeholder={i18n("dashboard.template.title.placeholder")}
                    value={title}
                    error={!isTitleValid(title)}
                    onChange={onChange}
                />
            ) : (
                <>
                    {title}
                    {subTitle ? <SubTitleStyled>{subTitle}</SubTitleStyled> : ""}
                </>
            )}
        </DashboardWizardTitleStyled>
    );
};

DashboardWizardTitle.defaultProps = {
    title: "",
    editable: false,
    onChange: () => null,
    galleryOpen: false,
};
DashboardWizardTitle.propTypes = {
    title: PropTypes.string,
    editable: PropTypes.bool,
    onChange: PropTypes.func,
    galleryOpen: PropTypes.bool,
};

SWReactRootComponent(DashboardWizardTitle, "DashboardWizardTitle");
