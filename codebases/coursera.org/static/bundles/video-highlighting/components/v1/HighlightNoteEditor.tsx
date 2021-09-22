import React from 'react';
import Textarea from 'react-textarea-autosize';

import { Box, Button } from '@coursera/coursera-ui';
import withSingleTracked from 'bundles/common/components/withSingleTracked';

import _t from 'i18n!nls/video-highlighting';

import 'css!./__styles__/HighlightNoteEditor';

const TrackedButton = withSingleTracked({ type: 'BUTTON' })(Button);

type Props = {
  initialNoteText: string;
  ariaLabelledBy: string;
  onSave: (x: string) => void;
  onCancel: () => void;
};

type State = {
  noteText: string;
};

class HighlightNoteEditor extends React.Component<Props, State> {
  textarea: HTMLTextAreaElement | null;

  setTextareaRef: (el: HTMLTextAreaElement | null) => void;

  constructor(props: Props) {
    super(props);

    this.state = {
      noteText: props.initialNoteText,
    };

    this.textarea = null;
    this.setTextareaRef = (el) => {
      this.textarea = el;
    };
  }

  componentDidMount() {
    if (this.textarea) {
      this.textarea.focus();
    }
  }

  handleSave = () => {
    const { noteText } = this.state;
    const { onSave } = this.props;

    onSave(noteText);
  };

  handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    this.setState({ noteText: e.target.value });
  };

  render() {
    const { noteText } = this.state;
    const { initialNoteText, onCancel, ariaLabelledBy } = this.props;

    const disableSave = noteText === initialNoteText || noteText.length > 1000;

    return (
      <div className="rc-HighlightNoteEditor">
        <Textarea
          id="note-text"
          name="note-text"
          minRows={1}
          maxRows={20}
          value={noteText}
          className="note-textarea"
          aria-labelledby={ariaLabelledBy}
          onChange={this.handleChange}
          inputRef={this.setTextareaRef}
        />

        <Box justifyContent="end">
          <TrackedButton
            size="sm"
            type="primary"
            label={_t('Save')}
            disabled={disableSave}
            onClick={this.handleSave}
            trackingName="edit_highlight"
            style={{ padding: '0 10px', marginRight: '5px', minHeight: '30px' }}
          />

          <TrackedButton
            size="sm"
            type="default"
            onClick={onCancel}
            label={_t('Cancel')}
            trackingName="cancel_edit_highlight"
            style={{ padding: '0 10px', minHeight: '30px' }}
          />
        </Box>
      </div>
    );
  }
}

export default HighlightNoteEditor;
