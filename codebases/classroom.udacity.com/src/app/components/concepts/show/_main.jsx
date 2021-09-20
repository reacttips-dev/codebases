import AtomContainer from 'components/atoms/atom-container';
import { Button } from '@udacity/veritas-components';
import { CareerServiceConsumer } from 'components/career-services/_context';
import ClassroomPropTypes from 'components/prop-types';
import FeedbackConfirmation from 'components/content-feedback/feedback-confirmation';
import FeedbackFormModal from 'components/content-feedback/feedback-form-modal';
import InfoBox from 'components/projects/show/_project/info-box';
import NanodegreeHelper from 'helpers/nanodegree-helper';
import NodeHelper from 'helpers/node-helper';
import PropTypes from 'prop-types';
import { Resizable } from 're-resizable';
import RouteMixin from 'mixins/route-mixin';
import SemanticTypes from 'constants/semantic-types';
import StaticContentNotificationBar from 'components/common/static-content-notification-bar';
import StaticContentPlaceholder from 'components/common/static-content-placeholder';
import { __ } from 'services/localization-service';
import { compose } from 'recompose';
import createReactClass from 'create-react-class';
import styles from './_main.scss';
import withAppLayoutContext from 'decorators/with-app-layout-context';

/**
 * Renders a single concept
 */
