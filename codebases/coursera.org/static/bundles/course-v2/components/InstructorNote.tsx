import React from 'react';
import _ from 'underscore';
import classnames from 'classnames';

import CollapsibleMessage from 'bundles/ui/components/CollapsibleMessage';
import InstructorImage from 'bundles/course-v2/components/InstructorImage';
import { Instructor } from 'bundles/course-v2/types/Course';

import ApplicationStoreClass from 'bundles/ssr/stores/ApplicationStore';

import connectToStores from 'js/lib/connectToStores';
import UserAgentInfo from 'js/lib/useragent';

import { color } from '@coursera/coursera-ui';
import { SvgClose } from '@coursera/coursera-ui/svg';

import _t from 'i18n!nls/course-v2';

import 'css!./__styles__/InstructorNote';

type State = {
  collapsed: boolean;
};

type PropsFromCaller = {
  note: string;
  instructors: Array<Instructor>;
  canDismiss?: boolean;
  title: string;
  onDismiss?: () => void;
};

type PropsFromStores = {
  userAgent: UserAgentInfo;
};

type PropsToComponent = PropsFromCaller & PropsFromStores;

const NOTE_COLLAPSE_LENGTH = 250;

class InstructorNote extends React.Component<PropsToComponent, State> {
  state = { collapsed: !this.props.userAgent.isMobileBrowser };

  handleToggle = () => {
    const { collapsed } = this.state;
    this.setState({ collapsed: !collapsed });
  };

  lessAriaLabel = _t('Show less instructor welcome note');

  moreAriaLabel = _t('Show more instructor welcome note');

  render() {
    const { collapsed } = this.state;
    const { note, instructors, canDismiss, onDismiss, title } = this.props;

    const paragraphRegex = /<p>(.*?)<\/p>/g;

    let collapsedNote = '';
    let toggleTruncate = false;

    const instructorProfileClasses = classnames(
      'horizontal-box align-items-left align-items-vertical-center instructor-profile',
      { 'instructor-profile--many': instructors.length > 1 }
    );

    // render the first <p> tag if it is the first element in the note and if not the first `NOTE_COLLAPSE_LENGTH` characters of the note
    // so only visible content is focused and announced
    if (note.indexOf('<p>') === 0) {
      collapsedNote = note.match(paragraphRegex)?.[0] || '';
    } else {
      toggleTruncate = true;
      collapsedNote = note.length > NOTE_COLLAPSE_LENGTH ? `${note.slice(0, NOTE_COLLAPSE_LENGTH)}...` : note;
    }

    return (
      <CollapsibleMessage
        cardSpacing="roomy"
        className="rc-InstructorNote"
        gradientColor="none"
        isInitiallyCollapsed={collapsed}
        onToggleClick={this.handleToggle}
        showToggle={note.length > NOTE_COLLAPSE_LENGTH}
        moreAriaLabel={this.moreAriaLabel}
        lessAriaLabel={this.lessAriaLabel}
        toggleIconColor="#2A73CC"
        hideTruncated={toggleTruncate}
      >
        {canDismiss && (
          <button
            type="button"
            onClick={onDismiss}
            className="nostyle dismiss"
            aria-label={_t('Dismiss instructor note')}
          >
            <SvgClose size={24} color={color.secondaryText} hoverColor={color.black} />
          </button>
        )}

        <div className="card-headline-text">{title}</div>

        {instructors.length > 0 && (
          <div className={instructorProfileClasses}>
            {instructors.map((instructor) => (
              <InstructorImage key={instructor.id} instructor={instructor} />
            ))}
            {instructors.length === 1 && (
              <div
                className="headline-1-text instructor-name"
                aria-label={_t('Instructor #{instructor} note', { instructor: instructors[0].fullName })}
              >
                {instructors[0].fullName}
              </div>
            )}
          </div>
        )}

        {/* eslint-disable react/no-danger */}

        <div
          key={_('message_').uniqueId()} // This needs a key to re-render properly.
          dangerouslySetInnerHTML={{ __html: collapsed ? collapsedNote : note }}
        />

        {/* eslint-enable react/no-danger */}
      </CollapsibleMessage>
    );
  }
}

export default connectToStores<PropsToComponent, PropsFromCaller, ApplicationStoreClass>(
  [ApplicationStoreClass],
  (ApplicationStore, props) => ({
    ...props,
    userAgent: ApplicationStore.getUserAgent(),
  })
)(InstructorNote);
