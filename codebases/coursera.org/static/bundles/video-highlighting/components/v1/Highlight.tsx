import React from 'react';
import classNames from 'classnames';

import { Box } from '@coursera/coursera-ui';

import HighlightSnapshot from 'bundles/video-highlighting/components/v1/HighlightSnapshot';
import HighlightTranscript from 'bundles/video-highlighting/components/v1/HighlightTranscript';
import HighlightPlayButton from 'bundles/video-highlighting/components/v1/HighlightPlayButton';
import HighlightNoteEditor from 'bundles/video-highlighting/components/v1/HighlightNoteEditor';
import HighlightEditButton from 'bundles/video-highlighting/components/v1/HighlightEditButton';
import HighlightButtonLabel from 'bundles/video-highlighting/components/v1/HighlightButtonLabel';
import HighlightDeleteButton from 'bundles/video-highlighting/components/v1/HighlightDeleteButton';

import type { VideoPlayer } from 'bundles/item-lecture/types';
import type { Highlight as HighlightType } from 'bundles/video-highlighting/types';

import _t from 'i18n!nls/video-highlighting';

import 'css!./__styles__/Highlight';

type Props = {
  highlight: HighlightType;
  videoPlayer: VideoPlayer;
  currentHighlight: string | null;
  onSetCurrentHighlight: (id: string) => void;
  onDelete: () => void;
  onUpdate: (highlight: HighlightType) => void;
};

type State = {
  playing: boolean;
  editing: boolean;
  created: boolean;
  noteText: string;
};

class Highlight extends React.Component<Props, State> {
  createTimeoutId: number | null | undefined;

  highlight: HTMLElement | null | undefined;

  constructor(props: Props) {
    super(props);

    this.state = {
      playing: false,
      editing: false,
      noteText: props.highlight.noteText,
      created: props.highlight.pendingCreate,
    };
  }

  componentDidMount() {
    const { created } = this.state;
    const { videoPlayer } = this.props;

    if (created) {
      if (this.highlight && this.highlight.scrollIntoView) {
        this.highlight.scrollIntoView();
      }

      this.createTimeoutId = window.setTimeout(() => {
        this.setState({ created: false });
        this.createTimeoutId = null;
      }, 2000);
    }

    if (videoPlayer) {
      videoPlayer.on('pause', this.handlePause);
    }
  }

  componentDidUpdate({ currentHighlight: prevHighlight }: Props) {
    const {
      currentHighlight,
      highlight: { id: highlightId },
    } = this.props;

    if (currentHighlight && prevHighlight !== currentHighlight && currentHighlight !== highlightId) {
      this.handlePause();
    }
  }

  componentWillUnmount() {
    const { videoPlayer } = this.props;

    if (this.createTimeoutId) {
      clearTimeout(this.createTimeoutId);
    }

    if (videoPlayer) {
      videoPlayer.off('pause', this.handlePause);
    }
  }

  handlePause = () => {
    this.setState({ playing: false });
  };

  handleToggle = () => {
    const {
      videoPlayer,
      highlight: { id, noteStartTs, captureTs },
      onSetCurrentHighlight,
    } = this.props;
    const { playing } = this.state;

    onSetCurrentHighlight(id);

    if (noteStartTs) {
      videoPlayer.currentTime(noteStartTs);
    } else {
      videoPlayer.currentTime(captureTs);
    }

    if (videoPlayer.paused() || !playing) {
      videoPlayer.play();
      this.setState({
        playing: true,
      });
    } else {
      videoPlayer.pause();
      this.setState({
        playing: false,
      });
    }
  };

  handleEdit = () => {
    this.setState({ editing: true });
  };

  handleSave = (noteText: string) => {
    const { highlight, onUpdate } = this.props;
    this.setState({ noteText, editing: false });

    onUpdate({ ...highlight, noteText });
  };

  handleCancel = () => {
    this.setState({ editing: false });
  };

  render() {
    const { noteText, created, editing, playing } = this.state;
    const {
      highlight,
      highlight: { id, pendingCreate, pendingUpdate },
      onDelete,
    } = this.props;
    const editButtonLabelStartText = _t('#{action} your thoughts#{noteText} for the note marked', {
      noteText: noteText ? `, ${noteText},` : '',
      action: noteText ? _t('Edit') : _t('Add'),
    });
    const editButtonLabelId = `edit-btn-label-${id}`;

    return (
      <div
        className={classNames('rc-Highlight', { created })}
        ref={(el: HTMLElement | null) => {
          this.highlight = el;
        }}
      >
        <Box justifyContent="between" rootClassName="highlight-header">
          <Box justifyContent="start" alignItems="center">
            <HighlightPlayButton highlight={highlight} onClick={this.handleToggle} playing={playing} />

            {(pendingCreate || pendingUpdate) && <span className="highlight-status">{_t('Saving...')}</span>}
          </Box>

          <Box
            alignItems="center"
            justifyContent="start"
            rootClassName={classNames('highlight-actions', { hidden: pendingCreate })}
          >
            <HighlightEditButton
              onClick={this.handleEdit}
              ariaLabelledBy={editButtonLabelId}
              hasComment={!!noteText}
              disabled={pendingCreate || pendingUpdate}
            />
            <HighlightDeleteButton
              onDelete={onDelete}
              disabled={pendingCreate || pendingUpdate}
              highlight={highlight}
            />
          </Box>
        </Box>

        <Box justifyContent="start" alignItems="start" rootClassName="highlight-body">
          <HighlightSnapshot highlight={highlight} onClick={this.handleToggle} playing={playing} />
          <HighlightTranscript highlight={highlight} onClick={this.handleToggle} playing={playing} />
        </Box>

        <HighlightEditButton
          isLabel={true}
          onClick={this.handleEdit}
          ariaLabelledBy={editButtonLabelId}
          hasComment={!!noteText}
          disabled={pendingCreate || pendingUpdate}
        />

        {!editing && <div className="highlight-note">{noteText}</div>}

        {editing && (
          <HighlightNoteEditor
            initialNoteText={noteText}
            onSave={this.handleSave}
            onCancel={this.handleCancel}
            ariaLabelledBy={editButtonLabelId}
          />
        )}

        <HighlightButtonLabel id={editButtonLabelId} startText={editButtonLabelStartText} highlight={highlight} />
      </div>
    );
  }
}

export default Highlight;
