import React from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import Textarea from 'react-textarea-autosize';
import cx from 'classnames';
import styles from './Reply.less';

type RenderCallback = (height?: string | number) => void;

interface AnimateHeightProps {
  render: (
    setInitialHeight: RenderCallback,
    setTargetHeight: RenderCallback,
    endAnimation: RenderCallback,
  ) => React.ReactNode;
}

interface AnimateHeightState {
  height: string | number | undefined;
  isAnimating: boolean;
}

class AnimateHeight extends React.Component<
  AnimateHeightProps,
  AnimateHeightState
> {
  state = { height: 'auto', isAnimating: false };

  setInitialHeight = (height: string | number | undefined) => {
    this.setState({ height, isAnimating: true });
  };

  setTargetHeight = (height: string | number | undefined) => {
    const onAfterReflow = window.requestAnimationFrame || window.setTimeout;

    onAfterReflow(() => {
      this.setState({ height });
    });
  };

  endAnimation = () => {
    this.setState({ isAnimating: false });
  };

  render() {
    const { isAnimating, height } = this.state;

    const style = {
      height: isAnimating ? height : 'auto',
      transition: '200ms height',
    };

    return (
      <div style={style}>
        {this.props.render(
          this.setInitialHeight,
          this.setTargetHeight,
          this.endAnimation,
        )}
      </div>
    );
  }
}

export const ReplyContainer: React.FC = ({ children, ...props }) => (
  <div className={styles.replyContainer} {...props}>
    <AnimateHeight
      // eslint-disable-next-line react/jsx-no-bind
      render={(setInitialHeight, setTargetHeight, endAnimation) => (
        <TransitionGroup>
          {React.Children.map(children, (child, index) => (
            <CSSTransition
              key={(child as React.ReactElement).key || index}
              timeout={400}
              classNames="slide"
              unmountOnExit={true}
              // eslint-disable-next-line react/jsx-no-bind
              onExit={(node) => setInitialHeight(node.offsetHeight)}
              // eslint-disable-next-line react/jsx-no-bind
              onEnter={(node) => setTargetHeight(node.offsetHeight)}
              // eslint-disable-next-line react/jsx-no-bind
              onExited={() => endAnimation()}
            >
              <div className={styles.slideIn}>{child}</div>
            </CSSTransition>
          ))}
        </TransitionGroup>
      )}
    />
  </div>
);

export const ReplyActions: React.FC<{ centered?: boolean }> = ({
  centered,
  ...props
}) => (
  <div
    className={cx(styles.replyActions, centered && styles.centered)}
    {...props}
  />
);

export const ReplyColumns: React.FC = (props) => (
  <div className={styles.replyColumns} {...props} />
);

export const ReplyColumnAvatar: React.FC = (props) => (
  <div className={styles.replyColumnAvatar} {...props} />
);

export const ReplyColumnContent: React.FC = (props) => (
  <div className={styles.replyColumnContent} {...props} />
);

export const ReplyLink: React.FC = (props) => (
  <a className={styles.replyLink} {...props} />
);

export const ReplySentText: React.FC<{ centered?: boolean }> = ({
  centered,
  ...props
}) => (
  <div
    className={cx(styles.replySentText, centered && styles.centered)}
    {...props}
  />
);

export class ReplyTextarea extends React.Component {
  inputRef: HTMLTextAreaElement | null = null;

  componentDidMount() {
    if (this.inputRef) {
      const endIndex = this.inputRef.value.length;
      this.inputRef.focus();
      // There are cross-browser inconsistencies about where the cursor is
      // after calling focus(). Always select the end of the input.
      this.inputRef.setSelectionRange(endIndex, endIndex);
    }
  }

  render() {
    return (
      <Textarea
        className={styles.replyTextArea}
        // eslint-disable-next-line react/jsx-no-bind
        inputRef={(ref: HTMLTextAreaElement) => (this.inputRef = ref)}
        {...this.props}
      />
    );
  }
}
