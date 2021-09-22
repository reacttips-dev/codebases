import React from 'react';
import DelayMount from 'bundles/common/components/DelayMount';
import { SkillTagModalDialog, wasSkillTaggingDialogDismissed, dismissSkillTaggingDialog } from 'bundles/skill-tagging';

type Props = {
  courseId: string;
  itemId: string;
  dialogTitle: string;
  dialogDescription: string;
  onClose?: () => void;
};

type State = {
  wasDismissed: boolean;
};

export default class DelayedSkillTagModalDialog extends React.Component<Props, State> {
  state = {
    wasDismissed: true,
  };

  componentDidMount() {
    const { courseId, itemId } = this.props;
    this.setState({
      wasDismissed: wasSkillTaggingDialogDismissed({ courseId, itemId }),
    });
  }

  hideSkillTaggingModalDialog = () => {
    const { courseId, itemId, onClose } = this.props;
    dismissSkillTaggingDialog({ courseId, itemId });
    this.setState({
      wasDismissed: true,
    });
    if (onClose) onClose();
  };

  render() {
    const { courseId, itemId, dialogTitle, dialogDescription } = this.props;
    const { wasDismissed } = this.state;
    return (
      !wasDismissed && (
        <DelayMount waitInMs={5000}>
          <SkillTagModalDialog
            hideDialogDuringLoading={true}
            onClose={this.hideSkillTaggingModalDialog}
            scrollLockQuerySelector=".rc-TunnelVisionWrapper__content"
            dialogTitle={dialogTitle}
            dialogDescription={dialogDescription}
            courseId={courseId}
            itemId={itemId}
          />
        </DelayMount>
      )
    );
  }
}
