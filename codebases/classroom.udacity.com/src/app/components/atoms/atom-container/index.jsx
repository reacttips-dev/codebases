import * as Atoms from 'components/atoms';

import AtomFeedbackContainer from './atom-feedback-container';
import AutoAdvanceOverlay from './_auto-advance-overlay';
import NodeHelper from 'helpers/node-helper';
import Notes from './_notes';
import NotesWide from './_notes-wide';
import PropTypes from 'prop-types';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import UnknownAtom from 'components/atoms/unknown-atom';
import { __ } from 'services/localization-service';
import styles from './index.scss';
import { trackInitialPageLoad } from 'helpers/performance-helper';

export default cssModule(
  class extends React.Component {
    static displayName = 'atoms/atom-container/index';

    static propTypes = {
      isWideLayout: PropTypes.bool,
      isSelectingContent: PropTypes.bool,
      isAutoAdvanceable: PropTypes.bool,
      isFullScreen: PropTypes.bool,
      onToggleFullScreen: PropTypes.func,
      atom: PropTypes.object.isRequired,
      onAutoAdvance: PropTypes.func.isRequired,
      currentTitle: PropTypes.string,
      nextTitle: PropTypes.string,
      overlayPresent: PropTypes.bool,
    };

    static defaultProps = {
      isWideLayout: false,
      isAutoAdvanceable: false,
      currentTitle: null,
      nextTitle: null,
      overlayPresent: false,
      isFullScreen: false,
    };

    state = {
      autoAdvanceActive: false,
    };

    componentDidMount() {
      trackInitialPageLoad('concept');
    }

    _getOverlayTransitionNames = () => {
      return {
        enter: styles['auto-advance-overlay-enter'],
        enterActive: styles['auto-advance-overlay-enter-active'],
        leave: styles['auto-advance-overlay-leave'],
        leaveActive: styles['auto-advance-overlay-leave-active'],
      };
    };

    handleAtomFinish = () => {
      if (this.props.isAutoAdvanceable) {
        this.setState({
          autoAdvanceActive: true,
        });
      }
    };

    handleAutoAdvanceHide = () => {
      this.setState({
        autoAdvanceActive: false,
      });
    };

    _renderInstructorNotes = () => {
      const { isWideLayout, atom } = this.props;
      const NotesComponent = isWideLayout ? NotesWide : Notes;

      return (
        atom.instructor_notes && (
          <div styleName="instructor-notes-container">
            <div
              styleName={
                isWideLayout ? 'instructor-notes-wide' : 'instructor-notes'
              }
            >
              <NotesComponent atom={atom} />
            </div>
          </div>
        )
      );
    };

    render() {
      var {
        isWideLayout,
        onToggleFullScreen,
        atom,
        onAutoAdvance,
        currentTitle,
        nextTitle,
        atoms,
        overlayPresent,
      } = this.props;
      var Atom = Atoms[atom.semantic_type] || UnknownAtom;

      return (
        <AtomFeedbackContainer atom={atom}>
          <div styleName={isWideLayout ? 'container-wide' : 'container'}>
            <div styleName={isWideLayout ? 'atom-wide' : 'atom'}>
              <Atom
                nodeKey={atom.key}
                atom={atom}
                atoms={atoms}
                unstructuredData={NodeHelper.getUnstructuredData(atom)}
                isWideLayout={isWideLayout}
                onToggleFullScreen={onToggleFullScreen}
                onFinish={this.handleAtomFinish}
                overlayPresent={overlayPresent}
                onAutoAdvance={onAutoAdvance}
              />
              <ReactCSSTransitionGroup
                transitionName={this._getOverlayTransitionNames()}
                transitionEnterTimeout={300}
                transitionLeaveTimeout={300}
              >
                {this.state.autoAdvanceActive ? (
                  <div styleName="auto-advance-overlay">
                    <AutoAdvanceOverlay
                      title={__('You just finished <%= lesson_name %>', {
                        lesson_name: currentTitle,
                      })}
                      nextTitle={nextTitle}
                      onAutoAdvance={onAutoAdvance}
                      onHide={this.handleAutoAdvanceHide}
                    />
                  </div>
                ) : null}
              </ReactCSSTransitionGroup>
            </div>
            {this.props.isFullScreen ? null : this._renderInstructorNotes()}
          </div>
        </AtomFeedbackContainer>
      );
    }
  },
  styles
);
