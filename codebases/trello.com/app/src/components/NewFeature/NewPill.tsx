import React, { useEffect, useState } from 'react';
import { Analytics, SourceType } from '@trello/atlassian-analytics';
import { forNamespace } from '@trello/i18n';
import { Lozenge, LozengeProps } from 'app/src/components/Lozenge';
import { FeatureId } from './FeatureRolloutConfig';
import { useNewFeature } from './useNewFeature';
import styles from './NewPill.less';

const format = forNamespace('new feature');

interface NewPillProps extends Partial<LozengeProps> {
  featureId: FeatureId;
  source: SourceType;
  /**
   * Whether to dismiss lozenge on click. The lozenge is always clickable, and
   * we fire an analytics event on click regardless, but we only apply link
   * styling if this property is true.
   * @default false
   */
  dismissOnClick?: boolean;
  /**
   * Whether to fire a oneTimeMessagesDismissed indicating that the new feature
   * has been seen when this component renders.
   * @default true
   */
  markViewed?: boolean;
  /**
   * By default, we render a localized "New" string within the Lozenge; to pass
   * in a custom string, pass it in as a child.
   * @default undefined
   */
  children?: React.ReactNode;
}

export const NewPill: React.FC<NewPillProps> = ({
  featureId,
  source,
  markViewed = true,
  dismissOnClick = false,
  children,
  ...lozengeProps
}) => {
  const { isNewFeature, acknowledgeNewFeature } = useNewFeature(featureId);
  const [shouldMarkViewed, setShouldMarkedViewed] = useState(markViewed);

  useEffect(() => {
    if (shouldMarkViewed && isNewFeature) {
      acknowledgeNewFeature({ source });
      setShouldMarkedViewed(false);
      Analytics.sendViewedComponentEvent({
        componentType: 'pill',
        componentName: 'newFeaturePill',
        source,
        attributes: { featureId },
      });
    }
  }, [
    featureId,
    isNewFeature,
    acknowledgeNewFeature,
    shouldMarkViewed,
    setShouldMarkedViewed,
    source,
  ]);

  if (!isNewFeature) {
    return null;
  }

  const onClick = () => {
    if (dismissOnClick) {
      acknowledgeNewFeature({ source, explicit: true });
    }
    Analytics.sendUIEvent({
      action: 'clicked',
      actionSubject: 'pill',
      actionSubjectId: 'newFeaturePill',
      source,
      attributes: { featureId, dismissOnClick },
    });
  };

  return (
    <span
      className={dismissOnClick ? styles.link : styles.unstyledLink}
      // eslint-disable-next-line react/jsx-no-bind
      onClick={onClick}
      role="button"
      tabIndex={dismissOnClick ? 0 : undefined}
    >
      <Lozenge color="green" {...lozengeProps}>
        <span className={styles.lozenge}>{children || format('new')}</span>
      </Lozenge>
    </span>
  );
};
