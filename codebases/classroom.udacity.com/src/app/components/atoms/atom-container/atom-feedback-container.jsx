import { __ } from 'services/localization-service';
import styles from './atom-feedback-container.scss';
import withFeedbackContext from 'components/content-feedback/with-feedback-context';

@cssModule(styles)
export class AtomFeedbackContainer extends React.Component {
  static displayName = 'components/atoms/atom-feedback-container';

  render() {
    const {
      children,
      atom,
      atomKey: selectedAtomKey,
      isSelectingContent,
      showFeedbackModal,
      onAtomSelect,
    } = this.props;
    switch (true) {
      case showFeedbackModal:
        return (
          <div
            className={
              atom.key === selectedAtomKey
                ? styles['atom-feedback-container-selected']
                : null
            }
          >
            {children}
          </div>
        );
      case isSelectingContent:
        return (
          <div className={styles['atom-feedback-container']}>
            <button onClick={() => onAtomSelect(atom)} styleName="curtain">
              <span styleName="button">{__('Select')}</span>
            </button>
            {children}
          </div>
        );
      default:
        return children;
    }
  }
}

export default withFeedbackContext(AtomFeedbackContainer);
