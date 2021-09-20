import ClassroomPropTypes from 'components/prop-types';
import Overlay from 'components/common/overlay';
import PropTypes from 'prop-types';
import { UreactImageAtom } from '@udacity/ureact-atoms';
import styles from './image-atom.scss';

export default cssModule(
  class extends React.Component {
    static displayName = 'atoms/image-atom';

    static propTypes = {
      atom: ClassroomPropTypes.imageAtom.isRequired,
      isWideLayout: PropTypes.bool,
    };

    static defaultProps = {
      isWideLayout: false,
    };

    state = {
      showOverlay: false,
    };

    handleHide = () => {
      this.setState({ showOverlay: false });
    };

    handleImageClick = (evt) => {
      evt.preventDefault();
      this.setState({ showOverlay: true });
    };

    handleImageClickOnEnter = (e) => {
      if (e.key === 'Enter') {
        this.handleImageClick(e);
      }
    };

    render() {
      var { showOverlay } = this.state;
      var { atom, isWideLayout } = this.props;

      var overlayElement = (
        <Overlay onHide={this.handleHide} show={showOverlay}>
          <UreactImageAtom {...atom} fullscreen={true} imageGeoUrl={atom.url} />
        </Overlay>
      );

      return (
        <div>
          {showOverlay ? overlayElement : null}
          <div
            role="button"
            tabIndex="0"
            aria-label="Show Image Fullscreen"
            styleName="image-atom"
            onClick={this.handleImageClick}
            onKeyPress={this.handleImageClickOnEnter}
          >
            <UreactImageAtom
              {...atom}
              isWideLayout={isWideLayout}
              imageGeoUrl={atom.url}
            />
          </div>
        </div>
      );
    }
  },
  styles
);
