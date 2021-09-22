import React from 'react';
import Modal from 'bundles/phoenix/components/Modal';
import user from 'js/lib/user';
import ErrorBoundaryWithTagging from 'bundles/common/components/ErrorBoundaryWithTagging';
import type { SkillEntry } from './SkillTagSelect';
import SkillTagDialogDataState from './SkillTagDialogDataState';

import 'css!./__styles__/SkillTagModalDialog';
import type { SkillTagResultCallData } from './SkillTagDataProvider';
import SkillTagDataProvider from './SkillTagDataProvider';
import SkillTagModalContent from './SkillTagModalContent';
import type { PostFeedbackFn } from '../private/mutations';
import ExecuteOnMount from './ExecuteOnMount';
import type { Skill } from './SkillTagList';

type Props = {
  dialogTitle: string;
  dialogDescription: string;
  onClose: () => void;

  thanksMessageDuration?: number;
  scrollLockQuerySelector?: string;

  courseId: string;
  itemId: string;
  hideDialogDuringLoading: boolean;
};

type State = {
  selectedSkills: string[];
  userWrittenSkills: SkillEntry[];
  showThanks: boolean;
};

class SkillTagModalDialog extends React.Component<Props, State> {
  static defaultProps = {
    thanksMessageDuration: 5000,
  };

  /**
   * Dialog for tagging skills to an item.
   *
   * @typedef {object} Props
   * @prop {string} dialogTitle used for the title of the dialog
   * @prop {string} dialogDescription used for a description under the title
   * @prop {function ():void} onClose callback when the dialog is closed (both after submitting, and canceling)
   * @prop {string} courseId current course id
   * @prop {string} itemId current assignment id
   * @prop {string?} scrollLockQuerySelector A query selector for a component that needs to have scroll locked
   * @prop {number?} thanksMessageDuration how many ms should the thanks message be shown after submitting
   * ...
   */
  constructor(props: Props) {
    super(props);
    this.state = {
      selectedSkills: [],
      userWrittenSkills: [],
      showThanks: false,
    };
  }

  componentDidMount() {
    // We need to lock the scroll on the assignment page, to prevent the user from scrolling something that is behind the dialog
    // We are adding a css class that will prevent the user from accidentally scrolling,
    //  and forecfully setting the scroll back to 0, as the page also sets scroll when the keys are used

    if (this.props.scrollLockQuerySelector) {
      const el = document.querySelector(this.props.scrollLockQuerySelector) as HTMLElement;
      if (el) {
        el.classList.add('skill-tag-scroll-hidden');
        el.scrollTop = 0;
        el.onscroll = () => {
          el.scrollTop = 0;
        };
      }
    }
  }

  componentWillUnmount() {
    if (this.props.scrollLockQuerySelector) {
      const el = document.querySelector(this.props.scrollLockQuerySelector) as HTMLElement;
      if (el) {
        el.onscroll = null;
        el.classList.remove('skill-tag-scroll-hidden');
      }
    }
  }

  onPillClick = (skillId: string, isSelected: boolean) => {
    this.setState(({ selectedSkills }) => {
      const state = {
        selectedSkills: selectedSkills.filter((s) => s !== skillId).concat(isSelected ? skillId : []),
      };

      return state;
    });
  };

  onWrittenSkillsChange = (userWrittenSkills: SkillEntry[]) => {
    this.setState({ userWrittenSkills });
  };

  submit(postFeedback: PostFeedbackFn, shownSkills: Skill[]) {
    const { courseId, itemId, thanksMessageDuration } = this.props;
    const { selectedSkills, userWrittenSkills } = this.state;

    this.setState({
      showThanks: true,
    });

    postFeedback({
      variables: {
        body: {
          learnerSkillTagId: {
            userId: user.get().id,
            courseId,
            itemId,
          },
          learnerSkillTagFeedback: {
            skillTagsShown: shownSkills.map((s) => s.skillId),
            skillTagsPicked: selectedSkills,
            otherFeedback: userWrittenSkills.map((s) => s.skillId),
            createdAt: Date.now(),
          },
        },
      },
    });

    return new Promise<void>((resolve) => {
      setTimeout(() => {
        this.setState({
          showThanks: false,
        });
        this.props.onClose();
        resolve();
      }, thanksMessageDuration);
    });
  }

  renderContent({ loading, error, hasSubmittedBefore, data, postFeedback }: SkillTagResultCallData) {
    const { dialogTitle, dialogDescription } = this.props;
    const { selectedSkills, userWrittenSkills, showThanks } = this.state;

    if (loading) return <SkillTagDialogDataState dataState="loading" />;
    if (error) return <SkillTagDialogDataState dataState="error" />;

    if (showThanks) return <SkillTagDialogDataState dataState="thanks" />;

    if (hasSubmittedBefore || data.shownSkills.length === 0) {
      // Immediately close the dialog
      return <ExecuteOnMount execute={this.props.onClose} />;
    }

    return (
      <SkillTagModalContent
        // Display properties
        dialogTitle={dialogTitle}
        dialogDescription={dialogDescription}
        // Data
        allSkills={data.allSkills}
        shownSkills={data.shownSkills}
        // State
        selectedSkills={selectedSkills}
        userWrittenSkills={userWrittenSkills}
        // Handlers
        onPillClick={this.onPillClick}
        onSkillSelectChange={this.onWrittenSkillsChange}
        // Callback
        submit={() => this.submit(postFeedback, data.shownSkills)}
      />
    );
  }

  render() {
    const { dialogTitle, onClose, courseId, itemId, hideDialogDuringLoading } = this.props;

    return (
      <SkillTagDataProvider courseId={courseId} itemId={itemId} userId={user.get().id}>
        {(results) => {
          if (hideDialogDuringLoading && results.loading) return <span />;

          return (
            <Modal handleClose={onClose} modalName={dialogTitle} className="rc-SkillTagModal">
              <ErrorBoundaryWithTagging
                componentName="skill_tagging_dialog"
                errorComponent={<SkillTagDialogDataState dataState="error" />}
              >
                {this.renderContent(results)}
              </ErrorBoundaryWithTagging>
            </Modal>
          );
        }}
      </SkillTagDataProvider>
    );
  }
}

export default SkillTagModalDialog;