export const Main = createReactClass({
  displayName: 'concepts/show/_main',

  propTypes: {
    concept: PropTypes.object.isRequired,
    atoms: PropTypes.array.isRequired,
    nextNode: ClassroomPropTypes.node,
    onNext: PropTypes.func.isRequired,
    overlayPresent: PropTypes.bool,
    isSelectingContent: PropTypes.bool,
    mentor: ClassroomPropTypes.mentor,
    isStudentHubEnabled: PropTypes.bool,

    // App Layout Context
    toggleSidebar: PropTypes.func.isRequired,
  },

  contextTypes: {
    root: PropTypes.object,
    router: PropTypes.object,
  },

  mixins: [RouteMixin],

  defaultProps: {
    overlayPresent: false,
    mentor: {},
  },

  getInitialState() {
    return {};
  },

  componentDidMount() {
    this._setSidebarState(this.props.atoms);
  },

  componentWillReceiveProps(props) {
    if (
      this._shouldSidebarBeVisible(props.atoms) !==
      this._shouldSidebarBeVisible(this.props.atoms)
    ) {
      this._setSidebarState(props.atoms);
    }
  },

  _setSidebarState(atoms) {
    const visible = this._shouldSidebarBeVisible(atoms);
    this.props.toggleSidebar(visible);
  },

  _shouldSidebarBeVisible(atoms) {
    return !(
      atoms.length === 1 &&
      SemanticTypes.isWorkspaceAtom(atoms[0]) &&
      !NanodegreeHelper.isStatic(this.context.root)
    );
  },

  // TODO: Instead of doing this, we should run a transform on the classroom-content db to do this merge
  _returnAtomWithInstructorNotes(atoms) {
    // To enable wide layout for two atom concepts that are a video or quiz with a text atom underneath,
    // return a single atom with the text atom text stored as an instructor note on the video/quiz
    if (
      atoms.length === 2 &&
      SemanticTypes.isOneOf(atoms[0], [
        SemanticTypes.VIDEO_ATOM,
        SemanticTypes.QUIZ_ATOM,
      ]) &&
      SemanticTypes.isTextAtom(atoms[1])
    ) {
      return [_.extend(atoms[0], { instructor_notes: atoms[1].text })];
    }

    return atoms;
  },

  _isAutoAdvanceable(updatedAtoms) {
    return (
      updatedAtoms.length === 1 && !SemanticTypes.isTextAtom(updatedAtoms[0])
    );
  },

  _atomRequiresWideLayout(updatedAtoms) {
    return (
      updatedAtoms.length === 1 &&
      (SemanticTypes.isOneOf(updatedAtoms[0], [
        SemanticTypes.VIDEO_ATOM,
        SemanticTypes.QUIZ_ATOM,
        SemanticTypes.IMAGE_ATOM,
      ]) ||
        (SemanticTypes.isWorkspaceAtom(updatedAtoms[0]) &&
          !NanodegreeHelper.isStatic(this.context.root)))
    );
  },

  _isFullScreen(isWideLayout, atoms = []) {
    // When true, the "Next" button is removed.
    // A full screen capable atom must provide its own "Next" button
    // or otherwise control when onNext will be called.
    return isWideLayout && SemanticTypes.isWorkspaceAtom(atoms[0]);
  },

  _isWorkspaceProject() {
    const { atoms, root } = this.props;
    return (
      SemanticTypes.isNanodegree(root) &&
      _.some(atoms, (atom) => SemanticTypes.isWorkspaceAtom(atom))
    );
  },

  handleAutoAdvance() {
    return this.props.onNext();
  },

  toggleMaximizeAtom(atomKey) {
    this.setState((prevState) => {
      const { maximizedAtom } = prevState;
      return {
        // Set or clear maximizedAtom
        maximizedAtom: maximizedAtom === atomKey ? undefined : atomKey,
      };
    });
  },

  _renderFooter() {
    const { onNext } = this.props;

    return (
      <div>
        <div styleName="footer-container">
          <Button onClick={onNext} variant="secondary" label={__('Next')} />
        </div>
      </div>
    );
  },

  _getWorkspaceAtom(updatedAtoms) {
    return _.find(updatedAtoms, (atom) => {
      return SemanticTypes.isWorkspaceAtom(atom);
    });
  },

  _hasPartnerWorkspace(updatedAtoms) {
    const workspaceAtom = this._getWorkspaceAtom(updatedAtoms);
    return (
      _.get(workspaceAtom, 'configuration.blueprint.kind') ===
      'partner-workspace'
    );
  },

  _renderAtoms(updatedAtoms, hasMaximizedAtom, maximizedAtom) {
    const {
      concept,
      atoms,
      nextNode,
      overlayPresent,
      isSelectingContent,
    } = this.props;

    const atomRequiresWideLayout = this._atomRequiresWideLayout(updatedAtoms);
    const isAutoAdvanceable = this._isAutoAdvanceable(updatedAtoms);
    const isFullScreen = this._isFullScreen(atomRequiresWideLayout, atoms);

    return _.map(updatedAtoms, (atom) => {
      const isMaximizedAtom = atom.key === maximizedAtom;
      const atomHasWideLayout = atomRequiresWideLayout || isMaximizedAtom;

      const currentAtomContainer = (
        <AtomContainer
          key={atom.key}
          isWideLayout={atomHasWideLayout}
          isFullScreen={isFullScreen || hasMaximizedAtom}
          onToggleFullScreen={
            isFullScreen ? undefined : () => this.toggleMaximizeAtom(atom.key)
          }
          isSelectingContent={isSelectingContent}
          atom={atom}
          atoms={updatedAtoms}
          nextTitle={NodeHelper.getTitle(nextNode)}
          currentTitle={NodeHelper.getTitle(concept)}
          onAutoAdvance={this.handleAutoAdvance}
          isAutoAdvanceable={isAutoAdvanceable}
          overlayPresent={overlayPresent}
        />
      );

      // If there is a maximized atom, hide all the other atoms using their wrapper divs.
      return (
        <div
          key={atom.key}
          styleName={
            hasMaximizedAtom && !isMaximizedAtom ? 'hidden-atom' : null
          }
        >
          {currentAtomContainer}
        </div>
      );
    });
  },

  renderSplitWorkspaceLayout(updatedAtoms, hasMaximizedAtom, maximizedAtom) {
    const [workspaceAtoms, contentAtoms] = _.chain(updatedAtoms)
      .partition((atom) => {
        return SemanticTypes.isWorkspaceAtom(atom);
      })
      .map((atomGroup) => {
        return this._renderAtoms(atomGroup, hasMaximizedAtom, maximizedAtom);
      })
      .value();

    const workspaceAtom = workspaceAtoms[0] || {};
    const fullScreenHeightOffset = styles.app_nav_bar_height || '57px';

    if (contentAtoms.length) {
      return (
        <div
          styleName="split-screen"
          style={{ height: `calc(100vh - ${fullScreenHeightOffset})` }}
        >
          <div styleName="content-panel">
            <div styleName="content">{contentAtoms}</div>
          </div>
          <Resizable
            defaultSize={{ width: '60%' }}
            maxWidth={'90%'}
            minWidth={'15%'}
            enable={{ left: true }}
            style={{ borderLeft: '3px solid black' }}
          >
            <div styleName="partner-iframe">{workspaceAtom}</div>
          </Resizable>
        </div>
      );
    } else {
      return <div styleName="partner-iframe">{workspaceAtom}</div>;
    }
  },

  render() {
    const { atoms, mentor, isStudentHubEnabled } = this.props;
    const { root, lesson } = this.context;
    const { maximizedAtom } = this.state;
    const updatedAtoms = this._returnAtomWithInstructorNotes(atoms);
    const atomRequiresWideLayout = this._atomRequiresWideLayout(updatedAtoms);
    const isFullScreen = this._isFullScreen(atomRequiresWideLayout, atoms);

    const hasMaximizedAtom =
      !isFullScreen &&
      maximizedAtom &&
      // Handle when a previously maximized atom is no longer present
      _.some(updatedAtoms, { key: maximizedAtom });

    const isWideLayout = atomRequiresWideLayout || hasMaximizedAtom;

    return (
      <div
        data-test="concept-main"
        styleName={isWideLayout ? 'main-wide' : 'main'}
      >
        <div styleName="content-container">
          <StaticContentPlaceholder
            placeholder={
              <div className={styles['notification-bar']}>
                <StaticContentNotificationBar />
              </div>
            }
          />

          <CareerServiceConsumer>
            {(isCareerService) => {
              const shouldRender =
                this._isWorkspaceProject() &&
                !isCareerService &&
                isStudentHubEnabled;

              if (shouldRender) {
                return (
                  <InfoBox
                    root={root}
                    project={_.get(lesson, 'project', {})}
                    mentor={mentor}
                  />
                );
              }
            }}
          </CareerServiceConsumer>

          {this._hasPartnerWorkspace(updatedAtoms)
            ? this.renderSplitWorkspaceLayout(
                updatedAtoms,
                hasMaximizedAtom,
                maximizedAtom
              )
            : this._renderAtoms(updatedAtoms, hasMaximizedAtom, maximizedAtom)}
        </div>
        {isFullScreen || hasMaximizedAtom ? null : this._renderFooter()}
        <FeedbackConfirmation />
        <FeedbackFormModal
          key={_.chain(updatedAtoms).map('key').join('').value()}
        />
      </div>
    );
  },
});

export default compose(withAppLayoutContext, cssModule(styles))(Main);
