import React from 'react';
import CdsMigrationTypography from 'bundles/authoring/common/components/cds/CdsMigrationTypography';
import 'css!./__styles__/ModalSection';

type Props = {
  heading: React.ReactNode;
  headingClassName?: string;
  children?: React.ReactNode;
};

class ModalSection extends React.Component<Props> {
  static defaultProps = {
    autoFocus: false,
  };

  render() {
    const { heading, headingClassName, children } = this.props;

    return (
      <div className="rc-ModalSection">
        <CdsMigrationTypography
          variant="h3semibold"
          cuiComponentName="Label"
          component="h3"
          className={headingClassName}
        >
          {heading}
        </CdsMigrationTypography>
        {children}
      </div>
    );
  }
}

export default ModalSection;
