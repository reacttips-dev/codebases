import React from 'react';
import styles from './styles.sass';

/**
 * @deprecated Use CSS hover styling
 */
export function HoverWrappedComponent(
  RenderComponent: React.ElementType<any>,
  defaultOverrideProps = {},
  hoverOverrideProps = {}
) {
  return (props: any) => {
    const defaultProps = { ...props, ...defaultOverrideProps };
    const hoverProps = { ...props, ...hoverOverrideProps };
    const { className } = props;
    return (
      <div className={`${className || ''} ${styles.hoverWrappedComponent}`}>
        <RenderComponent
          {...defaultProps}
          className={styles.hoverWrappedComponentDefault}
        />
        <RenderComponent
          {...hoverProps}
          className={styles.hoverWrappedComponentHover}
        />
      </div>
    );
  };
}

export function getContainerClassName({
  isEmbedded,
  isPlaying,
}: {
  isEmbedded: boolean;
  isPlaying?: boolean;
}) {
  let className = styles.episodeContainer;
  if (isEmbedded) {
    className = `${className} ${styles.episodeContainerIsEmbedded}`;
  }
  if (isPlaying) {
    className = `${className} ${styles.episodeContainerIsPlaying}`;
  }
  return className;
}
