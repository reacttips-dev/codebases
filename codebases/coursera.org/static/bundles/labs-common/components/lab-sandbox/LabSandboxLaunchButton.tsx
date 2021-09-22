import React, { Component } from 'react';
import { color, SvgButton } from '@coursera/coursera-ui';
import { SvgExternalLink } from '@coursera/coursera-ui/svg';
import withSingleTracked from 'bundles/common/components/withSingleTracked';
import { getLabSandboxUrl } from 'bundles/labs-common/utils/LabSandboxUtils';
import _t from 'i18n!nls/labs-common';
import 'css!./__styles__/LabSandboxLaunchButton';

type PropsFromCaller = {
  courseSlug: string;
  isPrimaryCallToAction: boolean;
};

type PropsToComponent = PropsFromCaller;

const TrackedSvgButton = withSingleTracked({ type: 'BUTTON' })(SvgButton);

class LabSandboxLaunchButton extends Component<PropsToComponent> {
  handleClick = () => {
    const { courseSlug } = this.props;
    const url = getLabSandboxUrl(courseSlug);
    window.open(url, '_blank');
  };

  render() {
    const { isPrimaryCallToAction } = this.props;

    return (
      <div className="rc-LabSandboxLaunchButton">
        <TrackedSvgButton
          label={_t('Open Lab Sandbox')}
          type={isPrimaryCallToAction ? 'primary' : 'secondary'}
          onClick={this.handleClick}
          trackingName="lab_sandbox_launch_button"
          svgElement={
            <SvgExternalLink
              color={isPrimaryCallToAction ? color.white : color.primary}
              hoverColor={color.white}
              style={{ marginRight: 5 }}
            />
          }
        />
      </div>
    );
  }
}

export default LabSandboxLaunchButton;
