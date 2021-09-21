/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { Button } from '../../shared/Button/NewButton';
import Icon from '../../shared/Icon';
import { AccessibleErrorContainer } from '../AccessibleErrorContainer';
import styles from './styles.sass';

type Props = {
  onClick?: () => void;
  label?: string;
  hideIcon?: boolean;
};

export const DEFAULT_ERROR_MESSAGE = 'Unable to load details';
export const RETRY_BUTTON_LABEL = 'Retry';

export const UnableToLoadError = ({
  onClick,
  label = DEFAULT_ERROR_MESSAGE,
  hideIcon = false,
}: Props) => {
  return (
    <AccessibleErrorContainer>
      <div className={styles.errorContainer}>
        {!hideIcon && (
          <div className={styles.errorIconWrapper} aria-label="Error icon">
            <Icon type="Error" fillColor="#7f8287" />
          </div>
        )}
        <p className={styles.errorText}>{label}</p>
        {onClick && (
          <div className={styles.errorButtonWrapper}>
            <Button
              color="white"
              onClick={onClick}
              height={40}
              css={css`
                width: 160px;
              `}
            >
              {RETRY_BUTTON_LABEL}
            </Button>
          </div>
        )}
      </div>
    </AccessibleErrorContainer>
  );
};
